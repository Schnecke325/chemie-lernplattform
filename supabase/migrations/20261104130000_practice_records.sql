-- Aufgabenergebnisse im Konto (Paket K2).
-- Gespeichert wird je Aufgabe nur das letzte Ergebnis: richtig/teilweise/falsch, Art der
-- Prüfung und Zeitpunkt. Antworttexte und Handschrift werden nicht gespeichert.

create table public.practice_records (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 200),
  result text not null check (result in ('correct', 'partial', 'incorrect')),
  checked_by text not null check (checked_by in ('auto', 'self')),
  updated_at timestamptz not null,
  primary key (user_id, exercise_id)
);

comment on table public.practice_records is 'Letztes Bearbeitungsergebnis je Konto und Aufgabe.';

-- Bei Bearbeitung auf mehreren Geräten gewinnt das neuere Ergebnis, auch wenn ein älteres später ankommt.
create function public.keep_newer_practice_record() returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end
$$;

create trigger keep_newer_practice_record
  before update on public.practice_records
  for each row execute function public.keep_newer_practice_record();

alter table public.practice_records enable row level security;

-- Eigene Ergebnisse nur mit gültigem Konto; Admins lesen alle (Fortschrittsübersicht).
create policy "Eigene Ergebnisse oder Admin liest" on public.practice_records
  for select to authenticated
  using ((user_id = (select auth.uid()) and (select public.is_active())) or (select public.is_active_admin()));

create policy "Eigene Ergebnisse anlegen" on public.practice_records
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_active()));

create policy "Eigene Ergebnisse ändern" on public.practice_records
  for update to authenticated
  using (user_id = (select auth.uid()) and (select public.is_active()))
  with check (user_id = (select auth.uid()) and (select public.is_active()));

create policy "Eigene Ergebnisse löschen" on public.practice_records
  for delete to authenticated
  using (user_id = (select auth.uid()) and (select public.is_active()));

revoke all on public.practice_records from anon, authenticated;
grant select, insert, update, delete on public.practice_records to authenticated;
