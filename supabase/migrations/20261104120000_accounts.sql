-- Benutzerkonten der Lernplattform (Paket K1).
-- Konten legen ausschließlich Admins über die Edge Function admin-users an; eine
-- öffentliche Registrierung gibt es nicht. Die Anmeldung erfolgt mit Benutzername
-- und Zugangscode; die E-Mail-Adresse im Auth-System ist nur ein interner Platzhalter
-- (<benutzername>@chemie-lernraum.invalid), an den nie E-Mails verschickt werden.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9.-]{1,39}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  is_admin boolean not null default false,
  can_view_archive boolean not null default false,
  -- Letzter gültiger Tag (deutsche Zeit); null = unbefristet.
  valid_until date,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Ein Profil je Konto: Anzeigename, Rechte und Ablaufdatum.';
comment on column public.profiles.can_view_archive is 'Darf das Abiturarchiv sehen; der Archivinhalt ist noch nicht freigegeben.';

-- Heutiges Datum in deutscher Zeit, damit ein Zugang bis einschließlich valid_until gilt.
create function public.today_berlin() returns date
language sql stable set search_path = ''
as $$ select (now() at time zone 'Europe/Berlin')::date $$;

-- Ist das angemeldete Konto noch gültig?
create function public.is_active() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and (valid_until is null or valid_until >= public.today_berlin())
  )
$$;

-- Ist das angemeldete Konto ein gültiges Admin-Konto?
create function public.is_active_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin and (valid_until is null or valid_until >= public.today_berlin())
  )
$$;

alter table public.profiles enable row level security;

-- Das eigene Profil ist immer lesbar (auch abgelaufen, damit die Seite den Ablauf anzeigen kann).
create policy "Eigenes Profil oder Admin liest" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_active_admin()));

create policy "Admin ändert Profile" on public.profiles
  for update to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

-- Anlegen und Löschen nur über die Edge Function (Service-Rolle), daher keine Policies dafür.
-- Admins dürfen nur Anzeigename, Rechte und Ablaufdatum ändern, nicht Benutzername oder ID.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, is_admin, can_view_archive, valid_until) on public.profiles to authenticated;

-- Es muss immer mindestens ein gültiges Admin-Konto bleiben.
create function public.keep_active_admin() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if old.is_admin and (old.valid_until is null or old.valid_until >= public.today_berlin())
     and not exists (
       select 1 from public.profiles
       where is_admin and (valid_until is null or valid_until >= public.today_berlin())
     ) then
    raise exception 'Mindestens ein gültiges Admin-Konto muss bestehen bleiben.';
  end if;
  return null;
end
$$;

create trigger keep_active_admin
  after update or delete on public.profiles
  for each row execute function public.keep_active_admin();

-- Abgelaufene Konten samt allen zugehörigen Daten löschen (über on delete cascade).
create function public.delete_expired_accounts() returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  removed integer;
begin
  delete from auth.users
  where id in (select id from public.profiles where valid_until < public.today_berlin());
  get diagnostics removed = row_count;
  return removed;
end
$$;

revoke execute on function public.delete_expired_accounts() from public, anon, authenticated;

-- Täglich um 03:15 UTC ausführen.
create extension if not exists pg_cron;
select cron.schedule('abgelaufene-konten-loeschen', '15 3 * * *', 'select public.delete_expired_accounts()');
