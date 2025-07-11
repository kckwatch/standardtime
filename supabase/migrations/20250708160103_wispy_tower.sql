/*
  # Fix Authentication, Orders, and Chat System

  1. Enhanced Tables
    - Update `profiles` table with proper fields
    - Create comprehensive `orders` table with 5-step checkout process
    - Add `chat_messages` table for live chat
    - Add `email_notifications` table for tracking emails

  2. Security
    - Enable RLS on all tables
    - Add policies for users and admins
    - Proper user access controls

  3. Features
    - Auto-generate unique 5-digit order numbers
    - Order status tracking with timestamps
    - Email notification system
    - Live chat between users and admins
    - Profile management with full CRUD
*/

-- Drop existing tables if they exist to recreate with proper structure
DROP TABLE IF EXISTS email_notifications CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS order_status_updates CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create enhanced profiles table
CREATE TABLE profiles (
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

-- Create comprehensive orders table
CREATE TABLE orders (
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
  order_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  payment_approved_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  tracking_number text
);

-- Create order status updates table for audit trail
CREATE TABLE order_status_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id)
);

-- Create chat messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('customer', 'admin')),
  customer_email text,
  customer_name text,
  created_at timestamptz DEFAULT now()
);

-- Create email notifications table
CREATE TABLE email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  subject text,
  body text,
  sent_at timestamptz DEFAULT now(),
  event_type text
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies - Users can manage their own profiles, admins can see all
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO public
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE TO public
  USING (auth.uid() = id);

-- Orders policies - Users can see their own orders, admins can see all
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

CREATE POLICY "orders_insert_admin" ON orders
  FOR INSERT TO public
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

-- Allow users to insert their own orders
CREATE POLICY "user_orders_insert" ON orders
  FOR INSERT TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_orders_select" ON orders
  FOR SELECT TO public
  USING (user_id = auth.uid());

CREATE POLICY "user_orders_update" ON orders
  FOR UPDATE TO public
  USING (user_id = auth.uid());

-- Allow public to insert orders (for guest checkout)
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

-- Order status updates policies
CREATE POLICY "order_updates_select_own" ON order_status_updates
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_status_updates.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "admin_status_updates_select" ON order_status_updates
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin
  ));

CREATE POLICY "order_updates_all_admin" ON order_status_updates
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

-- Chat messages policies
CREATE POLICY "chat_messages_select_own" ON chat_messages
  FOR SELECT TO public
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "chat_messages_insert_own" ON chat_messages
  FOR INSERT TO public
  WITH CHECK (
    (sender = 'customer' AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
    OR (sender = 'admin' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    ))
  );

-- Email notifications policies
CREATE POLICY "admin_email_notifications_select" ON email_notifications
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin
  ));

CREATE POLICY "user_email_notifications_select" ON email_notifications
  FOR SELECT TO public
  USING (order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  ));

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

-- Triggers to update updated_at on profiles and orders
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to send email notification (placeholder for integration)
CREATE OR REPLACE FUNCTION send_email_notification(
  p_order_id text,
  p_recipient_email text,
  p_subject text,
  p_body text,
  p_event_type text
)
RETURNS void AS $$
BEGIN
  -- Insert email log
  INSERT INTO email_notifications (order_id, recipient_email, subject, body, event_type)
  VALUES (p_order_id, p_recipient_email, p_subject, p_body, p_event_type);
  
  -- Here you would integrate with your email service
  -- For now, we just log the email
END;
$$ LANGUAGE plpgsql;

-- Function to handle order completion and send email for bank transfers
CREATE OR REPLACE FUNCTION complete_order_with_email()
RETURNS TRIGGER AS $$
DECLARE
  email_subject text;
  email_body text;
BEGIN
  -- Only send email for bank transfer orders
  IF NEW.payment_method = 'Bank Transfer' AND NEW.status = 'pending' THEN
    email_subject := '[Action Required] Complete Your Bank Transfer';
    email_body := 'Thank you for your order. Please complete the bank transfer as soon as possible.

Your Order Number: ' || NEW.order_number || '
Note: Payment verification may take up to 2 days. Delay in transfer could result in cancellation.

Bank Details:
Bank: Hana Bank
Account Name: Kwon, Changkyu (StandardTime)
Account Number: 29891090745107
SWIFT Code: HNBNKRSE
Amount: $' || NEW.total || ' USD
Reference: Order #' || NEW.order_number;

    -- Send email notification
    PERFORM send_email_notification(
      NEW.id,
      NEW.email,
      email_subject,
      email_body,
      'bank_transfer_instructions'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to send email on order creation
CREATE TRIGGER send_bank_transfer_email
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION complete_order_with_email();

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_status_updates_order_id ON order_status_updates(order_id);
CREATE INDEX idx_status_updates_order_id ON order_status_updates(order_id);
CREATE INDEX idx_chat_messages_customer_email ON chat_messages(customer_email);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_email_notifications_order_id ON email_notifications(order_id);
CREATE INDEX idx_email_notifications_sent_at ON email_notifications(sent_at);

-- Set admin user (replace with actual admin email)
UPDATE profiles SET is_admin = true WHERE email = 'standardtimepiece@gmail.com';

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
ON CONFLICT (id) DO UPDATE SET is_admin = true;