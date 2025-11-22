-- Add profession column to profiles table for civil workers
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profession TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN profiles.profession IS 'Profession type for civil workers (plumber, electrician, painter, etc.)';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'profession';
