# 🚀 Supabase Setup Guide - CivilConnect

## Step-by-Step Instructions

### 1️⃣ Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your **CivilConnect** project

### 2️⃣ Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"** button (top right)

### 3️⃣ Run the Setup Script
1. Open the file: `RUN_THIS_IN_SUPABASE.sql`
2. **Copy the ENTIRE content** (Ctrl+A, then Ctrl+C)
3. **Paste it** into the Supabase SQL Editor
4. **IMPORTANT**: Before running, find this line:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'itzprabhakar8919@gmail.com';
   ```
5. Replace `'itzprabhakar8919@gmail.com'` with **YOUR email address**
6. Click the **"RUN"** button (or press Ctrl+Enter)

### 4️⃣ Verify Success
After running, you should see:
- ✅ "SETUP COMPLETE!" message
- Your admin user details
- Total profiles count
- Storage buckets created

### 5️⃣ Test Your Website
Now you can test:
- ✅ Upload profile images
- ✅ Upload files in chat
- ✅ Submit contact form
- ✅ Access admin panel at `/admin/dashboard`

---

## 🔧 What This Script Does

1. **Adds missing columns** to profiles table (role, phone, experience, etc.)
2. **Creates contact_messages table** for the contact form
3. **Adds attachment support** to chat messages
4. **Creates ratings table** for user reviews
5. **Sets up storage buckets** for images and files
6. **Configures storage policies** to allow uploads
7. **Makes you an admin** so you can access `/admin/dashboard`

---

## ⚠️ Troubleshooting

### If you get "column already exists" errors:
- **This is normal!** The script uses `IF NOT EXISTS` to safely add columns
- The script will skip existing columns and continue

### If you get "policy already exists" errors:
- **This is normal!** The script drops old policies before creating new ones

### If uploads still don't work:
1. Go to **Storage** in Supabase sidebar
2. Check if buckets exist: `profile-images`, `land-images`, `chat-files`
3. Click on each bucket → **Policies** tab
4. Verify policies are listed

### If admin panel doesn't work:
1. Run this query to check your role:
   ```sql
   SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
   ```
2. If role is not 'admin', run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

---

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase SQL Editor for error messages
2. Copy the error message
3. Share it for debugging

---

## ✅ After Setup Checklist

- [ ] SQL script ran successfully
- [ ] Admin role assigned to your email
- [ ] Can upload profile images
- [ ] Can send files in chat
- [ ] Contact form saves messages
- [ ] Can access `/admin/dashboard`

**Once all checked, your website is fully functional! 🎉**
