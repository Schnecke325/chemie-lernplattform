import type { NumericAnswerPart } from '../content/types'
import type { PracticeResult } from './storage'

const defaultRelativeTolerance = 0.02

/** Liest Zahlen in deutscher oder englischer Schreibweise, auch mit Zehnerpotenz (6,2·10^-4). */
export function parseNumber(input: string): number | null {
  const normalized = input.trim()
    .replace(/\s+/g, '')
    .replace(/[−–]/g, '-')
    .replace(/(?:·|\*|×|x)10\^?/i, 'e')
    .replace(',', '.')
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(normalized)) return null
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

export function isWithinTolerance(part: NumericAnswerPart, value: number): boolean {
  const deviation = Math.abs(value - part.value)
  if (part.tolerance?.absolute !== undefined) return deviation <= part.tolerance.absolute + 1e-9
  const relative = part.tolerance?.relative ?? defaultRelativeTolerance
  return deviation <= relative * Math.abs(part.value) + 1e-12
}

export function combineResults(correct: number, total: number): PracticeResult {
  if (correct === total) return 'correct'
  return correct === 0 ? 'incorrect' : 'partial'
}
