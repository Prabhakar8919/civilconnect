-- ============================================
-- CIVILCONNECT - COMPLETE SETUP SCRIPT
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Then click "RUN" button
-- ============================================

-- PART 1: ADD MISSING COLUMNS TO PROFILES
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cost_per_sqft DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_projects INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT;

-- PART 2: CREATE CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- PART 3: ADD CHAT ATTACHMENTS
-- ============================================
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;

-- PART 4: CREATE RATINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rated_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rater_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rated_user_id, rater_user_id, connection_id)
);

ALTER TABLE ratings DISABLE ROW LEVEL SECURITY;

-- PART 5: CREATE STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('land-images', 'land-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- PART 6: STORAGE POLICIES - Profile Images
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated users to upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their profile images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their profile images" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload profile images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow public to read profile images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-images');

CREATE POLICY "Allow users to update their profile images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-images');

CREATE POLICY "Allow users to delete their profile images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-images');

-- PART 7: STORAGE POLICIES - Land Images
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated users to upload land images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read land images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their land images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their land images" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload land images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'land-images');

CREATE POLICY "Allow public to read land images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'land-images');

CREATE POLICY "Allow users to update their land images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'land-images');

CREATE POLICY "Allow users to delete their land images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'land-images');
-- PART 8: STORAGE POLICIES - Chat Files
-- ============================================
DROP POLICY IF EXISTS "Allow authenticated users to upload chat files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read chat files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their chat files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their chat files" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload chat files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Allow public to read chat files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chat-files');

CREATE POLICY "Allow users to update their chat files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'chat-files');

CREATE POLICY "Allow users to delete their chat files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-files');

-- PART 9: SET YOUR EMAIL AS ADMIN
-- ============================================
-- ⚠️ IMPORTANT: Replace 'itzprabhakar8919@gmail.com' with YOUR email
UPDATE profiles SET role = 'admin' WHERE email = 'itzprabhakar8919@gmail.com';

-- PART 10: VERIFY SETUP
-- ============================================
SELECT '✅ SETUP COMPLETE!' as status;
SELECT 'Admin user:' as info, full_name, email, role FROM profiles WHERE role = 'itzprabhakar8919@gmail.com';
SELECT 'Total profiles:' as info, COUNT(*) as count FROM profiles;
SELECT 'Storage buckets:' as info, name FROM storage.buckets WHERE name IN ('profile-images', 'land-images', 'chat-files');
