-- Update "civil_labour" profession to "mason"
-- Run this in Supabase SQL Editor

-- Step 1: Check existing civil_labour users
SELECT 
    id,
    full_name,
    email,
    profession,
    created_at
FROM profiles
WHERE profession = 'civil_labour';

-- Step 2: Update civil_labour to mason
UPDATE profiles
SET profession = 'mason'
WHERE profession = 'civil_labour';

-- Step 3: Verify the update
SELECT 
    id,
    full_name,
    email,
    profession,
    created_at
FROM profiles
WHERE profession = 'mason';

-- Step 4: Check all professions count
SELECT 
    profession,
    COUNT(*) as count
FROM profiles
WHERE user_type = 'worker'
GROUP BY profession
ORDER BY count DESC;

-- Done! Now "Mason" will appear instead of "Civil Labour"
