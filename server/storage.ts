import type { GenerationRequest, InsertGenerationRequest, CustomizeWebsite } from "@shared/schema";
import { generationRequests } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Helper to recursively remove undefined values from objects
// Also removes objects/arrays that become empty after sanitization
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    const sanitized = obj.map(sanitizeObject).filter(item => item !== undefined);
    return sanitized.length > 0 ? sanitized : undefined;
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        const sanitized = sanitizeObject(value);
        if (sanitized !== undefined) {
          result[key] = sanitized;
        }
      }
    }
    // Return undefined if object becomes empty after sanitization
    return Object.keys(result).length > 0 ? result : undefined;
  }
  
  return obj;
}

export interface IStorage {
  createGenerationRequest(request: InsertGenerationRequest): Promise<GenerationRequest>;
  getGenerationRequest(id: string): Promise<GenerationRequest | undefined>;
  updateGenerationRequest(id: string, updates: Partial<GenerationRequest>): Promise<GenerationRequest | undefined>;
  getAllGenerationRequests(): Promise<GenerationRequest[]>;
}

export class MemStorage implements IStorage {
  private generationRequests: Map<string, GenerationRequest>;

  constructor() {
    this.generationRequests = new Map();
  }

  async createGenerationRequest(insertRequest: InsertGenerationRequest): Promise<GenerationRequest> {
    const id = randomUUID();
    const request: GenerationRequest = {
      ...insertRequest,
      id,
      generatedHtml: null,
      generatedCss: null,
      generatedJs: null,
      customColors: null,
      customTexts: null,
      createdAt: new Date(),
    };
    this.generationRequests.set(id, request);
    return request;
  }

  async getGenerationRequest(id: string): Promise<GenerationRequest | undefined> {
    return this.generationRequests.get(id);
  }

  async updateGenerationRequest(
    id: string,
    updates: Partial<GenerationRequest>
  ): Promise<GenerationRequest | undefined> {
    const existing = this.generationRequests.get(id);
    if (!existing) return undefined;

    const updated: GenerationRequest = { ...existing, ...updates };
    this.generationRequests.set(id, updated);
    return updated;
  }

  async getAllGenerationRequests(): Promise<GenerationRequest[]> {
    return Array.from(this.generationRequests.values());
  }
}

export class DbStorage implements IStorage {
  async createGenerationRequest(insertRequest: InsertGenerationRequest): Promise<GenerationRequest> {
    const id = randomUUID();
    const request: GenerationRequest = {
      ...insertRequest,
      id,
      generatedHtml: null,
      generatedCss: null,
      generatedJs: null,
      customColors: null,
      customTexts: null,
      createdAt: new Date(),
    };
    
    await db.insert(generationRequests).values(request);
    return request;
  }

  async getGenerationRequest(id: string): Promise<GenerationRequest | undefined> {
    const results = await db.select().from(generationRequests).where(eq(generationRequests.id, id));
    return results[0];
  }

  async updateGenerationRequest(
    id: string,
    updates: Partial<GenerationRequest>
  ): Promise<GenerationRequest | undefined> {
    // Deep sanitize: recursively remove undefined values (including nested objects)
    const sanitizedUpdates = sanitizeObject(updates);
    
    // Guard against sanitizeObject returning undefined
    if (!sanitizedUpdates || typeof sanitizedUpdates !== 'object') {
      return this.getGenerationRequest(id);
    }
    
    // Filter out top-level undefined fields after sanitization
    const cleanUpdates = Object.fromEntries(
      Object.entries(sanitizedUpdates).filter(([_, v]) => v !== undefined)
    );
    
    // Only update if there are valid fields to update
    if (Object.keys(cleanUpdates).length === 0) {
      return this.getGenerationRequest(id);
    }
    
    await db
      .update(generationRequests)
      .set(cleanUpdates)
      .where(eq(generationRequests.id, id));
    
    return this.getGenerationRequest(id);
  }

  async getAllGenerationRequests(): Promise<GenerationRequest[]> {
    return db.select().from(generationRequests);
  }
}

// Use database storage instead of in-memory
export const storage = new DbStorage();
