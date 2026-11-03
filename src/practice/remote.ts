import { supabase } from '../account/client'
import { isPracticeRecord, type PracticeRecords } from './storage'

/** Zugriff auf public.practice_records (siehe supabase/migrations); RLS beschränkt auf das eigene Konto. */
interface PracticeRow { exercise_id: string; result: string; checked_by: string; updated_at: string }

/** Eigene Ergebnisse; mit `userId` die eines anderen Kontos (nur für Admins durch RLS erlaubt). */
export async function fetchRemoteRecords(userId?: string): Promise<PracticeRecords> {
  let query = supabase.from('practice_records').select('exercise_id, result, checked_by, updated_at')
  if (userId) query = query.eq('user_id', userId)
  const { data, error } = await query
  if (error) throw error
  const records: PracticeRecords = {}
  for (const row of data as PracticeRow[]) {
    const record = { result: row.result, checkedBy: row.checked_by, updatedAt: new Date(row.updated_at).toISOString() }
    if (isPracticeRecord(record)) records[row.exercise_id] = record
  }
  return records
}

export interface PracticeSummary { userId: string; secure: number; partial: number; missing: number; lastActivity: string | null }

/** Zusammenfassung je Konto für die Admin-Übersicht (Datenbankfunktion admin_practice_summary). */
export async function fetchPracticeSummary(): Promise<PracticeSummary[]> {
  const { data, error } = await supabase.rpc('admin_practice_summary')
  if (error) throw error
  return (data as Array<{ user_id: string; secure: number; partial: number; missing: number; last_activity: string | null }>)
    .map((row) => ({ userId: row.user_id, secure: row.secure, partial: row.partial, missing: row.missing, lastActivity: row.last_activity }))
}

export async function upsertRemoteRecords(userId: string, records: PracticeRecords) {
  const rows = Object.entries(records).map(([id, record]) => ({
    user_id: userId, exercise_id: id, result: record.result, checked_by: record.checkedBy, updated_at: record.updatedAt,
  }))
  if (rows.length === 0) return
  const { error } = await supabase.from('practice_records').upsert(rows, { onConflict: 'user_id,exercise_id' })
  if (error) throw error
}

export async function deleteRemoteRecords(userId: string) {
  const { error } = await supabase.from('practice_records').delete().eq('user_id', userId)
  if (error) throw error
}
