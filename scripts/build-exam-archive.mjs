// Erzeugt src/content/exam-archive.json aus der eigenen Prüfungsauswertung (research/).
// Enthält nur Metadaten (Jahr, Termin, Vorschlag, Themen, Dateiname), keine Prüfungstexte.
// Die PDFs selbst liegen ausschließlich lokal bzw. im privaten Supabase-Speicher.
import fs from 'node:fs'

const analysis = fs.readFileSync('research/pruefungsanalyse_2007-2025.md', 'utf8')
const inventory = fs.readFileSync('research/pruefungsinventar.md', 'utf8')
const lessonDir = 'src/content/lessons/'
const lessons = fs.readdirSync(lessonDir).map((file) => JSON.parse(fs.readFileSync(lessonDir + file, 'utf8')))
const catalog = JSON.parse(fs.readFileSync('src/content/catalog.json', 'utf8'))
const chapterOf = new Map(catalog.chapters.flatMap((chapter) => chapter.children.filter((child) => child.lessonId).map((child) => [child.lessonId, chapter.id])))

const plain = (text) => text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
const fieldPattern = /\b(?:Q\d\.\d|E\.\d)\b/g

const files = new Map([...inventory.matchAll(/^\| (20\d\d) \| (HT|NT) \| ([A-D]) \| `([^`]+)` \| ([^|]+?) \|$/gm)]
  .map(([, year, term, proposal, file]) => [`${year}-${term}-${proposal}`, file]))

const directLessons = new Map()
for (const lesson of lessons) {
  for (const reference of lesson.examReferences) {
    const key = `${reference.year}-${reference.term}-${reference.proposal}`
    directLessons.set(key, [...(directLessons.get(key) ?? []), lesson.id])
  }
}

const exams = [...analysis.matchAll(/^\| (20\d\d) (HT|NT) ([A-D]), PDF ([^|]+?) \| ([^|]+?) \| ([^|]*?) \|$/gm)].map(([, year, term, proposal, pages, focus, further]) => {
  const id = `${year}-${term}-${proposal}`
  const file = files.get(id)
  if (!file) throw new Error(`Keine Datei im Inventar für ${id}`)
  const fields = [...new Set(`${focus} ${further}`.match(fieldPattern) ?? [])]
  const focusFields = focus.match(fieldPattern) ?? fields
  // Übungsbezug: Lernseiten, die diese Prüfung selbst als Beleg nennen; sonst die Kapitel der Hauptfokus-Felder
  const direct = (directLessons.get(id) ?? []).sort()
  const fieldChapters = [...new Set(lessons
    .filter((lesson) => lesson.curriculum.some((reference) => focusFields.includes(reference.fieldId)))
    .map((lesson) => chapterOf.get(lesson.id)).filter(Boolean))].sort()
  return {
    id, year: Number(year), term, proposal, file, pages: plain(pages),
    focus: plain(focus), further: plain(further), fields,
    practice: direct.length > 0
      ? direct.map((lessonId) => ({ chapterId: chapterOf.get(lessonId), lessonId }))
      : fieldChapters.map((chapterId) => ({ chapterId })),
    practiceMatch: direct.length > 0 ? 'lesson' : fieldChapters.length > 0 ? 'chapter' : 'none',
  }
})

if (exams.length !== files.size) throw new Error(`Analyse (${exams.length}) und Inventar (${files.size}) passen nicht zusammen`)

const notes = [...analysis.matchAll(/^\| (20\d\d (?:HT|NT|HT\/NT) [A-D](?:–D)?) \| ([^|]+?) \| ([^|]+?) \|$/gm)]
  .map(([, label, observation, assessment]) => ({ label, observation: plain(observation), assessment: plain(assessment) }))

const archive = {
  schemaVersion: 1,
  source: 'research/pruefungsanalyse_2007-2025.md und research/pruefungsinventar.md',
  exams: exams.sort((a, b) => b.year - a.year || a.term.localeCompare(b.term) || a.proposal.localeCompare(b.proposal)),
  notes,
}
fs.writeFileSync('src/content/exam-archive.json', JSON.stringify(archive, null, 2) + '\n')
const matches = exams.reduce((count, exam) => ({ ...count, [exam.practiceMatch]: (count[exam.practiceMatch] ?? 0) + 1 }), {})
console.log(`${exams.length} Prüfungen, ${notes.length} Hinweise; Lernseiten-Zuordnung:`, matches)
