import { useEffect, useMemo, useState } from 'react'
import { formatDate } from '../account/profile'
import { getAllExercises, learningCatalog } from '../content'
import type { Exercise } from '../content/types'
import type { PracticeRecords } from '../practice/storage'
import { buildProgress, repeatAfterDays, taskStateLabels, type StateCounts, type TaskState } from '../progress/progress'
import './ProgressOverview.css'

const stateOrder: TaskState[] = ['secure', 'partial', 'missing', 'open']
const reasonLabels = { missing: 'noch nicht gelöst', partial: 'teilweise gelöst', old: `vor über ${repeatAfterDays} Tagen sicher gelöst` }
const shortDate = (iso: string) => formatDate(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' }))

/** Aufgabenbestand einmal laden; Grundlage für Fortschrittsseite, Dashboard und Admin-Ansicht. */
export function useExercises(): Exercise[] | null {
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  useEffect(() => {
    let active = true
    getAllExercises().then((items) => { if (active) setExercises(items) }).catch(() => { if (active) setExercises([]) })
    return () => { active = false }
  }, [])
  return exercises
}

/** Gestapelter Balken; zeigt Anteile nur grafisch, die Zahlen stehen daneben. */
export function StateBar({ counts }: { counts: StateCounts }) {
  const label = stateOrder.map((state) => `${counts[state]} ${taskStateLabels[state]}`).join(', ')
  return <div className="state-bar" role="img" aria-label={label} title={label}>
    {stateOrder.map((state) => counts[state] > 0 && <span key={state} className={`state-${state}`} style={{ flexGrow: counts[state] }}/>)}
  </div>
}

function Legend({ counts }: { counts: StateCounts }) {
  return <ul className="state-legend">
    {stateOrder.map((state) => <li key={state}><span className={`state-dot state-${state}`}/>{counts[state]} {taskStateLabels[state]}</li>)}
  </ul>
}

interface ProgressOverviewProps {
  records: PracticeRecords
  /** Fehlt in der lesenden Admin-Ansicht */
  onPractice?: (exerciseId: string) => void
}

/** Lernstand je Kapitel und Lernseite, AFB-Aufteilung und Wiederholungsliste. */
export function ProgressOverview({ records, onPractice }: ProgressOverviewProps) {
  const exercises = useExercises()
  const [showAll, setShowAll] = useState(false)
  const progress = useMemo(() => exercises && buildProgress(learningCatalog.chapters, exercises, records), [exercises, records])

  if (!progress) return <p className="progress-muted">Lernstand wird berechnet …</p>
  const { overall, byAfb, chapters, repetition } = progress
  const visibleRepetition = showAll ? repetition : repetition.slice(0, 8)

  return <div className="progress-overview">
    <section className="progress-panel progress-summary">
      <div className="section-kicker">GESAMT · {overall.total} AUFGABEN</div>
      <StateBar counts={overall}/>
      <Legend counts={overall}/>
      <div className="progress-afb">
        {([1, 2, 3] as const).map((afb) => <div key={afb} className="progress-afb-row">
          <span className="progress-afb-label">AFB {afb === 1 ? 'I' : afb === 2 ? 'II' : 'III'}</span>
          <StateBar counts={byAfb[afb]}/>
          <span className="progress-count">{byAfb[afb].secure} / {byAfb[afb].total} sicher</span>
        </div>)}
      </div>
      <p className="progress-activity">
        {progress.lastActive ? <>Zuletzt aktiv am {shortDate(progress.lastActive)} · in den letzten 7 Tagen {progress.thisWeek} {progress.thisWeek === 1 ? 'Aufgabe' : 'Aufgaben'} bearbeitet</> : 'Noch keine Aufgabe bearbeitet.'}
      </p>
    </section>

    <section className="progress-panel">
      <div className="section-kicker">ZUM WIEDERHOLEN</div>
      <h2>Wiederholungsliste</h2>
      {repetition.length === 0
        ? <p className="progress-muted">Nichts zu wiederholen: Es gibt keine Aufgaben mit „noch nicht“ oder „teilweise“ und keine sicheren, die länger als {repeatAfterDays} Tage zurückliegen.</p>
        : <>
          <ol className="repetition-list">
            {visibleRepetition.map((item) => <li key={item.exercise.id} className="repetition-item">
              <span className={`state-dot state-${item.state}`}/>
              <div className="repetition-main">
                <strong>{item.exercise.title}</strong>
                <span>{item.lessonTitle} · {reasonLabels[item.reason]} · {shortDate(item.updatedAt)}</span>
              </div>
              {onPractice && <button className="repetition-action" onClick={() => onPractice(item.exercise.id)}>Üben</button>}
            </li>)}
          </ol>
          {repetition.length > 8 && <button className="text-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Weniger anzeigen' : `Alle ${repetition.length} anzeigen`}</button>}
        </>}
    </section>

    <section className="progress-panel">
      <div className="section-kicker">STAND JE THEMA</div>
      <h2>Kapitel und Lernseiten</h2>
      <div className="progress-chapters">
        {chapters.map((chapter) => <details key={chapter.id} className="progress-chapter">
          <summary>
            <span className="progress-chapter-title">{chapter.title}</span>
            <StateBar counts={chapter.counts}/>
            <span className="progress-count">{chapter.counts.secure} / {chapter.counts.total} sicher</span>
          </summary>
          <ul className="progress-lessons">
            {chapter.lessons.map((lesson) => <li key={lesson.id}>
              <span className="progress-lesson-title">{lesson.title}</span>
              <StateBar counts={lesson.counts}/>
              <span className="progress-count">{lesson.counts.secure} / {lesson.counts.total} sicher</span>
            </li>)}
          </ul>
        </details>)}
      </div>
    </section>
  </div>
}
