import { lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import type { PageId } from '../types/navigation'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'

interface AppShellProps { activePage: PageId; onNavigate: (page: PageId) => void; children: ReactNode }

// Das Periodensystem wird erst beim ersten Öffnen geladen.
const PeriodicTable = lazy(() => import('./PeriodicTable'))

export function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const tableButtonRef = useRef<HTMLButtonElement>(null)
  const closeTable = () => {
    setTableOpen(false)
    requestAnimationFrame(() => tableButtonRef.current?.focus())
  }
  return <div className="app-shell">
    <Sidebar activePage={activePage} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} />
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Navigation öffnen" onClick={() => setMenuOpen(true)}><Icon name="menu"/></button>
        <button ref={tableButtonRef} className="icon-button pse-button" aria-haspopup="dialog" aria-label="Periodensystem öffnen" onClick={() => setTableOpen(true)}>PSE</button>
        <div className="breadcrumb"><span>CHEMIE LERNRAUM</span><Icon name="chevron" size={14}/><strong>{pageLabels[activePage]}</strong></div>
        <div className="topbar-right"><span className="topbar-tag"><span className="status-dot"/> DEIN LERNPLATZ</span><span className="avatar">C</span></div>
      </header>
      <div className="page-content">{children}</div>
      <footer className="app-footer"><span>Ein Lernprojekt für das hessische Chemie-Landesabitur</span><span>IN AUFBAU <span className="status-dot"/></span></footer>
    </main>
    {tableOpen && <Suspense fallback={null}><PeriodicTable onClose={closeTable}/></Suspense>}
  </div>
}

const pageLabels: Record<PageId, string> = { dashboard: 'Übersicht', lernen: 'Lernbereich', uebungen: 'Übungsbereich', abiturarchiv: 'Abiturarchiv', fortschritt: 'Lernfortschritt' }

