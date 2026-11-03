import { useEffect, useMemo, useState } from 'react'
import { accountsEnabled, useAdminProfile, useCanViewArchive } from '../account/AccountContext'
import { learningCatalog } from '../content'
import archiveData from '../content/exam-archive.json'
import type { ExerciseFocus } from '../types/navigation'
import './ArchivePage.css'

/** Eintrag aus src/content/exam-archive.json (erzeugt von scripts/build-exam-archive.mjs). */
interface ArchiveExam {
  id: string
  year: number
  term: 'HT' | 'NT'
  proposal: string
  file: string
  pages: string
  focus: string
  further: string
  fields: string[]
  /** Kapitel aus Lernseiten-Belegen und Hauptfokus-Feldern */
  chapterIds: string[]
  /** Lernseiten, die diese Prüfung als Beleg nennen */
  lessonIds: string[]
  practice: Array<{ chapterId: string; lessonId?: string }>
  practiceMatch: 'lesson' | 'chapter' | 'none'
}
interface ArchiveNote { label: string; observation: string; assessment: string }

const exams = archiveData.exams as ArchiveExam[]
const notes = archiveData.notes as ArchiveNote[]
const years = [...new Set(exams.map((exam) => exam.year))]
const fields = [...new Set(exams.flatMap((exam) => exam.fields))].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }))
const chapterTitles = new Map(learningCatalog.chapters.map((chapter) => [chapter.id, chapter.title]))
// Nur Kapitel und Lernseiten anbieten, zu denen es Prüfungen gibt, in Katalogreihenfolge
const topicChapters = [...learningCatalog.chapters].sort((a, b) => a.order - b.order)
  .filter((chapter) => exams.some((exam) => exam.chapterIds.includes(chapter.id)))
const lessonTitles = new Map(learningCatalog.chapters.flatMap((chapter) => chapter.children.filter((child) => child.lessonId).map((child) => [child.lessonId!, child.title])))

/** Abiturarchiv: jede Prüfung einzeln, Original-PDF nur mit dem Recht „Abiturarchiv“. */
export default function ArchivePage({ onPractice }: { onPractice: (focus: ExerciseFocus) => void }) {
  const canView = useCanViewArchive()
  if (!canView) return <div className="archive-page">
    <div className="eyebrow"><span className="eyebrow-line"/> ABITURARCHIV</div>
    <section className="archive-panel"><h1>Abiturarchiv</h1><p className="archive-muted">Für diesen Bereich fehlt deinem Konto die Berechtigung.</p></section>
  </div>
  return <ArchiveList onPractice={onPractice}/>
}

