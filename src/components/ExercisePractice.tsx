import { useEffect, useState } from 'react'
import { getFigureUrl } from '../content'
import type { Exercise, ExerciseAnswer, ExerciseFigure, ExerciseMode } from '../content/types'
import { HandwritingPad } from './HandwritingPad'
import { SharedNotes } from './SharedNotes'
import { Discussion } from './Discussion'
import { useExerciseNote, type NoteSaveState } from '../notes/NotesContext'
import './ExercisePractice.css'
import { combineResults, isWithinTolerance, parseNumber } from '../practice/checkAnswer'
import type { PracticeRecord, PracticeResult } from '../practice/storage'

export const resultLabels: Record<PracticeResult, string> = {
  correct: 'Richtig',
  partial: 'Teilweise',
  incorrect: 'Noch nicht',
}

function Figures({ figures }: { figures: ExerciseFigure[] }) {
  return <>{figures.map((figure) => <figure className="practice-figure" key={figure.file}>
    <img src={getFigureUrl(figure.file)} alt={figure.alt} loading="lazy"/>
    {figure.caption && <figcaption>{figure.caption}</figcaption>}
  </figure>)}</>
}

type NumericAnswer = Extract<ExerciseAnswer, { kind: 'numeric' }>
type MatchingAnswer = Extract<ExerciseAnswer, { kind: 'matching' }>

