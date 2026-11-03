import { useEffect, useState } from 'react'
import { formatDate, type Profile } from '../account/profile'
import { ProgressOverview, StateBar, useExercises } from '../components/ProgressOverview'
import { fetchPracticeSummary, fetchRemoteRecords, type PracticeSummary } from '../practice/remote'
import type { PracticeRecords } from '../practice/storage'

const shortDate = (iso: string) => formatDate(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' }))

/** Lernstand aller Konten für Admins: Liste mit Zusammenfassung, Klick öffnet die Detailansicht. */
export function AdminProgress({ users }: { users: Profile[] }) {
  const exercises = useExercises()
  const [summary, setSummary] = useState<Map<string, PracticeSummary> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Profile | null>(null)
  const [records, setRecords] = useState<PracticeRecords | null>(null)

  useEffect(() => {
    fetchPracticeSummary()
      .then((rows) => setSummary(new Map(rows.map((row) => [row.userId, row]))))
      .catch(() => setError('Der Lernstand konnte nicht geladen werden. Ist die SQL-Datei für K3 im Supabase-Projekt ausgeführt?'))
  }, [])

  useEffect(() => {
    if (!selected) return
    let active = true
    setRecords(null)
    fetchRemoteRecords(selected.id)
      .then((result) => { if (active) setRecords(result) })
      .catch(() => { if (active) setError('Die Ergebnisse dieses Kontos konnten nicht geladen werden.') })
    return () => { active = false }
  }, [selected])

  if (selected) return <section className="admin-progress-detail">
    <button className="text-link" onClick={() => setSelected(null)}>← Zurück zur Übersicht</button>
    <h2>Lernstand von {selected.display_name} <span className="admin-muted">({selected.username})</span></h2>
    {error && <p className="account-message is-error" role="alert">{error}</p>}
    {records ? <ProgressOverview records={records}/> : !error && <p className="admin-muted">Ergebnisse werden geladen …</p>}
  </section>

  const total = exercises?.length ?? 0
  return <section className="admin-list" aria-label="Lernstand">
    {error && <p className="account-message is-error" role="alert">{error}</p>}
    {!summary && !error && <p className="admin-muted">Lernstand wird geladen …</p>}
    {summary && users.map((user) => {
      const row = summary.get(user.id) ?? { secure: 0, partial: 0, missing: 0, lastActivity: null }
      const done = row.secure + row.partial + row.missing
      const counts = { secure: row.secure, partial: row.partial, missing: row.missing, open: Math.max(0, total - done), total: Math.max(total, done) }
      return <button key={user.id} className="admin-user admin-progress-row" onClick={() => { setError(null); setSelected(user) }}>
        <div className="admin-user-name"><strong>{user.display_name}</strong><span>{user.username}</span></div>
        <StateBar counts={counts}/>
        <div className="admin-progress-counts">
          <span>{done} / {total} bearbeitet</span>
          <span>{row.secure} sicher · {row.partial} teilweise · {row.missing} noch nicht</span>
        </div>
        <div className="admin-validity">{row.lastActivity ? `aktiv ${shortDate(row.lastActivity)}` : 'noch nicht aktiv'}</div>
      </button>
    })}
  </section>
}
