// Edge Function für die Benutzerverwaltung (Paket K1).
// Anlegen, neuen Zugangscode erzeugen und Entfernen brauchen den geheimen Schlüssel
// und laufen deshalb hier und nicht im Browser. Jede Anfrage muss von einem
// gültigen Admin-Konto kommen; die Plattform prüft zusätzlich das JWT (verify_jwt).
import { createClient } from 'npm:@supabase/supabase-js@2'

/** Interne Platzhalter-Domain; muss zu src/account/client.ts passen. Es werden nie E-Mails verschickt. */
const loginDomain = 'chemie-lernraum.invalid'
const allowedOrigins = ['https://schnecke325.github.io', 'http://localhost:5173', 'http://localhost:4173']
/** Ohne 0/O und 1/I, damit Codes eindeutig abzulesen sind; genau 32 Zeichen = 5 Bit je Zeichen ohne Verzerrung. */
const codeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function secretKey(): string {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>
    if (parsed.default) return parsed.default
  }
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!legacy) throw new Error('Kein geheimer Schlüssel in der Funktionsumgebung')
  return legacy
}

const admin = createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), {
  auth: { persistSession: false, autoRefreshToken: false },
})

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

class RequestError extends Error {
  constructor(message: string, readonly status = 400) { super(message) }
}

function todayBerlin(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date())
}

/** 16 zufällige Zeichen; im Konto ohne Bindestriche gespeichert, angezeigt in Viererblöcken. */
function generateCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => codeAlphabet[byte & 31]).join('')
}
const formatCode = (code: string) => code.match(/.{4}/g)!.join('-')

function usernameBase(name: string): string {
  const parts = name.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter(Boolean)
  if (parts.length === 0) return 'nutzer'
  const base = (parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1][0]}` : parts[0]).slice(0, 30)
  return base.length < 2 ? `nutzer.${base}` : base
}

async function uniqueUsername(name: string): Promise<string> {
  const base = usernameBase(name)
  const { data, error } = await admin.from('profiles').select('username').like('username', `${base}%`)
  if (error) throw error
  const taken = new Set(data.map((row) => row.username))
  if (!taken.has(base)) return base
  for (let n = 2; ; n++) if (!taken.has(`${base}${n}`)) return `${base}${n}`
}

function readValidUntil(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RequestError('Ungültiges Ablaufdatum.')
  if (value < todayBerlin()) throw new RequestError('Das Ablaufdatum liegt in der Vergangenheit.')
  return value
}

function readUserId(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f-]{36}$/.test(value)) throw new RequestError('Ungültige Benutzer-ID.')
  return value
}

/** Prüft, dass die Anfrage von einem gültigen Admin-Konto kommt, und liefert dessen ID. */
async function requireAdmin(req: Request): Promise<string> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) throw new RequestError('Nicht angemeldet.', 401)
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) throw new RequestError('Nicht angemeldet.', 401)
  const { data: profile } = await admin.from('profiles').select('is_admin, valid_until').eq('id', user.id).maybeSingle()
  const active = profile && (profile.valid_until === null || profile.valid_until >= todayBerlin())
  if (!active || !profile.is_admin) throw new RequestError('Keine Admin-Berechtigung.', 403)
  return user.id
}

async function createUser(body: Record<string, unknown>) {
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : ''
  if (displayName.length < 1 || displayName.length > 80) throw new RequestError('Bitte einen Namen mit höchstens 80 Zeichen angeben.')
  const validUntil = readValidUntil(body.validUntil)
  const username = await uniqueUsername(displayName)
  const code = generateCode()
  const { data, error } = await admin.auth.admin.createUser({ email: `${username}@${loginDomain}`, password: code, email_confirm: true })
  if (error || !data.user) throw new Error(`Konto konnte nicht angelegt werden: ${error?.message}`)
  const profile = {
    id: data.user.id,
    username,
    display_name: displayName,
    is_admin: body.isAdmin === true,
    can_view_archive: body.canViewArchive === true,
    valid_until: validUntil,
  }
  const { data: inserted, error: insertError } = await admin.from('profiles').insert(profile).select().single()
  if (insertError) {
    await admin.auth.admin.deleteUser(data.user.id)
    throw new Error(`Profil konnte nicht angelegt werden: ${insertError.message}`)
  }
  return { profile: inserted, code: formatCode(code) }
}

async function resetCode(body: Record<string, unknown>) {
  const userId = readUserId(body.userId)
  const code = generateCode()
  const { error } = await admin.auth.admin.updateUserById(userId, { password: code })
  if (error) throw new Error(`Neuer Code konnte nicht gesetzt werden: ${error.message}`)
  return { code: formatCode(code) }
}

async function deleteUser(body: Record<string, unknown>, callerId: string) {
  const userId = readUserId(body.userId)
  if (userId === callerId) throw new RequestError('Das eigene Konto kann nicht entfernt werden.')
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new RequestError('Konto konnte nicht entfernt werden. Mindestens ein gültiges Admin-Konto muss bestehen bleiben.')
  return { ok: true }
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get('Origin'))
  if (req.method === 'OPTIONS') return new Response(null, { headers })
  const reply = (body: unknown, status = 200) => Response.json(body, { status, headers })
  try {
    if (req.method !== 'POST') throw new RequestError('Nur POST ist erlaubt.', 405)
    const callerId = await requireAdmin(req)
    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    switch (body.action) {
      case 'create': return reply(await createUser(body))
      case 'reset-code': return reply(await resetCode(body))
      case 'delete': return reply(await deleteUser(body, callerId))
      default: throw new RequestError('Unbekannte Aktion.')
    }
  } catch (error) {
    if (error instanceof RequestError) return reply({ error: error.message }, error.status)
    console.error(error)
    return reply({ error: 'Interner Fehler. Bitte später erneut versuchen.' }, 500)
  }
})
