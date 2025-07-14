/*
  # Setup New Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `orders` - Order management system
    - `chat_messages` - Live chat system
    - `order_status_updates` - Order status tracking
    - `email_logs` - Email notification tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for users and admins
    - Proper access controls

  3. Functions
    - Auto-generate order numbers
    - Order status management
    - Profile creation triggers
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  phone text,
  address text,
  city text,
  country text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY DEFAULT ('ST-' || extract(epoch from now())::bigint::text),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  postal_code text,
  country text,
  watch_id integer,
  watch_brand text,
  watch_model text,
  watch_year text,
  watch_condition text,
  price text,
  original_price text,
  subtotal numeric,
  shipping numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  total numeric,
  currency text DEFAULT 'USD',
  payment_method text CHECK (payment_method IN ('Card Payment', 'Bank Transfer')),
  customs_assistance boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'payment_approved', 'shipping_in_progress', 'delivery_completed')),
  tracking_number text,
  order_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  payment_approved_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('customer', 'admin')),
  customer_email text,
  customer_name text,
  created_at timestamptz DEFAULT now()
);

-- Create order status updates table
CREATE TABLE IF NOT EXISTS order_status_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id)
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  recipient_email text,
  subject text,
  sent_at timestamptz DEFAULT now(),
  event_type text
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND (p.is_admin = true OR p.email = 'standardtimepiece@gmail.com')
    )
  );

-- Orders policies
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO public
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

-- Chat messages policies
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

-- Order status updates policies
CREATE POLICY "order_updates_select_own" ON order_status_updates
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_updates.order_id 
      AND orders.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.email = 'standardtimepiece@gmail.com')
    )
  );

CREATE POLICY "order_updates_all_admin" ON order_status_updates
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

-- Function to generate unique 5-digit order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  exists_check boolean;
BEGIN
  LOOP
    -- Generate random 5-digit number
    new_number := LPAD((RANDOM() * 99999)::int::text, 5, '0');
    
    -- Check if it already exists
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO exists_check;
    
    -- If it doesn't exist, we can use it
    IF NOT exists_check THEN
      RETURN new_number;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically assign order number
CREATE OR REPLACE FUNCTION assign_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign order number on insert
CREATE TRIGGER trg_assign_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION assign_order_number();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    now(), 
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER create_profile_on_signup_trigger
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

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to update order status with proper error handling
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
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_status_updates_order_id ON order_status_updates(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_customer_email ON chat_messages(customer_email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);

-- Set admin user
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