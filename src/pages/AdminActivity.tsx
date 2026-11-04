import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../account/client'
import { formatDate } from '../account/profile'

/** Aktivität und Geräte je Konto für die Benutzerverwaltung (Datenbankfunktionen aus 20261104180000_devices_activity.sql). */
export interface Activity { lastSeenAt: string | null; everSignedIn: boolean; devices: number; logins7d: number }
interface Device { sessionId: string; userAgent: string | null; signedInAt: string; lastUsedAt: string; allowed: boolean }

const onlineWindow = 3 * 60_000
const refreshEvery = 60_000

export function useAdminActivity() {
  const [activity, setActivity] = useState<Map<string, Activity> | null>(null)
  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('admin_activity')
    if (error) return
    setActivity(new Map((data as Array<{ user_id: string; last_seen_at: string | null; ever_signed_in: boolean; devices: number; logins_7d: number }>)
      .map((row) => [row.user_id, { lastSeenAt: row.last_seen_at, everSignedIn: row.ever_signed_in, devices: row.devices, logins7d: row.logins_7d }])))
  }, [])
  useEffect(() => {
    void load()
    const timer = window.setInterval(() => { void load() }, refreshEvery)
    return () => window.clearInterval(timer)
  }, [load])
  return { activity, reloadActivity: load }
}

function relative(iso: string): string {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60_000)
  if (minutes < 1) return 'gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  if (minutes < 24 * 60) return `vor ${Math.round(minutes / 60)} Std.`
  return `am ${formatDate(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' }))}`
}

/** Grün online, grau offline, orange noch nie angemeldet. */
export function ActivityStatus({ activity }: { activity?: Activity }) {
  if (!activity) return null
  if (!activity.everSignedIn && !activity.lastSeenAt) return <span className="activity-status is-never"><span className="activity-dot"/>noch nie angemeldet</span>
  const online = activity.lastSeenAt !== null && Date.now() - Date.parse(activity.lastSeenAt) < onlineWindow
  if (online) return <span className="activity-status is-online"><span className="activity-dot"/>online</span>
  return <span className="activity-status is-offline"><span className="activity-dot"/>offline{activity.lastSeenAt && ` · zuletzt ${relative(activity.lastSeenAt)}`}</span>
}

/** Grobe Gerätebeschreibung aus der Browser-Kennung, z. B. „Chrome auf Windows“. */
export function describeAgent(agent: string | null): string {
  if (!agent) return 'Unbekanntes Gerät'
  const browser = /Edg\//.test(agent) ? 'Edge' : /OPR\//.test(agent) ? 'Opera' : /Firefox\//.test(agent) ? 'Firefox'
    : /Chrome\//.test(agent) ? 'Chrome' : /Safari\//.test(agent) ? 'Safari' : 'Browser'
  const system = /iPhone/.test(agent) ? 'iPhone' : /iPad/.test(agent) ? 'iPad' : /Android/.test(agent) ? 'Android'
    : /Windows/.test(agent) ? 'Windows' : /Mac OS X/.test(agent) ? 'macOS' : /Linux/.test(agent) ? 'Linux' : 'unbekanntem System'
  return `${browser} auf ${system}`
}

/** Kurzinfo zu den Geräten eines Kontos; aufklappbar mit Liste und „Alle Geräte abmelden“. */
export function DeviceInfo({ userId, isAdmin, activity, onChanged }: { userId: string; isAdmin: boolean; activity?: Activity; onChanged: () => void }) {
  const [open, setOpen] = useState(false)
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!activity) return null

  const load = async () => {
    setError(null)
    const { data, error: loadError } = await supabase.rpc('admin_user_devices', { p_user_id: userId })
    if (loadError) { setError('Die Geräte konnten nicht geladen werden.'); return }
    setDevices((data as Array<{ session_id: string; user_agent: string | null; signed_in_at: string; last_used_at: string; allowed: boolean }>)
      .map((row) => ({ sessionId: row.session_id, userAgent: row.user_agent, signedInAt: row.signed_in_at, lastUsedAt: row.last_used_at, allowed: row.allowed })))
  }

  const signOutAll = async () => {
    if (!window.confirm('Alle Geräte dieses Kontos abmelden? Die Person muss sich danach neu anmelden.')) return
    const { error: signOutError } = await supabase.rpc('admin_sign_out_all', { p_user_id: userId })
    if (signOutError) { setError('Die Geräte konnten nicht abgemeldet werden.'); return }
    await load()
    onChanged()
  }

  return <div className="device-info">
    <button type="button" className="device-toggle" aria-expanded={open} onClick={() => { setOpen(!open); if (!open) void load() }}>
      Geräte: {activity.devices}{isAdmin ? ' (ohne Limit)' : ' / 3'} · {activity.logins7d} {activity.logins7d === 1 ? 'Anmeldung' : 'Anmeldungen'} in 7 Tagen
    </button>
    {open && <div className="device-panel">
      {error && <p className="account-message is-error">{error}</p>}
      {!devices && !error && <p className="admin-muted">Geräte werden geladen …</p>}
      {devices?.length === 0 && <p className="admin-muted">Kein Gerät angemeldet.</p>}
      {devices && devices.length > 0 && <ul>
        {devices.map((device) => <li key={device.sessionId} className={device.allowed ? '' : 'is-blocked'}>
          <strong>{describeAgent(device.userAgent)}</strong>
          <span>angemeldet {relative(device.signedInAt)} · zuletzt verlängert {relative(device.lastUsedAt)}{!device.allowed && ' · verdrängt, ohne Zugriff'}</span>
        </li>)}
      </ul>}
      {devices && devices.length > 0 && <button type="button" className="admin-action is-danger" onClick={() => { void signOutAll() }}>Alle Geräte abmelden</button>}
    </div>}
  </div>
}
