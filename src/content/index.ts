import catalogData from './catalog.json'
import type {
  CatalogChapter,
  CatalogLessonLink,
  Exercise,
  ExerciseBank,
  LearningCatalog,
  LessonContent,
  LessonContentRecord,
  Relevance,
} from './types'

const lessonModules = import.meta.glob<LessonContentRecord>('./lessons/*.json', { import: 'default' })
const loadExerciseBank = () => import('./exercises.json').then((module) => module.default as ExerciseBank)

const relevanceValues = new Set<Relevance | 'cross-cutting'>(['high', 'medium', 'supplementary', 'cross-cutting'])
const taskTypes = new Set(['free-response', 'numeric', 'single-choice', 'multiple-choice', 'matching', 'structured'])
const competencies = new Set(['S', 'E', 'K', 'B'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function hasStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isLessonLink(value: unknown): value is CatalogLessonLink {
  if (!isRecord(value)) return false
  return typeof value.id === 'string' && typeof value.title === 'string' && typeof value.order === 'number'
    && (value.lessonId === undefined || typeof value.lessonId === 'string')
    && (value.status === undefined || value.status === 'planned')
    && !(value.status === 'planned' && value.lessonId !== undefined)
    && relevanceValues.has(value.relevance as Relevance | 'cross-cutting')
    && typeof value.relevanceNote === 'string'
    && (value.proposalCount === undefined || typeof value.proposalCount === 'number')
}

function isChapter(value: unknown): value is CatalogChapter {
  if (!isRecord(value)) return false
  return typeof value.id === 'string' && typeof value.title === 'string' && typeof value.order === 'number'
    && hasStrings(value.curriculumRefs)
    && relevanceValues.has(value.relevance as Relevance | 'cross-cutting')
    && Array.isArray(value.children) && value.children.every(isLessonLink)
}

function isLearningCatalog(value: unknown): value is LearningCatalog {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.title !== 'string'
    || !Array.isArray(value.chapters) || !value.chapters.every(isChapter)) return false
  const ids = value.chapters.flatMap((chapter) => [chapter.id, ...chapter.children.map((child) => child.id)])
  return ids.every((id, index) => ids.indexOf(id) === index)
}

function isExercise(value: unknown): value is Exercise {
  if (!isRecord(value)) return false
  return typeof value.id === 'string' && typeof value.title === 'string'
    && ['basic', 'standard', 'transfer'].includes(String(value.difficulty))
    && typeof value.prompt === 'string' && typeof value.sourceLessonId === 'string'
    && ['exercise', 'selfTest'].includes(String(value.sourceKind))
    && hasStrings(value.hints) && typeof value.solution === 'string'
    && Array.isArray(value.competencies) && value.competencies.every((item) => competencies.has(String(item)))
    && hasStrings(value.operators)
    && (value.subpart === undefined || typeof value.subpart === 'string')
    && (value.taskType === undefined || taskTypes.has(String(value.taskType)))
    && (value.afb === undefined || [1, 2, 3].includes(Number(value.afb)))
    && (value.supportedModes === undefined || (Array.isArray(value.supportedModes)
      && value.supportedModes.length > 0
      && value.supportedModes.every((mode) => ['screen', 'handwriting'].includes(String(mode)))))
    && (value.sourceExamRefs === undefined || (Array.isArray(value.sourceExamRefs)
      && value.sourceExamRefs.every(isExamRef)))
}

function isExamRef(value: unknown): boolean {
  return isRecord(value) && typeof value.year === 'number' && ['HT', 'NT'].includes(String(value.term))
    && ['A', 'B', 'C', 'D'].includes(String(value.proposal)) && typeof value.pageStart === 'number'
    && (value.pageEnd === undefined || typeof value.pageEnd === 'number')
    && ['main-topic', 'additional-topic', 'competency'].includes(String(value.evidenceRole))
    && ['local-only', 'public-reference'].includes(String(value.sourceAvailability))
}

function isLearningGoal(value: unknown): boolean {
  return isRecord(value) && typeof value.id === 'string' && typeof value.statement === 'string'
    && hasStrings(value.competencies) && hasStrings(value.operators)
}

function isLessonContent(value: unknown): value is LessonContentRecord {
  if (!isRecord(value)) return false
  const relevance = isRecord(value.relevance) ? value.relevance : undefined
  const isObjectArray = (key: string, keys: string[]) => Array.isArray(value[key])
    && (value[key] as unknown[]).every((item) => isRecord(item) && keys.every((field) => typeof item[field] === 'string'))
  return value.schemaVersion === 2 && typeof value.id === 'string' && typeof value.title === 'string'
    && typeof value.summary === 'string' && typeof value.order === 'number'
    && ['draft', 'review', 'published'].includes(String(value.publicationStatus))
    && Boolean(relevance && ['high', 'medium', 'supplementary'].includes(String(relevance.label)))
    && Boolean(relevance && ['proposal-count-proxy', 'curriculum-only', 'cross-cutting'].includes(String(relevance.basis)))
    && Boolean(relevance && typeof relevance.note === 'string')
    && (relevance?.kcgoProposalCount === undefined || typeof relevance.kcgoProposalCount === 'number')
    && Array.isArray(value.curriculum) && value.curriculum.every((item) => isRecord(item)
      && typeof item.sourceId === 'string' && typeof item.fieldId === 'string'
      && ['required', 'additional', 'year-specific'].includes(String(item.status)))
    && hasStrings(value.prerequisites) && Array.isArray(value.learningGoals) && value.learningGoals.every(isLearningGoal)
    && typeof value.introduction === 'string' && typeof value.explanation === 'string'
    && isObjectArray('fundamentals', ['term', 'explanation']) && isObjectArray('equations', ['id', 'notation', 'explanation'])
    && typeof value.equationNote === 'string' && isObjectArray('mechanisms', ['id', 'title'])
    && isObjectArray('workedExamples', ['id', 'title', 'prompt', 'result'])
    && Array.isArray(value.examReferences) && value.examReferences.every(isExamRef)
    && hasStrings(value.typicalTaskTypes) && hasStrings(value.exerciseIds) && hasStrings(value.selfTestIds)
    && isObjectArray('tipsAndErrors', ['tip', 'commonError']) && isRecord(value.review)
}

if (!isLearningCatalog(catalogData)) throw new Error('Invalid learning content catalog: check IDs and required metadata.')

export const learningCatalog: LearningCatalog = catalogData
const catalogIds = new Set(learningCatalog.chapters.flatMap((chapter) => [
  chapter.id,
  ...chapter.children.flatMap((child) => child.lessonId ? [child.id, child.lessonId] : [child.id]),
]))
const catalogLessonLinks = learningCatalog.chapters.flatMap((chapter) => chapter.children)
  .filter((child) => child.lessonId)
const catalogLessonIds = new Set(catalogLessonLinks.map((child) => child.lessonId as string))

export const learningLessonIds = Object.keys(lessonModules)
  .map((path) => path.replace(/^\.\/lessons\//, '').replace(/\.json$/, ''))

export function hasLearningLesson(id: string): boolean {
  return Boolean(lessonModules[`./lessons/${id}.json`])
}

let exerciseMapPromise: Promise<Map<string, Exercise>> | undefined

async function getExerciseMap(): Promise<Map<string, Exercise>> {
  exerciseMapPromise ??= loadExerciseBank().then((bank) => {
    if (!isRecord(bank) || bank.schemaVersion !== 1 || !Array.isArray(bank.exercises)
      || !bank.exercises.every(isExercise)) {
      throw new Error('Invalid central exercise bank: check schema and task metadata.')
    }
    const entries = bank.exercises as Exercise[]
    const map = new Map(entries.map((exercise) => [exercise.id, exercise]))
    if (map.size !== entries.length) throw new Error('Duplicate exercise IDs found in central exercise bank.')
    for (const exercise of entries) {
      if (!catalogLessonIds.has(exercise.sourceLessonId) || !hasLearningLesson(exercise.sourceLessonId)) {
        throw new Error(`Exercise ${exercise.id} references unknown lesson ${exercise.sourceLessonId}.`)
      }
    }
    return map
  }).catch((error) => {
    exerciseMapPromise = undefined
    throw error
  })
  return exerciseMapPromise
}

export async function getAllExercises(): Promise<Exercise[]> {
  return [...(await getExerciseMap()).values()]
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  return (await getExerciseMap()).get(id)
}

function resolveIds(ids: string[], lessonId: string, sourceKind: Exercise['sourceKind'], bank: Map<string, Exercise>): Exercise[] {
  const seen = new Set<string>()
  return ids.map((id) => {
    const exercise = bank.get(id)
    if (!exercise || seen.has(id) || exercise.sourceLessonId !== lessonId || exercise.sourceKind !== sourceKind) {
      throw new Error(`Invalid ${sourceKind} reference ${id} in lesson ${lessonId}.`)
    }
    seen.add(id)
    return exercise
  })
}

export async function getLessonById(id: string): Promise<LessonContent | undefined> {
  const loader = lessonModules[`./lessons/${id}.json`]
  if (!loader) return undefined
  const data: unknown = await loader()
  if (!isLessonContent(data)) throw new Error(`Invalid lesson content in ${id}.json: check required fields and schema version.`)
  if (!catalogIds.has(data.id) || !data.prerequisites.every((prerequisite) => catalogIds.has(prerequisite))) {
    throw new Error(`Invalid lesson links in ${data.id}: check catalog and prerequisite IDs.`)
  }
  const catalogLink = catalogLessonLinks.find((child) => child.lessonId === data.id)
  if (!catalogLink || catalogLink.id !== data.id || catalogLink.title !== data.title) {
    throw new Error(`Catalog link does not match lesson metadata: ${data.id}.`)
  }
  const bank = await getExerciseMap()
  const exercises = resolveIds(data.exerciseIds, data.id, 'exercise', bank)
  const selfTest = resolveIds(data.selfTestIds, data.id, 'selfTest', bank)
  return { ...data, exercises, selfTest }
}
