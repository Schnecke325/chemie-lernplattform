import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  accountStorageKey, clearPracticeRecords, deviceStorageKey, loadPendingIds, loadPracticeRecords, mergePracticeRecords,
  reconcile, savePendingIds, savePracticeRecords, type PracticeRecord, type PracticeRecords,
} from './storage'
import './PracticeRecordsContext.css'

interface PracticeValue {
  records: PracticeRecords
  saveRecord: (id: string, record: PracticeRecord) => void
  resetRecords: () => void
  /** Stand aus dem Konto neu laden (z. B. beim Öffnen einer Seite); ohne Konto wirkungslos */
  refresh: () => void
  /** Wo die Ergebnisse dauerhaft liegen */
  storage: 'device' | 'account'
  /** Letzter Abgleich mit dem Konto ist fehlgeschlagen; neue Ergebnisse werden beim nächsten Abgleich nachgetragen. */
  syncProblem: boolean
}

const PracticeContext = createContext<PracticeValue | null>(null)

// Supabase-Zugriff erst bei Bedarf laden
const loadRemote = () => import('./remote')
/** Mindestabstand zwischen zwei Abgleichen, damit Fokuswechsel nicht ständig Anfragen auslösen */
const minSyncInterval = 5000

/**
 * Gemeinsamer Ergebnisbestand für Übungsbereich und Lernseiten. Ohne Konto bleibt er auf
 * diesem Gerät. Mit Konto ist das Konto maßgeblich: Beim Start, beim Öffnen einer Seite und
 * bei der Rückkehr zum Tab wird sein Stand übernommen; noch nicht übertragene lokale
 * Ergebnisse werden dabei nachgetragen, wenn sie neuer sind.
 */
export function PracticeRecordsProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const key = userId ? accountStorageKey(userId) : deviceStorageKey
  const [records, setRecords] = useState<PracticeRecords>(() => loadPracticeRecords(key))
  const recordsRef = useRef(records)
  const lastSyncRef = useRef(0)
  const [syncProblem, setSyncProblem] = useState(false)
  const [deviceCount, setDeviceCount] = useState(() => userId ? Object.keys(loadPracticeRecords(deviceStorageKey)).length : 0)

  const commit = useCallback((next: PracticeRecords) => {
    recordsRef.current = next
    savePracticeRecords(next, key)
    setRecords(next)
  }, [key])

  /** Überträgt Ergebnisse ins Konto; bis zur Bestätigung gelten sie als ausstehend. */
  const push = useCallback((changes: PracticeRecords) => {
    if (!userId || Object.keys(changes).length === 0) return
    const pending = loadPendingIds(userId)
    for (const id of Object.keys(changes)) pending.add(id)
    savePendingIds(userId, pending)
    loadRemote()
      .then((remote) => remote.upsertRemoteRecords(userId, changes))
      .then(() => {
        const stillPending = loadPendingIds(userId)
        // Nur entfernen, wenn das Ergebnis seitdem nicht erneut geändert wurde
        for (const [id, record] of Object.entries(changes)) {
          if (recordsRef.current[id]?.updatedAt === record.updatedAt) stillPending.delete(id)
        }
        savePendingIds(userId, stillPending)
        setSyncProblem(false)
      }, () => setSyncProblem(true))
  }, [userId])

  const sync = useCallback((force = false) => {
    if (!userId) return
    if (!force && Date.now() - lastSyncRef.current < minSyncInterval) return
    lastSyncRef.current = Date.now()
    loadRemote()
      .then((remote) => remote.fetchRemoteRecords())
      .then((remoteRecords) => {
        const { records: next, toPush } = reconcile(recordsRef.current, remoteRecords, loadPendingIds(userId))
        commit(next)
        savePendingIds(userId, new Set(Object.keys(toPush)))
        push(toPush)
        setSyncProblem(false)
      })
      .catch(() => setSyncProblem(true))
  }, [userId, commit, push])

  // Beim Start und bei der Rückkehr zum Tab bzw. Fenster abgleichen.
  useEffect(() => {
    if (!userId) return
    sync(true)
    const onVisible = () => { if (document.visibilityState === 'visible') sync() }
    const onFocus = () => sync()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [userId, sync])

  const saveRecord = useCallback((id: string, record: PracticeRecord) => {
    commit({ ...recordsRef.current, [id]: record })
    push({ [id]: record })
  }, [commit, push])

  const resetRecords = useCallback(() => {
    commit({})
    if (!userId) return
    savePendingIds(userId, new Set())
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

  const refresh = useCallback(() => sync(), [sync])

  const value = useMemo(() => ({ records, saveRecord, resetRecords, refresh, storage: userId ? 'account' as const : 'device' as const, syncProblem }),
    [records, saveRecord, resetRecords, refresh, userId, syncProblem])

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
