-- Create opportunites_suivies table
create table public.opportunites_suivies (
  id uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references public.profiles(id) on delete cascade,
  opportunite_id uuid not null references public.opportunites(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(utilisateur_id, opportunite_id)
);

-- Enable RLS
alter table public.opportunites_suivies enable row level security;

-- Policies
create policy "Users can view their own followed opportunities"
on public.opportunites_suivies for select
using (utilisateur_id = auth.uid() or is_staff());

create policy "Users can follow/unfollow opportunities"
on public.opportunites_suivies for all
using (utilisateur_id = auth.uid() or is_staff())
with check (utilisateur_id = auth.uid() or is_staff());
