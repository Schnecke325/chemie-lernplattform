export type PageId = 'dashboard' | 'lernen' | 'uebungen' | 'abiturarchiv' | 'fortschritt' | 'admin' | 'datenschutz'

/** Ziel beim Sprung in den Übungsbereich: eine Aufgabe oder ein Kapitel bzw. eine Lernseite */
export type ExerciseFocus = { exerciseId: string } | { chapterId: string; lessonId?: string }

export interface NavigationItem {
  id: PageId
  label: string
  icon: string
}
