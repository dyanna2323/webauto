import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create drizzle instance with schema
export const db = drizzle({ client: pool, schema });
