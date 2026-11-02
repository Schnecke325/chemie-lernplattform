import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ExercisePractice, resultLabels } from '../components/ExercisePractice'
import { getAllExercises, learningCatalog } from '../content'
import type { Competency, Difficulty, Exercise, ExerciseMode } from '../content/types'
import { clearPracticeRecords, loadPracticeRecords, savePracticeRecords, type PracticeRecord, type PracticeRecords } from '../practice/storage'
import './ExercisesPage.css'

const competencyLabels: Record<Competency, string> = {
  S: 'Sachkompetenz',
  E: 'Erkenntnisgewinnung',
  K: 'Kommunikation',
  B: 'Bewertung',
}

const difficultyLabels: Record<Difficulty, string> = {
  basic: 'Grundlegend',
  standard: 'Standard',
  transfer: 'Transfer',
}

const modeLabels: Record<ExerciseMode, string> = {
  screen: 'Bildschirm',
  handwriting: 'Handschriftlich',
}

const topicByLessonId = new Map(learningCatalog.chapters.flatMap((chapter) => chapter.children
  .filter((child) => child.lessonId)
  .map((child) => [child.lessonId as string, {
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    lessonId: child.lessonId as string,
    lessonTitle: child.title,
  }] as const)))

interface Filters {
  chapterId: string
  lessonId: string
  difficulty: string
  source: string
  competency: string
  afb: string
  mode: string
}

const initialFilters: Filters = {
  chapterId: '',
  lessonId: '',
  difficulty: '',
  source: '',
  competency: '',
  afb: '',
  mode: '',
}

