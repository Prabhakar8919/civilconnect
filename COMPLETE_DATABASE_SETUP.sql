-- ============================================
-- CIVILCONNECT COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Create enum for user types (including admin)
CREATE TYPE user_type AS ENUM (
  'land_owner',
  'buyer', 
  'architect',
  'engineer',
  'contractor',
  'builder',
  'worker',
  'material_seller',
  'admin'
);

-- Create enum for listing status
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold', 'inactive');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type user_type NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create land listings table
CREATE TABLE land_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  area_sqft DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  price_per_sqft DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL,
  images TEXT[],
  amenities TEXT[],
  status listing_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create professional profiles table (for architects, engineers, contractors, builders)
CREATE TABLE professional_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  experience_years INTEGER,
  price_per_sqft DECIMAL,
  certifications TEXT[],
  portfolio_images TEXT[],
  services_offered TEXT[],
  availability BOOLEAN DEFAULT true,
  rating DECIMAL DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create worker profiles table (for civil workers, laborers)
CREATE TABLE worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills TEXT[] NOT NULL,
  experience_years INTEGER,
  availability BOOLEAN DEFAULT true,
  rating DECIMAL DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create material listings table
CREATE TABLE material_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  images TEXT[],
  in_stock BOOLEAN DEFAULT true,
  minimum_order DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create connections table (for tracking user connections)
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Create password reset codes table
CREATE TABLE password_reset_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for land_listings
CREATE POLICY "Anyone can view active land listings"
  ON land_listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Owners can insert their land listings"
  ON land_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their land listings"
  ON land_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their land listings"
  ON land_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- RLS Policies for professional_profiles
CREATE POLICY "Anyone can view professional profiles"
  ON professional_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their professional profile"
  ON professional_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their professional profile"
  ON professional_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

-- RLS Policies for worker_profiles
CREATE POLICY "Anyone can view worker profiles"
  ON worker_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their worker profile"
  ON worker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their worker profile"
  ON worker_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

-- RLS Policies for material_listings
CREATE POLICY "Anyone can view active material listings"
  ON material_listings FOR SELECT
  TO authenticated
  USING (in_stock = true);

CREATE POLICY "Sellers can insert their material listings"
  ON material_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their material listings"
  ON material_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their material listings"
  ON material_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- RLS Policies for connections
CREATE POLICY "Users can view their connections"
  ON connections FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connections"
  ON connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- RLS Policies for password_reset_codes
CREATE POLICY "Users can view their own reset codes"
  ON password_reset_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reset codes"
  ON password_reset_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reset codes"
  ON password_reset_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_listings_updated_at BEFORE UPDATE ON land_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_profiles_updated_at BEFORE UPDATE ON professional_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_listings_updated_at BEFORE UPDATE ON material_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AFTER RUNNING THE ABOVE, RUN THIS TO SET YOUR ADMIN USER:
-- Replace 'your-email@example.com' with your actual email
-- ============================================

-- UPDATE profiles 
-- SET user_type = 'admin' 
-- WHERE email = 'itzprabhakar8919@gmail.com';
