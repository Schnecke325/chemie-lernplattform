import { supabase } from '../account/client'

/** Zugriff auf public.notes (siehe supabase/migrations/20261104160000_notes.sql). */
export interface NoteRow {
  exercise_id: string
  answer_strokes: string | null
  scratch_strokes: string | null
  typed_answer: string | null
  shared: boolean
  updated_at: string
}

export interface SharedNote {
  userId: string
  displayName: string
  answerStrokes: string | null
  scratchStrokes: string | null
  updatedAt: string
}

/** Welche eigenen Notizen gibt es? (ohne Inhalte, damit die Liste klein bleibt) */
export async function fetchOwnNoteIndex(): Promise<Map<string, { shared: boolean }>> {
  const { data, error } = await supabase.from('notes').select('exercise_id, shared')
  if (error) throw error
  return new Map((data as Array<{ exercise_id: string; shared: boolean }>).map((row) => [row.exercise_id, { shared: row.shared }]))
}

export async function fetchOwnNote(exerciseId: string): Promise<NoteRow | null> {
  const { data, error } = await supabase.from('notes').select('*').eq('exercise_id', exerciseId).maybeSingle<NoteRow>()
  if (error) throw error
  return data
}

export async function saveOwnNote(userId: string, exerciseId: string, changes: Partial<Omit<NoteRow, 'exercise_id' | 'updated_at'>>) {
  const { error } = await supabase.from('notes')
    .upsert({ user_id: userId, exercise_id: exerciseId, ...changes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,exercise_id' })
  if (error) throw error
}

export async function deleteOwnNote(exerciseId: string) {
  const { error } = await supabase.from('notes').delete().eq('exercise_id', exerciseId)
  if (error) throw error
}

export async function fetchSharedCounts(): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc('shared_note_counts')
  if (error) throw error
  return new Map((data as Array<{ exercise_id: string; note_count: number }>).map((row) => [row.exercise_id, row.note_count]))
}

export async function fetchSharedNotes(exerciseId: string): Promise<SharedNote[]> {
  const { data, error } = await supabase.rpc('shared_notes', { p_exercise_id: exerciseId })
  if (error) throw error
  return (data as Array<{ user_id: string; display_name: string; answer_strokes: string | null; scratch_strokes: string | null; updated_at: string }>)
    .map((row) => ({ userId: row.user_id, displayName: row.display_name, answerStrokes: row.answer_strokes, scratchStrokes: row.scratch_strokes, updatedAt: row.updated_at }))
}

export async function deleteSharedNote(userId: string, exerciseId: string) {
  const { error } = await supabase.rpc('delete_shared_note', { p_user_id: userId, p_exercise_id: exerciseId })
  if (error) throw error
}
