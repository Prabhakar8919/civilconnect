-- ============================================
-- ADDRESS FIELDS MIGRATION
-- Add detailed address fields to profiles and land_listings tables
-- Run this in Supabase SQL Editor
-- ============================================

-- Add address columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS plot_number TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS village TEXT,
  ADD COLUMN IF NOT EXISTS mandal TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT;

-- Add address columns to land_listings table
ALTER TABLE land_listings 
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS plot_number TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS village TEXT,
  ADD COLUMN IF NOT EXISTS mandal TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT;

-- Verify the changes
SELECT '✅ Address columns added successfully!' as status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('house_number', 'plot_number', 'street', 'area', 'village', 'mandal', 'district');
