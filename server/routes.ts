import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateWebsite, customizeWebsiteColors, customizeWebsiteTexts } from "./openai";
import { insertGenerationRequestSchema, customizeWebsiteSchema } from "@shared/schema";
import { ZodError } from "zod";
import JSZip from "jszip";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/generate - Generate a new website with AI
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = insertGenerationRequestSchema.parse(req.body);

      // Create initial request in storage
      const request = await storage.createGenerationRequest(validatedData);

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

      // Update in storage
      const updated = await storage.updateGenerationRequest(validatedData.id, {
        generatedHtml: updatedHtml,
        generatedCss: updatedCss,
        customColors: validatedData.customColors || existing.customColors,
        customTexts: validatedData.customTexts || existing.customTexts,
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
