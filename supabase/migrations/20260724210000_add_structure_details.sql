-- Migration: add_structure_details
-- Description: Enrich the structures table with new fields for premium presentation pages.

ALTER TABLE public.structures
ADD COLUMN IF NOT EXISTS description_detaillee TEXT,
ADD COLUMN IF NOT EXISTS formations_proposees JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS conditions_admission TEXT,
ADD COLUMN IF NOT EXISTS frais_scolarite TEXT,
ADD COLUMN IF NOT EXISTS chiffres_cles JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS galerie_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS site_web_officiel TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_telephone TEXT,
ADD COLUMN IF NOT EXISTS couverture_url TEXT;

-- Update RLS policies to ensure the new fields are readable
-- (Assuming existing policy "Les structures publiées sont visibles par tous" covers the whole row)
