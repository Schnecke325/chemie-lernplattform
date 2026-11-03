/**
 * Lokale Ablage von Bearbeitungsergebnissen. Ohne Konto bleiben die Daten ausschließlich
 * im Browser dieses Geräts; mit Konto dient die Ablage als Zwischenspeicher je Konto und
 * wird beim Abmelden gelöscht. Eigene Antworttexte werden bewusst nicht gespeichert.
 */
export type PracticeResult = 'correct' | 'partial' | 'incorrect'

export interface PracticeRecord {
  result: PracticeResult
  checkedBy: 'auto' | 'self'
  updatedAt: string
}

export type PracticeRecords = Record<string, PracticeRecord>

/** Ergebnisse ohne Konto (bisheriger Schlüssel) */
export const deviceStorageKey = 'chemie-lernraum.practice.v1'
const accountKeyPrefix = `${deviceStorageKey}.`
/** Zwischenspeicher der Ergebnisse eines Kontos */
export const accountStorageKey = (userId: string) => `${accountKeyPrefix}${userId}`

const results = new Set<PracticeResult>(['correct', 'partial', 'incorrect'])

export function isPracticeRecord(value: unknown): value is PracticeRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return results.has(record.result as PracticeResult)
    && (record.checkedBy === 'auto' || record.checkedBy === 'self')
    && typeof record.updatedAt === 'string'
}

export function loadPracticeRecords(key = deviceStorageKey): PracticeRecords {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isPracticeRecord(value))) as PracticeRecords
  } catch {
    return {}
  }
}

export function savePracticeRecords(records: PracticeRecords, key = deviceStorageKey) {
  try {
    window.localStorage.setItem(key, JSON.stringify(records))
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus): Ergebnisse gelten dann nur für diese Sitzung.
  }
}

export function clearPracticeRecords(key = deviceStorageKey) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // siehe savePracticeRecords
  }
}

/** Entfernt die Zwischenspeicher aller Konten, z. B. beim Abmelden auf einem geteilten Gerät. */
export function clearAccountCaches() {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(accountKeyPrefix)) window.localStorage.removeItem(key)
    }
  } catch {
    // siehe savePracticeRecords
  }
}

const isNewer = (candidate: PracticeRecord, current: PracticeRecord | undefined) =>
  !current || Date.parse(candidate.updatedAt) > Date.parse(current.updatedAt)

/** Führt zwei Bestände zusammen; je Aufgabe gewinnt das neuere Ergebnis. */
export function mergePracticeRecords(base: PracticeRecords, incoming: PracticeRecords): PracticeRecords {
  const merged = { ...base }
  for (const [id, record] of Object.entries(incoming)) {
    if (isNewer(record, merged[id])) merged[id] = record
  }
  return merged
}

/** Einträge aus `local`, die in `remote` fehlen oder dort älter sind. */
export function newerThan(local: PracticeRecords, remote: PracticeRecords): PracticeRecords {
  return Object.fromEntries(Object.entries(local).filter(([id, record]) => isNewer(record, remote[id])))
}
