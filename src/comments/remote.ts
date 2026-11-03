import { supabase } from '../account/client'

/** Zugriff auf die Diskussion zu Aufgaben, nur über Datenbankfunktionen (supabase/migrations/20261104170000_comments.sql). */
export type CommentState = 'visible' | 'deleted' | 'removed' | 'account-deleted'

export interface Comment {
  id: string
  parentId: string | null
  /** null bei Platzhaltern */
  author: string | null
  isOwn: boolean
  body: string | null
  state: CommentState
  createdAt: string
  editedAt: string | null
}

interface CommentRow { id: string; parent_id: string | null; author: string | null; is_own: boolean; body: string | null; state: CommentState; created_at: string; edited_at: string | null }

export async function fetchCommentCounts(): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc('comment_counts')
  if (error) throw error
  return new Map((data as Array<{ exercise_id: string; comment_count: number }>).map((row) => [row.exercise_id, row.comment_count]))
}

export async function fetchComments(exerciseId: string): Promise<Comment[]> {
  const { data, error } = await supabase.rpc('exercise_comments', { p_exercise_id: exerciseId })
  if (error) throw error
  return (data as CommentRow[]).map((row) => ({
    id: row.id, parentId: row.parent_id, author: row.author, isOwn: row.is_own, body: row.body,
    state: row.state, createdAt: row.created_at, editedAt: row.edited_at,
  }))
}

export async function addComment(exerciseId: string, parentId: string | null, body: string) {
  const { error } = await supabase.rpc('add_comment', { p_exercise_id: exerciseId, p_parent_id: parentId, p_body: body })
  if (error) throw error
}

export async function editComment(id: string, body: string) {
  const { error } = await supabase.rpc('edit_comment', { p_id: id, p_body: body })
  if (error) throw error
}

export async function deleteComment(id: string) {
  const { error } = await supabase.rpc('delete_comment', { p_id: id })
  if (error) throw error
}
