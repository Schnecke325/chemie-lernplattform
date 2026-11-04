-- Aktivitätsübersicht: zusätzlich der Zeitpunkt der letzten Anmeldung.
-- Die letzte Aktivität (last_seen_at) wird erst seit dem Geräte-Limit erfasst; bis ein Konto die
-- Seite wieder öffnet, zeigt die Benutzerverwaltung ersatzweise die letzte Anmeldung.

drop function public.admin_activity();

create function public.admin_activity()
returns table (user_id uuid, last_seen_at timestamptz, last_sign_in_at timestamptz, ever_signed_in boolean, devices integer, logins_7d integer)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.last_seen_at, u.last_sign_in_at, u.last_sign_in_at is not null,
    (select least(count(*), case when p.is_admin then count(*) else public.device_limit() end)::integer
       from auth.sessions s where s.user_id = p.id),
    (select count(*)::integer from public.session_log l where l.user_id = p.id and l.first_seen > now() - interval '7 days')
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_active_admin()
$$;

revoke execute on function public.admin_activity() from public, anon;
grant execute on function public.admin_activity() to authenticated;
