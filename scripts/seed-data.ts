import dotenv from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencies = ["critical", "urgent", "normal"];
const statuses = ["pending", "approved", "rejected"];

const donorNames = [
  "John Smith",
  "Emma Johnson",
  "Michael Brown",
  "Sophia Davis",
  "James Wilson",
];

const recipientNames = [
  "Olivia Martinez",
  "William Anderson",
  "Ava Taylor",
  "Alexander Moore",
  "Isabella Jackson",
];

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
];

const requestTitles = [
  "Urgent blood needed for surgery",
  "Emergency blood transfusion required",
  "Critical patient needs blood donation",
  "Life-saving blood donation needed",
  "Medical emergency - blood required",
  "Accident victim needs blood urgently",
  "Cancer patient requires blood",
  "Surgery preparation - blood needed",
];

async function seedData() {
  console.log("Starting database seeding...");

  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create 5 donors
    console.log("Creating donor users...");
    const donors = [];
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          name: donorNames[i],
          email: `donor${i + 1}@example.com`,
          password: hashedPassword,
          role: "donor",
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating donor ${i + 1}:`, error);
        continue;
      }
      donors.push(data);
      console.log(`Created donor: ${data.name}`);
    }

    // Create 5 recipients
    console.log("\nCreating recipient users...");
    const recipients = [];
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          name: recipientNames[i],
          email: `recipient${i + 1}@example.com`,
          password: hashedPassword,
          role: "recipient",
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating recipient ${i + 1}:`, error);
        continue;
      }
      recipients.push(data);
      console.log(`Created recipient: ${data.name}`);
    }

    // Create blood requests for recipients (2-3 per recipient)
    console.log("\nCreating blood requests...");
    for (const recipient of recipients) {
      const numRequests = Math.floor(Math.random() * 2) + 2; // 2-3 requests
      for (let i = 0; i < numRequests; i++) {
        const { data, error } = await supabase
          .from("blood_requests")
          .insert({
            recipient_id: recipient.id,
            title: requestTitles[Math.floor(Math.random() * requestTitles.length)],
            description: `Medical facility requires ${bloodGroups[Math.floor(Math.random() * bloodGroups.length)]} blood for patient treatment. Contact immediately if available.`,
            blood_group: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
            units_required: Math.floor(Math.random() * 4) + 1, // 1-4 units
            status: statuses[Math.floor(Math.random() * statuses.length)],
            urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
            contact_phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            contact_email: recipient.email,
            address: `${Math.floor(Math.random() * 9000) + 1000} Medical Center Dr, ${cities[Math.floor(Math.random() * cities.length)]}`,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating blood request for ${recipient.name}:`, error);
          continue;
        }
        console.log(`Created blood request for ${recipient.name}: ${data.title}`);
      }
    }

    console.log("\n✓ Database seeding completed successfully!");
    console.log("\nTest credentials:");
    console.log("Donors: donor1@example.com to donor5@example.com");
    console.log("Recipients: recipient1@example.com to recipient5@example.com");
    console.log("Password for all: password123");
    console.log("\nSummary:");
    console.log(`- Created ${donors.length} donor users`);
    console.log(`- Created ${recipients.length} recipient users`);
    console.log(`- Created blood requests for each recipient (2-3 per recipient)`);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seedData();
