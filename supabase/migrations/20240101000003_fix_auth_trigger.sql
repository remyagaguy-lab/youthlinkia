-- Fix trigger search path and type casting
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, prenom)
  values (
    new.id, 
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'lyceen_etudiant'::public.user_role), 
    coalesce(new.raw_user_meta_data->>'prenom', 'Nouveau')
  );
  return new;
end;
$$;
