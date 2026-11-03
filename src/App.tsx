import { lazy, Suspense, useState } from 'react'
import { AccountProvider, accountsEnabled, useAccount } from './account/AccountContext'
import { AppShell } from './components/AppShell'
import { PracticeRecordsProvider } from './practice/PracticeRecordsContext'
import { LoginGate } from './components/LoginGate'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { LearningPage } from './pages/LearningPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import type { PageId } from './types/navigation'

// Die Benutzerverwaltung wird nur für Admins gebraucht und deshalb erst beim Öffnen geladen.
const AdminPage = lazy(() => import('./pages/AdminPage'))

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

  return <PracticeRecordsProvider userId={userId}><AppShell activePage={activePage} onNavigate={setActivePage}>
    {activePage === 'dashboard'
      ? <DashboardPage onNavigate={setActivePage}/>
      : activePage === 'lernen'
        ? <LearningPage/>
        : activePage === 'uebungen'
          ? <ExercisesPage/>
          : activePage === 'admin'
            ? <Suspense fallback={null}><AdminPage/></Suspense>
            : activePage === 'datenschutz'
              ? <PrivacyPage/>
              : <PlaceholderPage page={activePage}/>}
  </AppShell></PracticeRecordsProvider>
}
