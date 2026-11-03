-- Notizen zu Aufgaben (Nutzerentscheidung vom 04.11.2026).
-- Je Konto und Aufgabe eine Notiz: handschriftliche Antwort, handschriftlicher Rechenweg
-- und getippte Antwort. Private Notizen kann nur die eigene Person lesen, auch Admins nicht.
-- Geteilte Notizen sehen alle gültigen Konten mit dem Namen der Verfasserin bzw. des
-- Verfassers, aber nur die Handschrift: Die getippte Antwort bleibt immer privat.

create table public.notes (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 200),
  -- Striche im kompakten Format aus src/notes/encoding.ts
  answer_strokes text,
  scratch_strokes text,
  typed_answer text check (char_length(typed_answer) <= 10000),
  shared boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id),
  constraint notes_size check (coalesce(octet_length(answer_strokes), 0) + coalesce(octet_length(scratch_strokes), 0) <= 2000000)
);

comment on table public.notes is 'Eigene Notiz je Aufgabe; geteilte Handschrift ist über shared_notes() für alle Konten lesbar.';

alter table public.notes enable row level security;

-- Direkt nur die eigenen Notizen; fremde geteilte Notizen nur über die Funktionen unten.
create policy "Eigene Notizen lesen" on public.notes
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.is_active()));

create policy "Eigene Notizen anlegen" on public.notes
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_active()));

create policy "Eigene Notizen ändern" on public.notes
  for update to authenticated
  using (user_id = (select auth.uid()) and (select public.is_active()))
  with check (user_id = (select auth.uid()) and (select public.is_active()));

create policy "Eigene Notizen löschen" on public.notes
  for delete to authenticated
  using (user_id = (select auth.uid()) and (select public.is_active()));

revoke all on public.notes from anon, authenticated;
grant select, insert, update, delete on public.notes to authenticated;

-- Anzahl geteilter Notizen anderer je Aufgabe (für die Anzeige „Geteilte Notizen (n)“).
create function public.shared_note_counts()
returns table (exercise_id text, note_count integer)
language sql stable security definer set search_path = ''
as $$
  select n.exercise_id, count(*)::integer
  from public.notes n
  where n.shared and n.user_id <> auth.uid() and public.is_active()
    and (n.answer_strokes is not null or n.scratch_strokes is not null)
  group by n.exercise_id
$$;

-- Geteilte Notizen anderer zu einer Aufgabe, ohne getippte Antwort.
create function public.shared_notes(p_exercise_id text)
returns table (user_id uuid, display_name text, answer_strokes text, scratch_strokes text, updated_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select n.user_id, p.display_name, n.answer_strokes, n.scratch_strokes, n.updated_at
  from public.notes n
  join public.profiles p on p.id = n.user_id
  where n.exercise_id = p_exercise_id and n.shared and n.user_id <> auth.uid() and public.is_active()
    and (n.answer_strokes is not null or n.scratch_strokes is not null)
  order by n.updated_at desc
$$;

-- Admins dürfen geteilte Notizen entfernen (z. B. bei unpassendem Inhalt), private nie.
create function public.delete_shared_note(p_user_id uuid, p_exercise_id text)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  removed integer;
begin
  if not public.is_active_admin() then
    raise exception 'Keine Admin-Berechtigung.';
  end if;
  delete from public.notes where user_id = p_user_id and exercise_id = p_exercise_id and shared;
  get diagnostics removed = row_count;
  return removed > 0;
end
$$;

revoke execute on function public.shared_note_counts() from public, anon;
revoke execute on function public.shared_notes(text) from public, anon;
revoke execute on function public.delete_shared_note(uuid, text) from public, anon;
grant execute on function public.shared_note_counts() to authenticated;
grant execute on function public.shared_notes(text) to authenticated;
grant execute on function public.delete_shared_note(uuid, text) to authenticated;
