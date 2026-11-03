-- Abiturarchiv (Nutzerentscheidung vom 04.11.2026).
-- Die Original-PDFs liegen in einem privaten Speicherbereich. Lesen dürfen nur gültige
-- Konten mit dem Recht „Abiturarchiv“; Hochladen, Ändern und Löschen nur im Supabase-
-- Dashboard (Service-Rolle). Über die Website lässt sich nichts hochladen oder löschen.

insert into storage.buckets (id, name, public)
values ('abitur-archiv', 'abitur-archiv', false)
on conflict (id) do update set public = false;

-- Hat das angemeldete, gültige Konto das Recht „Abiturarchiv“?
create function public.can_view_archive() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and can_view_archive and (valid_until is null or valid_until >= public.today_berlin())
  )
$$;

create policy "Abiturarchiv nur mit Recht lesen" on storage.objects
  for select to authenticated
  using (bucket_id = 'abitur-archiv' and (select public.can_view_archive()));
