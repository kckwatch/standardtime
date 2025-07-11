/*
  # Complete Checkout System Migration

  1. New Tables
    - Enhanced `orders` table with 5-step checkout process
    - `order_status_updates` table for tracking status changes
    - `email_logs` table for tracking sent emails

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin and user access

  3. Features
    - 5-digit unique order numbers
    - Order status tracking (5 stages)
    - Payment method support (card/bank)
    - Customs assistance tracking
    - Admin approval workflow
*/

-- Create enhanced orders table
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
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'payment_approved', 'shipping_in_progress', 'delivery_completed', 'verified')),
  tracking_number text,
  order_date timestamptz DEFAULT now(),
  payment_approved_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  verified_at timestamptz,
  bank_transfer_confirmed boolean DEFAULT false,
  admin_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order status updates table for audit trail
CREATE TABLE IF NOT EXISTS order_status_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  notes text,
  tracking_number text,
  changed_at timestamptz DEFAULT now()
);

-- Create email logs table for tracking notifications
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  recipient_email text,
  subject text,
  event_type text CHECK (event_type IN ('order_confirmation', 'payment_approved', 'shipping_started', 'tracking_number', 'delivery_completed', 'verified')),
  sent_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop orders policies
  DROP POLICY IF EXISTS "orders_select_own" ON orders;
  DROP POLICY IF EXISTS "orders_select_admin" ON orders;
  DROP POLICY IF EXISTS "orders_insert_admin" ON orders;
  DROP POLICY IF EXISTS "orders_update_admin" ON orders;
  DROP POLICY IF EXISTS "orders_delete_admin" ON orders;
  DROP POLICY IF EXISTS "orders_insert_public" ON orders;
  
  -- Drop order status updates policies
  DROP POLICY IF EXISTS "order_updates_select_own" ON order_status_updates;
  DROP POLICY IF EXISTS "order_updates_all_admin" ON order_status_updates;
  
  -- Drop email logs policies
  DROP POLICY IF EXISTS "email_logs_all_admin" ON email_logs;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new orders policies
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "orders_insert_admin" ON orders
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Allow anyone to insert orders (for checkout process)
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

-- Order status updates policies
CREATE POLICY "order_updates_select_own" ON order_status_updates
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_updates.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_updates_all_admin" ON order_status_updates
  FOR ALL TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Email logs policies
CREATE POLICY "email_logs_all_admin" ON email_logs
  FOR ALL TO public
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
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

-- Function to update order status with automatic date tracking
CREATE OR REPLACE FUNCTION update_order_status(
  order_id_param text,
  new_status_param text,
  updated_by_param uuid DEFAULT auth.uid(),
  notes_param text DEFAULT NULL,
  tracking_number_param text DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  old_status_val text;
  order_email text;
BEGIN
  -- Get current status and email
  SELECT status, email INTO old_status_val, order_email FROM orders WHERE id = order_id_param;
  
  -- Update order with new status and appropriate date
  UPDATE orders 
  SET 
    status = new_status_param,
    updated_at = now(),
    payment_approved_at = CASE 
      WHEN new_status_param = 'payment_approved' AND payment_approved_at IS NULL 
      THEN now() 
      ELSE payment_approved_at 
    END,
    shipped_at = CASE 
      WHEN new_status_param = 'shipping_in_progress' AND shipped_at IS NULL 
      THEN now() 
      ELSE shipped_at 
    END,
    delivered_at = CASE 
      WHEN new_status_param = 'delivery_completed' AND delivered_at IS NULL 
      THEN now() 
      ELSE delivered_at 
    END,
    verified_at = CASE 
      WHEN new_status_param = 'verified' AND verified_at IS NULL 
      THEN now() 
      ELSE verified_at 
    END,
    admin_verified = CASE 
      WHEN new_status_param = 'verified' 
      THEN true 
      ELSE admin_verified 
    END,
    tracking_number = COALESCE(tracking_number_param, tracking_number)
  WHERE id = order_id_param;
  
  -- Insert status update record
  INSERT INTO order_status_updates (order_id, previous_status, new_status, changed_by, notes, tracking_number)
  VALUES (order_id_param, old_status_val, new_status_param, updated_by_param, notes_param, tracking_number_param);
  
  -- Log email notification
  INSERT INTO email_logs (order_id, recipient_email, subject, event_type)
  VALUES (
    order_id_param, 
    order_email, 
    'Order Status Update - ' || new_status_param,
    CASE 
      WHEN new_status_param = 'payment_approved' THEN 'payment_approved'
      WHEN new_status_param = 'shipping_in_progress' THEN 'shipping_started'
      WHEN new_status_param = 'delivery_completed' THEN 'delivery_completed'
      WHEN new_status_param = 'verified' THEN 'verified'
      ELSE 'order_confirmation'
    END
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate order number on insert
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and create new one
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger to automatically log order creation
CREATE OR REPLACE FUNCTION log_order_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_logs (order_id, recipient_email, subject, event_type)
  VALUES (NEW.id, NEW.email, 'Order Confirmation - #' || NEW.order_number, 'order_confirmation');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and create new one
DROP TRIGGER IF EXISTS trigger_log_order_creation ON orders;
CREATE TRIGGER trigger_log_order_creation
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_creation();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_status_updates_order_id ON order_status_updates(order_id);
CREATE INDEX IF NOT EXISTS idx_status_updates_changed_at ON order_status_updates(changed_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent_at ON email_logs(sent_at);