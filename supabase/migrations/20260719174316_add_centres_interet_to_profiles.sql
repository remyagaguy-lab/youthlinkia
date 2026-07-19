ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS centres_interet text[] DEFAULT '{}';