function NumericCheck({ exercise, answer, onResult }: {
  exercise: Exercise
  answer: NumericAnswer
  onResult: (result: PracticeResult) => void
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | 'invalid'> | null>(null)

  const check = () => {
    const next: Record<string, 'correct' | 'incorrect' | 'invalid'> = {}
    for (const part of answer.parts) {
      const parsed = parseNumber(values[part.id] ?? '')
      next[part.id] = parsed === null ? 'invalid' : isWithinTolerance(part, parsed) ? 'correct' : 'incorrect'
    }
    setFeedback(next)
    if (Object.values(next).some((state) => state === 'invalid')) return
    onResult(combineResults(Object.values(next).filter((state) => state === 'correct').length, answer.parts.length))
  }

  return <div className="practice-check">
    <div className="practice-numeric-grid">
      {answer.parts.map((part) => {
        const inputId = `${exercise.id}-${part.id}`
        const state = feedback?.[part.id]
        return <div className={`practice-numeric-field${state ? ` is-${state}` : ''}`} key={part.id}>
          <label htmlFor={inputId}>{part.label}</label>
          <div className="practice-numeric-input">
            <input id={inputId} inputMode="decimal" autoComplete="off" value={values[part.id] ?? ''}
              onChange={(event) => setValues((current) => ({ ...current, [part.id]: event.target.value }))}
              onKeyDown={(event) => { if (event.key === 'Enter') check() }}/>
            {part.unit && <span>{part.unit}</span>}
          </div>
          {state === 'correct' && <small>Stimmt.</small>}
          {state === 'incorrect' && <small>Stimmt noch nicht.</small>}
          {state === 'invalid' && <small>Bitte eine Zahl eingeben, z. B. 0,25 oder 6,2·10^-4.</small>}
        </div>
      })}
    </div>
    <button type="button" className="practice-primary" onClick={check}>Antwort prüfen</button>
  </div>
}

function MatchingCheck({ exercise, answer, onResult }: {
  exercise: Exercise
  answer: MatchingAnswer
  onResult: (result: PracticeResult) => void
}) {
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const complete = answer.items.every((item) => choices[item.id])

  const check = () => {
    setChecked(true)
    onResult(combineResults(answer.items.filter((item) => choices[item.id] === item.correct).length, answer.items.length))
  }

  return <div className="practice-check">
    <div className="practice-matching-list">
      {answer.items.map((item) => {
        const selectId = `${exercise.id}-${item.id}`
        const state = checked ? (choices[item.id] === item.correct ? 'correct' : 'incorrect') : undefined
        return <div className={`practice-matching-row${state ? ` is-${state}` : ''}`} key={item.id}>
          <label htmlFor={selectId}>{item.label}</label>
          <select id={selectId} value={choices[item.id] ?? ''}
            onChange={(event) => { setChecked(false); setChoices((current) => ({ ...current, [item.id]: event.target.value })) }}>
            <option value="">Bitte wählen</option>
            {answer.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {state === 'incorrect' && <small>Richtig wäre: {item.correct}</small>}
        </div>
      })}
    </div>
    <button type="button" className="practice-primary" onClick={check} disabled={!complete}>Zuordnung prüfen</button>
  </div>
}

function SelfAssessment({ onResult, current }: { onResult: (result: PracticeResult) => void; current?: PracticeRecord }) {
  return <div className="practice-self">
    <span>Vergleiche deine Antwort mit der Musterlösung. Wie gut ist sie gelungen?</span>
    <div className="practice-self-buttons">
      {(['correct', 'partial', 'incorrect'] as const).map((result) => <button type="button" key={result}
        className={`practice-self-button result-${result}${current?.checkedBy === 'self' && current.result === result ? ' is-active' : ''}`}
        aria-pressed={current?.checkedBy === 'self' && current.result === result} onClick={() => onResult(result)}>
        {resultLabels[result]}
      </button>)}
    </div>
  </div>
}

export function ExercisePractice({ exercise, record, onRecord }: {
  exercise: Exercise
  record?: PracticeRecord
  onRecord: (record: PracticeRecord) => void
}) {
  const [hintCount, setHintCount] = useState(0)
  const [ownAnswer, setOwnAnswer] = useState('')
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [autoResult, setAutoResult] = useState<PracticeResult | null>(null)
  const answer = exercise.answer
  const promptFigures = exercise.figures?.filter((figure) => figure.placement === 'prompt') ?? []
  const solutionFigures = exercise.figures?.filter((figure) => figure.placement === 'solution') ?? []
  const handwritingOnly = exercise.supportedModes?.length === 1 && exercise.supportedModes[0] === 'handwriting'
  const [inputMode, setInputMode] = useState<ExerciseMode>(handwritingOnly ? 'handwriting' : 'screen')
  const [scratchVisible, setScratchVisible] = useState(false)
  const recommendation = exercise.supportedModes?.includes('handwriting')
    ? handwritingOnly ? 'Diese Aufgabe bearbeitest du am besten handschriftlich.' : 'Diese Aufgabe eignet sich auch gut zur handschriftlichen Bearbeitung.'
    : null

  // Eigene Notiz (Handschrift, Rechenweg, getippte Antwort) im Konto
  const note = useExerciseNote(exercise.id)
  const accountNote = note.status !== 'off'
  useEffect(() => {
    if (note.loadKey === 0) return
    const { answer: answerStrokes, scratch, typed } = note.content
    if (typed) setOwnAnswer(typed)
    if (answerStrokes.length > 0 && !typed) setInputMode('handwriting')
    if (scratch.length > 0) setScratchVisible(true)
  // Nur nach dem Laden einer gespeicherten Notiz übernehmen
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.loadKey])
  const storageNote = accountNote ? 'Die Handschrift wird automatisch in deinem Konto gespeichert.' : undefined
  const padReady = note.status !== 'loading'

  const saveAuto = (result: PracticeResult) => {
    setAutoResult(result)
    onRecord({ result, checkedBy: 'auto', updatedAt: new Date().toISOString() })
  }
  const saveSelf = (result: PracticeResult) => onRecord({ result, checkedBy: 'self', updatedAt: new Date().toISOString() })

  return <div className="exercise-practice">
    <p className="practice-prompt">{exercise.prompt}</p>
    {promptFigures.length > 0 && <Figures figures={promptFigures}/>}

    {answer?.kind === 'numeric' && <>
      <button type="button" className="practice-scratch-toggle" aria-expanded={scratchVisible}
        onClick={() => setScratchVisible((visible) => !visible)}>
        {scratchVisible ? 'Schreibfläche für den Rechenweg ausblenden' : 'Rechenweg handschriftlich notieren'}
      </button>
      {scratchVisible && padReady && <HandwritingPad key={`scratch-${note.loadKey}`} label={`Schreibfläche für den Rechenweg: ${exercise.title}`}
        initialStrokes={note.content.scratch} onChange={(strokes) => note.update({ scratch: strokes })} storageNote={storageNote}/>}
      <NumericCheck exercise={exercise} answer={answer} onResult={saveAuto}/>
    </>}
    {answer?.kind === 'matching' && <MatchingCheck exercise={exercise} answer={answer} onResult={saveAuto}/>}
    {!answer && <div className="practice-answer-area">
      <div className="practice-mode-switch" role="group" aria-label="Bearbeitungsmodus">
        <button type="button" aria-pressed={inputMode === 'screen'} onClick={() => setInputMode('screen')}>Antwort tippen</button>
        <button type="button" aria-pressed={inputMode === 'handwriting'} onClick={() => setInputMode('handwriting')}>Handschriftlich</button>
      </div>
      {recommendation && <p className="practice-mode-hint">{recommendation}</p>}
      <label className="practice-own-answer" hidden={inputMode !== 'screen'}>
        <span>Deine Antwort (optional, {accountNote ? 'wird nur für dich gespeichert und nie geteilt' : 'wird nicht gespeichert'})</span>
        <textarea rows={4} value={ownAnswer} maxLength={10000} onChange={(event) => { setOwnAnswer(event.target.value); note.update({ typed: event.target.value }) }}
          placeholder="Formuliere deine Antwort, bevor du die Musterlösung öffnest."/>
      </label>
      <div hidden={inputMode !== 'handwriting'}>{padReady && <HandwritingPad key={`answer-${note.loadKey}`} label={`Schreibfläche für die Antwort: ${exercise.title}`}
        initialStrokes={note.content.answer} onChange={(strokes) => note.update({ answer: strokes })} storageNote={storageNote}/>}</div>
    </div>}
    {note.status === 'loading' && answer?.kind !== 'matching' && <p className="practice-sync-note">Deine Notiz wird geladen …</p>}
    {note.status === 'error' && <p className="practice-sync-note is-error">Deine gespeicherte Notiz konnte nicht geladen werden.</p>}
    {accountNote && note.status === 'ready' && answer?.kind !== 'matching' && <NoteSharing shared={note.content.shared} saveState={note.saveState}
      onChange={(shared) => note.update({ shared })}/>}

    {autoResult && <p className={`practice-result result-${autoResult}`} role="status">
      {autoResult === 'correct' ? 'Alles richtig.' : autoResult === 'partial' ? 'Teilweise richtig.' : 'Noch nicht richtig.'}
      {' '}Die Musterlösung zeigt dir den Rechen- bzw. Lösungsweg.
    </p>}

    <div className="practice-actions">
      {exercise.hints.length > 0 && <button type="button" onClick={() => setHintCount((count) => Math.min(count + 1, exercise.hints.length))}
        disabled={hintCount >= exercise.hints.length}>
        {hintCount === 0 ? 'Hinweis anzeigen' : hintCount < exercise.hints.length ? 'Nächster Hinweis' : 'Alle Hinweise angezeigt'}
      </button>}
      <button type="button" onClick={() => setSolutionVisible((visible) => !visible)} aria-expanded={solutionVisible}>
        {solutionVisible ? 'Musterlösung ausblenden' : 'Musterlösung anzeigen'}
      </button>
    </div>

    {hintCount > 0 && <ol className="practice-hints">
      {exercise.hints.slice(0, hintCount).map((hint) => <li key={hint}>{hint}</li>)}
    </ol>}

    {solutionVisible && <div className="practice-solution">
      <strong>Musterlösung</strong>
      <p>{exercise.solution}</p>
      {solutionFigures.length > 0 && <Figures figures={solutionFigures}/>}
    </div>}

    {!answer && solutionVisible && <SelfAssessment onResult={saveSelf} current={record}/>}
    {accountNote && <SharedNotes exerciseId={exercise.id}/>}
    <Discussion exerciseId={exercise.id}/>
  </div>
}

const saveLabels: Record<NoteSaveState, string> = { idle: '', saving: 'Wird gespeichert …', saved: 'Gespeichert', error: 'Speichern fehlgeschlagen, neuer Versuch bei der nächsten Änderung', 'too-large': 'Zu viel Handschrift für eine Notiz; bitte etwas löschen' }

/** Privat oder geteilt; geteilt wird nur die Handschrift, nie die getippte Antwort. */
function NoteSharing({ shared, saveState, onChange }: { shared: boolean; saveState: NoteSaveState; onChange: (shared: boolean) => void }) {
  return <div className="note-sharing">
    <div className="practice-mode-switch" role="group" aria-label="Sichtbarkeit deiner Notiz">
      <button type="button" aria-pressed={!shared} onClick={() => onChange(false)}>Privat</button>
      <button type="button" aria-pressed={shared} onClick={() => onChange(true)}>Geteilt</button>
    </div>
    <span className="note-sharing-hint">{shared ? 'Andere sehen deine Handschrift zu dieser Aufgabe mit deinem Namen; die getippte Antwort bleibt privat.' : 'Nur du kannst diese Notiz sehen, auch Admins nicht.'}</span>
    {saveLabels[saveState] && <span className={`note-save-state is-${saveState}`}>{saveLabels[saveState]}</span>}
  </div>
}
