import { useState } from 'react'
import { useAdminProfile } from '../account/AccountContext'
import { formatDate } from '../account/profile'
import { decodeStrokes } from '../notes/encoding'
import { useNotes } from '../notes/NotesContext'
import type { SharedNote } from '../notes/remote'
import type { Stroke } from './HandwritingPad'

/** Statische Ansicht gespeicherter Striche (nur lesend), auf den beschriebenen Bereich zugeschnitten. */
export function StrokePreview({ strokes, label }: { strokes: Stroke[]; label: string }) {
  if (strokes.length === 0) return null
  const xs = strokes.flatMap((stroke) => stroke.points.map(([x]) => x))
  const ys = strokes.flatMap((stroke) => stroke.points.map(([, y]) => y))
  const pad = 12
  const x0 = Math.min(...xs) - pad
  const y0 = Math.min(...ys) - pad
  const width = Math.max(...xs) - x0 + pad
  const height = Math.max(...ys) - y0 + pad
  return <svg className="note-preview" viewBox={`${x0} ${y0} ${width} ${height}`} role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }}>
    {strokes.map((stroke, index) => {
      const factor = stroke.points.reduce((sum, [, , f]) => sum + f, 0) / stroke.points.length
      const d = stroke.points.map(([x, y], pointIndex) => `${pointIndex ? 'L' : 'M'}${x} ${y}`).join(' ')
      return <path key={index} d={stroke.points.length === 1 ? `${d} l0.01 0` : d} fill="none" stroke={stroke.color}
        strokeWidth={stroke.width * factor} strokeLinecap="round" strokeLinejoin="round"/>
    })}
  </svg>
}

const shortDate = (iso: string) => formatDate(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' }))

/** Geteilte Notizen anderer zu einer Aufgabe; wird erst beim Aufklappen geladen. */
export function SharedNotes({ exerciseId }: { exerciseId: string }) {
  const { userId, sharedCounts, refreshSharedCounts } = useNotes()
  const admin = useAdminProfile()
  const [notes, setNotes] = useState<SharedNote[] | null>(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const count = sharedCounts.get(exerciseId) ?? 0
  if (!userId || (count === 0 && !notes?.length)) return null

  const load = async () => {
    setError(null)
    try {
      const remote = await import('../notes/remote')
      setNotes(await remote.fetchSharedNotes(exerciseId))
    } catch {
      setError('Die geteilten Notizen konnten nicht geladen werden.')
    }
  }

  const toggle = () => {
    setOpen(!open)
    if (!open) void load()
  }

  const remove = async (note: SharedNote) => {
    if (!window.confirm(`Geteilte Notiz von ${note.displayName} entfernen?`)) return
    try {
      const remote = await import('../notes/remote')
      await remote.deleteSharedNote(note.userId, exerciseId)
      setNotes((current) => current?.filter((item) => item.userId !== note.userId) ?? null)
      refreshSharedCounts()
    } catch {
      setError('Die Notiz konnte nicht entfernt werden.')
    }
  }

  return <section className="shared-notes">
    <button type="button" className="shared-notes-toggle" aria-expanded={open} onClick={toggle}>
      {open ? 'Geteilte Notizen ausblenden' : `Geteilte Notizen anderer (${count})`}
    </button>
    {open && <div className="shared-notes-list">
      {error && <p className="practice-sync-note is-error">{error}</p>}
      {!notes && !error && <p className="practice-sync-note">Notizen werden geladen …</p>}
      {notes?.length === 0 && <p className="practice-sync-note">Zurzeit teilt niemand eine Notiz zu dieser Aufgabe.</p>}
      {notes?.map((note) => {
        const answer = decodeStrokes(note.answerStrokes)
        const scratch = decodeStrokes(note.scratchStrokes)
        return <article key={note.userId} className="shared-note">
          <header><strong>{note.displayName}</strong><span>{shortDate(note.updatedAt)}</span>
            {admin && <button type="button" onClick={() => { void remove(note) }}>Entfernen</button>}
          </header>
          {answer.length > 0 && <StrokePreview strokes={answer} label={`Handschriftliche Antwort von ${note.displayName}`}/>}
          {scratch.length > 0 && <><span className="shared-note-kicker">RECHENWEG</span><StrokePreview strokes={scratch} label={`Rechenweg von ${note.displayName}`}/></>}
          {answer.length === 0 && scratch.length === 0 && <p className="practice-sync-note">Diese Notiz enthält keine Handschrift.</p>}
        </article>
      })}
    </div>}
  </section>
}
