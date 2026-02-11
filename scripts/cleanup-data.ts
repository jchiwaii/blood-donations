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

    // Step 3: Delete all non-admin users
    console.log("\n3. Deleting all non-admin users...");
    try {
      await pool.query(
        "DELETE FROM user_profiles WHERE role IN ('donor', 'recipient')",
      );
      console.log("✓ All non-admin users deleted");
    } catch (err) {
      console.error("Error deleting users:", err);
    }

    // Step 4: Get count of remaining admin users
    console.log("\n4. Checking remaining admin users...");
    try {
      const result = await pool.query(
        "SELECT id, name, email, role FROM user_profiles WHERE role = 'admin'",
      );
      const admins = result.rows;
      console.log(`✓ ${admins.length || 0} admin user(s) preserved:`);
      admins.forEach((admin) => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    } catch (err) {
      console.error("Error checking admin users:", err);
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
