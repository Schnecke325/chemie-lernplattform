import { useMemo } from 'react'
import { Icon } from '../components/Icon'
import { PlaceholderBadge } from '../components/PlaceholderBadge'
import { useExercises } from '../components/ProgressOverview'
import { learningCatalog } from '../content'
import { usePracticeRecords } from '../practice/PracticeRecordsContext'
import { buildProgress, repeatAfterDays } from '../progress/progress'
import type { PageId } from '../types/navigation'

interface DashboardPageProps { onNavigate: (page: PageId) => void; onPractice: (exerciseId: string) => void }

const reasonTexts = { missing: 'Zuletzt noch nicht gelöst', partial: 'Zuletzt teilweise gelöst', old: `Vor über ${repeatAfterDays} Tagen sicher gelöst` }

export function DashboardPage({ onNavigate, onPractice }: DashboardPageProps) {
  const { records } = usePracticeRecords()
  const exercises = useExercises()
  const progress = useMemo(() => exercises && buildProgress(learningCatalog.chapters, exercises, records), [exercises, records])
  const stats = [
    { label: 'SICHER', value: progress ? String(progress.overall.secure) : '—', hint: progress ? `von ${progress.overall.total} Aufgaben` : 'wird berechnet', icon: 'chart' },
    { label: 'ZUM WIEDERHOLEN', value: progress ? String(progress.repetition.length) : '—', hint: 'Aufgaben auf deiner Liste', icon: 'book' },
    { label: 'DIESE WOCHE', value: progress ? String(progress.thisWeek) : '—', hint: 'Aufgaben in 7 Tagen bearbeitet', icon: 'clock' },
  ]
  const next = progress?.repetition[0]
    ? { exercise: progress.repetition[0].exercise, lessonTitle: progress.repetition[0].lessonTitle, note: reasonTexts[progress.repetition[0].reason] }
    : progress?.nextOpen ? { ...progress.nextOpen, note: 'Noch nicht bearbeitet' } : null

  return <div className="dashboard-page">
    <div className="eyebrow"><span className="eyebrow-line"/> DEIN DIGITALER LERNRAUM</div>
    <section className="hero">
      <div className="hero-copy"><div className="hero-kicker"><span/> HESSEN · CHEMIE LEISTUNGSKURS</div>
        <h1>Wissen verstehen.<br/><span>Sicher anwenden.</span></h1>
        <p>Dein Raum für klare Erklärungen, gezieltes Üben und eine starke Vorbereitung auf das Landesabitur.</p>
        <button className="primary-button" onClick={() => onNavigate('lernen')}>Lernbereich entdecken <Icon name="arrow" size={17}/></button>
        <div className="hero-note"><Icon name="spark" size={15}/> In deinem Tempo. Schritt für Schritt.</div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="orbital orbital-one"/><div className="orbital orbital-two"/><div className="orbital orbital-three"/>
        <div className="molecule molecule-center"><span>C</span></div>
        <div className="molecule molecule-top"><span>O</span></div>
        <div className="molecule molecule-right"><span>H</span></div>
        <div className="molecule molecule-left"><span>N</span></div>
        <div className="molecule molecule-bottom"><span>H</span></div>
        <span className="visual-label label-one">MOLEKÜLSTRUKTUR <i/></span><span className="visual-label label-two"><i/> CHEMIE · LK</span>
        <div className="visual-coordinate">50°06′ N<br/>08°41′ E</div>
      </div>
      <div className="hero-index">01 <span/> LERNEN</div>
    </section>

    <section className="overview-section">
      <div className="section-heading"><div><div className="section-kicker">DEIN STARTPUNKT</div><h2>Lernübersicht</h2></div><button className="text-link" onClick={() => onNavigate('fortschritt')}>Zum Lernfortschritt <Icon name="arrow" size={15}/></button></div>
      <div className="stats-grid">{stats.map((stat, index) => <article className="stat-card" key={stat.label}>
        <div className="stat-card-top"><span className="stat-icon"><Icon name={stat.icon} size={18}/></span><span className="stat-index">0{index + 1}</span></div>
        <div className="stat-value">{stat.value}</div><div className="stat-label">{stat.label}</div><p>{stat.hint}</p>
      </article>)}</div>
    </section>

    <section className="lower-grid">
      <article className="continue-card"><div className="card-heading"><div><div className="section-kicker">WEITERLERNEN</div><h3>Dein nächster Schritt</h3></div><span className="card-heading-icon"><Icon name="arrow" size={18}/></span></div>
        <div className="empty-state"><span className="empty-icon"><Icon name="spark" size={20}/></span>
          {next
            ? <div><strong>{next.exercise.title}</strong><p>{next.lessonTitle} · {next.note}</p></div>
            : <div><strong>{progress ? 'Alle Aufgaben bearbeitet und aktuell.' : 'Dein nächster Schritt wird ermittelt …'}</strong><p>{progress ? 'Im Lernbereich kannst du Themen vertiefen.' : 'Einen Moment.'}</p></div>}
        </div>
        {next
          ? <button className="text-link" onClick={() => onPractice(next.exercise.id)}>Jetzt üben <Icon name="arrow" size={15}/></button>
          : <button className="text-link" onClick={() => onNavigate('lernen')}>Zum Lernbereich <Icon name="arrow" size={15}/></button>}
      </article>
      <article className="focus-card"><div className="section-kicker">ABITURVORBEREITUNG</div><h3>Systematisch<br/>zum Überblick.</h3><p>Prüfungsinhalte werden anhand der verfügbaren hessischen Landesabiturprüfungen strukturiert.</p><div className="focus-foot"><PlaceholderBadge/><button className="icon-button" aria-label="Zum Abiturarchiv" onClick={() => onNavigate('abiturarchiv')}><Icon name="arrow" size={17}/></button></div><span className="focus-watermark">H<sub>2</sub>O</span></article>
    </section>
    <p className="placeholder-note"><span className="status-dot"/> Das Abiturarchiv ist noch ein Platzhalter.</p>
  </div>
}
