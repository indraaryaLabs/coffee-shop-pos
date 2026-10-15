import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import "dotenv/config";

async function main() {
  console.log("🌱 Starting synthetic data seed...");
  try {
    const sqlPath = path.join(process.cwd(), "scripts", "synthetic_data.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    console.log("Executing SQL blocks...");
    await db.execute(sql.raw(sqlContent));

    console.log("✅ Synthetic data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
