create table public.evenements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text not null,
  date_debut timestamptz not null,
  lien_inscription text,
  created_at timestamptz default now()
);

alter table public.evenements enable row level security;

create policy "Les évènements sont publics en lecture"
  on public.evenements for select
  using ( true );

create policy "Seuls les admins peuvent modifier les évènements"
  on public.evenements for all
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );
