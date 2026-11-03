import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Stroke } from '../components/HandwritingPad'
import { decodeStrokes, encodedSize, encodeStrokes, maxEncodedBytes } from './encoding'

// Supabase-Zugriff erst bei Bedarf laden
const loadRemote = () => import('./remote')

interface NotesValue {
  userId: string | null
  /** Eigene Notizen (Aufgabe → geteilt?); null solange unbekannt */
  ownIndex: Map<string, { shared: boolean }> | null
  setOwnEntry: (exerciseId: string, entry: { shared: boolean } | null) => void
  /** Anzahl geteilter Notizen anderer je Aufgabe */
  sharedCounts: Map<string, number>
  refreshSharedCounts: () => void
}

const NotesContext = createContext<NotesValue | null>(null)

/** Gemeinsamer Stand der Notizen; ohne Konto (userId null) ist Speichern ausgeschaltet. */
export function NotesProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const [ownIndex, setOwnIndex] = useState<Map<string, { shared: boolean }> | null>(null)
  const [sharedCounts, setSharedCounts] = useState<Map<string, number>>(new Map())

  const refreshSharedCounts = useCallback(() => {
    if (!userId) return
    loadRemote().then((remote) => remote.fetchSharedCounts()).then(setSharedCounts).catch(() => undefined)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    loadRemote().then((remote) => remote.fetchOwnNoteIndex()).then(setOwnIndex).catch(() => setOwnIndex(new Map()))
    refreshSharedCounts()
  }, [userId, refreshSharedCounts])

  const setOwnEntry = useCallback((exerciseId: string, entry: { shared: boolean } | null) => {
    setOwnIndex((current) => {
      const next = new Map(current ?? [])
      if (entry) next.set(exerciseId, entry)
      else next.delete(exerciseId)
      return next
    })
  }, [])

  const value = useMemo(() => ({ userId, ownIndex, setOwnEntry, sharedCounts, refreshSharedCounts }),
    [userId, ownIndex, setOwnEntry, sharedCounts, refreshSharedCounts])
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotes(): NotesValue {
  const value = useContext(NotesContext)
  if (!value) throw new Error('useNotes außerhalb von NotesProvider')
  return value
}

export interface NoteContent { answer: Stroke[]; scratch: Stroke[]; typed: string; shared: boolean }
export type NoteSaveState = 'idle' | 'saving' | 'saved' | 'error' | 'too-large'

const emptyNote: NoteContent = { answer: [], scratch: [], typed: '', shared: false }
const saveDelay = 1500

/**
 * Eigene Notiz zu einer Aufgabe: lädt sie, speichert Änderungen verzögert und beim Schließen.
 * status 'off' bedeutet ohne Konto; dann bleibt alles nur im Speicher der Seite.
 */
export function useExerciseNote(exerciseId: string) {
  const { userId, ownIndex, setOwnEntry } = useNotes()
  const [status, setStatus] = useState<'off' | 'loading' | 'ready' | 'error'>(userId ? 'loading' : 'off')
  const [content, setContent] = useState<NoteContent>(emptyNote)
  const [loadKey, setLoadKey] = useState(0)
  const [saveState, setSaveState] = useState<NoteSaveState>('idle')
  const contentRef = useRef<NoteContent>(emptyNote)
  const timerRef = useRef<number | null>(null)
  const dirtyRef = useRef(false)
  const existsRef = useRef(false)
  const loadedRef = useRef(false)

  // Laden, sobald bekannt ist, ob es eine eigene Notiz gibt
  useEffect(() => {
    if (!userId || !ownIndex || loadedRef.current) return
    loadedRef.current = true
    if (!ownIndex.has(exerciseId)) { setStatus('ready'); return }
    existsRef.current = true
    loadRemote().then((remote) => remote.fetchOwnNote(exerciseId)).then((row) => {
      const loaded = row
        ? { answer: decodeStrokes(row.answer_strokes), scratch: decodeStrokes(row.scratch_strokes), typed: row.typed_answer ?? '', shared: row.shared }
        : emptyNote
      contentRef.current = loaded
      setContent(loaded)
      setLoadKey((key) => key + 1)
      setStatus('ready')
    }).catch(() => setStatus('error'))
  }, [userId, ownIndex, exerciseId])

  const flush = useCallback(async () => {
    if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null }
    if (!userId || !dirtyRef.current) return
    dirtyRef.current = false
    const current = contentRef.current
    const answer = encodeStrokes(current.answer)
    const scratch = encodeStrokes(current.scratch)
    const typed = current.typed.trim() ? current.typed : null
    if (encodedSize(answer) + encodedSize(scratch) > maxEncodedBytes) { setSaveState('too-large'); return }
    setSaveState('saving')
    try {
      const remote = await loadRemote()
      // Ohne Inhalt gibt es keine Notiz; „Geteilt“ wirkt erst, sobald etwas geschrieben ist.
      if (!answer && !scratch && !typed) {
        if (existsRef.current) await remote.deleteOwnNote(exerciseId)
        existsRef.current = false
        setOwnEntry(exerciseId, null)
      } else {
        await remote.saveOwnNote(userId, exerciseId, { answer_strokes: answer, scratch_strokes: scratch, typed_answer: typed, shared: current.shared })
        existsRef.current = true
        setOwnEntry(exerciseId, { shared: current.shared })
      }
      setSaveState('saved')
    } catch {
      dirtyRef.current = true
      setSaveState('error')
    }
  }, [userId, exerciseId, setOwnEntry])

  const flushRef = useRef(flush)
  flushRef.current = flush
  // Beim Schließen der Aufgabe nicht gespeicherte Änderungen sofort übertragen
  useEffect(() => () => { void flushRef.current() }, [])

  const update = useCallback((changes: Partial<NoteContent>) => {
    contentRef.current = { ...contentRef.current, ...changes }
    setContent(contentRef.current)
    if (!userId) return
    dirtyRef.current = true
    setSaveState('saving')
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    // Umschalten zwischen privat und geteilt sofort speichern, Schreiben verzögert
    if ('shared' in changes) void flush()
    else timerRef.current = window.setTimeout(() => { void flush() }, saveDelay)
  }, [userId, flush])

  return { status, content, loadKey, saveState, update }
}
