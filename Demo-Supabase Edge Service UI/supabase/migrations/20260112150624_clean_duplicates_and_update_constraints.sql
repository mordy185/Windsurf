/*
  # Clean Duplicate Phone Numbers and Update Customer Table Constraints

  1. Changes
    - Delete duplicate customer records (keep only the oldest record per phone number)
    - Remove unique constraint from email column (allow multiple customers with same email)
    - Add unique constraint to phone_number column (service number must be unique)
    - Create sequence for customer_id generation
    - Add function to auto-generate customer_id in format C0000001, C0000002, etc.
    - Make customer_id column NOT NULL with auto-generation

  2. Security
    - No RLS changes needed

  3. Important Notes
    - Removes duplicate test records to ensure data integrity
    - Keeps the oldest record for each duplicate phone number
*/

-- Delete duplicate customers, keeping only the oldest record for each phone number
DELETE FROM customers 
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY phone_number ORDER BY created_at ASC) as rn
    FROM customers
  ) t
  WHERE t.rn > 1
);

-- Drop unique constraint on email if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'customers_email_key'
  ) THEN
    ALTER TABLE customers DROP CONSTRAINT customers_email_key;
  END IF;
END $$;

-- Add unique constraint on phone_number if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'customers_phone_number_key'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_phone_number_key UNIQUE (phone_number);
  END IF;
END $$;

-- Create sequence for customer_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class 
    WHERE relname = 'customers_customer_id_seq'
  ) THEN
    CREATE SEQUENCE customers_customer_id_seq START WITH 1;
  END IF;
END $$;

-- Set the sequence to start from the highest existing customer_id + 1
DO $$
DECLARE
  max_id INTEGER := 0;
BEGIN
  -- Get the highest existing customer_id number
  SELECT COALESCE(MAX(CAST(SUBSTRING(customer_id FROM 2) AS INTEGER)), 0) 
  INTO max_id
  FROM customers 
  WHERE customer_id IS NOT NULL AND customer_id ~ '^C[0-9]+$';
  
  -- Set the sequence to start from max_id + 1
  PERFORM setval('customers_customer_id_seq', max_id);
END $$;

-- Create function to generate customer_id in format C0000001
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  formatted_id TEXT;
BEGIN
  next_id := nextval('customers_customer_id_seq');
  formatted_id := 'C' || LPAD(next_id::TEXT, 7, '0');
  RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing NULL customer_id values
UPDATE customers 
SET customer_id = generate_customer_id() 
WHERE customer_id IS NULL;

-- Make customer_id NOT NULL and set default
ALTER TABLE customers 
  ALTER COLUMN customer_id SET DEFAULT generate_customer_id(),
  ALTER COLUMN customer_id SET NOT NULL;

-- Add unique constraint on customer_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'customers_customer_id_key'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_customer_id_key UNIQUE (customer_id);
  END IF;
END $$;