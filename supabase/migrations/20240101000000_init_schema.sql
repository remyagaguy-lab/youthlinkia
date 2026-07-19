-- Enum des rôles applicatifs (RBAC)
create type user_role as enum (
  'lyceen_etudiant',
  'jeune_professionnel',
  'entrepreneur',
  'partenaire',
  'moderateur',
  'admin'
);

-- Profil applicatif, étend auth.users (1-1)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  prenom text not null,
  pays text,
  secteur text,
  niveau_etudes_experience text,
  ambitions text,
  statut_validation text not null default 'valide', -- 'en_attente_validation' pour les partenaires
  completion_pct int generated always as (0) stored, -- calculé côté application, placeholder
  created_at timestamptz not null default now()
);

-- Structures / annuaire (Module 2)
create table public.structures (
  id uuid primary key default gen_random_uuid(),
  partenaire_id uuid references public.profiles(id),
  nom text not null,
  slug text unique not null,
  mission text not null,
  type text not null, -- institution_academique | structure_accompagnement | bailleur | incubateur | association | entreprise
  secteurs text[] not null default '{}',
  pays_intervention text[] not null default '{}',
  lien text,
  contact text,
  logo_url text,
  statut text not null default 'a_valider', -- a_valider | publiee | rejetee
  created_at timestamptz not null default now()
);

-- Sources de veille (Module 3)
create table public.sources_veille (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  url text not null,
  score_confiance numeric(3,2) not null default 0.50, -- 0 à 1, pilote l'auto-publication Phase 2/3
  derniere_verification timestamptz
);

-- Opportunités (Module 3, cœur du produit)
create table public.opportunites (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources_veille(id),
  structure_id uuid references public.structures(id),
  titre text not null,
  slug text unique not null,
  description text not null,
  type text not null, -- bourse_etude | bourse_recherche | formation_courte | emploi | volontariat | financement | concours
  montant_couverture text,
  pays_eligibles_residence text[] not null default '{}',
  pays_diffusion text[] not null default '{}',
  niveau_requis text,
  deadline date,
  lien_source text not null,
  tags text[] not null default '{}', -- ex: 'orientation_scolaire', 'insertion_professionnelle', 'orientation_entrepreneuriale'
  statut_fraicheur text not null default 'a_jour', -- a_jour | a_verifier | expiree
  statut_moderation text not null default 'detecte', -- detecte | a_valider | publie | rejete
  created_at timestamptz not null default now()
);

create index idx_opportunites_recherche on public.opportunites using gin (
  to_tsvector('french', titre || ' ' || description)
);

-- Alertes utilisateur (abonnement par critères)
create table public.alertes_utilisateur (
  id uuid primary key default gen_random_uuid(),
  utilisateur_id uuid not null references public.profiles(id) on delete cascade,
  criteres jsonb not null, -- { "pays": [...], "secteur": [...], "type": [...] }
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

-- Signalements communautaires
create table public.signalements (
  id uuid primary key default gen_random_uuid(),
  opportunite_id uuid not null references public.opportunites(id) on delete cascade,
  utilisateur_id uuid references public.profiles(id),
  motif text not null, -- lien_mort | info_erronee | autre
  statut text not null default 'ouvert', -- ouvert | traite
  created_at timestamptz not null default now()
);

-- Articles (Module 0 / CMS partagé)
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  auteur_id uuid references public.profiles(id),
  titre text not null,
  slug text unique not null,
  chapo text not null,
  corps text not null, -- markdown/MDX
  categorie text not null, -- tremplin_carriere | labo_business | reseautage | ecosysteme_data | filieres
  image_couverture_url text,
  image_couverture_alt text not null,
  meta_title text,
  meta_description text,
  related_links jsonb,
  statut text not null default 'brouillon', -- brouillon | publie
  published_at timestamptz
);

-- Abonnements & paiements (Module 10)
create table public.abonnements (
  id uuid primary key default gen_random_uuid(),
  titulaire_id uuid not null references public.profiles(id),
  type text not null, -- cotisation | plan_partenaire
  plan text,
  statut text not null default 'actif', -- actif | expire | annule
  rail_paiement text not null, -- stripe | cinetpay
  reference_transaction text,
  date_debut timestamptz not null default now(),
  date_fin timestamptz
);

-- Function is_staff()
create function public.is_staff() returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('moderateur', 'admin')
  );
$$ language sql security definer stable;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.structures enable row level security;
alter table public.sources_veille enable row level security;
alter table public.opportunites enable row level security;
alter table public.alertes_utilisateur enable row level security;
alter table public.signalements enable row level security;
alter table public.articles enable row level security;
alter table public.abonnements enable row level security;

-- Policies for profiles
create policy "chacun_lit_son_profil"
on public.profiles for select using (id = auth.uid() or is_staff());

create policy "chacun_modifie_son_profil"
on public.profiles for update using (id = auth.uid() or is_staff());

-- Policies for structures
create policy "lecture_publique_structures_publiees"
on public.structures for select
using (statut = 'publiee' or partenaire_id = auth.uid() or is_staff());

create policy "ecriture_partenaire_sur_sa_structure"
on public.structures for insert with check (partenaire_id = auth.uid() or is_staff());

create policy "modification_partenaire_sur_sa_structure"
on public.structures for update using (partenaire_id = auth.uid() or is_staff());

-- Policies for opportunites
create policy "lecture_publique_opportunites_publiees"
on public.opportunites for select
using (statut_moderation = 'publie' or is_staff());

create policy "staff_acces_complet_opportunites"
on public.opportunites for all using (is_staff())
with check (is_staff());

-- Policies for articles
create policy "lecture_publique_articles_publies"
on public.articles for select
using (statut = 'publie' or is_staff());

create policy "staff_acces_complet_articles"
on public.articles for all using (is_staff())
with check (is_staff());

-- Policies for alertes_utilisateur
create policy "chacun_lit_ses_alertes"
on public.alertes_utilisateur for select using (utilisateur_id = auth.uid() or is_staff());

create policy "chacun_modifie_ses_alertes"
on public.alertes_utilisateur for all using (utilisateur_id = auth.uid() or is_staff()) with check (utilisateur_id = auth.uid() or is_staff());

-- TRIGGER handle_new_user()
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, prenom)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::user_role, 'lyceen_etudiant'::user_role), coalesce(new.raw_user_meta_data->>'prenom', 'Nouveau'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
