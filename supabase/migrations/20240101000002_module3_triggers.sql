-- Ajouter les tables au système Realtime de Supabase
alter publication supabase_realtime add table public.opportunites;
alter publication supabase_realtime add table public.signalements;

-- Trigger pour suspendre une opportunité après 3 signalements ouverts
create or replace function public.check_signalements_opportunite()
returns trigger as $$
declare
  signalements_count int;
begin
  -- Compter le nombre de signalements ouverts pour cette opportunité
  select count(*) into signalements_count
  from public.signalements
  where opportunite_id = new.opportunite_id and statut = 'ouvert';

  -- Si 3 ou plus, on repasse l'opportunité en "a_valider"
  if signalements_count >= 3 then
    update public.opportunites
    set statut_moderation = 'a_valider'
    where id = new.opportunite_id and statut_moderation = 'publie';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_check_signalements
after insert or update on public.signalements
for each row execute function public.check_signalements_opportunite();