function uniqueValues<T extends string | number>(items: Array<T | undefined>): T[] {
  return [...new Set(items.filter((item): item is T => item !== undefined))]
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  disabled?: boolean
}) {
  return <label className="exercise-filter-field" htmlFor={id}>
    <span>{label}</span>
    <select id={id} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  </label>
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [records, setRecords] = useState<PracticeRecords>(loadPracticeRecords)

  const saveRecord = (id: string, record: PracticeRecord) => {
    setRecords((current) => {
      const next = { ...current, [id]: record }
      savePracticeRecords(next)
      return next
    })
  }

  const resetRecords = () => {
    if (!window.confirm('Alle auf diesem Gerät gespeicherten Bearbeitungsergebnisse löschen?')) return
    clearPracticeRecords()
    setRecords({})
  }

  useEffect(() => {
    let active = true
    getAllExercises().then((items) => {
      if (active) setExercises(items)
    }).catch(() => {
      if (active) setLoadError(true)
    }).finally(() => {
      if (active) setIsLoading(false)
    })
    return () => { active = false }
  }, [])

  const chapters = learningCatalog.chapters.filter((chapter) => chapter.children
    .some((child) => child.lessonId && exercises.some((exercise) => exercise.sourceLessonId === child.lessonId)))
  const availableLessons = filters.chapterId
    ? learningCatalog.chapters.find((chapter) => chapter.id === filters.chapterId)?.children
      .filter((child) => child.lessonId && exercises.some((exercise) => exercise.sourceLessonId === child.lessonId)) ?? []
    : []
  const competencyOptions = uniqueValues(exercises.flatMap((exercise) => exercise.competencies))
  const afbOptions = uniqueValues(exercises.map((exercise) => exercise.afb)).sort()
  const modeOptions = uniqueValues(exercises.flatMap((exercise) => exercise.supportedModes ?? []))
  const difficultyOptions = uniqueValues(exercises.map((exercise) => exercise.difficulty))

  const filteredExercises = useMemo(() => exercises.filter((exercise) => {
    const topic = topicByLessonId.get(exercise.sourceLessonId)
    if (filters.chapterId && topic?.chapterId !== filters.chapterId) return false
    if (filters.lessonId && topic?.lessonId !== filters.lessonId) return false
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false
    if (filters.source && exercise.sourceKind !== filters.source) return false
    if (filters.competency && !exercise.competencies.includes(filters.competency as Competency)) return false
    if (filters.afb && exercise.afb !== Number(filters.afb)) return false
    if (filters.mode && !exercise.supportedModes?.includes(filters.mode as ExerciseMode)) return false
    return true
  }), [exercises, filters])

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value, ...(key === 'chapterId' ? { lessonId: '' } : {}) }))
  }

  return <div className="exercise-page">
    <div className="eyebrow"><span className="eyebrow-line"/> WISSEN ANWENDEN</div>
    <header className="exercise-page-heading">
      <div>
        <span className="exercise-kicker">AUFGABENBANK · CHEMIE LK</span>
        <h1>Übungsbereich</h1>
        <p>Finde Aufgaben passend zu deinem Thema und wähle, worauf du dich konzentrieren möchtest.</p>
      </div>
      <div className="exercise-total" aria-label={`${filteredExercises.length} Aufgaben gefunden`}>
        <strong>{isLoading ? '—' : filteredExercises.length}</strong>
        <span>AUFGABEN GEFUNDEN</span>
      </div>
    </header>

    <details className="exercise-filter-panel">
      <summary>
        <span><span className="filter-summary-kicker">AUFGABEN EINGRENZEN</span><strong>Filter und Themenauswahl</strong></span>
        <span className="filter-summary-action">Filter öffnen <span aria-hidden="true">⌄</span></span>
      </summary>
      <div className="exercise-filter-grid">
        <SelectField id="filter-chapter" label="Hauptkapitel" value={filters.chapterId} onChange={(value) => setFilter('chapterId', value)}>
          <option value="">Alle Hauptkapitel</option>
          {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
        </SelectField>
        <SelectField id="filter-lesson" label="Unterkapitel" value={filters.lessonId} disabled={!filters.chapterId}
          onChange={(value) => setFilter('lessonId', value)}>
          <option value="">Alle Unterkapitel</option>
          {availableLessons.map((lesson) => <option key={lesson.id} value={lesson.lessonId}>{lesson.title}</option>)}
        </SelectField>
        <SelectField id="filter-difficulty" label="Schwierigkeit" value={filters.difficulty} onChange={(value) => setFilter('difficulty', value)}>
          <option value="">Alle Schwierigkeitsgrade</option>
          {difficultyOptions.map((difficulty) => <option key={difficulty} value={difficulty}>{difficultyLabels[difficulty]}</option>)}
        </SelectField>
        <SelectField id="filter-source" label="Aufgabenquelle" value={filters.source} onChange={(value) => setFilter('source', value)}>
          <option value="">Alle Aufgabenquellen</option>
          <option value="exercise">Übung</option>
          <option value="selfTest">Selbsttest</option>
        </SelectField>
        <SelectField id="filter-competency" label="Kompetenzbereich" value={filters.competency}
          disabled={competencyOptions.length === 0} onChange={(value) => setFilter('competency', value)}>
          <option value="">{competencyOptions.length ? 'Alle Kompetenzbereiche' : 'Keine Angaben vorhanden'}</option>
          {competencyOptions.map((competency) => <option key={competency} value={competency}>{competencyLabels[competency]}</option>)}
        </SelectField>
        <SelectField id="filter-afb" label="Anforderungsbereich" value={filters.afb} disabled={afbOptions.length === 0}
          onChange={(value) => setFilter('afb', value)}>
          <option value="">{afbOptions.length ? 'Alle Anforderungsbereiche' : 'Noch nicht klassifiziert'}</option>
          {afbOptions.map((afb) => <option key={afb} value={afb}>AFB {afb}</option>)}
        </SelectField>
        <SelectField id="filter-mode" label="Bearbeitungsmodus" value={filters.mode} disabled={modeOptions.length === 0}
          onChange={(value) => setFilter('mode', value)}>
          <option value="">{modeOptions.length ? 'Alle Bearbeitungsmodi' : 'Noch nicht klassifiziert'}</option>
          {modeOptions.map((mode) => <option key={mode} value={mode}>{modeLabels[mode]}</option>)}
        </SelectField>
        <div className="exercise-filter-actions">
          <span>Filter lassen sich kombinieren.</span>
          <button type="button" onClick={() => setFilters(initialFilters)} disabled={Object.values(filters).every((value) => !value)}>Zurücksetzen</button>
        </div>
      </div>
    </details>

    <section className="exercise-results" aria-live="polite">
      <div className="exercise-results-heading">
        <div><span className="section-kicker">ZENTRALER AUFGABENBESTAND</span><h2>Aufgabenübersicht</h2></div>
        {!isLoading && <span>{filteredExercises.length} von {exercises.length}</span>}
      </div>
      {!isLoading && !loadError && <div className="practice-device-note">
        <span>{Object.keys(records).length} Aufgaben bearbeitet · Ergebnisse werden nur auf diesem Gerät gespeichert.</span>
        <button type="button" onClick={resetRecords} disabled={Object.keys(records).length === 0}>Ergebnisse zurücksetzen</button>
      </div>}
      {isLoading ? <div className="exercise-empty"><strong>Aufgaben werden geladen …</strong><p>Der zentrale Aufgabenbestand wird vorbereitet.</p></div>
        : loadError ? <div className="exercise-empty"><strong>Aufgabenbestand konnte nicht geladen werden.</strong><p>Bitte lade die Seite erneut.</p></div>
          : filteredExercises.length === 0 ? <div className="exercise-empty"><strong>Keine Aufgaben für diese Auswahl</strong><p>Ändere oder setze einzelne Filter zurück, um weitere Aufgaben zu finden.</p></div>
            : <div className="exercise-list">{filteredExercises.map((exercise) => {
              const topic = topicByLessonId.get(exercise.sourceLessonId)
              const isExpanded = expandedId === exercise.id
              const record = records[exercise.id]
              return <article className={`exercise-list-item${isExpanded ? ' is-expanded' : ''}`} key={exercise.id}>
                <div className="exercise-list-toggle" onClick={() => setExpandedId(isExpanded ? null : exercise.id)}>
                <div className="exercise-list-main">
                  <div className="exercise-list-meta">
                    <span className={`exercise-source-tag ${exercise.sourceKind === 'selfTest' ? 'is-self-test' : ''}`}>
                      {exercise.sourceKind === 'exercise' ? 'Übung' : 'Selbsttest'}
                    </span>
                    {exercise.difficulty && <span className={`exercise-difficulty-tag difficulty-${exercise.difficulty}`}>
                      {difficultyLabels[exercise.difficulty]}
                    </span>}
                    {exercise.afb && <span className="exercise-meta-tag">AFB {exercise.afb}</span>}
                    {record && <span className={`exercise-result-tag result-${record.result}`}>{resultLabels[record.result]}</span>}
                  </div>
                  <h3><button type="button" className="exercise-title-button" aria-expanded={isExpanded}
                    aria-controls={`practice-${exercise.id}`}>{exercise.title}</button></h3>
                  <p className="exercise-topic">{topic ? <>{topic.chapterTitle}<span aria-hidden="true"> / </span><strong>{topic.lessonTitle}</strong></> : 'Thema nicht zugeordnet'}</p>
                </div>
                <div className="exercise-list-competencies" aria-label="Kompetenzbereiche">
                  {exercise.competencies.length > 0
                    ? exercise.competencies.map((competency) => <span key={competency} title={competencyLabels[competency]}>{competency} · {competencyLabels[competency]}</span>)
                    : <span className="exercise-unclassified">Nicht angegeben</span>}
                  {exercise.supportedModes?.map((mode) => <span className="exercise-mode-tag" key={mode}>{modeLabels[mode]}</span>)}
                </div>
                </div>
                {isExpanded && <div className="exercise-list-panel" id={`practice-${exercise.id}`}>
                  <ExercisePractice exercise={exercise} record={record} onRecord={(next) => saveRecord(exercise.id, next)}/>
                </div>}
              </article>
            })}</div>}
    </section>
    <p className="exercise-page-note">Wähle eine Aufgabe, um sie zu bearbeiten. Zahlen- und Zuordnungsaufgaben werden automatisch geprüft; bei Erklärungsaufgaben vergleichst du deine Antwort selbst mit der Musterlösung.</p>
  </div>
}
