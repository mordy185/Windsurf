/*
  # Make Optional Customer Fields Nullable

  1. Changes
    - Make street_address nullable (was incorrectly set as NOT NULL)
    - Make postal_code nullable (was incorrectly set as NOT NULL)
  
  2. Reason
    - These fields are optional in the registration form
    - Users should be able to register without providing these details
*/

-- Make street_address nullable
ALTER TABLE customers 
  ALTER COLUMN street_address DROP NOT NULL;

-- Make postal_code nullable
ALTER TABLE customers 
  ALTER COLUMN postal_code DROP NOT NULL;