create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  frequence text not null default 'quotidienne', -- immediate, quotidienne, hebdomadaire
  canaux jsonb not null default '["email"]', -- ["email", "push"]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "chacun_lit_ses_preferences"
on public.notification_preferences for select using (user_id = auth.uid() or is_staff());

create policy "chacun_modifie_ses_preferences"
on public.notification_preferences for update using (user_id = auth.uid() or is_staff());

create policy "chacun_cree_ses_preferences"
on public.notification_preferences for insert with check (user_id = auth.uid() or is_staff());
