import { useEffect, useRef } from 'react'
import { useAccount } from '../account/AccountContext'
import { formatDate } from '../account/profile'
import type { PageId } from '../types/navigation'
import { Icon } from './Icon'
import './AccountDialog.css'

interface AccountDialogProps { onClose: () => void; onNavigate: (page: PageId) => void }

/** Kontoübersicht mit Abmelden; die Anmeldung selbst läuft über die Zugangsseite. */
export function AccountDialog({ onClose, onNavigate }: AccountDialogProps) {
  const { state, signOut } = useAccount()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (state.status !== 'signed-in') return null
  const { profile } = state
  const go = (page: PageId) => { onNavigate(page); onClose() }

  return <div className="account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
      <button ref={closeRef} className="icon-button account-close" aria-label="Schließen" onClick={onClose}><Icon name="close" size={17}/></button>
      <div className="section-kicker">DEIN KONTO</div>
      <h2 id="account-title">{profile.display_name}</h2>
      <dl className="account-facts">
        <div><dt>Benutzername</dt><dd>{profile.username}</dd></div>
        <div><dt>Zugang gültig bis</dt><dd>{profile.valid_until ? formatDate(profile.valid_until) : 'unbefristet'}</dd></div>
        <div><dt>Rechte</dt><dd>{[profile.is_admin && 'Admin', profile.can_view_archive && 'Abiturarchiv'].filter(Boolean).join(', ') || 'Standard'}</dd></div>
      </dl>
      <div className="account-actions">
        {profile.is_admin && <button className="primary-button" onClick={() => go('admin')}>Zur Benutzerverwaltung</button>}
        <button className="account-secondary" onClick={() => { void signOut() }}>Abmelden</button>
      </div>
      <button className="account-privacy text-link" onClick={() => go('datenschutz')}>Datenschutz</button>
    </div>
  </div>
}
