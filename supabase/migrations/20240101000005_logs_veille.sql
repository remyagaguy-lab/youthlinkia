-- Create logs_veille table
create table public.logs_veille (
  id uuid primary key default gen_random_uuid(),
  type_cron text not null, -- 'veille_ia' | 'recheck_liens'
  sources_traitees int not null default 0,
  opportunites_ajoutees int not null default 0,
  statut text not null, -- 'succes' | 'erreur'
  details text,
  created_at timestamptz not null default now()
);

-- Insert test sources
insert into public.sources_veille (nom, url)
values 
  ('Campus France Bourses (Test RSS)', 'https://www.campusfrance.org/fr/bourses-etudiants-etrangers-rss'),
  ('ReliefWeb Jobs (Test RSS)', 'https://reliefweb.int/jobs/rss.xml');
