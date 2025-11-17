-- Fix the ratings table to have proper foreign key relationships
-- Run this in Supabase SQL Editor

-- Drop the existing ratings table
DROP TABLE IF EXISTS ratings CASCADE;

-- Recreate ratings table with proper foreign keys
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rated_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rater_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rated_user_id, rater_user_id, connection_id)
);

-- Disable RLS for ratings table
ALTER TABLE ratings DISABLE ROW LEVEL SECURITY;

-- Verify the foreign keys were created
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'ratings';
