/*
  # Add missing original_price column to orders table

  1. Add missing columns
    - Add original_price column to orders table
    - Ensure all required columns exist

  2. Fix any remaining issues
    - Update table structure to match checkout requirements
*/

-- Add missing original_price column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_price text;

-- Ensure all other required columns exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS watch_condition text;

-- Update the orders table to ensure it has all the columns we need
DO $$ 
BEGIN
  -- Check if columns exist and add them if they don't
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'original_price') THEN
    ALTER TABLE orders ADD COLUMN original_price text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'watch_condition') THEN
    ALTER TABLE orders ADD COLUMN watch_condition text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'country') THEN
    ALTER TABLE orders ADD COLUMN country text;
  END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';