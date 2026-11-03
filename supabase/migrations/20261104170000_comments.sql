-- Diskussion zu Aufgaben (Nutzerentscheidung vom 04.11.2026).
-- Beiträge mit einer Antwortebene, sichtbar für alle gültigen Konten mit Namen. Eigene
-- Beiträge lassen sich bearbeiten und löschen; Admins können jeden Beitrag entfernen.
-- Hat ein gelöschter Beitrag Antworten, bleibt ein Platzhalter ohne Text stehen.
-- Der Zugriff läuft ausschließlich über die Funktionen unten; die Tabelle selbst ist gesperrt.

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  exercise_id text not null check (char_length(exercise_id) between 1 and 200),
  parent_id uuid references public.comments (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  body text check (body is null or char_length(btrim(body)) between 1 and 2000),
  -- visible, deleted (von der Person selbst), removed (von einem Admin), account-deleted
  state text not null default 'visible' check (state in ('visible', 'deleted', 'removed', 'account-deleted')),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  check ((state = 'visible') = (body is not null))
);

create index comments_exercise_idx on public.comments (exercise_id, created_at);
create index comments_parent_idx on public.comments (parent_id);

alter table public.comments enable row level security;
revoke all on public.comments from anon, authenticated;

-- Entfernt Platzhalter, unter denen keine Antworten mehr stehen.
create function public.prune_comment_placeholders(p_exercise_id text) returns void
language sql security definer set search_path = ''
as $$
  delete from public.comments c
  where c.exercise_id = p_exercise_id and c.state <> 'visible' and c.parent_id is null
    and not exists (select 1 from public.comments r where r.parent_id = c.id)
$$;

-- Beim Löschen eines Kontos: Beiträge ohne Antworten entfernen, sonst Platzhalter ohne Text.
create function public.anonymize_comments_of_profile() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  affected text;
begin
  for affected in select distinct exercise_id from public.comments where user_id = old.id loop
    delete from public.comments c
    where c.user_id = old.id and not exists (select 1 from public.comments r where r.parent_id = c.id);
    update public.comments set body = null, state = 'account-deleted', user_id = null, edited_at = null
    where user_id = old.id;
    perform public.prune_comment_placeholders(affected);
  end loop;
  return old;
end
$$;

create trigger anonymize_comments_of_profile
  before delete on public.profiles
  for each row execute function public.anonymize_comments_of_profile();

-- Beiträge zu einer Aufgabe mit Namen; Text nur bei sichtbaren Beiträgen.
create function public.exercise_comments(p_exercise_id text)
returns table (id uuid, parent_id uuid, author text, is_own boolean, body text, state text, created_at timestamptz, edited_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.parent_id,
    case when c.state = 'visible' then p.display_name end,
    c.user_id = auth.uid(), c.body, c.state, c.created_at, c.edited_at
  from public.comments c
  left join public.profiles p on p.id = c.user_id
  where c.exercise_id = p_exercise_id and public.is_active()
  order by c.created_at
$$;

-- Anzahl sichtbarer Beiträge je Aufgabe.
create function public.comment_counts()
returns table (exercise_id text, comment_count integer)
language sql stable security definer set search_path = ''
as $$
  select c.exercise_id, count(*)::integer from public.comments c
  where c.state = 'visible' and public.is_active()
  group by c.exercise_id
$$;

create function public.add_comment(p_exercise_id text, p_parent_id uuid, p_body text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  new_id uuid;
  parent public.comments;
begin
  if not public.is_active() then raise exception 'Nicht angemeldet.'; end if;
  if p_parent_id is not null then
    select * into parent from public.comments where id = p_parent_id;
    if parent.id is null or parent.exercise_id <> p_exercise_id then raise exception 'Beitrag nicht gefunden.'; end if;
    -- Nur eine Antwortebene
    if parent.parent_id is not null then raise exception 'Auf Antworten kann nicht geantwortet werden.'; end if;
  end if;
  insert into public.comments (exercise_id, parent_id, user_id, body)
  values (p_exercise_id, p_parent_id, auth.uid(), btrim(p_body))
  returning id into new_id;
  return new_id;
end
$$;

create function public.edit_comment(p_id uuid, p_body text) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_active() then raise exception 'Nicht angemeldet.'; end if;
  update public.comments set body = btrim(p_body), edited_at = now()
  where id = p_id and user_id = auth.uid() and state = 'visible';
  if not found then raise exception 'Nur eigene Beiträge können bearbeitet werden.'; end if;
end
$$;

-- Eigene Beiträge löschen; Admins dürfen jeden Beitrag entfernen.
create function public.delete_comment(p_id uuid) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  target public.comments;
  by_admin boolean;
begin
  if not public.is_active() then raise exception 'Nicht angemeldet.'; end if;
  select * into target from public.comments where id = p_id;
  if target.id is null or target.state <> 'visible' then raise exception 'Beitrag nicht gefunden.'; end if;
  by_admin := target.user_id is distinct from auth.uid();
  if by_admin and not public.is_active_admin() then raise exception 'Nur eigene Beiträge können gelöscht werden.'; end if;
  if exists (select 1 from public.comments r where r.parent_id = target.id) then
    update public.comments set body = null, state = case when by_admin then 'removed' else 'deleted' end, edited_at = null
    where id = target.id;
  else
    delete from public.comments where id = target.id;
  end if;
  perform public.prune_comment_placeholders(target.exercise_id);
end
$$;

revoke execute on function public.prune_comment_placeholders(text) from public, anon, authenticated;
revoke execute on function public.exercise_comments(text) from public, anon;
revoke execute on function public.comment_counts() from public, anon;
revoke execute on function public.add_comment(text, uuid, text) from public, anon;
revoke execute on function public.edit_comment(uuid, text) from public, anon;
revoke execute on function public.delete_comment(uuid) from public, anon;
grant execute on function public.exercise_comments(text) to authenticated;
grant execute on function public.comment_counts() to authenticated;
grant execute on function public.add_comment(text, uuid, text) to authenticated;
grant execute on function public.edit_comment(uuid, text) to authenticated;
grant execute on function public.delete_comment(uuid) to authenticated;
