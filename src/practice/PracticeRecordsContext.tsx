import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  accountStorageKey, clearPracticeRecords, deviceStorageKey, loadPracticeRecords, mergePracticeRecords, newerThan,
  savePracticeRecords, type PracticeRecord, type PracticeRecords,
} from './storage'
import './PracticeRecordsContext.css'

interface PracticeValue {
  records: PracticeRecords
  saveRecord: (id: string, record: PracticeRecord) => void
  resetRecords: () => void
  /** Wo die Ergebnisse dauerhaft liegen */
  storage: 'device' | 'account'
  /** Letzter Abgleich mit dem Konto ist fehlgeschlagen; neuere lokale Ergebnisse werden beim nächsten Laden nachgetragen. */
  syncProblem: boolean
}

const PracticeContext = createContext<PracticeValue | null>(null)

// Supabase-Zugriff erst bei Bedarf laden
const loadRemote = () => import('./remote')

/**
 * Gemeinsamer Ergebnisbestand für Übungsbereich und Lernseiten. Ohne Konto bleibt er auf
 * diesem Gerät; mit Konto wird er mit dem Konto abgeglichen (neueres Ergebnis gewinnt).
 */
export function PracticeRecordsProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const key = userId ? accountStorageKey(userId) : deviceStorageKey
  const [records, setRecords] = useState<PracticeRecords>(() => loadPracticeRecords(key))
  const recordsRef = useRef(records)
  const [syncProblem, setSyncProblem] = useState(false)
  const [deviceCount, setDeviceCount] = useState(() => userId ? Object.keys(loadPracticeRecords(deviceStorageKey)).length : 0)

  const commit = useCallback((next: PracticeRecords) => {
    recordsRef.current = next
    savePracticeRecords(next, key)
    setRecords(next)
  }, [key])

  const push = useCallback((changes: PracticeRecords) => {
    if (!userId || Object.keys(changes).length === 0) return
    loadRemote()
      .then((remote) => remote.upsertRemoteRecords(userId, changes))
      .then(() => setSyncProblem(false), () => setSyncProblem(true))
  }, [userId])

  // Beim Start mit dem Konto abgleichen: fehlende oder neuere Ergebnisse in beide Richtungen übernehmen.
  useEffect(() => {
    if (!userId) return
    let active = true
    loadRemote()
      .then((remote) => remote.fetchRemoteRecords())
      .then((remoteRecords) => {
        if (!active) return
        const local = recordsRef.current
        commit(mergePracticeRecords(local, remoteRecords))
        push(newerThan(local, remoteRecords))
        setSyncProblem(false)
      })
      .catch(() => { if (active) setSyncProblem(true) })
    return () => { active = false }
  }, [userId, commit, push])

  const saveRecord = useCallback((id: string, record: PracticeRecord) => {
    commit({ ...recordsRef.current, [id]: record })
    push({ [id]: record })
  }, [commit, push])

  const resetRecords = useCallback(() => {
    commit({})
    if (!userId) return
    loadRemote()
      .then((remote) => remote.deleteRemoteRecords(userId))
      .then(() => setSyncProblem(false), () => setSyncProblem(true))
  }, [commit, userId])

  const importDeviceRecords = () => {
    const device = loadPracticeRecords(deviceStorageKey)
    commit(mergePracticeRecords(recordsRef.current, device))
    push(device)
    clearPracticeRecords(deviceStorageKey)
    setDeviceCount(0)
  }

  const discardDeviceRecords = () => {
    clearPracticeRecords(deviceStorageKey)
    setDeviceCount(0)
  }

  const value = useMemo(() => ({ records, saveRecord, resetRecords, storage: userId ? 'account' as const : 'device' as const, syncProblem }),
    [records, saveRecord, resetRecords, userId, syncProblem])

  return <PracticeContext.Provider value={value}>
    {children}
    {deviceCount > 0 && <aside className="import-prompt" role="dialog" aria-labelledby="import-title">
      <strong id="import-title">Ergebnisse von diesem Gerät übernehmen?</strong>
      <p>Auf diesem Gerät {deviceCount === 1 ? 'ist 1 Aufgabenergebnis' : `sind ${deviceCount} Aufgabenergebnisse`} ohne Konto gespeichert. Du kannst {deviceCount === 1 ? 'es' : 'sie'} in dein Konto übernehmen; bei derselben Aufgabe gilt das neuere Ergebnis.</p>
      <div className="import-actions">
        <button className="primary-button" onClick={importDeviceRecords}>Übernehmen</button>
        <button className="account-secondary" onClick={discardDeviceRecords}>Verwerfen</button>
        <button className="text-link" onClick={() => setDeviceCount(0)}>Später</button>
      </div>
    </aside>}
  </PracticeContext.Provider>
}

export function usePracticeRecords(): PracticeValue {
  const value = useContext(PracticeContext)
  if (!value) throw new Error('usePracticeRecords außerhalb von PracticeRecordsProvider')
  return value
}
