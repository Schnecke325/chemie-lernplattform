import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { LearningPage } from './pages/LearningPage'
import { ExercisesPage } from './pages/ExercisesPage'
import type { PageId } from './types/navigation'

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')

  return <AppShell activePage={activePage} onNavigate={setActivePage}>
    {activePage === 'dashboard'
      ? <DashboardPage onNavigate={setActivePage}/>
      : activePage === 'lernen'
        ? <LearningPage/>
        : activePage === 'uebungen'
          ? <ExercisesPage/>
        : <PlaceholderPage page={activePage}/>}
  </AppShell>
}
