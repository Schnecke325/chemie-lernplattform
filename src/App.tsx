import { lazy, Suspense, useState } from 'react'
import { AccountProvider, accountsEnabled, useAccount } from './account/AccountContext'
import { AppShell } from './components/AppShell'
import { PracticeRecordsProvider } from './practice/PracticeRecordsContext'
import { LoginGate } from './components/LoginGate'
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

/** Mit eingerichteten Konten sieht nur, wer angemeldet ist, die Lernbereiche. */
function Workspace() {
  const { state } = useAccount()
  if (!accountsEnabled) return <Pages userId={null}/>
  if (state.status !== 'signed-in') return <LoginGate/>
  // Neuer Schlüssel je Konto: Nach einem Kontowechsel beginnt die Ansicht wieder beim Dashboard.
  return <Pages key={state.profile.id} userId={state.profile.id}/>
}

function Pages({ userId }: { userId: string | null }) {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  // Ziel, das der Übungsbereich beim nächsten Öffnen zeigen soll (Wiederholungsliste, Dashboard, Archiv)
  const [exerciseFocus, setExerciseFocus] = useState<ExerciseFocus | null>(null)
  const openPractice = (focus: ExerciseFocus) => {
    setExerciseFocus(focus)
    setActivePage('uebungen')
  }
  const openExercise = (exerciseId: string) => openPractice({ exerciseId })

  return <PracticeRecordsProvider userId={userId}><AppShell activePage={activePage} onNavigate={setActivePage}>
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
  </AppShell></PracticeRecordsProvider>
}
