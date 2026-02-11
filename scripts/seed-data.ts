import dotenv from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

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

// ---------------------------------------------------------------------------
// Test credentials — all accounts use password: password123
// ---------------------------------------------------------------------------

const adminUsers = [
  { name: "Admin User", email: "admin@test.com", role: "admin" },
  { name: "Super Admin", email: "superadmin@test.com", role: "admin" },
];

const donorUsers = [
  { name: "John Smith", email: "donor1@test.com", role: "donor" },
  { name: "Emma Johnson", email: "donor2@test.com", role: "donor" },
  { name: "Michael Brown", email: "donor3@test.com", role: "donor" },
  { name: "Sophia Davis", email: "donor4@test.com", role: "donor" },
  { name: "James Wilson", email: "donor5@test.com", role: "donor" },
];

const recipientUsers = [
  { name: "Olivia Martinez", email: "recipient1@test.com", role: "recipient" },
  { name: "William Anderson", email: "recipient2@test.com", role: "recipient" },
  { name: "Ava Taylor", email: "recipient3@test.com", role: "recipient" },
  { name: "Alexander Moore", email: "recipient4@test.com", role: "recipient" },
  { name: "Isabella Jackson", email: "recipient5@test.com", role: "recipient" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["low", "medium", "high", "critical"];
const requestStatuses = ["pending", "in_progress", "fulfilled", "cancelled"];
const donationStatuses = ["pending", "approved", "rejected"];

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
];

const hospitals = [
  "City General Hospital",
  "St. Mary's Medical Center",
  "Regional Blood Bank",
  "University Hospital",
  "Memorial Health Center",
  "Sacred Heart Hospital",
  "Mercy Medical Center",
  "Community Health Clinic",
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
  "Post-operative transfusion needed",
  "Thalassemia patient needs regular transfusion",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  return `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function randomAddress(): string {
  return `${Math.floor(Math.random() * 9000) + 1000} ${pick(hospitals)} Dr, ${pick(cities)}`;
}

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return d.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seedData() {
  console.log("🌱 Starting database seeding...\n");
  console.log("═══════════════════════════════════════════");
  console.log("  All test accounts use password: password123");
  console.log("═══════════════════════════════════════════\n");

  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // ── Admin users ──────────────────────────────────────────────────────
    console.log("👑 Creating admin users...");
    const admins = [];
    for (const u of adminUsers) {
      const result = await pool.query(
        "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [u.name, u.email, hashedPassword, u.role],
      );
      const data = result.rows[0];
      if (!data) { console.error(`  ✗ Failed: ${u.email}`); continue; }
      admins.push(data);
      console.log(`  ✓ ${data.name} — ${data.email} (${data.role})`);
    }

    // ── Donor users ──────────────────────────────────────────────────────
    console.log("\n🩸 Creating donor users...");
    const donors = [];
    for (const u of donorUsers) {
      const result = await pool.query(
        "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [u.name, u.email, hashedPassword, u.role],
      );
      const data = result.rows[0];
      if (!data) { console.error(`  ✗ Failed: ${u.email}`); continue; }
      donors.push(data);
      console.log(`  ✓ ${data.name} — ${data.email} (${data.role})`);
    }

    // ── Recipient users ──────────────────────────────────────────────────
    console.log("\n🏥 Creating recipient users...");
    const recipients = [];
    for (const u of recipientUsers) {
      const result = await pool.query(
        "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [u.name, u.email, hashedPassword, u.role],
      );
      const data = result.rows[0];
      if (!data) { console.error(`  ✗ Failed: ${u.email}`); continue; }
      recipients.push(data);
      console.log(`  ✓ ${data.name} — ${data.email} (${data.role})`);
    }

    // ── Blood requests (3 per recipient = 15 total) ─────────────────────
    console.log("\n📋 Creating blood requests...");
    const allRequests: any[] = [];
    for (const recipient of recipients) {
      for (let i = 0; i < 3; i++) {
        const bg = pick(bloodGroups);
        const status = pick(requestStatuses);
        const urgency = pick(urgencyLevels);
        const units = Math.floor(Math.random() * 4) + 1;

        const result = await pool.query(
          `INSERT INTO blood_requests
            (recipient_id, title, description, blood_group, units_required, status, urgency, contact_phone, contact_email, address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            recipient.id,
            pick(requestTitles),
            `Patient at ${pick(hospitals)} urgently requires ${units} unit(s) of ${bg} blood. ${
              urgency === "critical"
                ? "This is a life-threatening situation — immediate help needed."
                : "Please contact the hospital if you are a compatible donor."
            }`,
            bg,
            units,
            status,
            urgency,
            randomPhone(),
            recipient.email,
            randomAddress(),
          ],
        );

        const data = result.rows[0];
        if (!data) { console.error(`  ✗ Failed request for ${recipient.name}`); continue; }
        allRequests.push(data);
        console.log(
          `  ✓ [${status.toUpperCase()}] ${data.title} — ${bg} (${urgency}) for ${recipient.name}`,
        );
      }
    }

    // Ensure some requests are specifically "approved" so donors see them
    const approvedRequests = allRequests.filter((r) => r.status === "approved");
    if (approvedRequests.length < 3) {
      console.log("\n  ↻ Ensuring at least 5 approved requests for donors...");
      const pendingRequests = allRequests.filter((r) => r.status === "pending");
      const toApprove = pendingRequests.slice(0, 5 - approvedRequests.length);
      for (const req of toApprove) {
        await pool.query(
          "UPDATE blood_requests SET status = 'approved' WHERE id = $1",
          [req.id],
        );
        req.status = "approved";
        approvedRequests.push(req);
        console.log(`  ✓ Request #${req.id} set to approved`);
      }
    }

    // ── Blood donations (donor offers linked to approved requests) ───────
    console.log("\n💉 Creating blood donation offers...");
    const finalApproved = allRequests.filter((r) => r.status === "approved");

    // Each donor makes 1-2 donation offers
    for (const donor of donors) {
      const numDonations = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numDonations; i++) {
        const linkedRequest = finalApproved.length > 0 ? pick(finalApproved) : null;
        const bg = linkedRequest ? linkedRequest.blood_group : pick(bloodGroups);
        const donationStatus = pick(donationStatuses);

        const result = await pool.query(
          `INSERT INTO blood_donations
            (donor_id, request_id, blood_group, units_available, availability_date, contact_phone, contact_email, address, medical_info, notes, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          [
            donor.id,
            linkedRequest?.id || null,
            bg,
            Math.floor(Math.random() * 3) + 1,
            futureDate(30),
            randomPhone(),
            donor.email,
            randomAddress(),
            pick([
              "No known allergies. Last donation was 4 months ago.",
              "Healthy, non-smoker. Regular donor for 3 years.",
              "No medications. Blood pressure is normal.",
              "Vegetarian diet. No recent illness or travel.",
              null,
            ]),
            pick([
              "Happy to help! Can donate at the hospital or blood bank.",
              "Available on weekends. Please call to confirm timing.",
              "Can travel within 20 miles. Flexible with timing.",
              "First-time donor, willing to help in any way.",
              null,
            ]),
            donationStatus,
          ],
        );

        const data = result.rows[0];
        if (!data) { console.error(`  ✗ Failed donation for ${donor.name}`); continue; }
        console.log(
          `  ✓ [${donationStatus.toUpperCase()}] ${donor.name} — ${bg}, ${data.units_available} unit(s)${
            linkedRequest ? ` → Request #${linkedRequest.id}` : ""
          }`,
        );
      }
    }

    // ── Summary ──────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════");
    console.log("  ✅ Seeding complete!");
    console.log("═══════════════════════════════════════════");
    console.log("\n📧 Test Login Credentials (password: password123)\n");
    console.log("  ADMINS:");
    for (const a of adminUsers) {
      console.log(`    ${a.email}  (${a.name})`);
    }
    console.log("\n  DONORS:");
    for (const d of donorUsers) {
      console.log(`    ${d.email}  (${d.name})`);
    }
    console.log("\n  RECIPIENTS:");
    for (const r of recipientUsers) {
      console.log(`    ${r.email}  (${r.name})`);
    }
    console.log("");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await pool.end();
  }
}

seedData();
