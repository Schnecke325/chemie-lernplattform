/**
 * Statische, von React-Komponenten getrennte Inhaltsverträge.
 * Originalprüfungen bleiben lokale Quellen und gehören nie in den Content-Bundle.
 */
export type Relevance = 'high' | 'medium' | 'supplementary'
export type PublicationStatus = 'draft' | 'review' | 'published'
export type Difficulty = 'basic' | 'standard' | 'transfer'
export type Competency = 'S' | 'E' | 'K' | 'B'
export type CurriculumStatus = 'required' | 'additional' | 'year-specific'
export type ExerciseMode = 'screen' | 'handwriting'
export type ExerciseSource = 'exercise' | 'selfTest'
export type ExerciseTaskType = 'free-response' | 'numeric' | 'single-choice' | 'multiple-choice' | 'matching' | 'structured'
export type Anforderungsbereich = 1 | 2 | 3

export interface CurriculumRef {
  sourceId: string
  fieldId: string
  subsection?: string
  status: CurriculumStatus
}

export interface ExamRef {
  year: number
  term: 'HT' | 'NT'
  proposal: 'A' | 'B' | 'C' | 'D'
  pageStart: number
  pageEnd?: number
  taskLabel?: string
  evidenceRole: 'main-topic' | 'additional-topic' | 'competency'
  sourceAvailability: 'local-only' | 'public-reference'
}

export interface LearningGoal {
  id: string
  statement: string
  competencies: Competency[]
  operators: string[]
}

export interface Exercise {
  id: string
  title: string
  difficulty: Difficulty
  prompt: string
  /** Lesson ownership and list role replace duplicated placement metadata. */
  sourceLessonId: string
  sourceKind: ExerciseSource
  /** Optional until each legacy item has been explicitly classified. */
  taskType?: ExerciseTaskType
  supportedModes?: ExerciseMode[]
  afb?: Anforderungsbereich
  subpart?: string
  hints: string[]
  solution: string
  competencies: Competency[]
  operators: string[]
  sourceExamRefs?: ExamRef[]
}

export interface ExerciseBank {
  schemaVersion: 1
  exercises: Exercise[]
}

export interface LessonContentRecord {
  schemaVersion: 2
  id: string
  title: string
  summary: string
  order: number
  publicationStatus: PublicationStatus
  relevance: {
    label: Relevance
    basis: 'proposal-count-proxy' | 'curriculum-only' | 'cross-cutting'
    kcgoProposalCount?: number
    note: string
  }
  curriculum: CurriculumRef[]
  prerequisites: string[]
  learningGoals: LearningGoal[]
  introduction: string
  explanation: string
  fundamentals: Array<{ term: string; explanation: string }>
  equations: Array<{ id: string; notation: string; explanation: string }>
  equationNote: string
  mechanisms: Array<{ id: string; title: string; steps: string[] }>
  workedExamples: Array<{ id: string; title: string; prompt: string; steps: string[]; result: string }>
  examReferences: ExamRef[]
  typicalTaskTypes: string[]
  exerciseIds: string[]
  tipsAndErrors: Array<{ tip: string; commonError: string }>
  selfTestIds: string[]
  review: { reviewedBy?: string; reviewedOn?: string; sourceCheckedOn?: string }
}

/** Lesson data with its central exercise references resolved for the existing renderer. */
export interface LessonContent extends Omit<LessonContentRecord, 'exerciseIds' | 'selfTestIds'> {
  exerciseIds: string[]
  selfTestIds: string[]
  exercises: Exercise[]
  selfTest: Exercise[]
}

export interface CatalogLessonLink {
  id: string
  title: string
  order: number
  /** Absent while a catalog entry is planned and has no lesson file yet. */
  lessonId?: string
  status?: 'planned'
  relevance: Relevance | 'cross-cutting'
  evidenceField?: string
  proposalCount?: number
  relevanceNote: string
}

export interface CatalogChapter {
  id: string
  title: string
  order: number
  curriculumRefs: string[]
  relevance: Relevance | 'cross-cutting'
  proposalCount?: number
  proposalCounts?: Record<string, number | null>
  children: CatalogLessonLink[]
}

export interface LearningCatalog {
  schemaVersion: 1
  title: string
  chapters: CatalogChapter[]
}
