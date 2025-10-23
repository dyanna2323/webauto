import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Website generation requests
export const generationRequests = pgTable("generation_requests", {
  id: varchar("id").primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGenerationRequestSchema = createInsertSchema(generationRequests).omit({
  id: true,
  generatedHtml: true,
  generatedCss: true,
  generatedJs: true,
  customColors: true,
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
});

export type InsertGenerationRequest = z.infer<typeof insertGenerationRequestSchema>;
export type GenerationRequest = typeof generationRequests.$inferSelect;
export type CustomizeWebsite = z.infer<typeof customizeWebsiteSchema>;

// Template types available
export const templateTypes = ["restaurant", "consultancy", "shop", "services"] as const;
export type TemplateType = typeof templateTypes[number];
