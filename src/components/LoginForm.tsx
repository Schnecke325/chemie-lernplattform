import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAccount } from '../account/AccountContext'
import './AccountDialog.css'

/** Anmeldung mit Benutzername und Zugangscode. */
export function LoginForm() {
  const { state, notice, signIn } = useAccount()
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstFieldRef.current?.focus() }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!username.trim() || !code.trim()) { setError('Bitte Benutzername und Zugangscode eingeben.'); return }
    setBusy(true)
    setError(await signIn(username, code))
    setBusy(false)
  }

  return <form onSubmit={submit} noValidate>
    <div className="section-kicker">ANMELDEN</div>
    <h2 id="login-title">Mit Zugangscode anmelden</h2>
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
  </form>
}
