import type { NavigationItem, PageId } from '../types/navigation'
import { Icon } from './Icon'

const items: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'lernen', label: 'Lernbereich', icon: 'flask' },
  { id: 'uebungen', label: 'Übungsbereich', icon: 'book' },
  { id: 'abiturarchiv', label: 'Abiturarchiv', icon: 'archive' },
  { id: 'fortschritt', label: 'Lernfortschritt', icon: 'chart' },
]

interface SidebarProps { activePage: PageId; onNavigate: (page: PageId) => void; open: boolean; onClose: () => void }

export function Sidebar({ activePage, onNavigate, open, onClose }: SidebarProps) {
  return <>
    <button className={`sidebar-backdrop ${open ? 'is-visible' : ''}`} aria-label="Navigation schließen" onClick={onClose} />
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <span className="brand-mark"><Icon name="flask" size={22}/></span>
        <span className="brand-copy"><strong>chemie<span>.</span></strong><small>LERNRAUM · LK</small></span>
      </a>
      <div className="nav-label">LERNEN</div>
      <nav className="main-nav" aria-label="Hauptnavigation">
        {items.map((item) => <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => { onNavigate(item.id); onClose() }} aria-current={activePage === item.id ? 'page' : undefined}>
          <Icon name={item.icon}/><span>{item.label}</span>{activePage === item.id && <span className="nav-indicator"/>}
        </button>)}
      </nav>
      <div className="sidebar-footer">
        <div className="syllabus-card"><span className="syllabus-icon"><Icon name="spark" size={17}/></span><div><strong>Dein Lernraum</strong><p>Schritt für Schritt zum Ziel.</p></div></div>
        <div className="sidebar-meta"><span className="status-dot"/> BETA · IN AUFBAU</div>
      </div>
    </aside>
  </>
}
