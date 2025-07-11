/*
  # Fix All Database Issues - Complete Migration

  1. Tables
    - Fix admin_users table structure
    - Ensure email_logs table exists
    - Update all RLS policies
    - Fix orders table with proper constraints

  2. Functions
    - Drop and recreate update_order_status function
    - Add proper error handling

  3. Security
    - Update all policies for admin access
    - Ensure proper permissions
*/

-- Drop existing function first to avoid return type conflict
DROP FUNCTION IF EXISTS update_order_status(text, text, uuid);
DROP FUNCTION IF EXISTS update_order_status(text, text);

-- Drop and recreate admin_users table with correct structure
DROP TABLE IF EXISTS admin_users CASCADE;
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure email_logs table exists with correct structure
DROP TABLE IF EXISTS email_logs CASCADE;
CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  recipient_email text,
  subject text,
  sent_at timestamptz DEFAULT now(),
  event_type text
);

-- Fix orders table - ensure it has all required columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country text;

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Fix profiles table policies - allow admin to see all profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO public
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND (p.is_admin = true OR p.email = 'standardtimepiece@gmail.com')
    )
  );

-- Fix orders policies - ensure proper admin access
DROP POLICY IF EXISTS "orders_select_admin" ON orders;
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

DROP POLICY IF EXISTS "orders_update_admin" ON orders;
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

-- Fix chat_messages policies
DROP POLICY IF EXISTS "chat_messages_select_own" ON chat_messages;
CREATE POLICY "chat_messages_select_own" ON chat_messages
  FOR SELECT TO public
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

DROP POLICY IF EXISTS "chat_messages_insert_own" ON chat_messages;
CREATE POLICY "chat_messages_insert_own" ON chat_messages
  FOR INSERT TO public
  WITH CHECK (
    (sender = 'customer' AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
    OR (sender = 'admin' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    ))
  );

-- Admin users policies
CREATE POLICY "admin_users_all_admin" ON admin_users
  FOR ALL TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

-- Email logs policies
CREATE POLICY "email_logs_all_admin" ON email_logs
  FOR ALL TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

-- Create new function to update order status with proper error handling
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id text,
  p_new_status text,
  p_admin_id uuid DEFAULT auth.uid()
)
RETURNS json AS $$
DECLARE
  old_status text;
  order_email text;
BEGIN
  -- Get current status and email
  SELECT status, email INTO old_status, order_email FROM orders WHERE id = p_order_id;
  
  IF old_status IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;
  
  -- Update order with new status and appropriate timestamps
  UPDATE orders 
  SET 
    status = p_new_status,
    updated_at = now(),
    payment_approved_at = CASE 
      WHEN p_new_status = 'payment_approved' AND payment_approved_at IS NULL 
      THEN now() 
      ELSE payment_approved_at 
    END,
    shipped_at = CASE 
      WHEN p_new_status = 'shipping_in_progress' AND shipped_at IS NULL 
      THEN now() 
      ELSE shipped_at 
    END,
    delivered_at = CASE 
      WHEN p_new_status = 'delivery_completed' AND delivered_at IS NULL 
      THEN now() 
      ELSE delivered_at 
    END
  WHERE id = p_order_id;
  
  -- Insert status update record
  INSERT INTO order_status_updates (order_id, previous_status, new_status, changed_by)
  VALUES (p_order_id, old_status, p_new_status, p_admin_id);
  
  -- Log email notification
  INSERT INTO email_logs (order_id, recipient_email, subject, event_type)
  VALUES (
    p_order_id,
    order_email,
    'Order Status Update - ' || p_new_status,
    CASE 
      WHEN p_new_status = 'payment_approved' THEN 'payment_approved'
      WHEN p_new_status = 'shipping_in_progress' THEN 'shipping_started'
      WHEN p_new_status = 'delivery_completed' THEN 'delivery_completed'
      ELSE 'status_update'
    END
  );
  
  RETURN json_build_object('success', true, 'message', 'Order status updated successfully');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert admin user if not exists
INSERT INTO profiles (id, email, display_name, is_admin, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email),
  true,
  now(),
  now()
FROM auth.users 
WHERE email = 'standardtimepiece@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  is_admin = true,
  updated_at = now();

-- Insert into admin_users table
INSERT INTO admin_users (id, email, created_at, updated_at)
SELECT 
  id,
  email,
  now(),
  now()
FROM auth.users 
WHERE email = 'standardtimepiece@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  updated_at = now();