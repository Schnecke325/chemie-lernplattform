import { createClient, FunctionsHttpError } from '@supabase/supabase-js'

/**
 * Verbindung zu Supabase. URL und Publishable Key sind öffentlich (Zugriffsschutz über
 * Row Level Security) und kommen beim Build aus Umgebungsvariablen, nicht aus dem Quellcode.
 * Dieses Modul wird erst nachgeladen, wenn Konten eingerichtet sind.
 */
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!, {
  auth: { storageKey: 'chemie-lernraum.auth', detectSessionInUrl: false },
})

/** Interne Platzhalter-Domain; muss zu supabase/functions/admin-users passen. Es werden nie E-Mails verschickt. */
const loginDomain = 'chemie-lernraum.invalid'

export const loginEmail = (username: string) => `${username.trim().toLowerCase()}@${loginDomain}`

/** Zugangscodes werden in Viererblöcken angezeigt, aber ohne Trennzeichen und in Großbuchstaben gespeichert. */
export const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** Ruft die Edge Function für die Benutzerverwaltung auf und liefert deren Fehlermeldung als Error. */
export async function callAdminFunction<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('admin-users', { body })
  if (!error) return data as T
  let message = 'Die Aktion ist fehlgeschlagen. Bitte später erneut versuchen.'
  if (error instanceof FunctionsHttpError) {
    try {
      const details = await error.context.json() as { error?: string }
      if (details.error) message = details.error
    } catch {
      // Antwort ohne JSON: allgemeine Meldung behalten
    }
  }
  throw new Error(message)
}
