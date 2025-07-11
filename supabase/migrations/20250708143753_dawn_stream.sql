/*
  # Create Profile and Personal Records System

  1. New Tables
    - `profile` table with id, username, address, avatar_url
    - `personal_records` table with id, user_id, email, address, order_number, orders
    
  2. Security
    - Enable RLS on both tables
    - Users have full CRUD permissions for their own data
    - Auto-generate UUID for personal_records.id
    - Link both tables to auth.users.id

  3. Authentication
    - Email-based signup and login
    - Email verification required for new accounts
    - Proper user_id capture on login
*/

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  address text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create personal_records table
CREATE TABLE IF NOT EXISTS personal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  address text,
  order_number text,
  orders jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop profile policies
  DROP POLICY IF EXISTS "profile_select_own" ON profile;
  DROP POLICY IF EXISTS "profile_insert_own" ON profile;
  DROP POLICY IF EXISTS "profile_update_own" ON profile;
  DROP POLICY IF EXISTS "profile_delete_own" ON profile;
  
  -- Drop personal_records policies
  DROP POLICY IF EXISTS "personal_records_select_own" ON personal_records;
  DROP POLICY IF EXISTS "personal_records_insert_own" ON personal_records;
  DROP POLICY IF EXISTS "personal_records_update_own" ON personal_records;
  DROP POLICY IF EXISTS "personal_records_delete_own" ON personal_records;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Profile table policies - Full CRUD for own data
CREATE POLICY "profile_select_own" ON profile
  FOR SELECT TO public
  USING (auth.uid() = id);

CREATE POLICY "profile_insert_own" ON profile
  FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profile_update_own" ON profile
  FOR UPDATE TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profile_delete_own" ON profile
  FOR DELETE TO public
  USING (auth.uid() = id);

-- Personal records table policies - Full CRUD for own data
CREATE POLICY "personal_records_select_own" ON personal_records
  FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "personal_records_insert_own" ON personal_records
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "personal_records_update_own" ON personal_records
  FOR UPDATE TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "personal_records_delete_own" ON personal_records
  FOR DELETE TO public
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile (id, username, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now());
  
  INSERT INTO personal_records (user_id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and personal record on user signup
DROP TRIGGER IF EXISTS create_profile_on_signup_trigger ON auth.users;
CREATE TRIGGER create_profile_on_signup_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_on_signup();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at on both tables
DROP TRIGGER IF EXISTS update_profile_updated_at ON profile;
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_personal_records_updated_at ON personal_records;
CREATE TRIGGER update_personal_records_updated_at
  BEFORE UPDATE ON personal_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_id ON profile(id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_email ON personal_records(email);
CREATE INDEX IF NOT EXISTS idx_personal_records_order_number ON personal_records(order_number);

-- Function to add order to personal records
CREATE OR REPLACE FUNCTION add_order_to_personal_records(
  p_user_id uuid,
  p_order_number text,
  p_order_data jsonb
)
RETURNS void AS $$
BEGIN
  -- Update the orders array in personal_records
  UPDATE personal_records 
  SET 
    orders = COALESCE(orders, '[]'::jsonb) || p_order_data,
    order_number = p_order_number,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO personal_records (user_id, email, order_number, orders)
    SELECT p_user_id, email, p_order_number, jsonb_build_array(p_order_data)
    FROM auth.users 
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;