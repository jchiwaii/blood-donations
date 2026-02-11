import dotenv from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: DATABASE_URL must be set in .env.local"
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

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
      const result = await pool.query(
        "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [donorNames[i], `donor${i + 1}@example.com`, hashedPassword, "donor"]
      );

      const data = result.rows[0];
      if (!data) {
        console.error(`Error creating donor ${i + 1}`);
        continue;
      }
      donors.push(data);
      console.log(`Created donor: ${data.name}`);
    }

    // Create 5 recipients
    console.log("\nCreating recipient users...");
    const recipients = [];
    for (let i = 0; i < 5; i++) {
      const result = await pool.query(
        "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [recipientNames[i], `recipient${i + 1}@example.com`, hashedPassword, "recipient"]
      );

      const data = result.rows[0];
      if (!data) {
        console.error(`Error creating recipient ${i + 1}`);
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
        const result = await pool.query(
          `INSERT INTO blood_requests
            (recipient_id, title, description, blood_group, units_required, status, urgency, contact_phone, contact_email, address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            recipient.id,
            requestTitles[Math.floor(Math.random() * requestTitles.length)],
            `Medical facility requires ${
              bloodGroups[Math.floor(Math.random() * bloodGroups.length)]
            } blood for patient treatment. Contact immediately if available.`,
            bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
            Math.floor(Math.random() * 4) + 1,
            statuses[Math.floor(Math.random() * statuses.length)],
            urgencies[Math.floor(Math.random() * urgencies.length)],
            `+1-555-${Math.floor(Math.random() * 900) + 100}-${
              Math.floor(Math.random() * 9000) + 1000
            }`,
            recipient.email,
            `${Math.floor(Math.random() * 9000) + 1000} Medical Center Dr, ${
              cities[Math.floor(Math.random() * cities.length)]
            }`,
          ]
        );

        const data = result.rows[0];
        if (!data) {
          console.error(`Error creating blood request for ${recipient.name}`);
          continue;
        }
        console.log(
          `Created blood request for ${recipient.name}: ${data.title}`
        );
      }
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await pool.end();
  }
}

seedData();
