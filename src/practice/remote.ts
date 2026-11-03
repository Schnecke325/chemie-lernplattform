import { supabase } from '../account/client'
import { isPracticeRecord, type PracticeRecords } from './storage'

/** Zugriff auf public.practice_records (siehe supabase/migrations); RLS beschränkt auf das eigene Konto. */
interface PracticeRow { exercise_id: string; result: string; checked_by: string; updated_at: string }

export async function fetchRemoteRecords(): Promise<PracticeRecords> {
  const { data, error } = await supabase.from('practice_records').select('exercise_id, result, checked_by, updated_at')
  if (error) throw error
  const records: PracticeRecords = {}
  for (const row of data as PracticeRow[]) {
    const record = { result: row.result, checkedBy: row.checked_by, updatedAt: new Date(row.updated_at).toISOString() }
    if (isPracticeRecord(record)) records[row.exercise_id] = record
  }
  return records
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
