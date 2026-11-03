-- Lernstand-Übersicht für Admins (Paket K3).
-- Zählt die letzten Ergebnisse je Konto in der Datenbank, statt alle Einzelzeilen
-- (bei vielen Konten weit über der Zeilengrenze einer Anfrage) an den Browser zu schicken.

create function public.admin_practice_summary()
returns table (user_id uuid, secure integer, partial integer, missing integer, last_activity timestamptz)
language sql stable security definer set search_path = ''
as $$
  select
    p.id,
    (count(r.exercise_id) filter (where r.result = 'correct'))::integer,
    (count(r.exercise_id) filter (where r.result = 'partial'))::integer,
    (count(r.exercise_id) filter (where r.result = 'incorrect'))::integer,
    max(r.updated_at)
  from public.profiles p
  left join public.practice_records r on r.user_id = p.id
  -- Nur gültige Admins erhalten Zeilen; alle anderen eine leere Liste.
  where public.is_active_admin()
  group by p.id
$$;

revoke execute on function public.admin_practice_summary() from public, anon;
grant execute on function public.admin_practice_summary() to authenticated;
