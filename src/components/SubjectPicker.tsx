import { useState } from 'react'
import { accountsEnabled, useAccount } from '../account/AccountContext'
import { PrivacyPage } from '../pages/PrivacyPage'
import { Icon } from './Icon'
import './LoginGate.css'

export type SubjectId = 'chemie'

/** Verfügbare Fächer; weitere kommen hinzu, sobald sie Inhalte haben. */
const subjects: Array<{ id: SubjectId; title: string; course: string; description: string; icon: string }> = [
  { id: 'chemie', title: 'Chemie', course: 'Leistungskurs', description: 'Lernseiten, Übungsaufgaben, Lernfortschritt und Abiturvorbereitung für das hessische Landesabitur.', icon: 'flask' },
]

/** Fächerauswahl nach der Anmeldung. */
export function SubjectPicker({ onChoose }: { onChoose: (subject: SubjectId) => void }) {
  const { state, signOut } = useAccount()
  const [showPrivacy, setShowPrivacy] = useState(false)
  const name = state.status === 'signed-in' ? state.profile.display_name : null

  return <div className="gate">
    <header className="gate-brand">
      <span className="brand-mark"><Icon name="spark" size={22}/></span>
      <span className="brand-copy"><strong>lernraum<span>.</span></strong><small>OBERSTUFE · HESSEN</small></span>
      {accountsEnabled && name && <button className="account-secondary subject-signout" onClick={() => { void signOut() }}>Abmelden</button>}
    </header>
    {showPrivacy
      ? <main className="gate-privacy">
        <button className="text-link" onClick={() => setShowPrivacy(false)}><Icon name="arrow" size={14}/> Zurück zur Fächerauswahl</button>
        <PrivacyPage/>
      </main>
      : <main className="subject-main">
        <div className="eyebrow"><span className="eyebrow-line"/> FACH WÄHLEN</div>
        <h1 className="subject-heading">{name ? <>Hallo {name.split(' ')[0]}, <span>was lernst du heute?</span></> : <>Was lernst du <span>heute?</span></>}</h1>
        <div className="subject-grid">
          {subjects.map((subject) => <button key={subject.id} className="subject-card" onClick={() => onChoose(subject.id)}>
            <span className="subject-icon"><Icon name={subject.icon} size={24}/></span>
            <span className="subject-course">{subject.course.toUpperCase()}</span>
            <strong>{subject.title}</strong>
            <span className="subject-description">{subject.description}</span>
            <span className="subject-open">Öffnen <Icon name="arrow" size={15}/></span>
          </button>)}
          <div className="subject-card is-upcoming" aria-label="Weitere Fächer folgen">
            <span className="subject-icon"><Icon name="book" size={24}/></span>
            <span className="subject-course">IN PLANUNG</span>
            <strong>Weitere Fächer</strong>
            <span className="subject-description">Weitere Fächer folgen.</span>
          </div>
        </div>
      </main>}
    <footer className="gate-footer">
      <span>Ein Lernprojekt für das hessische Landesabitur</span>
      {!showPrivacy && <button className="footer-link" onClick={() => setShowPrivacy(true)}>DATENSCHUTZ</button>}
    </footer>
  </div>
}
