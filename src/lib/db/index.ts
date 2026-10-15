import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// For query purposes, use the pooler with prepare: false for transaction mode compatibility
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("Missing database connection string");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
