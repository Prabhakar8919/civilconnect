# Database Migrations Guide

## Required Migrations

### 1. Address Fields Migration
**File:** `address_migration.sql`  
**Status:** ⚠️ MUST BE RUN IN PRODUCTION

**Instructions:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `address_migration.sql`
3. Click "Run"
4. Verify success message

**What it does:**
- Adds address columns to `profiles` table: house_number, plot_number, street, area, village, mandal, district
- Adds same columns to `land_listings` table

**Verification:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('house_number', 'plot_number', 'street', 'area', 'village', 'mandal', 'district');
```

Expected: 7 rows returned

---

## Migration History

| Date | File | Status | Description |
|------|------|--------|-------------|
| 2025-11-16 | address_migration.sql | ⚠️ Pending | Add detailed address fields |

---

## After Running Migrations

Once migrations are successfully applied in production:
1. Move `address_migration.sql` to `supabase/migrations/` folder
2. Update this README with completion date
3. Commit changes to version control
