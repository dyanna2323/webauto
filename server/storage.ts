import type { GenerationRequest, InsertGenerationRequest, CustomizeWebsite, User, InsertUser } from "@shared/schema";
import { generationRequests, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
  // Generation requests
  createGenerationRequest(request: InsertGenerationRequest, userId?: number): Promise<GenerationRequest>;
  getGenerationRequest(id: string): Promise<GenerationRequest | undefined>;
  updateGenerationRequest(id: string, updates: Partial<GenerationRequest>): Promise<GenerationRequest | undefined>;
  deleteGenerationRequest(id: string): Promise<boolean>;
  getAllGenerationRequests(): Promise<GenerationRequest[]>;
  getUserGenerationRequests(userId: number): Promise<GenerationRequest[]>;
  
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  verifyUserPassword(email: string, password: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private generationRequests: Map<string, GenerationRequest>;
  private users: Map<number, User>;
  private nextUserId: number;

  constructor() {
    this.generationRequests = new Map();
    this.users = new Map();
    this.nextUserId = 1;
  }

  async createGenerationRequest(insertRequest: InsertGenerationRequest, userId?: number): Promise<GenerationRequest> {
    const id = randomUUID();
    const request: GenerationRequest = {
      ...insertRequest,
      id,
      userId: userId || null,
      generatedHtml: null,
      generatedCss: null,
      generatedJs: null,
      customColors: null,
      customTexts: null,
      customImages: null,
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
  
  async getUserGenerationRequests(userId: number): Promise<GenerationRequest[]> {
    return Array.from(this.generationRequests.values()).filter(r => r.userId === userId);
  }
  
  async deleteGenerationRequest(id: string): Promise<boolean> {
    return this.generationRequests.delete(id);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      id: this.nextUserId++,
      email: user.email,
      password: hashedPassword,
      name: user.name || null,
      plan: "free",
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }
  
  async verifyUserPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }
}

export class DbStorage implements IStorage {
  async createGenerationRequest(insertRequest: InsertGenerationRequest, userId?: number): Promise<GenerationRequest> {
    const id = randomUUID();
    const request: GenerationRequest = {
      ...insertRequest,
      id,
      userId: userId || null,
      generatedHtml: null,
      generatedCss: null,
      generatedJs: null,
      customColors: null,
      customTexts: null,
      customImages: null,
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
  
  async getUserGenerationRequests(userId: number): Promise<GenerationRequest[]> {
    return db.select().from(generationRequests).where(eq(generationRequests.userId, userId));
  }
  
  async deleteGenerationRequest(id: string): Promise<boolean> {
    const result = await db.delete(generationRequests).where(eq(generationRequests.id, id));
    return true; // Drizzle returns count, but we return boolean for interface compatibility
  }

  // User methods
  async createUser(user: InsertUser): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = {
        ...user,
        password: hashedPassword,
        plan: 'free' as const, // Explicitly set default plan
      };
      
      console.log('Creating user with data:', { ...newUser, password: '[REDACTED]' });
      const result = await db.insert(users).values(newUser).returning();
      console.log('User created successfully:', { id: result[0].id, email: result[0].email });
      return result[0];
    } catch (error) {
      console.error('Error creating user in database:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async verifyUserPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return undefined;
    
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    await db.update(users).set(updates).where(eq(users.id, id));
    return this.getUserById(id);
  }
}

// Use database storage instead of in-memory
export const storage = new DbStorage();
