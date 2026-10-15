import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Membaca file .env yang baru saja kita ubah namanya
dotenv.config({ path: ".env" });

export default defineConfig({
	schema: "./src/lib/db/*", // <-- Ini kuncinya! Memberitahu Drizzle di mana file skemanya berada
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DIRECT_URL!,
	},
});