/**
 * Lokale Ablage von Bearbeitungsergebnissen. Die Daten bleiben ausschließlich im
 * Browser dieses Geräts; eigene Antworttexte werden bewusst nicht gespeichert.
 */
export type PracticeResult = 'correct' | 'partial' | 'incorrect'

export interface PracticeRecord {
  result: PracticeResult
  checkedBy: 'auto' | 'self'
  updatedAt: string
}

export type PracticeRecords = Record<string, PracticeRecord>

const storageKey = 'chemie-lernraum.practice.v1'
const results = new Set<PracticeResult>(['correct', 'partial', 'incorrect'])

function isRecord(value: unknown): value is PracticeRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return results.has(record.result as PracticeResult)
    && (record.checkedBy === 'auto' || record.checkedBy === 'self')
    && typeof record.updatedAt === 'string'
}

export function loadPracticeRecords(): PracticeRecords {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isRecord(value))) as PracticeRecords
  } catch {
    return {}
  }
}

export function savePracticeRecords(records: PracticeRecords) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records))
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus): Ergebnisse gelten dann nur für diese Sitzung.
  }
}

export function clearPracticeRecords() {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    // siehe savePracticeRecords
  }
}
