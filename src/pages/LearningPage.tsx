import { ExercisePractice, resultLabels } from '../components/ExercisePractice'
import { getLessonById, hasLearningLesson, learningCatalog, learningLessonIds } from '../content'
import type { Competency, Exercise, LessonContent, PublicationStatus } from '../content/types'
import type { PracticeRecord } from '../practice/storage'
import { usePracticeRecords } from '../practice/usePracticeRecords'
import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './LearningPage.css'

const competencyLabels: Record<Competency, string> = {
  S: 'Sachkompetenz',
  E: 'Erkenntnisgewinnung',
  K: 'Kommunikation',
  B: 'Bewertung',
}

/** Hinweis im Seitenkopf; freigegebene Seiten tragen keinen. */
const statusLabels: Record<PublicationStatus, string | null> = {
  draft: 'Entwurf',
  review: 'In fachlicher Redaktion',
  published: null,
}

const sectionLinks = [
  ['ziele', 'Lernziele'],
  ['voraussetzungen', 'Vorkenntnisse'],
  ['einstieg', 'Einführung'],
  ['grundlagen', 'Fachliche Erklärung'],
  ['begriffe', 'Fachbegriffe'],
  ['gleichungen', 'Formeln & Gleichungen'],
  ['beispiele', 'Gerechnete Beispiele'],
  ['abiturbezug', 'Abiturbezüge'],
  ['uebungen', 'Übungen'],
  ['loesungen', 'Typische Fehler'],
  ['selbsttest', 'Selbsttest'],
] as const

function RichText({ text }: { text: string }) {
  return <div className="lesson-richtext">
    {text.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
      const lines = block.split('\n')
      if (lines[0].startsWith('### ')) {
        return <div className="richtext-subsection" key={index}>
          <h3>{lines[0].slice(4)}</h3>
          {lines.slice(1).length > 0 && <RichText text={lines.slice(1).join('\n')}/>}
        </div>
      }
      if (lines.every((line) => line.startsWith('- '))) {
        return <ul key={index}>{lines.map((line) => <li key={line}>{line.slice(2)}</li>)}</ul>
      }
      return <p key={index}>{block.replaceAll('\n', ' ')}</p>
    })}
  </div>
}

function CompetencyTags({ items }: { items: Competency[] }) {
  return <div className="lesson-tags" aria-label="Kompetenzbereiche">
    {items.map((item) => <span className="lesson-tag" key={item} title={competencyLabels[item]}>{item} · {competencyLabels[item]}</span>)}
  </div>
}

function ExerciseCard({ exercise, index, record, onRecord, showDifficulty = true }: {
  exercise: Exercise
  index: number
  record?: PracticeRecord
  onRecord: (record: PracticeRecord) => void
  showDifficulty?: boolean
}) {
  return <article className="exercise-card" id={exercise.id}>
    <div className="exercise-card-top">
      <span className="exercise-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="exercise-card-tags">
        {record && <span className={`exercise-result-tag result-${record.result}`}>{resultLabels[record.result]}</span>}
        {showDifficulty && <span className={`difficulty-pill difficulty-${exercise.difficulty}`}>
          {exercise.difficulty === 'basic' ? 'Grundlegend' : exercise.difficulty === 'standard' ? 'Standard' : 'Transfer'}
        </span>}
      </div>
    </div>
    <h4>{exercise.title}</h4>
    <CompetencyTags items={exercise.competencies}/>
    <ExercisePractice exercise={exercise} record={record} onRecord={onRecord}/>
  </article>
}

function LessonSection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section className="lesson-section" id={id}>
    <div className="lesson-section-heading"><span>{number}</span><h2>{title}</h2></div>
    {children}
  </section>
}

export function LearningPage() {
  const [selectedId, setSelectedId] = useState(learningLessonIds[0] ?? '')
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(() => new Set())
  const [lesson, setLesson] = useState<LessonContent | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    setLesson(null)
    setLoadError(false)
    if (!selectedId) return () => { active = false }

    getLessonById(selectedId)
      .then((content) => { if (active) setLesson(content ?? null) })
      .catch(() => { if (active) setLoadError(true) })
    return () => { active = false }
  }, [selectedId])

  if (loadError) return <div className="learning-empty">Die Lernseite konnte nicht geladen werden. Bitte versuche es erneut.</div>
  if (!lesson) return <div className="learning-empty">Lernseite wird geladen …</div>
  return <>
    <LearningCatalog
      selectedId={lesson.id}
      openChapterIds={openChapterIds}
      onToggleChapter={(chapterId) => {
        setOpenChapterIds((current) => {
          const next = new Set(current)
          if (next.has(chapterId)) next.delete(chapterId)
          else next.add(chapterId)
          return next
        })
      }}
      onSelect={setSelectedId}
    />
    <LessonView key={lesson.id} lesson={lesson}/>
  </>
}

