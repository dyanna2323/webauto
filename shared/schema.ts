import { pgTable, text, varchar, timestamp, json, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  plan: varchar("plan", { length: 50 }).default("free"), // free, pro
  createdAt: timestamp("created_at").defaultNow(),
});

// Website generation requests
export const generationRequests = pgTable("generation_requests", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessDescription: text("business_description").notNull(),
  templateType: varchar("template_type").notNull(),
  generatedHtml: text("generated_html"),
  generatedCss: text("generated_css"),
  generatedJs: text("generated_js"),
  customColors: json("custom_colors").$type<{
    primary?: string;
    secondary?: string;
    accent?: string;
  }>(),
  customTexts: json("custom_texts").$type<Record<string, string>>(),
  customImages: json("custom_images").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  generationRequests: many(generationRequests),
}));

export const generationRequestsRelations = relations(generationRequests, ({ one }) => ({
  user: one(users, {
    fields: [generationRequests.userId],
    references: [users.id],
  }),
}));

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  plan: true,
  createdAt: true,
});

// Schema for user registration
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().optional(),
});

// Schema for user login
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Schema for inserting generation requests
export const insertGenerationRequestSchema = createInsertSchema(generationRequests).omit({
  id: true,
  userId: true,
  generatedHtml: true,
  generatedCss: true,
  generatedJs: true,
  customColors: true,
  customTexts: true,
  customImages: true,
  createdAt: true,
});

export const customizeWebsiteSchema = z.object({
  id: z.string(),
  customColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
  customTexts: z.record(z.string()).optional(),
  customImages: z.record(z.string()).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertGenerationRequest = z.infer<typeof insertGenerationRequestSchema>;
export type GenerationRequest = typeof generationRequests.$inferSelect;
export type CustomizeWebsite = z.infer<typeof customizeWebsiteSchema>;

// Template types available
export const templateTypes = ["restaurant", "consultancy", "shop", "services"] as const;
export type TemplateType = typeof templateTypes[number];
