-- Geräte-Limit und Aktivitätsstatus (Nutzerentscheidung vom 04.11.2026).
-- Jedes Konto darf höchstens 3 Geräte gleichzeitig angemeldet haben; Admins sind ausgenommen.
-- Maßgeblich sind die drei neuesten Anmeldungen (Sitzungen in auth.sessions). Ältere Sitzungen
-- erhalten keine Daten mehr und werden beim nächsten Herzschlag entfernt, sodass sich das
-- Gerät nicht mehr verlängern kann. Für den Online-Status speichert die Seite nur den Zeitpunkt
-- der letzten Aktivität; IP-Adressen werden weder ausgewertet noch angezeigt.

alter table public.profiles add column last_seen_at timestamptz;

-- Neue Anmeldungen (Sitzungen) je Konto, damit Admins häufige Gerätewechsel erkennen, auch wenn
-- verdrängte Sitzungen schon gelöscht sind. Nur Sitzungskennung und Zeitpunkt, 30 Tage aufbewahrt.
create table public.session_log (
  session_id uuid primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  first_seen timestamptz not null default now()
);
alter table public.session_log enable row level security;
revoke all on public.session_log from anon, authenticated;

create function public.device_limit() returns integer
language sql immutable set search_path = ''
as $$ select 3 $$;

-- Ist die Sitzung des Aufrufs eine der erlaubten? Admins sind unbegrenzt.
create function public.session_allowed() returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false)
    or (auth.jwt() ->> 'session_id')::uuid in (
      select s.id from auth.sessions s
      where s.user_id = auth.uid()
      order by s.created_at desc
      limit public.device_limit()
    )
$$;

-- Gültiges Konto und erlaubtes Gerät; alle Zugriffsregeln nutzen diese Funktion.
create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and (valid_until is null or valid_until >= public.today_berlin())
  ) and public.session_allowed()
$$;

-- Herzschlag der geöffneten Seite: Aktivität vermerken, überzählige alte Sitzungen entfernen.
-- Ergebnis: 'ok', 'replaced' (Gerät wurde durch neuere Anmeldungen verdrängt) oder 'inactive'.
create function public.heartbeat() returns text
language plpgsql security definer set search_path = ''
as $$
declare
  me public.profiles;
begin
  select * into me from public.profiles where id = auth.uid();
  if me.id is null or not (me.valid_until is null or me.valid_until >= public.today_berlin()) then
    return 'inactive';
  end if;
  if not public.session_allowed() then
    return 'replaced';
  end if;
  update public.profiles set last_seen_at = now() where id = me.id;
  insert into public.session_log (session_id, user_id) values ((auth.jwt() ->> 'session_id')::uuid, me.id)
  on conflict (session_id) do nothing;
  delete from public.session_log where first_seen < now() - interval '30 days';
  if not me.is_admin then
    delete from auth.sessions s
    where s.user_id = me.id and s.id not in (
      select k.id from auth.sessions k where k.user_id = me.id order by k.created_at desc limit public.device_limit()
    );
  end if;
  return 'ok';
end
$$;

-- Übersicht für Admins: Aktivität, angemeldete Geräte, Anmeldungen der letzten 7 Tage.
create function public.admin_activity()
returns table (user_id uuid, last_seen_at timestamptz, ever_signed_in boolean, devices integer, logins_7d integer)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.last_seen_at, u.last_sign_in_at is not null,
    (select least(count(*), case when p.is_admin then count(*) else public.device_limit() end)::integer
       from auth.sessions s where s.user_id = p.id),
    (select count(*)::integer from public.session_log l where l.user_id = p.id and l.first_seen > now() - interval '7 days')
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_active_admin()
$$;

-- Angemeldete Geräte eines Kontos (Browser-Kennung, Anmeldung, letzte Verlängerung), ohne IP-Adresse.
create function public.admin_user_devices(p_user_id uuid)
returns table (session_id uuid, user_agent text, signed_in_at timestamptz, last_used_at timestamptz, allowed boolean)
language sql stable security definer set search_path = ''
as $$
  select s.id, s.user_agent, s.created_at, coalesce(s.refreshed_at::timestamptz, s.updated_at, s.created_at),
    (select p.is_admin from public.profiles p where p.id = p_user_id)
      or row_number() over (order by s.created_at desc) <= public.device_limit()
  from auth.sessions s
  where s.user_id = p_user_id and public.is_active_admin()
  order by s.created_at desc
$$;

-- Alle Geräte eines Kontos abmelden.
create function public.admin_sign_out_all(p_user_id uuid) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  removed integer;
begin
  if not public.is_active_admin() then raise exception 'Keine Admin-Berechtigung.'; end if;
  delete from auth.sessions where user_id = p_user_id;
  get diagnostics removed = row_count;
  return removed;
end
$$;

revoke execute on function public.heartbeat() from public, anon;
revoke execute on function public.admin_activity() from public, anon;
revoke execute on function public.admin_user_devices(uuid) from public, anon;
revoke execute on function public.admin_sign_out_all(uuid) from public, anon;
grant execute on function public.heartbeat() to authenticated;
grant execute on function public.admin_activity() to authenticated;
grant execute on function public.admin_user_devices(uuid) to authenticated;
grant execute on function public.admin_sign_out_all(uuid) to authenticated;
