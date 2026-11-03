import type { NavigationItem, PageId } from '../types/navigation'
import { Icon } from './Icon'

const items: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'lernen', label: 'Lernbereich', icon: 'flask' },
  { id: 'uebungen', label: 'Übungsbereich', icon: 'book' },
  { id: 'abiturarchiv', label: 'Abiturarchiv', icon: 'archive' },
  { id: 'fortschritt', label: 'Lernfortschritt', icon: 'chart' },
]

const adminItem: NavigationItem = { id: 'admin', label: 'Benutzerverwaltung', icon: 'shield' }

interface SidebarProps { activePage: PageId; onNavigate: (page: PageId) => void; open: boolean; onClose: () => void; showAdmin: boolean }

export function Sidebar({ activePage, onNavigate, open, onClose, showAdmin }: SidebarProps) {
  const navButton = (item: NavigationItem) => <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => { onNavigate(item.id); onClose() }} aria-current={activePage === item.id ? 'page' : undefined}>
    <Icon name={item.icon}/><span>{item.label}</span>{activePage === item.id && <span className="nav-indicator"/>}
  </button>
  return <>
    <button className={`sidebar-backdrop ${open ? 'is-visible' : ''}`} aria-label="Navigation schließen" onClick={onClose} />
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <span className="brand-mark"><Icon name="flask" size={22}/></span>
        <span className="brand-copy"><strong>chemie<span>.</span></strong><small>LERNRAUM · LK</small></span>
      </a>
      <div className="nav-label">LERNEN</div>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {items.map(navButton)}
      </nav>
      {showAdmin && <>
        <div className="nav-label nav-label-admin">VERWALTUNG</div>
        <nav className="main-nav" aria-label="Verwaltung">{navButton(adminItem)}</nav>
      </>}
      <div className="sidebar-footer">
        <div className="syllabus-card"><span className="syllabus-icon"><Icon name="spark" size={17}/></span><div><strong>Dein Lernraum</strong><p>Schritt für Schritt zum Ziel.</p></div></div>
        <div className="sidebar-meta"><span className="status-dot"/> BETA · IN AUFBAU</div>
      </div>
    </aside>
  </>
}
