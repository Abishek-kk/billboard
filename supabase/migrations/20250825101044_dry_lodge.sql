/*
  # Billboard Guardian+ Database Schema

  1. New Tables
    - `users` - User accounts with roles and gamification data
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `role` (enum: citizen, inspector, official)
      - `points` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `billboards` - Billboard registry with location and permit data
      - `id` (uuid, primary key)
      - `latitude` (decimal, not null)
      - `longitude` (decimal, not null)
      - `address` (text, not null)
      - `permit_number` (text, nullable)
      - `width` (decimal, not null)
      - `height` (decimal, not null)
      - `status` (enum: compliant, violation, pending_review)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `violations` - Violation reports with AI analysis
      - `id` (uuid, primary key)
      - `billboard_id` (uuid, foreign key)
      - `reporter_id` (uuid, foreign key)
      - `type` (enum: unauthorized, damaged, oversized, improper_location, missing_permit)
      - `description` (text, not null)
      - `confidence_score` (decimal, not null)
      - `photo_url` (text, not null)
      - `video_url` (text, nullable)
      - `latitude` (decimal, not null)
      - `longitude` (decimal, not null)
      - `address` (text, not null)
      - `status` (enum: pending, verified, resolved, false_positive)
      - `ai_analysis` (jsonb, not null)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `badges` - Achievement badges
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `icon` (text, not null)
      - `points_required` (integer, not null)
      - `created_at` (timestamp)

    - `user_badges` - Junction table for user-badge relationships
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `badge_id` (uuid, foreign key)
      - `earned_at` (timestamp)

    - `challenges` - Time-limited challenges for gamification
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `target` (integer, not null)
      - `points_reward` (integer, not null)
      - `badge_reward_id` (uuid, nullable, foreign key)
      - `expires_at` (timestamp, not null)
      - `type` (enum: weekly, monthly, special)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for officials to view all violation data
    - Add policies for inspectors to verify violations

  3. Indexes
    - Add spatial indexes for location-based queries
    - Add indexes on frequently queried columns (status, type, created_at)
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('citizen', 'inspector', 'official');
CREATE TYPE billboard_status AS ENUM ('compliant', 'violation', 'pending_review');
CREATE TYPE violation_type AS ENUM ('unauthorized', 'damaged', 'oversized', 'improper_location', 'missing_permit');
CREATE TYPE violation_status AS ENUM ('pending', 'verified', 'resolved', 'false_positive');
CREATE TYPE challenge_type AS ENUM ('weekly', 'monthly', 'special');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'citizen',
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude decimal NOT NULL,
  longitude decimal NOT NULL,
  address text NOT NULL,
  permit_number text,
  width decimal NOT NULL,
  height decimal NOT NULL,
  status billboard_status DEFAULT 'pending_review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points_required integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  target integer NOT NULL,
  points_reward integer NOT NULL,
  badge_reward_id uuid REFERENCES badges(id),
  expires_at timestamptz NOT NULL,
  type challenge_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  billboard_id uuid REFERENCES billboards(id),
  reporter_id uuid REFERENCES users(id),
  type violation_type NOT NULL,
  description text NOT NULL,
  confidence_score decimal NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  photo_url text NOT NULL,
  video_url text,
  latitude decimal NOT NULL,
  longitude decimal NOT NULL,
  address text NOT NULL,
  status violation_status DEFAULT 'pending',
  ai_analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  badge_id uuid REFERENCES badges(id),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can read and update their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- All authenticated users can read billboards
CREATE POLICY "All users can read billboards"
  ON billboards FOR SELECT
  TO authenticated
  USING (true);

-- Citizens and inspectors can create billboards
CREATE POLICY "Citizens and inspectors can create billboards"
  ON billboards FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Officials can update billboard status
CREATE POLICY "Officials can update billboards"
  ON billboards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'official'
    )
  );

-- Users can read all violations
CREATE POLICY "All users can read violations"
  ON violations FOR SELECT
  TO authenticated
  USING (true);

-- Users can create violations
CREATE POLICY "Users can create violations"
  ON violations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Users can update their own violations
CREATE POLICY "Users can update own violations"
  ON violations FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Officials and inspectors can update violation status
CREATE POLICY "Officials and inspectors can update violation status"
  ON violations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('official', 'inspector')
    )
  );

-- All authenticated users can read badges
CREATE POLICY "All users can read badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Users can read their own badges
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System can award badges
CREATE POLICY "System can award badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- All authenticated users can read challenges
CREATE POLICY "All users can read challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_billboards_location ON billboards (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_violations_location ON violations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations (status);
CREATE INDEX IF NOT EXISTS idx_violations_type ON violations (type);
CREATE INDEX IF NOT EXISTS idx_violations_created_at ON violations (created_at);
CREATE INDEX IF NOT EXISTS idx_violations_reporter ON violations (reporter_id);
CREATE INDEX IF NOT EXISTS idx_violations_billboard ON violations (billboard_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges (user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_expires ON challenges (expires_at);

-- Create trigger for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_billboards_updated_at
  BEFORE UPDATE ON billboards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_violations_updated_at
  BEFORE UPDATE ON violations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();