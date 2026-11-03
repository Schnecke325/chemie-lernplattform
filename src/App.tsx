import { lazy, Suspense, useState } from 'react'
import { AccountProvider } from './account/AccountContext'
import { AppShell } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { LearningPage } from './pages/LearningPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import type { PageId } from './types/navigation'

// Die Benutzerverwaltung wird nur für Admins gebraucht und deshalb erst beim Öffnen geladen.
const AdminPage = lazy(() => import('./pages/AdminPage'))

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')

  return <AccountProvider>
    <AppShell activePage={activePage} onNavigate={setActivePage}>
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
    </AppShell>
  </AccountProvider>
}
