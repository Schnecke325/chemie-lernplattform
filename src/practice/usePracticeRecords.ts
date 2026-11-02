import { useCallback, useState } from 'react'
import { clearPracticeRecords, loadPracticeRecords, savePracticeRecords, type PracticeRecord, type PracticeRecords } from './storage'

/** Gemeinsamer Zugriff auf die lokal gespeicherten Bearbeitungsergebnisse (Übungsbereich und Lernseiten). */
export function usePracticeRecords() {
  const [records, setRecords] = useState<PracticeRecords>(loadPracticeRecords)

  const saveRecord = useCallback((id: string, record: PracticeRecord) => {
    setRecords((current) => {
      const next = { ...current, [id]: record }
      savePracticeRecords(next)
      return next
    })
  }, [])

  const resetRecords = useCallback(() => {
    clearPracticeRecords()
    setRecords({})
  }, [])

  return { records, saveRecord, resetRecords }
}
