import dotenv from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL must be set in .env.local");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function cleanupData() {
  console.log("Starting database cleanup...");
  console.log("⚠️  This will delete all data except admin users!");

  try {
    // Step 1: Delete all blood requests
    console.log("\n1. Deleting all blood requests...");
    try {
      await pool.query("DELETE FROM blood_requests");
      console.log("✓ All blood requests deleted");
    } catch (err) {
      console.error("Error deleting blood requests:", err);
    }

    // Step 2: Delete all blood donations
    console.log("\n2. Deleting all blood donations...");
    try {
      await pool.query("DELETE FROM blood_donations");
      console.log("✓ All blood donations deleted");
    } catch (err: any) {
      if (err.code === "42P01") {
        console.log("⚠️  blood_donations table does not exist (skipping)");
      } else {
        console.error("Error deleting blood donations:", err);
      }
    }

    // Step 3: Delete all users (including test admins)
    console.log("\n3. Deleting all users...");
    try {
      await pool.query("DELETE FROM user_profiles");
      console.log("✓ All users deleted");
    } catch (err) {
      console.error("Error deleting users:", err);
    }

    // Step 4: Delete all media
    console.log("\n4. Deleting all media...");
    try {
      await pool.query("DELETE FROM media");
      console.log("✓ All media deleted");
    } catch (err: any) {
      if (err.code === "42P01") {
        console.log("⚠️  media table does not exist (skipping)");
      } else {
        console.error("Error deleting media:", err);
      }
    }

    console.log("\n✅ Database cleanup completed successfully!");
    console.log("\nYou can now run: npm run seed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await pool.end();
  }
}

cleanupData();
