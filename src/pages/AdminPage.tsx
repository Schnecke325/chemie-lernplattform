import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAccount, useAdminProfile } from '../account/AccountContext'
import { callAdminFunction, supabase } from '../account/client'
import { formatDate, isProfileActive, todayBerlin, type Profile } from '../account/profile'
import { AdminProgress } from './AdminProgress'
import { ActivityStatus, DeviceInfo, useAdminActivity } from './AdminActivity'
import './AdminPage.css'

/** Benutzerverwaltung: Konten anlegen, Rechte und Ablaufdatum setzen, Codes erneuern, Konten entfernen. */
export default function AdminPage() {
  const admin = useAdminProfile()
  const { refreshProfile } = useAccount()
  if (!admin) return <div className="admin-page">
    <div className="eyebrow"><span className="eyebrow-line"/> VERWALTUNG</div>
    <section className="admin-panel"><h1>Benutzerverwaltung</h1><p className="admin-muted">Dieser Bereich ist nur für angemeldete Admins.</p></section>
  </div>
  return <UserAdmin self={admin} onSelfChanged={refreshProfile}/>
}

interface UserValues { display_name: string; valid_until: string | null; is_admin: boolean; can_view_archive: boolean }
interface IssuedCode { name: string; username: string; code: string }

function UserAdmin({ self, onSelfChanged }: { self: Profile; onSelfChanged: () => Promise<void> }) {
  const [users, setUsers] = useState<Profile[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [issued, setIssued] = useState<IssuedCode | null>(null)
  const [tab, setTab] = useState<'users' | 'progress'>('users')
  const { activity, reloadActivity } = useAdminActivity()

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase.from('profiles').select('*').order('display_name')
    if (loadError) setError('Die Benutzerliste konnte nicht geladen werden.')
    else setUsers(data as Profile[])
  }, [])

  useEffect(() => { void load() }, [load])

  const create = async (values: UserValues) => {
    try {
      const result = await callAdminFunction<{ profile: Profile; code: string }>({
        action: 'create', displayName: values.display_name, validUntil: values.valid_until, isAdmin: values.is_admin, canViewArchive: values.can_view_archive,
      })
      setCreating(false)
      setIssued({ name: result.profile.display_name, username: result.profile.username, code: result.code })
      await load()
      return null
    } catch (createError) {
      return (createError as Error).message
    }
  }

  const update = async (user: Profile, values: UserValues) => {
    const { error: updateError } = await supabase.from('profiles').update(values).eq('id', user.id)
    if (updateError) return updateError.message.includes('Admin-Konto') ? 'Mindestens ein gültiges Admin-Konto muss bestehen bleiben.' : 'Die Änderung konnte nicht gespeichert werden.'
    setEditingId(null)
    await load()
    if (user.id === self.id) await onSelfChanged()
    return null
  }

  const resetCode = async (user: Profile) => {
    if (!window.confirm(`Neuen Zugangscode für ${user.display_name} erzeugen? Der bisherige Code wird ungültig.`)) return
    setBusyId(user.id)
    setError(null)
    try {
      const result = await callAdminFunction<{ code: string }>({ action: 'reset-code', userId: user.id })
      setIssued({ name: user.display_name, username: user.username, code: result.code })
    } catch (resetError) {
      setError((resetError as Error).message)
    }
    setBusyId(null)
  }

  const remove = async (user: Profile) => {
    if (!window.confirm(`${user.display_name} (${user.username}) mit allen Daten endgültig entfernen?`)) return
    setBusyId(user.id)
    setError(null)
    try {
      await callAdminFunction({ action: 'delete', userId: user.id })
      await load()
    } catch (removeError) {
      setError((removeError as Error).message)
    }
    setBusyId(null)
  }

  return <div className="admin-page">
    <div className="eyebrow"><span className="eyebrow-line"/> VERWALTUNG</div>
    <div className="admin-heading">
      <div><h1>Benutzerverwaltung</h1><p className="admin-muted">Zugänge vergeben, Rechte festlegen und Konten entfernen. Abgelaufene Konten werden am Folgetag automatisch mit allen Daten gelöscht.</p></div>
      {!creating && tab === 'users' && <button className="primary-button" onClick={() => { setCreating(true); setIssued(null) }}>Benutzer anlegen</button>}
    </div>

    <div className="admin-tabs" role="tablist" aria-label="Bereiche der Benutzerverwaltung">
      <button role="tab" aria-selected={tab === 'users'} className={tab === 'users' ? 'is-active' : ''} onClick={() => setTab('users')}>Benutzer</button>
      <button role="tab" aria-selected={tab === 'progress'} className={tab === 'progress' ? 'is-active' : ''} onClick={() => { setTab('progress'); setCreating(false); setIssued(null) }}>Lernstand</button>
    </div>

    {tab === 'progress' ? <AdminProgress users={users ?? []}/> : <>
    {issued && <section className="admin-code" aria-live="polite">
      <div className="section-kicker">ZUGANGSDATEN · NUR JETZT SICHTBAR</div>
      <h2>{issued.name}</h2>
      <dl>
        <div><dt>Benutzername</dt><dd>{issued.username}</dd></div>
        <div><dt>Zugangscode</dt><dd className="admin-code-value">{issued.code}</dd></div>
      </dl>
      <p className="admin-muted">Der Code wird nur einmal angezeigt und ist danach nicht mehr abrufbar. Gib ihn persönlich oder über einen sicheren Weg weiter.</p>
      <div className="admin-actions">
        <CopyButton text={`Benutzername: ${issued.username}\nZugangscode: ${issued.code}`}/>
        <button className="account-secondary" onClick={() => setIssued(null)}>Fertig</button>
      </div>
    </section>}

    {creating && <section className="admin-panel">
      <h2>Neuer Benutzer</h2>
      <UserForm initial={{ display_name: '', valid_until: null, is_admin: false, can_view_archive: false }} submitLabel="Anlegen und Code erzeugen" onSubmit={create} onCancel={() => setCreating(false)}/>
    </section>}

    {error && <p className="account-message is-error" role="alert">{error}</p>}

    <section className="admin-list" aria-label="Benutzer">
      {users === null && !error && <p className="admin-muted">Benutzer werden geladen …</p>}
      {users?.map((user) => <article key={user.id} className="admin-user">
        {editingId === user.id
          ? <UserForm initial={user} submitLabel="Speichern" onSubmit={(values) => update(user, values)} onCancel={() => setEditingId(null)}/>
          : <>
            <div className="admin-user-name">
              <strong>{user.display_name}{user.id === self.id && <span className="admin-self"> (du)</span>}</strong>
              <span>{user.username}</span>
              <ActivityStatus activity={activity?.get(user.id)}/>
            </div>
            <Validity user={user}/>
            <div className="admin-rights">
              {user.is_admin && <span className="admin-badge is-admin">Admin</span>}
              {user.can_view_archive && <span className="admin-badge">Abiturarchiv</span>}
              {!user.is_admin && !user.can_view_archive && <span className="admin-muted">Standard</span>}
            </div>
            <div className="admin-actions">
              <button className="admin-action" disabled={busyId !== null} onClick={() => setEditingId(user.id)}>Bearbeiten</button>
              <button className="admin-action" disabled={busyId !== null} onClick={() => { void resetCode(user) }}>Neuer Code</button>
              <button className="admin-action is-danger" disabled={busyId !== null || user.id === self.id} title={user.id === self.id ? 'Das eigene Konto kann nicht entfernt werden.' : undefined} onClick={() => { void remove(user) }}>Entfernen</button>
            </div>
            <DeviceInfo userId={user.id} isAdmin={user.is_admin} activity={activity?.get(user.id)} onChanged={() => { void reloadActivity() }}/>
          </>}
      </article>)}
    </section>

    </>}
  </div>
}