function ArchiveList({ onPractice }: { onPractice: (focus: ExerciseFocus) => void }) {
  const admin = useAdminProfile()
  const [year, setYear] = useState('')
  const [term, setTerm] = useState('')
  const [field, setField] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [opening, setOpening] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<Set<string> | null>(null)

  // Upload-Kontrolle für Admins: Welche PDFs fehlen noch im Speicher?
  useEffect(() => {
    if (!admin) return
    import('../practice/remote').then((remote) => remote.listArchiveFiles()).then(setUploaded).catch(() => setUploaded(null))
  }, [admin])

  const subtopics = useMemo(() => [...(topicChapters.find((chapter) => chapter.id === chapterId)?.children ?? [])]
    .sort((a, b) => a.order - b.order)
    .filter((child) => child.lessonId && exams.some((exam) => exam.lessonIds.includes(child.lessonId!))), [chapterId])
  const filtered = useMemo(() => exams.filter((exam) => (!year || exam.year === Number(year))
    && (!term || exam.term === term) && (!field || exam.fields.includes(field))
    && (!chapterId || exam.chapterIds.includes(chapterId)) && (!lessonId || exam.lessonIds.includes(lessonId))), [year, term, field, chapterId, lessonId])
  const missing = uploaded ? exams.filter((exam) => !uploaded.has(exam.file)) : []

  const openPdf = async (exam: ArchiveExam) => {
    setError(null)
    setOpening(exam.id)
    // Fenster sofort öffnen, sonst blockieren Browser das Pop-up nach dem Warten auf den Link
    const target = window.open('', '_blank')
    try {
      const { signedArchiveUrl } = await import('../practice/remote')
      const url = await signedArchiveUrl(exam.file)
      if (target) target.location.href = url
      else window.location.href = url
    } catch {
      target?.close()
      setError(`Das PDF zu ${exam.year} ${exam.term} ${exam.proposal} konnte nicht geöffnet werden. Ist es im Archivspeicher hochgeladen?`)
    }
    setOpening(null)
  }

  return <div className="archive-page">
    <div className="eyebrow"><span className="eyebrow-line"/> ABITURARCHIV</div>
    <h1 className="archive-heading">Abiturarchiv</h1>
    <p className="archive-intro">Hessische Chemie-LK-Prüfungen 2007–2025, jede Prüfung einzeln mit Themen aus der eigenen Auswertung. Das zeigt historische Vorkommen, nicht welche Inhalte im aktuellen Abitur verbindlich sind; dafür gelten KCGO und der jeweilige Abiturerlass.</p>

    {admin && uploaded && <p className={`archive-upload ${missing.length ? 'is-incomplete' : ''}`}>
      {missing.length === 0 ? `Alle ${exams.length} PDFs sind im Archivspeicher.` : `${exams.length - missing.length} von ${exams.length} PDFs im Archivspeicher. Es fehlen: ${missing.slice(0, 6).map((exam) => exam.file).join(', ')}${missing.length > 6 ? ` und ${missing.length - 6} weitere` : ''}`}
    </p>}

    <div className="archive-filters">
      <label>Jahr<select value={year} onChange={(event) => setYear(event.target.value)}><option value="">Alle</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label>Termin<select value={term} onChange={(event) => setTerm(event.target.value)}><option value="">HT und NT</option><option value="HT">Haupttermin</option><option value="NT">Nachtermin</option></select></label>
      <label>KCGO-Feld<select value={field} onChange={(event) => setField(event.target.value)}><option value="">Alle</option>{fields.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label>Thema<select value={chapterId} onChange={(event) => { setChapterId(event.target.value); setLessonId('') }}><option value="">Alle Themen</option>{topicChapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>
      <label>Unterthema<select value={lessonId} disabled={!chapterId || subtopics.length === 0} onChange={(event) => setLessonId(event.target.value)}><option value="">{chapterId ? 'Alle Unterthemen' : 'Erst Thema wählen'}</option>{subtopics.map((child) => <option key={child.lessonId} value={child.lessonId}>{child.title}</option>)}</select></label>
      <span className="archive-count">{filtered.length} von {exams.length}</span>
    </div>
    {lessonId && <p className="archive-filter-note">Beim Unterthema erscheinen die Prüfungen, die auf dieser Lernseite als Beleg genannt sind. Weitere Prüfungen zum Thema zeigt der Themenfilter allein.</p>}

    {error && <p className="account-message is-error" role="alert">{error}</p>}

    <div className="archive-list">
      {filtered.map((exam) => <article key={exam.id} className="archive-exam">
        <div className="archive-exam-head">
          <span className="archive-exam-id">{exam.year} · {exam.term} · Vorschlag {exam.proposal}</span>
          <div className="archive-fields">{exam.fields.map((value) => <span key={value}>{value}</span>)}</div>
        </div>
        <h2>{exam.focus.replace(/\s*\([^)]*\)\s*$/, '')}</h2>
        {exam.further && <p className="archive-further">{exam.further}</p>}
        <div className="archive-actions">
          <button className="primary-button" disabled={!accountsEnabled || opening === exam.id} onClick={() => { void openPdf(exam) }}>{opening === exam.id ? 'Wird geöffnet …' : 'PDF öffnen'}</button>
          <span className="archive-pages">Aufgaben {exam.pages}</span>
        </div>
        {exam.practice.length > 0 && <div className="archive-practice">
          <span>{exam.practiceMatch === 'lesson' ? 'Passend üben:' : 'Passendes Kapitel:'}</span>
          {exam.practice.map((target) => <button key={`${target.chapterId}-${target.lessonId ?? ''}`} onClick={() => onPractice(target.lessonId ? { chapterId: target.chapterId, lessonId: target.lessonId } : { chapterId: target.chapterId })}>
            {target.lessonId ? lessonTitles.get(target.lessonId) : chapterTitles.get(target.chapterId)}
          </button>)}
        </div>}
      </article>)}
    </div>

    <section className="archive-panel archive-notes">
      <h2>Nicht vorhandene Termine und Vorschläge</h2>
      <ul>{notes.map((note) => <li key={note.label}><strong>{note.label}:</strong> {note.observation}. {note.assessment}</li>)}</ul>
    </section>
  </div>
}
