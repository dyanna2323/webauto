import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { generateWebsite, customizeWebsiteColors, customizeWebsiteTexts, customizeWebsiteImages } from "./openai";
import { insertGenerationRequestSchema, customizeWebsiteSchema, registerUserSchema, loginUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import JSZip from "jszip";
import passport, { requireAuth, getCurrentUser } from "./auth";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const PgSession = connectPgSimple(session);
  
  // Require SESSION_SECRET in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    console.error("WARNING: SESSION_SECRET not set. Using a temporary secret for development.");
    if (process.env.NODE_ENV === 'production') {
      throw new Error("SESSION_SECRET environment variable is required in production");
    }
  }
  
  // Configure secure cookies based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set trust proxy for accurate req.secure detection behind proxies (like Replit)
  if (isProduction) {
    app.set('trust proxy', 1);
  }
  
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'user_sessions',
      }),
      secret: sessionSecret || 'dev-only-secret-' + Math.random(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: isProduction, // only secure cookies in production
        httpOnly: true,
        sameSite: 'lax', // CSRF protection
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  
  // POST /api/register - Register new user
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existing = await storage.getUserByEmail(validatedData.email);
      if (existing) {
        return res.status(400).json({ error: "Este email ya está registrado" });
      }
      
      // Create new user
      const user = await storage.createUser(validatedData);
      
      // Login the user after registration
      req.logIn(user, (err: any) => {
        if (err) {
          return res.status(500).json({ error: "Error iniciando sesión" });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Datos inválidos", details: error.errors });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Error al registrar usuario" });
      }
    }
  });

  // POST /api/login - Login user
  app.post("/api/login", (req, res, next) => {
    try {
      loginUserSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
    }
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Error en el servidor" });
      }
      if (!user) {
        return res.status(401).json({ error: info.message || "Email o contraseña incorrectos" });
      }
      
      req.logIn(user, (err: any) => {
        if (err) {
          return res.status(500).json({ error: "Error iniciando sesión" });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });

  // POST /api/logout - Logout user
  app.post("/api/logout", (req, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Error cerrando sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // GET /api/me - Get current user
  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "No autenticado" });
    }
    
    const user = req.user as any;
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // GET /api/my-websites - Get user's websites
  app.get("/api/my-websites", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const websites = await storage.getUserGenerationRequests(user.id);
      res.json({ websites });
    } catch (error) {
      console.error("Error fetching user websites:", error);
      res.status(500).json({ error: "Error al obtener tus webs" });
    }
  });

  // POST /api/generate - Generate a new website with AI (now with optional auth)
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = insertGenerationRequestSchema.parse(req.body);

      // Get user ID if authenticated
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;
      
      // Create initial request in storage
      const request = await storage.createGenerationRequest(validatedData, userId);

      // Generate website with OpenAI
      const generated = await generateWebsite(
        validatedData.businessDescription,
        validatedData.templateType
      );

      // Update with generated content
      const updated = await storage.updateGenerationRequest(request.id, {
        generatedHtml: generated.html,
        generatedCss: generated.css,
        generatedJs: generated.js,
      });

      res.json(updated);
    } catch (error) {
      console.error("Error generating website:", error);

      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Invalid request data",
          details: error.errors,
        });
      } else {
        res.status(500).json({
          error: error instanceof Error ? error.message : "Failed to generate website",
        });
      }
    }
  });

  // POST /api/customize - Customize website colors and texts
  app.post("/api/customize", async (req, res) => {
    try {
      const validatedData = customizeWebsiteSchema.parse(req.body);

      const existing = await storage.getGenerationRequest(validatedData.id);
      if (!existing) {
        res.status(404).json({ error: "Website not found" });
        return;
      }

      let updatedCss = existing.generatedCss || "";
      let updatedHtml = existing.generatedHtml || "";

      // Apply color customization if provided
      if (validatedData.customColors) {
        updatedCss = await customizeWebsiteColors(updatedCss, validatedData.customColors);
      }

      // Apply text customization if provided
      if (validatedData.customTexts && Object.keys(validatedData.customTexts).length > 0) {
        updatedHtml = await customizeWebsiteTexts(updatedHtml, validatedData.customTexts);
      }

      // Apply image customization if provided
      if (validatedData.customImages && Object.keys(validatedData.customImages).length > 0) {
        updatedHtml = await customizeWebsiteImages(updatedHtml, validatedData.customImages);
      }

      // Update in storage
      const updated = await storage.updateGenerationRequest(validatedData.id, {
        generatedHtml: updatedHtml,
        generatedCss: updatedCss,
        customColors: validatedData.customColors || existing.customColors,
        customTexts: validatedData.customTexts || existing.customTexts,
        customImages: validatedData.customImages || existing.customImages,
      });

      res.json(updated);
    } catch (error) {
      console.error("Error customizing website:", error);

      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Invalid request data",
          details: error.errors,
        });
      } else {
        res.status(500).json({
          error: error instanceof Error ? error.message : "Failed to customize website",
        });
      }
    }
  });

  // GET /api/download/:id - Download website as ZIP
  app.get("/api/download/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const request = await storage.getGenerationRequest(id);
      if (!request) {
        res.status(404).json({ error: "Website not found" });
        return;
      }

      if (!request.generatedHtml) {
        res.status(400).json({ error: "Website not yet generated" });
        return;
      }

      // Create ZIP file
      const zip = new JSZip();

      // Add files to ZIP
      zip.file("index.html", request.generatedHtml);

      if (request.generatedCss) {
        zip.file("styles.css", request.generatedCss);
      }

      if (request.generatedJs) {
        zip.file("script.js", request.generatedJs);
      }

      // Add README
      const readme = `# Tu Web Profesional

Generado con AI Web Builder

## Archivos incluidos:
- index.html - Página principal
${request.generatedCss ? "- styles.css - Estilos CSS\n" : ""}${request.generatedJs ? "- script.js - JavaScript\n" : ""}

## Cómo usar:
1. Sube estos archivos a tu hosting (FTP, cPanel, etc)
2. Asegúrate de que index.html esté en la raíz
3. ¡Tu web está lista!

## Personalización:
Puedes editar los archivos directamente o usar nuestro builder para regenerar.

---
Creado con ❤️ por AI Web Builder
`;

      zip.file("README.md", readme);

      // Generate ZIP
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      // Send ZIP file
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename=mi-web-${id}.zip`);
      res.send(zipBuffer);
    } catch (error) {
      console.error("Error creating ZIP:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to create ZIP file",
      });
    }
  });

  // GET /api/templates - Get available template types
  app.get("/api/templates", async (req, res) => {
    res.json({
      templates: [
        {
          id: "restaurant",
          name: "Restaurante / Bar",
          description: "Perfecto para restaurantes, cafeterías, bares",
        },
        {
          id: "consultancy",
          name: "Consultoría / Servicios",
          description: "Para consultores, asesores, servicios profesionales",
        },
        {
          id: "shop",
          name: "Tienda / E-commerce",
          description: "Muestra tus productos y servicios",
        },
        {
          id: "services",
          name: "Servicios Profesionales",
          description: "Fontaneros, electricistas, reformas, etc",
        },
      ],
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
