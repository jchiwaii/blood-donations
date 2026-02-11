import dotenv from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import { readFileSync } from "fs";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL must be set in .env.local");
  process.exit(1);
}

async function migrate() {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const sql = readFileSync(resolve(__dirname, "schema.sql"), "utf-8");
    console.log("Running schema migration...");
    await pool.query(sql);
    console.log("✅ Schema migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
