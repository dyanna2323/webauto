import type { GenerationRequest, InsertGenerationRequest, CustomizeWebsite } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
