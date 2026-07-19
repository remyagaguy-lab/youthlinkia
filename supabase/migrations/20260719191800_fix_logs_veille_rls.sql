-- Activer la Row Level Security pour la table logs_veille
alter table public.logs_veille enable row level security;

-- Créer une politique permettant uniquement aux administrateurs de lire ces logs
create policy "Seuls les administrateurs peuvent voir les logs de veille"
  on public.logs_veille for select
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Note: L'insertion dans logs_veille est faite par le Cron Job (Worker Cloudflare)
-- Le Worker utilise le service_role key, il contourne donc automatiquement la RLS pour l'insertion.
