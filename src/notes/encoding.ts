import type { Stroke } from '../components/HandwritingPad'

/**
 * Kompaktes Speicherformat für Handschrift: Koordinaten auf eine Nachkommastelle, Druckfaktor
 * auf zwei gerundet, Punkte je Strich als flache Zahlenliste. Version 1:
 * {"v":1,"s":[["#e9edf1",2.5,[x0,y0,f0,x1,y1,f1,…]],…]}
 */
const round = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits

export function encodeStrokes(strokes: Stroke[]): string | null {
  if (strokes.length === 0) return null
  return JSON.stringify({
    v: 1,
    s: strokes.map((stroke) => [stroke.color, stroke.width, stroke.points.flatMap(([x, y, f]) => [round(x, 1), round(y, 1), round(f, 2)])]),
  })
}

export function decodeStrokes(raw: string | null | undefined): Stroke[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as { v?: number; s?: unknown }
    if (parsed.v !== 1 || !Array.isArray(parsed.s)) return []
    return parsed.s.flatMap((entry): Stroke[] => {
      if (!Array.isArray(entry) || typeof entry[0] !== 'string' || typeof entry[1] !== 'number' || !Array.isArray(entry[2])) return []
      const flat = entry[2] as number[]
      const points: Stroke['points'] = []
      for (let index = 0; index + 2 < flat.length; index += 3) points.push([flat[index], flat[index + 1], flat[index + 2]])
      return points.length > 0 ? [{ color: entry[0], width: entry[1], points }] : []
    })
  } catch {
    return []
  }
}

/** Obergrenze der Datenbank (beide Schreibflächen zusammen) mit etwas Abstand. */
export const maxEncodedBytes = 1_900_000
export const encodedSize = (value: string | null) => (value ? new Blob([value]).size : 0)
