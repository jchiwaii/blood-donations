import dotenv from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

// Create Supabase client after loading env vars
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_PROJECT_URL and SUPABASE_API_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupData() {
  console.log("Starting database cleanup...");
  console.log("⚠️  This will delete all data except admin users!");

  try {
    // Step 1: Delete all blood requests
    console.log("\n1. Deleting all blood requests...");
    const { error: requestsError } = await supabase
      .from("blood_requests")
      .delete()
      .neq("id", 0); // Delete all records

    if (requestsError) {
      console.error("Error deleting blood requests:", requestsError);
    } else {
      console.log("✓ All blood requests deleted");
    }

    // Step 2: Delete all blood donations (if table exists)
    console.log("\n2. Deleting all blood donations...");
    const { error: donationsError } = await supabase
      .from("blood_donations")
      .delete()
      .neq("id", 0); // Delete all records

    if (donationsError) {
      if (donationsError.code === 'PGRST205') {
        console.log("⚠️  blood_donations table does not exist (skipping)");
      } else {
        console.error("Error deleting blood donations:", donationsError);
      }
    } else {
      console.log("✓ All blood donations deleted");
    }

    // Step 3: Delete all non-admin users
    console.log("\n3. Deleting all non-admin users...");
    const { error: usersError } = await supabase
      .from("user_profiles")
      .delete()
      .in("role", ["donor", "recipient"]);

    if (usersError) {
      console.error("Error deleting users:", usersError);
    } else {
      console.log("✓ All non-admin users deleted");
    }

    // Step 4: Get count of remaining admin users
    console.log("\n4. Checking remaining admin users...");
    const { data: admins, error: adminsError } = await supabase
      .from("user_profiles")
      .select("id, name, email, role")
      .eq("role", "admin");

    if (adminsError) {
      console.error("Error checking admin users:", adminsError);
    } else {
      console.log(`✓ ${admins?.length || 0} admin user(s) preserved:`);
      admins?.forEach((admin) => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    }

    console.log("\n✅ Database cleanup completed successfully!");
    console.log("\nYou can now run: npm run seed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

cleanupData();
