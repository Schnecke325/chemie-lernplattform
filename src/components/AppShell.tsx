import { lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import { useAccount, useCanViewArchive } from '../account/AccountContext'
import type { PageId } from '../types/navigation'
import { AccountDialog } from './AccountDialog'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'

interface AppShellProps { activePage: PageId; onNavigate: (page: PageId) => void; onLeaveSubject: () => void; children: ReactNode }

// Das Periodensystem wird erst beim ersten Öffnen geladen.
const PeriodicTable = lazy(() => import('./PeriodicTable'))

export function AppShell({ activePage, onNavigate, onLeaveSubject, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const tableButtonRef = useRef<HTMLButtonElement>(null)
  const closeTable = () => {
    setTableOpen(false)
    requestAnimationFrame(() => tableButtonRef.current?.focus())
  }
  const { state: account } = useAccount()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const closeAccount = () => {
    setAccountOpen(false)
    requestAnimationFrame(() => accountButtonRef.current?.focus())
  }
  const profile = account.status === 'signed-in' ? account.profile : null
  const canViewArchive = useCanViewArchive()
  return <div className="app-shell">
    <Sidebar activePage={activePage} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} showAdmin={Boolean(profile?.is_admin)} showArchive={canViewArchive} onLeaveSubject={onLeaveSubject} />
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Navigation öffnen" onClick={() => setMenuOpen(true)}><Icon name="menu"/></button>
        <button ref={tableButtonRef} className="icon-button pse-button" aria-haspopup="dialog" aria-label="Periodensystem öffnen" onClick={() => setTableOpen(true)}>PSE</button>
        <div className="breadcrumb"><span>CHEMIE LERNRAUM</span><Icon name="chevron" size={14}/><strong>{pageLabels[activePage]}</strong></div>
        <div className="topbar-right"><span className="topbar-tag"><span className="status-dot"/> DEIN LERNPLATZ</span>
          {profile
            ? <button ref={accountButtonRef} className="avatar account-button" aria-haspopup="dialog" aria-label={`Konto von ${profile.display_name}`} title={profile.display_name} onClick={() => setAccountOpen(true)}>{initials(profile.display_name)}</button>
            : <span className="avatar">C</span>}
        </div>
      </header>
      <div className="page-content">{children}</div>
      <footer className="app-footer"><span>Ein Lernprojekt für das hessische Chemie-Landesabitur</span><button className="footer-link" onClick={() => onNavigate('datenschutz')}>DATENSCHUTZ</button><span>IN AUFBAU <span className="status-dot"/></span></footer>
    </main>
    {tableOpen && <Suspense fallback={null}><PeriodicTable onClose={closeTable}/></Suspense>}
    {accountOpen && <AccountDialog onClose={closeAccount} onNavigate={onNavigate}/>}
  </div>
}

const pageLabels: Record<PageId, string> = { dashboard: 'Übersicht', lernen: 'Lernbereich', uebungen: 'Übungsbereich', abiturarchiv: 'Abiturarchiv', fortschritt: 'Lernfortschritt', admin: 'Benutzerverwaltung', datenschutz: 'Datenschutz' }

/** Bis zu zwei Initialen für das Konto-Symbol */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?'
}

