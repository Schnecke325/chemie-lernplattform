import { ProgressOverview } from '../components/ProgressOverview'
import { usePracticeRecords } from '../practice/PracticeRecordsContext'

/** Eigener Lernstand aus den gespeicherten Bearbeitungsergebnissen. */
export function ProgressPage({ onPractice }: { onPractice: (exerciseId: string) => void }) {
  const { records, storage } = usePracticeRecords()
  return <div className="progress-page">
    <div className="eyebrow"><span className="eyebrow-line"/> DEIN WEG IM BLICK</div>
    <h1 className="progress-heading">Lernfortschritt</h1>
    <p className="progress-intro">Für jede Aufgabe zählt dein letztes Ergebnis: sicher, teilweise, noch nicht oder offen. So siehst du, welche Themen sitzen und wo du nacharbeiten solltest.{storage === 'device' && ' Ohne Konto beruht der Stand nur auf diesem Gerät.'}</p>
    <ProgressOverview records={records} onPractice={onPractice}/>
  </div>
}
