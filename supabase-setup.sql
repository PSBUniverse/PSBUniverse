-- ============================================================
-- PSBUniverse � Supabase Gutter Tables
-- Naming: GTR_S_* (setup) and GTR_T_* (transactional)
-- ============================================================

-- ------------------------------------------------------------
-- 0) Rename legacy tables if they already exist
-- ------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.statuses') IS NOT NULL AND to_regclass('public.gtr_s_statuses') IS NULL THEN
    ALTER TABLE public.statuses RENAME TO gtr_s_statuses;
  END IF;

  IF to_regclass('public.colors') IS NOT NULL AND to_regclass('public.gtr_s_colors') IS NULL THEN
    ALTER TABLE public.colors RENAME TO gtr_s_colors;
  END IF;

  IF to_regclass('public.manufacturers') IS NOT NULL AND to_regclass('public.gtr_s_manufacturers') IS NULL THEN
    ALTER TABLE public.manufacturers RENAME TO gtr_s_manufacturers;
  END IF;

  IF to_regclass('public.leaf_guards') IS NOT NULL AND to_regclass('public.gtr_s_leaf_guards') IS NULL THEN
    ALTER TABLE public.leaf_guards RENAME TO gtr_s_leaf_guards;
  END IF;

  IF to_regclass('public.discounts') IS NOT NULL AND to_regclass('public.gtr_s_discounts') IS NULL THEN
    ALTER TABLE public.discounts RENAME TO gtr_s_discounts;
  END IF;

  IF to_regclass('public.trip_fee_rates') IS NOT NULL AND to_regclass('public.gtr_s_trip_fee_rates') IS NULL THEN
    ALTER TABLE public.trip_fee_rates RENAME TO gtr_s_trip_fee_rates;
  END IF;

  IF to_regclass('public.company_profile') IS NOT NULL AND to_regclass('public."PSB_S_Company"') IS NULL THEN
    ALTER TABLE public.company_profile RENAME TO "PSB_S_Company";
  END IF;

  IF to_regclass('public.gtr_s_company_profile') IS NOT NULL AND to_regclass('public."PSB_S_Company"') IS NULL THEN
    ALTER TABLE public.gtr_s_company_profile RENAME TO "PSB_S_Company";
  END IF;

  IF to_regclass('public.psb_s_company') IS NOT NULL AND to_regclass('public."PSB_S_Company"') IS NULL THEN
    ALTER TABLE public.psb_s_company RENAME TO "PSB_S_Company";
  END IF;

  IF to_regclass('public.projects') IS NOT NULL AND to_regclass('public.gtr_t_projects') IS NULL THEN
    ALTER TABLE public.projects RENAME TO gtr_t_projects;
  END IF;
END $$;

-- ------------------------------------------------------------
-- 1) Setup Tables
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gtr_s_statuses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS gtr_s_colors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS gtr_s_manufacturers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gtr_s_leaf_guards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gtr_s_discounts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  percent NUMERIC(5,4) NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS gtr_s_trip_fee_rates (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip TEXT NOT NULL UNIQUE,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "PSB_S_Company" (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT ''
);

-- ------------------------------------------------------------
-- 2) Transactional Tables
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gtr_t_projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  project_name TEXT DEFAULT '',
  customer TEXT DEFAULT '',
  status TEXT DEFAULT 'In Progress',
  date TEXT DEFAULT '',
  request_link TEXT DEFAULT '',
  project_address TEXT DEFAULT '',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- 3) Seed Data (only insert when missing)
-- ------------------------------------------------------------
INSERT INTO gtr_s_statuses (name) VALUES
  ('Awaiting Dealer Response'),
  ('Under Review'),
  ('In Progress'),
  ('Approved'),
  ('Completed'),
  ('On Hold'),
  ('Cancelled')
ON CONFLICT (name) DO NOTHING;

INSERT INTO gtr_s_colors (name) VALUES
  ('White'),
  ('Black'),
  ('Brown Chocolate'),
  ('Musket Brown'),
  ('Light Gray'),
  ('Charcoal'),
  ('Almond'),
  ('Cream'),
  ('Ivory'),
  ('Beige')
ON CONFLICT (name) DO NOTHING;

INSERT INTO gtr_s_manufacturers (name, rate) VALUES
  ('Spectra-Primary', 8.85),
  ('Sennox-Premium', 9.25),
  ('ABC-Good', 11.00)
ON CONFLICT (name) DO NOTHING;

INSERT INTO gtr_s_leaf_guards (name, price) VALUES
  ('Leaf Blaster', 30.00),
  ('Armour Lock (Black Mesh Screen) LS-Lock', 58.00),
  ('Eco Guard LS-Guard', 39.00)
ON CONFLICT (name) DO NOTHING;

INSERT INTO gtr_s_discounts (percent, description)
SELECT 0.08, 'Try this first on LFT price'
WHERE NOT EXISTS (
  SELECT 1 FROM gtr_s_discounts WHERE percent = 0.08 AND description = 'Try this first on LFT price'
);

INSERT INTO gtr_s_discounts (percent, description)
SELECT 0.13, 'More aggressive - to get the project'
WHERE NOT EXISTS (
  SELECT 1 FROM gtr_s_discounts WHERE percent = 0.13 AND description = 'More aggressive - to get the project'
);

INSERT INTO gtr_s_discounts (percent, description)
SELECT 0.15, 'Lowest price - email Arturo first'
WHERE NOT EXISTS (
  SELECT 1 FROM gtr_s_discounts WHERE percent = 0.15 AND description = 'Lowest price - email Arturo first'
);

INSERT INTO gtr_s_trip_fee_rates (trip, rate) VALUES
  ('St 1.5-1.99 Hrs', 150.00),
  ('St 2.0-2.5 Hrs', 200.00),
  ('Fr 2.6-3.0 Hrs', 10.25)
ON CONFLICT (trip) DO NOTHING;

INSERT INTO "PSB_S_Company" (email, phone)
SELECT 'Sales.pgd@premiumsteelgroup.com', '817-502-2520'
WHERE NOT EXISTS (SELECT 1 FROM "PSB_S_Company");

-- ------------------------------------------------------------
-- 4) RLS + Policies
-- ------------------------------------------------------------
ALTER TABLE gtr_s_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_s_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_s_manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_s_leaf_guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_s_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_s_trip_fee_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PSB_S_Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtr_t_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to gtr_s_statuses" ON gtr_s_statuses;
CREATE POLICY "Allow all access to gtr_s_statuses" ON gtr_s_statuses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_s_colors" ON gtr_s_colors;
CREATE POLICY "Allow all access to gtr_s_colors" ON gtr_s_colors FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_s_manufacturers" ON gtr_s_manufacturers;
CREATE POLICY "Allow all access to gtr_s_manufacturers" ON gtr_s_manufacturers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_s_leaf_guards" ON gtr_s_leaf_guards;
CREATE POLICY "Allow all access to gtr_s_leaf_guards" ON gtr_s_leaf_guards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_s_discounts" ON gtr_s_discounts;
CREATE POLICY "Allow all access to gtr_s_discounts" ON gtr_s_discounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_s_trip_fee_rates" ON gtr_s_trip_fee_rates;
CREATE POLICY "Allow all access to gtr_s_trip_fee_rates" ON gtr_s_trip_fee_rates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to PSB_S_Company" ON "PSB_S_Company";
CREATE POLICY "Allow all access to PSB_S_Company" ON "PSB_S_Company" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to gtr_t_projects" ON gtr_t_projects;
CREATE POLICY "Allow all access to gtr_t_projects" ON gtr_t_projects FOR ALL USING (true) WITH CHECK (true);
