import type { Anforderungsbereich, CatalogChapter, Exercise } from '../content/types'
import type { PracticeRecord, PracticeRecords } from '../practice/storage'

/**
 * Lernstand aus dem jeweils letzten Ergebnis jeder Aufgabe (Konzept vom 02.11.2026):
 * sicher, teilweise, noch nicht oder offen – keine Punkte, keine Prozentwerte.
 */
export type TaskState = 'secure' | 'partial' | 'missing' | 'open'

export const taskStateLabels: Record<TaskState, string> = { secure: 'sicher', partial: 'teilweise', missing: 'noch nicht', open: 'offen' }

/** Richtig gelöste Aufgaben kommen nach so vielen Tagen wieder auf die Wiederholungsliste. */
export const repeatAfterDays = 21
const dayMs = 86_400_000

export function taskState(record: PracticeRecord | undefined): TaskState {
  if (!record) return 'open'
  return record.result === 'correct' ? 'secure' : record.result === 'partial' ? 'partial' : 'missing'
}

export interface StateCounts { secure: number; partial: number; missing: number; open: number; total: number }

const emptyCounts = (): StateCounts => ({ secure: 0, partial: 0, missing: 0, open: 0, total: 0 })

function add(counts: StateCounts, state: TaskState) {
  counts[state] += 1
  counts.total += 1
}

export interface LessonProgress { id: string; title: string; counts: StateCounts }
export interface ChapterProgress { id: string; title: string; counts: StateCounts; lessons: LessonProgress[] }

export interface RepetitionItem {
  exercise: Exercise
  lessonTitle: string
  state: Exclude<TaskState, 'open'>
  updatedAt: string
  /** Grund für die Aufnahme in die Liste */
  reason: 'missing' | 'partial' | 'old'
}

export interface Progress {
  overall: StateCounts
  byAfb: Record<Anforderungsbereich, StateCounts>
  chapters: ChapterProgress[]
  repetition: RepetitionItem[]
  /** Erste Aufgabe einer Lernseite mit offenen Aufgaben, in Katalogreihenfolge */
  nextOpen: { exercise: Exercise; lessonTitle: string } | null
  lastActive: string | null
  /** Aufgaben, deren letztes Ergebnis aus den vergangenen sieben Tagen stammt */
  thisWeek: number
}

export function buildProgress(chapters: CatalogChapter[], exercises: Exercise[], records: PracticeRecords, now = Date.now()): Progress {
  const byLesson = new Map<string, Exercise[]>()
  for (const exercise of exercises) {
    const list = byLesson.get(exercise.sourceLessonId) ?? []
    list.push(exercise)
    byLesson.set(exercise.sourceLessonId, list)
  }

  const overall = emptyCounts()
  const byAfb: Record<Anforderungsbereich, StateCounts> = { 1: emptyCounts(), 2: emptyCounts(), 3: emptyCounts() }
  const repetition: RepetitionItem[] = []
  let nextOpen: Progress['nextOpen'] = null
  let lastActive: string | null = null
  let thisWeek = 0

  const chapterProgress = [...chapters].sort((a, b) => a.order - b.order).map((chapter) => {
    const chapterCounts = emptyCounts()
    const lessons = [...chapter.children].sort((a, b) => a.order - b.order).flatMap((child) => {
      const lessonExercises = child.lessonId ? byLesson.get(child.lessonId) ?? [] : []
      if (lessonExercises.length === 0) return []
      const counts = emptyCounts()
      for (const exercise of lessonExercises) {
        const record = records[exercise.id]
        const state = taskState(record)
        add(counts, state)
        add(chapterCounts, state)
        add(overall, state)
        if (exercise.afb) add(byAfb[exercise.afb], state)
        if (state === 'open') {
          nextOpen ??= { exercise, lessonTitle: child.title }
          continue
        }
        const updatedAt = record!.updatedAt
        if (!lastActive || updatedAt > lastActive) lastActive = updatedAt
        const age = now - Date.parse(updatedAt)
        if (age <= 7 * dayMs) thisWeek += 1
        if (state !== 'secure' || age > repeatAfterDays * dayMs) {
          repetition.push({ exercise, lessonTitle: child.title, state, updatedAt, reason: state === 'secure' ? 'old' : state })
        }
      }
      return [{ id: child.lessonId!, title: child.title, counts }]
    })
    return { id: chapter.id, title: chapter.title, counts: chapterCounts, lessons }
  })

  // Zuerst „noch nicht“, dann „teilweise“, dann lange zurückliegende; jeweils die älteste zuerst.
  const rank = { missing: 0, partial: 1, old: 2 }
  repetition.sort((a, b) => rank[a.reason] - rank[b.reason] || Date.parse(a.updatedAt) - Date.parse(b.updatedAt))

  return { overall, byAfb, chapters: chapterProgress, repetition, nextOpen, lastActive, thisWeek }
}
