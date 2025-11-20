-- ============================================
-- SUPABASE MIGRATION: ADD MISSING COLUMNS
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query)
-- ============================================

-- 1. ADD MISSING COLUMNS TO LEADS TABLE
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS timeline TEXT;

-- 2. ADD MISSING COLUMNS TO CONTACTS TABLE
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS linkedin TEXT;

-- 3. MIGRATE EXISTING DATA (if position column has data, copy to title)
UPDATE public.contacts
SET title = position
WHERE title IS NULL AND position IS NOT NULL;

-- 4. CREATE INDEXES FOR NEW COLUMNS (OPTIONAL - FOR BETTER PERFORMANCE)
CREATE INDEX IF NOT EXISTS idx_leads_status_score ON public.leads(status, score);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_department ON public.contacts(department);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- All missing columns have been added to your tables.
-- Your forms will now save all field data correctly.
-- ============================================