function LearningCatalog({
  selectedId,
  openChapterIds,
  onToggleChapter,
  onSelect,
}: {
  selectedId: string
  openChapterIds: ReadonlySet<string>
  onToggleChapter: (chapterId: string) => void
  onSelect: (id: string) => void
}) {
  return <nav className="learning-catalog" aria-label="Kapitel und Unterkapitel">
    <div className="learning-catalog-heading"><span>LERNPFAD</span><h2>Kapitel &amp; Unterkapitel</h2><p>Wähle ein ausgearbeitetes Unterkapitel aus. Weitere Inhalte werden kapitelweise ergänzt.</p></div>
    <div className="learning-catalog-grid">{learningCatalog.chapters.map((chapter) => {
      const isOpen = openChapterIds.has(chapter.id)
      return <section className={isOpen ? 'learning-catalog-chapter is-open' : 'learning-catalog-chapter'} key={chapter.id}>
      <h3>{chapter.title}</h3>
      <button
        type="button"
        className="catalog-chapter-toggle"
        aria-expanded={isOpen}
        aria-controls={`catalog-items-${chapter.id}`}
        onClick={() => onToggleChapter(chapter.id)}
      >
        {chapter.title}<span aria-hidden="true"/>
      </button>
      <ul id={`catalog-items-${chapter.id}`}>{chapter.children.map((child) => {
        const available = child.lessonId ? hasLearningLesson(child.lessonId) : false
        return <li key={child.id}>
          {available
            ? <button type="button" className={selectedId === child.lessonId ? 'catalog-lesson is-selected' : 'catalog-lesson'} aria-current={selectedId === child.lessonId ? 'page' : undefined} onClick={() => onSelect(child.lessonId!)}>{child.title}<span>Öffnen</span></button>
            : <span className="catalog-lesson catalog-lesson-pending" aria-disabled="true">{child.title}<span>{child.status === 'planned' ? 'Geplant' : 'In Ausarbeitung'}</span></span>}
        </li>
      })}</ul>
    </section>
    })}</div>
  </nav>
}

