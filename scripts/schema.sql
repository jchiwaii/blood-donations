-- Blood Donation Platform - Neon PostgreSQL Schema
-- Run this migration against your Neon database to create the required tables.

CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'donor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  recipient_id INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  blood_group VARCHAR(10) NOT NULL,
  units_required INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  urgency VARCHAR(50) NOT NULL DEFAULT 'normal',
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  address TEXT,
  proofs_url TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_donations (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  request_id INTEGER REFERENCES blood_requests(id) ON DELETE SET NULL,
  blood_group VARCHAR(10) NOT NULL,
  units_available INTEGER NOT NULL DEFAULT 1,
  availability_date DATE,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  address TEXT,
  medical_info TEXT,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  related_id INTEGER NOT NULL,
  related_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_blood_requests_recipient_id ON blood_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_donations_donor_id ON blood_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_blood_donations_request_id ON blood_donations(request_id);
CREATE INDEX IF NOT EXISTS idx_blood_donations_status ON blood_donations(status);
CREATE INDEX IF NOT EXISTS idx_media_related ON media(related_type, related_id);