function Validity({ user }: { user: Profile }) {
  if (!user.valid_until) return <div className="admin-validity">unbefristet</div>
  if (!isProfileActive(user)) return <div className="admin-validity is-expired">abgelaufen · wird gelöscht</div>
  const daysLeft = Math.round((Date.parse(user.valid_until) - Date.parse(todayBerlin())) / 86_400_000)
  return <div className={`admin-validity ${daysLeft <= 14 ? 'is-soon' : ''}`}>bis {formatDate(user.valid_until)}</div>
}

function UserForm({ initial, submitLabel, onSubmit, onCancel }: { initial: UserValues; submitLabel: string; onSubmit: (values: UserValues) => Promise<string | null>; onCancel: () => void }) {
  const [name, setName] = useState(initial.display_name)
  const [validUntil, setValidUntil] = useState(initial.valid_until ?? '')
  const [isAdmin, setIsAdmin] = useState(initial.is_admin)
  const [canViewArchive, setCanViewArchive] = useState(initial.can_view_archive)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const today = todayBerlin()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 80) { setError('Bitte einen Namen mit höchstens 80 Zeichen angeben.'); return }
    if (validUntil && validUntil < today && validUntil !== initial.valid_until) { setError('Das Ablaufdatum darf nicht in der Vergangenheit liegen.'); return }
    setBusy(true)
    setError(await onSubmit({ display_name: trimmed, valid_until: validUntil || null, is_admin: isAdmin, can_view_archive: canViewArchive }))
    setBusy(false)
  }

  return <form className="admin-form" onSubmit={submit} noValidate>
    <label className="account-field">Name
      <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} placeholder="z. B. Lena Krüger" autoFocus/>
    </label>
    <label className="account-field">Zugang gültig bis (leer = unbefristet)
      <input type="date" value={validUntil} min={today} onChange={(event) => setValidUntil(event.target.value)}/>
    </label>
    <label className="admin-check"><input type="checkbox" checked={canViewArchive} onChange={(event) => setCanViewArchive(event.target.checked)}/> darf das Abiturarchiv sehen</label>
    <label className="admin-check"><input type="checkbox" checked={isAdmin} onChange={(event) => setIsAdmin(event.target.checked)}/> ist Admin (darf Benutzer verwalten)</label>
    {error && <p className="account-message is-error" role="alert">{error}</p>}
    <div className="admin-actions">
      <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Bitte warten …' : submitLabel}</button>
      <button className="account-secondary" type="button" onClick={onCancel}>Abbrechen</button>
    </div>
  </form>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      window.prompt('Zum Kopieren markieren:', text)
    }
  }
  return <button className="primary-button" onClick={() => { void copy() }}>{copied ? 'Kopiert' : 'Kopieren'}</button>
}
