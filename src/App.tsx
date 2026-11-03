import { lazy, Suspense, useEffect, useState } from 'react'
import { AccountProvider, accountsEnabled, useAccount } from './account/AccountContext'
import { AppShell } from './components/AppShell'
import { PracticeRecordsProvider } from './practice/PracticeRecordsContext'
import { NotesProvider } from './notes/NotesContext'
import { CommentsProvider } from './comments/CommentsContext'
import { LoginGate } from './components/LoginGate'
import { SubjectPicker, type SubjectId } from './components/SubjectPicker'
import { DashboardPage } from './pages/DashboardPage'
import { LearningPage } from './pages/LearningPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ProgressPage } from './pages/ProgressPage'
import type { ExerciseFocus, PageId } from './types/navigation'

// Die Benutzerverwaltung wird nur für Admins gebraucht und deshalb erst beim Öffnen geladen.
const AdminPage = lazy(() => import('./pages/AdminPage'))
// Archivdaten nur laden, wenn das Archiv geöffnet wird
const ArchivePage = lazy(() => import('./pages/ArchivePage'))

export default function App() {
  return <AccountProvider><Workspace/></AccountProvider>
}

// Gewähltes Fach für diesen Tab merken, damit ein Neuladen nicht zur Fächerauswahl zurückführt
const subjectKey = 'lernraum.subject'
function readSubject(): SubjectId | null {
  try { return window.sessionStorage.getItem(subjectKey) === 'chemie' ? 'chemie' : null } catch { return null }
}
function storeSubject(subject: SubjectId | null) {
  try {
    if (subject) window.sessionStorage.setItem(subjectKey, subject)
    else window.sessionStorage.removeItem(subjectKey)
  } catch {
    // Ohne Sitzungsspeicher wird nach dem Neuladen wieder die Fächerauswahl gezeigt.
  }
}

/** Ablauf: Anmeldung (falls Konten eingerichtet), dann Fächerauswahl, dann das gewählte Fach. */
function Workspace() {
  const { state } = useAccount()
  const [subject, setSubject] = useState<SubjectId | null>(readSubject)
  const chooseSubject = (next: SubjectId | null) => {
    setSubject(next)
    storeSubject(next)
  }
  // Nach dem Abmelden beginnt die nächste Anmeldung wieder bei der Fächerauswahl.
  useEffect(() => {
    if (accountsEnabled && state.status === 'signed-out') chooseSubject(null)
  }, [state.status])

  if (accountsEnabled && state.status !== 'signed-in') return <LoginGate/>
  if (!subject) return <SubjectPicker onChoose={chooseSubject}/>
  const userId = state.status === 'signed-in' ? state.profile.id : null
  // Neuer Schlüssel je Konto: Nach einem Kontowechsel beginnt die Ansicht wieder beim Dashboard.
  return <Pages key={userId ?? 'local'} userId={userId} onLeaveSubject={() => chooseSubject(null)}/>
}

function Pages({ userId, onLeaveSubject }: { userId: string | null; onLeaveSubject: () => void }) {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  // Ziel, das der Übungsbereich beim nächsten Öffnen zeigen soll (Wiederholungsliste, Dashboard, Archiv)
  const [exerciseFocus, setExerciseFocus] = useState<ExerciseFocus | null>(null)
  const openPractice = (focus: ExerciseFocus) => {
    setExerciseFocus(focus)
    setActivePage('uebungen')
  }
  const openExercise = (exerciseId: string) => openPractice({ exerciseId })

  return <PracticeRecordsProvider userId={userId}><NotesProvider userId={userId}><CommentsProvider userId={userId}><AppShell activePage={activePage} onNavigate={setActivePage} onLeaveSubject={onLeaveSubject}>
    {activePage === 'dashboard'
      ? <DashboardPage onNavigate={setActivePage} onPractice={openExercise}/>
      : activePage === 'lernen'
        ? <LearningPage/>
        : activePage === 'uebungen'
          ? <ExercisesPage focus={exerciseFocus} onFocusHandled={() => setExerciseFocus(null)}/>
          : activePage === 'admin'
            ? <Suspense fallback={null}><AdminPage/></Suspense>
            : activePage === 'datenschutz'
              ? <PrivacyPage/>
              : activePage === 'fortschritt'
                ? <ProgressPage onPractice={openExercise}/>
                : <Suspense fallback={null}><ArchivePage onPractice={openPractice}/></Suspense>}
  </AppShell></CommentsProvider></NotesProvider></PracticeRecordsProvider>
}
