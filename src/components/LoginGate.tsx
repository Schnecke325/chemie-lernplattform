import { useState } from 'react'
import { useAccount } from '../account/AccountContext'
import { PrivacyPage } from '../pages/PrivacyPage'
import { Icon } from './Icon'
import { LoginForm } from './LoginForm'
import './LoginGate.css'

/**
 * Zugangsseite für nicht angemeldete Besucher, solange Konten eingerichtet sind.
 * Sie grenzt den Nutzerkreis sichtbar ein, ist aber kein Schutz der Lerninhalte:
 * Diese liegen weiterhin im öffentlichen Build.
 */
export function LoginGate() {
  const { state } = useAccount()
  const [showPrivacy, setShowPrivacy] = useState(false)

  return <div className="gate">
    <header className="gate-brand">
      <span className="brand-mark"><Icon name="flask" size={22}/></span>
      <span className="brand-copy"><strong>chemie<span>.</span></strong><small>LERNRAUM · LK</small></span>
    </header>
    {showPrivacy
      ? <main className="gate-privacy">
        <button className="text-link" onClick={() => setShowPrivacy(false)}><Icon name="arrow" size={14}/> Zurück zur Anmeldung</button>
        <PrivacyPage/>
      </main>
      : <main className="gate-main">
        <section className="gate-intro">
          <div className="eyebrow"><span className="eyebrow-line"/> HESSEN · CHEMIE LEISTUNGSKURS</div>
          <h1>Willkommen im <span>Lernraum.</span></h1>
          <p>Erklärungen, Übungen und Abiturvorbereitung für unseren Kurs. Melde dich mit den Zugangsdaten an, die du von einem Admin bekommen hast.</p>
        </section>
        <section className="gate-card" aria-labelledby="login-title">
          {state.status === 'loading' ? <p className="account-intro">Anmeldung wird geprüft …</p> : <LoginForm/>}
        </section>
      </main>}
    <footer className="gate-footer">
      <span>Ein Lernprojekt für das hessische Chemie-Landesabitur</span>
      {!showPrivacy && <button className="footer-link" onClick={() => setShowPrivacy(true)}>DATENSCHUTZ</button>}
    </footer>
  </div>
}
