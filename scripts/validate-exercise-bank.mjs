import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const lessonsDirectory = fileURLToPath(new URL('../src/content/lessons/', import.meta.url))
const catalog = JSON.parse(await readFile(new URL('../src/content/catalog.json', import.meta.url), 'utf8'))
const bank = JSON.parse(await readFile(new URL('../src/content/exercises.json', import.meta.url), 'utf8'))
const lessonFiles = (await readdir(lessonsDirectory)).filter((file) => file.endsWith('.json'))
const lessonLinks = catalog.chapters.flatMap((chapter) => chapter.children).filter((link) => link.lessonId)
const lessonIdsFromCatalog = new Set(lessonLinks.map((link) => link.lessonId))
const lessonIdsFromFiles = new Set(lessonFiles.map((file) => file.slice(0, -5)))
const errors = []
const allReferencedIds = new Set()
const stats = { exercise: 0, selfTest: 0, classified: 0 }

if (catalog.schemaVersion !== 1) errors.push('Unexpected catalog schema version.')
if (bank.schemaVersion !== 1 || !Array.isArray(bank.exercises)) errors.push('Invalid exercise bank schema.')
if (lessonFiles.length !== 47) errors.push(`Expected 47 lesson files, found ${lessonFiles.length}.`)
if (lessonIdsFromCatalog.size !== lessonIdsFromFiles.size
  || [...lessonIdsFromFiles].some((id) => !lessonIdsFromCatalog.has(id))) {
  errors.push('Lesson files and catalog lesson IDs do not match.')
}

const bankMap = new Map()
for (const task of bank.exercises ?? []) {
  if (bankMap.has(task.id)) errors.push(`Duplicate task ID: ${task.id}.`)
  bankMap.set(task.id, task)
  if (!lessonIdsFromCatalog.has(task.sourceLessonId)) errors.push(`${task.id} has unknown source lesson ${task.sourceLessonId}.`)
  if (!['exercise', 'selfTest'].includes(task.sourceKind)) errors.push(`${task.id} has invalid source kind.`)
  if (!['basic', 'standard', 'transfer'].includes(task.difficulty)) errors.push(`${task.id} has invalid difficulty.`)
  if (!Array.isArray(task.hints) || !Array.isArray(task.competencies) || !Array.isArray(task.operators)
    || typeof task.solution !== 'string' || typeof task.prompt !== 'string') {
    errors.push(`${task.id} is missing legacy task content fields.`)
  }
  if (task.taskType !== undefined && !['free-response', 'numeric', 'single-choice', 'multiple-choice', 'matching', 'structured'].includes(task.taskType)) {
    errors.push(`${task.id} has invalid taskType.`)
  }
  if (task.afb !== undefined && ![1, 2, 3].includes(task.afb)) errors.push(`${task.id} has invalid AFB.`)
  if ((task.afb === undefined) !== (task.taskType === undefined)) errors.push(`${task.id} must set AFB and taskType together.`)
  if (task.afb !== undefined) stats.classified += 1
  if (!Array.isArray(task.supportedModes)) errors.push(`${task.id} must define supportedModes.`)
  const checkable = task.taskType === 'numeric' || task.taskType === 'matching'
  if (checkable && task.answer?.kind !== task.taskType) errors.push(`${task.id} needs a ${task.taskType} answer.`)
  if (!checkable && task.answer !== undefined) errors.push(`${task.id} must not define an answer for taskType ${task.taskType}.`)
  if (task.answer?.kind === 'numeric' && (!Array.isArray(task.answer.parts) || task.answer.parts.length === 0
    || task.answer.parts.some((part) => typeof part.id !== 'string' || typeof part.label !== 'string' || !Number.isFinite(part.value)))) {
    errors.push(`${task.id} has an invalid numeric answer.`)
  }
  if (task.answer?.kind === 'matching' && (!Array.isArray(task.answer.items) || task.answer.items.length === 0
    || task.answer.items.some((item) => !task.answer.options.includes(item.correct)))) {
    errors.push(`${task.id} has an invalid matching answer.`)
  }
  if (task.supportedModes !== undefined && (!Array.isArray(task.supportedModes) || task.supportedModes.length === 0
    || task.supportedModes.some((mode) => !['screen', 'handwriting'].includes(mode)))) {
    errors.push(`${task.id} has invalid supportedModes.`)
  }
}

for (const file of lessonFiles) {
  const lesson = JSON.parse(await readFile(join(lessonsDirectory, file), 'utf8'))
  if (lesson.schemaVersion !== 2) errors.push(`${file} has unexpected schema version.`)
  const catalogLink = lessonLinks.find((link) => link.lessonId === lesson.id)
  if (!catalogLink || catalogLink.id !== lesson.id || catalogLink.title !== lesson.title) {
    errors.push(`${file} does not match its catalog link.`)
  }
  for (const [kind, ids] of [['exercise', lesson.exerciseIds], ['selfTest', lesson.selfTestIds]]) {
    if (!Array.isArray(ids)) {
      errors.push(`${file} is missing ${kind} IDs.`)
      continue
    }
    const local = new Set()
    for (const id of ids) {
      if (local.has(id)) errors.push(`${file} repeats task reference ${id}.`)
      local.add(id)
      if (allReferencedIds.has(id)) errors.push(`Task ${id} is referenced more than once.`)
      allReferencedIds.add(id)
      const task = bankMap.get(id)
      if (!task) errors.push(`${file} references missing task ${id}.`)
      else if (task.sourceLessonId !== lesson.id || task.sourceKind !== kind) {
        errors.push(`${id} has mismatched lesson or source kind.`)
      }
      stats[kind] += 1
    }
  }
}

for (const id of bankMap.keys()) if (!allReferencedIds.has(id)) errors.push(`Orphan task in bank: ${id}.`)
if (stats.exercise !== 282) errors.push(`Expected 282 regular exercises, found ${stats.exercise}.`)
if (stats.selfTest !== 143) errors.push(`Expected 143 self-tests, found ${stats.selfTest}.`)
if (bankMap.size !== 425) errors.push(`Expected 425 total tasks, found ${bankMap.size}.`)
if (stats.classified !== bankMap.size) errors.push(`Expected all tasks to have AFB and taskType, found ${stats.classified} of ${bankMap.size}.`)

if (errors.length) {
  console.error(`Content validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Content validation passed: ${lessonFiles.length} lessons; ${stats.exercise} exercises; ${stats.selfTest} self-tests; ${bankMap.size} unique, linked tasks; ${stats.classified} classified by AFB and task type.`)
}
