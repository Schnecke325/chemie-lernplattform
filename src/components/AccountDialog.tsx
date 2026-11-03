import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAccount } from '../account/AccountContext'
import { formatDate } from '../account/profile'
import type { PageId } from '../types/navigation'
import { Icon } from './Icon'
import './AccountDialog.css'

interface AccountDialogProps { onClose: () => void; onNavigate: (page: PageId) => void }

/** Anmeldung mit Benutzername und Zugangscode bzw. Kontoübersicht mit Abmelden. */
export function AccountDialog({ onClose, onNavigate }: AccountDialogProps) {
  const { state, notice, signIn, signOut } = useAccount()
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (state.status === 'signed-out') firstFieldRef.current?.focus()
    else closeRef.current?.focus()
  }, [state.status])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!username.trim() || !code.trim()) { setError('Bitte Benutzername und Zugangscode eingeben.'); return }
    setBusy(true)
    setError(await signIn(username, code))
    setBusy(false)
  }

  const go = (page: PageId) => { onNavigate(page); onClose() }

  return <div className="account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
      <button ref={closeRef} className="icon-button account-close" aria-label="Schließen" onClick={onClose}><Icon name="close" size={17}/></button>
      {state.status === 'signed-in'
        ? <>
          <div className="section-kicker">DEIN KONTO</div>
          <h2 id="account-title">{state.profile.display_name}</h2>
          <dl className="account-facts">
            <div><dt>Benutzername</dt><dd>{state.profile.username}</dd></div>
            <div><dt>Zugang gültig bis</dt><dd>{state.profile.valid_until ? formatDate(state.profile.valid_until) : 'unbefristet'}</dd></div>
            <div><dt>Rechte</dt><dd>{[state.profile.is_admin && 'Admin', state.profile.can_view_archive && 'Abiturarchiv'].filter(Boolean).join(', ') || 'Standard'}</dd></div>
          </dl>
          <div className="account-actions">
            {state.profile.is_admin && <button className="primary-button" onClick={() => go('admin')}>Zur Benutzerverwaltung</button>}
            <button className="account-secondary" onClick={() => { void signOut() }}>Abmelden</button>
          </div>
        </>
        : <form onSubmit={submit} noValidate>
          <div className="section-kicker">ANMELDEN</div>
          <h2 id="account-title">Mit Zugangscode anmelden</h2>
          <p className="account-intro">Zugänge vergibt ein Admin. Hast du deinen Code verloren, kann dir ein Admin einen neuen erzeugen.</p>
          {notice && <p className="account-message" role="status">{notice}</p>}
          <label className="account-field">Benutzername
            <input ref={firstFieldRef} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="z. B. lena.k"/>
          </label>
          <label className="account-field">Zugangscode
            <input type="password" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="current-password" spellCheck={false} placeholder="XXXX-XXXX-XXXX-XXXX"/>
          </label>
          {error && <p className="account-message is-error" role="alert">{error}</p>}
          <div className="account-actions">
            <button className="primary-button" type="submit" disabled={busy || state.status === 'loading'}>{busy ? 'Anmelden …' : 'Anmelden'}</button>
          </div>
        </form>}
      <button className="account-privacy text-link" onClick={() => go('datenschutz')}>Datenschutz</button>
    </div>
  </div>
}
