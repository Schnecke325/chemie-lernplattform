/** Zeile aus public.profiles (siehe supabase/migrations). */
export interface Profile {
  id: string
  username: string
  display_name: string
  is_admin: boolean
  can_view_archive: boolean
  /** Letzter gültiger Tag als YYYY-MM-DD; null = unbefristet */
  valid_until: string | null
  created_at: string
}

/** Heutiges Datum in deutscher Zeit als YYYY-MM-DD, passend zur Prüfung in der Datenbank. */
export function todayBerlin(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date())
}

export const isProfileActive = (profile: Profile) => profile.valid_until === null || profile.valid_until >= todayBerlin()

/** YYYY-MM-DD → TT.MM.JJJJ */
export function formatDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}