function LessonView({ lesson }: { lesson: LessonContent }) {
  const [activeSection, setActiveSection] = useState<string>(sectionLinks[0][0])
  const { records, saveRecord } = usePracticeRecords()
  const lessonStartRef = useRef<HTMLDivElement>(null)
  const parent = learningCatalog.chapters.find((chapter) => chapter.children.some((child) => child.lessonId === lesson.id))
  const catalogEntries = learningCatalog.chapters.flatMap((chapter) => [
    { id: chapter.id, title: chapter.title },
    ...chapter.children.map((child) => ({ id: child.id, title: child.title })),
  ])
  const prerequisiteLabels = lesson.prerequisites.map((id) => catalogEntries.find((item) => item.id === id)?.title ?? id)
  const practiceGroups: Array<{ key: Exercise['difficulty']; title: string; help: string }> = [
    { key: 'basic', title: '1 · Grundlagen sichern', help: 'Begriffe, Strukturen und einfache Zuordnungen' },
    { key: 'standard', title: '2 · Sicher anwenden', help: 'Rechnen und mehrschrittig begründen' },
    { key: 'transfer', title: '3 · Auf neue Situationen übertragen', help: 'Material auswerten und Aussagen prüfen' },
  ]

  useLayoutEffect(() => {
    const lessonStart = lessonStartRef.current
    if (!lessonStart) return

    // The document is the active scroll container; the lesson has rendered at this point.
    const top = window.scrollY + lessonStart.getBoundingClientRect().top
    const targetTop = Math.max(0, top)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetTop)
      return
    }

    window.scrollTo({ top: targetTop, left: 0, behavior: 'smooth' })
  }, [lesson.id])

  useEffect(() => {
    const sections = sectionLinks
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <div className="learning-page">
    <div className="lesson-breadcrumb" ref={lessonStartRef}><span>Lernbereich</span><span>/</span><span>{parent?.title ?? 'Naturstoffe'}</span><span>/</span><strong>{lesson.title}</strong></div>
    <div className="lesson-layout">
      <article className="lesson-main">
        <header className="lesson-hero">
          <div className="lesson-eyebrow"><span className="lesson-eyebrow-mark"/> {lesson.id === 'chem.q2.1.amino-acids-peptides' ? 'MUSTERSEITE · CHEMIE LK' : 'CHEMIE LK · LERNKAPITEL'}</div>
          <div className="lesson-hero-tags">
            {lesson.curriculum.map((reference) => <span className="curriculum-chip" key={`${reference.sourceId}-${reference.fieldId}`}>{reference.fieldId} · {parent?.title ?? 'Curriculum'}</span>)}
          </div>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
          {statusLabels[lesson.publicationStatus] && <span className="review-label">{statusLabels[lesson.publicationStatus]}</span>}
        </header>

        <LessonSection id="ziele" number="01" title="Lernziele">
          <div className="goal-list">{lesson.learningGoals.map((goal) => <div className="goal-item" key={goal.id}>
            <span className="goal-check" aria-hidden="true">✓</span>
            <div><p>{goal.statement}</p><CompetencyTags items={goal.competencies}/><div className="operator-list">Operatoren: {goal.operators.join(' · ')}</div></div>
          </div>)}</div>
        </LessonSection>

        <LessonSection id="voraussetzungen" number="02" title="Benötigte Vorkenntnisse">
          <p className="section-intro">Diese Grundlagen helfen dir, die Inhalte sicher nachzuvollziehen:</p>
          <div className="prerequisite-list">{prerequisiteLabels.map((label, index) => <div className="prerequisite-item" key={lesson.prerequisites[index]}><span>{String(index + 1).padStart(2, '0')}</span>{label}</div>)}</div>
        </LessonSection>

        <LessonSection id="einstieg" number="03" title="Einführung">
          <div className="lesson-prose"><RichText text={lesson.introduction}/></div>
        </LessonSection>

        <LessonSection id="grundlagen" number="04" title="Fachliche Erklärung">
          <div className="lesson-prose"><RichText text={lesson.explanation}/></div>
        </LessonSection>

        <LessonSection id="begriffe" number="05" title="Wichtige Fachbegriffe">
          <div className="term-grid">{lesson.fundamentals.map((item) => <article className="term-card" key={item.term}><h3>{item.term}</h3><p>{item.explanation}</p></article>)}</div>
        </LessonSection>

        <LessonSection id="gleichungen" number="06" title="Formeln und Reaktionsgleichungen">
          <p className="section-intro">{lesson.equationNote}</p>
          <div className="equation-list">{lesson.equations.map((equation, index) => <article className="equation-card" key={equation.id}>
            <span className="equation-index">G{index + 1}</span><code>{equation.notation}</code><p>{equation.explanation}</p>
          </article>)}</div>
          {lesson.mechanisms.length > 0 && <div className="mechanism-list">{lesson.mechanisms.map((mechanism) => <article className="mechanism-card" key={mechanism.id}><h3>{mechanism.title}</h3><ol>{mechanism.steps.map((step) => <li key={step}>{step}</li>)}</ol></article>)}</div>}
        </LessonSection>

        <LessonSection id="beispiele" number="07" title="Schrittweise gerechnete Beispiele">
          <div className="worked-examples">{lesson.workedExamples.map((example, index) => <article className="worked-example" key={example.id}>
            <div className="worked-example-heading"><span>BEISPIEL {String(index + 1).padStart(2, '0')}</span><h3>{example.title}</h3></div>
            <p className="example-prompt">{example.prompt}</p>
            <ol className="solution-steps">{example.steps.map((step, stepIndex) => <li key={step}><span>{stepIndex + 1}</span><p>{step}</p></li>)}</ol>
            <div className="example-result"><strong>Ergebnis</strong><p>{example.result}</p></div>
          </article>)}</div>
        </LessonSection>

        <LessonSection id="abiturbezug" number="08" title="Typische Abitur-Aufgabentypen">
          <ul className="task-type-list">{lesson.typicalTaskTypes.map((taskType) => <li key={taskType}>{taskType}</li>)}</ul>
          <div className="exam-reference-list">{lesson.examReferences.map((reference) => <article className="exam-reference" key={`${reference.year}-${reference.term}-${reference.proposal}`}>
            <span className="exam-year">{reference.year}</span><div><strong>{reference.term} · Vorschlag {reference.proposal}</strong><p>Aufgabenblatt S. {reference.pageStart}{reference.pageEnd ? `–${reference.pageEnd}` : ''} · {reference.evidenceRole === 'main-topic' ? 'Hauptthema' : 'Ergänzender Fachbezug'}</p></div><span className="local-source-tag">lokaler Quellenbeleg</span>
          </article>)}</div>
          <p className="copyright-note">Die Belege verweisen auf Jahr, Termin, Vorschlag und Seiten der lokalen Originale. Originalaufgaben und Lösungstexte sind nicht in diese Lernseite kopiert oder eingebettet.</p>
        </LessonSection>

        <LessonSection id="uebungen" number="09" title="Übungen in drei Schwierigkeitsstufen">
          <p className="section-intro">Bearbeite jede Aufgabe direkt hier, getippt oder handschriftlich. Zahlen- und Zuordnungsaufgaben werden automatisch geprüft; sonst vergleichst du deine Antwort mit der Musterlösung. Ergebnisse werden nur auf diesem Gerät gespeichert.</p>
          <div className="exercise-groups">{practiceGroups.map((group) => {
            const exercises = lesson.exercises.filter((exercise) => exercise.difficulty === group.key)
            return <section className="exercise-group" key={group.key}>
              <div className="exercise-group-heading"><div><h3>{group.title}</h3><p>{group.help}</p></div><span>{exercises.length} Aufgaben</span></div>
              <div className="exercise-grid">{exercises.map((exercise, index) => <ExerciseCard exercise={exercise} index={index} key={exercise.id}
                record={records[exercise.id]} onRecord={(record) => saveRecord(exercise.id, record)}/>)}</div>
            </section>
          })}</div>
        </LessonSection>

        <LessonSection id="loesungen" number="10" title="Lösungshinweise und typische Fehler">
          <div className="tip-grid">{lesson.tipsAndErrors.map((item, index) => <article className="tip-card" key={item.tip}>
            <span className="tip-number">T{String(index + 1).padStart(2, '0')}</span><div><h3>So gehst du vor</h3><p>{item.tip}</p><h4>Typischer Fehler</h4><p>{item.commonError}</p></div>
          </article>)}</div>
          <div className="solution-note"><strong>Beim Prüfen beachten</strong><p>Stimmen Einheiten, Stoff- und Ladungsbilanzen sowie Vorzeichen? Sind die verwendeten Annahmen und die Reichweite deiner Schlussfolgerung klar?</p></div>
        </LessonSection>

        <LessonSection id="selbsttest" number="11" title="Kurzer Selbsttest">
          <p className="section-intro">Beantworte die Fragen ohne nach oben zu scrollen und prüfe dich anschließend selbst.</p>
          <div className="exercise-grid">{lesson.selfTest.map((item, index) => <ExerciseCard exercise={item} index={index} key={item.id}
            showDifficulty={false} record={records[item.id]} onRecord={(record) => saveRecord(item.id, record)}/>)}</div>
        </LessonSection>

        <div className="lesson-endnote"><span className="lesson-endnote-dot"/> {lesson.publicationStatus !== 'published' && 'Seite im redaktionellen Review · '}Curriculum- und Häufigkeitsangaben sind im Quellenmodell getrennt geführt.</div>
      </article>

      <aside className="lesson-rail" aria-label="Auf dieser Seite">
        <details className="lesson-rail-card lesson-toc" open>
          <summary className="rail-kicker">AUF DIESER SEITE</summary>
          <nav>{sectionLinks.map(([id, label], index) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setActiveSection(id)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
        </details>
        <div className="lesson-rail-card rail-source"><span className="rail-kicker">CURRICULUM</span><strong>{lesson.curriculum.map((reference) => reference.fieldId).join(' · ')} · {parent?.title ?? 'Chemie'}</strong><p>Diese Seite ordnet das Unterkapitel den angegebenen curricularen Feldern zu.</p></div>
      </aside>
    </div>
  </div>
}
