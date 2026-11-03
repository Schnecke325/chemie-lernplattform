import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { clearAccountCaches } from '../practice/storage'
import { isProfileActive, type Profile } from './profile'

/** Konten sind nur aktiv, wenn beim Build eine Supabase-Konfiguration vorlag. */
export const accountsEnabled = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export type AccountState =
  | { status: 'disabled' | 'loading' | 'signed-out' }
  | { status: 'signed-in'; profile: Profile }

interface AccountValue {
  state: AccountState
  /** Hinweis für das Anmeldefenster, z. B. abgelaufener Zugang */
  notice: string | null
  signIn: (username: string, code: string) => Promise<string | null>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AccountContext = createContext<AccountValue | null>(null)

// Die Supabase-Bibliothek wird erst nach dem ersten Rendern nachgeladen.
const loadClient = () => import('./client')

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>({ status: accountsEnabled ? 'loading' : 'disabled' })
  const [notice, setNotice] = useState<string | null>(null)
  const userIdRef = useRef<string | null>(null)

  const loadProfile = useCallback(async (userId: string | null) => {
    userIdRef.current = userId
    if (!userId) { setState({ status: 'signed-out' }); return }
    const { supabase } = await loadClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle<Profile>()
    if (userIdRef.current !== userId) return
    if (error) {
      setNotice('Das Konto konnte nicht geladen werden. Bitte die Seite später neu laden.')
      setState({ status: 'signed-out' })
      return
    }
    if (!data || !isProfileActive(data)) {
      setNotice(data ? 'Dein Zugang ist abgelaufen. Wende dich an einen Admin.' : 'Zu diesem Zugang gibt es kein Konto mehr.')
      await supabase.auth.signOut({ scope: 'local' })
      return
    }
    setState({ status: 'signed-in', profile: data })
  }, [])

  useEffect(() => {
    if (!accountsEnabled) return
    let unsubscribe: (() => void) | undefined
    let cancelled = false
    loadClient().then(({ supabase }) => {
      if (cancelled) return
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        // Keine Supabase-Aufrufe direkt im Callback (Sperre im Auth-Client), daher entkoppelt.
        if (event === 'SIGNED_OUT') {
          // Zwischengespeicherte Ergebnisse nicht auf (womöglich geteilten) Geräten zurücklassen
          clearAccountCaches()
          userIdRef.current = null
          setState({ status: 'signed-out' })
          return
        }
        if (event === 'TOKEN_REFRESHED' && session?.user.id === userIdRef.current) return
        setTimeout(() => { void loadProfile(session?.user.id ?? null) }, 0)
      })
      unsubscribe = () => data.subscription.unsubscribe()
    }).catch(() => setState({ status: 'signed-out' }))
    return () => { cancelled = true; unsubscribe?.() }
  }, [loadProfile])

  const signIn = useCallback(async (username: string, code: string) => {
    const { supabase, loginEmail, normalizeCode } = await loadClient()
    setNotice(null)
    const email = loginEmail(username)
    // Zuerst wie eingegeben (von Hand gesetzte Passwörter, z. B. beim ersten Admin), dann als erzeugter Code normalisiert.
    const typed = code.trim()
    let { error } = await supabase.auth.signInWithPassword({ email, password: typed })
    if (error?.status === 400 && normalizeCode(typed) !== typed) {
      ({ error } = await supabase.auth.signInWithPassword({ email, password: normalizeCode(typed) }))
    }
    if (!error) return null
    if (error.status === 429) return 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.'
    if (error.status === 400) return 'Benutzername oder Zugangscode ist falsch.'
    return 'Die Anmeldung ist fehlgeschlagen. Bitte später erneut versuchen.'
  }, [])

  const signOut = useCallback(async () => {
    const { supabase } = await loadClient()
    setNotice(null)
    await supabase.auth.signOut({ scope: 'local' })
  }, [])

  const refreshProfile = useCallback(() => loadProfile(userIdRef.current), [loadProfile])

  const value = useMemo(() => ({ state, notice, signIn, signOut, refreshProfile }), [state, notice, signIn, signOut, refreshProfile])
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount(): AccountValue {
  const value = useContext(AccountContext)
  if (!value) throw new Error('useAccount außerhalb von AccountProvider')
  return value
}

/** Profil eines angemeldeten, gültigen Admin-Kontos, sonst null. */
export function useAdminProfile(): Profile | null {
  const { state } = useAccount()
  return state.status === 'signed-in' && state.profile.is_admin ? state.profile : null
}

/** Darf das Abiturarchiv samt Prüfungsbezügen sehen? Ohne eingerichtete Konten (lokal) ja. */
export function useCanViewArchive(): boolean {
  const { state } = useAccount()
  if (!accountsEnabled) return true
  return state.status === 'signed-in' && state.profile.can_view_archive
}
