import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'

/**
 * Schreibfläche für Stift, Maus und optional Finger. Striche werden als Vektordaten
 * in Weltkoordinaten gehalten (unabhängig von Zoom und Verschiebung), damit sie
 * später kontogebunden gespeichert werden können; derzeit existieren sie nur,
 * solange die Komponente geöffnet ist.
 */
export interface Stroke {
  color: string
  width: number
  /** x, y in Weltkoordinaten und Breitenfaktor aus dem Stiftdruck */
  points: Array<[x: number, y: number, factor: number]>
}

type Tool = 'pen' | 'eraser' | 'select' | 'pan'
interface View { scale: number; x: number; y: number }
interface Box { x0: number; y0: number; x1: number; y1: number }

const inkColors = [
  { value: '#e9edf1', label: 'Hell' },
  { value: '#80d8bc', label: 'Mint' },
  { value: '#e0c48d', label: 'Gelb' },
]
const widths = [{ value: 2.5, label: 'Fein' }, { value: 5, label: 'Breit' }]
const eraserRadius = 11
const gridSize = 20
const minScale = 0.5
const maxScale = 4
const sampleSpacing = 1.5

const copyStrokes = (strokes: Stroke[]) => strokes.map((stroke) => ({ ...stroke, points: stroke.points.map((point) => [...point] as Stroke['points'][number]) }))
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1)
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/** Entfernt alle Punkte im Radierbereich und teilt Striche an diesen Stellen. */
function eraseAlong(strokes: Stroke[], from: [number, number], to: [number, number], radius: number): Stroke[] {
  const result: Stroke[] = []
  for (const stroke of strokes) {
    let current: Stroke['points'] = []
    let changed = false
    for (const point of stroke.points) {
      if (distanceToSegment(point[0], point[1], from[0], from[1], to[0], to[1]) <= radius + stroke.width / 2) {
        changed = true
        if (current.length) result.push({ ...stroke, points: current })
        current = []
      } else {
        current.push(point)
      }
    }
    if (!changed) result.push(stroke)
    else if (current.length) result.push({ ...stroke, points: current })
  }
  return result
}

function boundsOf(strokes: Stroke[]): Box | null {
  if (!strokes.length) return null
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  for (const stroke of strokes) {
    for (const [x, y] of stroke.points) {
      box.x0 = Math.min(box.x0, x - stroke.width)
      box.y0 = Math.min(box.y0, y - stroke.width)
      box.x1 = Math.max(box.x1, x + stroke.width)
      box.y1 = Math.max(box.y1, y + stroke.width)
    }
  }
  return box
}

export function HandwritingPad({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const historyRef = useRef<Stroke[][]>([])
  const viewRef = useRef<View>({ scale: 1, x: 0, y: 0 })
  const selectionRef = useRef<{ strokes: Stroke[]; box: Box } | null>(null)
  const rubberRef = useRef<Box | null>(null)
  const cursorRef = useRef<[number, number] | null>(null)
  const touchesRef = useRef(new Map<number, [number, number]>())
  const pinchRef = useRef<{ distance: number; center: [number, number] } | null>(null)
  const actionRef = useRef<
    | { kind: 'draw'; pointerId: number; stroke: Stroke }
    | { kind: 'erase'; pointerId: number; last: [number, number] }
    | { kind: 'rubber'; pointerId: number; start: [number, number] }
    | { kind: 'move'; pointerId: number; last: [number, number] }
    | { kind: 'pan'; pointerId: number; last: [number, number] }
    | { kind: 'scroll'; pointerId: number; lastY: number }
    | null
  >(null)

  const [historySize, setHistorySize] = useState(0)
  const [hasStrokes, setHasStrokes] = useState(false)
  const [hasSelection, setHasSelection] = useState(false)
  const [tool, setToolState] = useState<Tool>('pen')
  const [color, setColor] = useState(inkColors[0].value)
  const [width, setWidth] = useState(widths[0].value)
  const [pressureEnabled, setPressureEnabled] = useState(true)
  const [fingerDrawing, setFingerDrawing] = useState(false)
  const [zoom, setZoom] = useState(1)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const ratio = window.devicePixelRatio || 1
    const { scale, x, y } = viewRef.current
    const cssWidth = canvas.width / ratio
    const cssHeight = canvas.height / ratio
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(ratio * scale, 0, 0, ratio * scale, ratio * x, ratio * y)

    // Karomuster in Weltkoordinaten, damit es mit Zoom und Verschiebung mitgeht.
    const left = -x / scale
    const top = -y / scale
    const right = left + cssWidth / scale
    const bottom = top + cssHeight / scale
    context.strokeStyle = '#1c272e'
    context.lineWidth = 1 / scale
    context.beginPath()
    for (let gx = Math.floor(left / gridSize) * gridSize; gx <= right; gx += gridSize) { context.moveTo(gx, top); context.lineTo(gx, bottom) }
    for (let gy = Math.floor(top / gridSize) * gridSize; gy <= bottom; gy += gridSize) { context.moveTo(left, gy); context.lineTo(right, gy) }
    context.stroke()

    context.lineCap = 'round'
    context.lineJoin = 'round'
    const selected = new Set(selectionRef.current?.strokes)
    const active = actionRef.current?.kind === 'draw' ? [actionRef.current.stroke] : []
    for (const stroke of [...strokesRef.current, ...active]) {
      context.strokeStyle = stroke.color
      context.fillStyle = stroke.color
      context.globalAlpha = selected.size && !selected.has(stroke) ? 0.55 : 1
      const points = stroke.points
      if (points.length === 1) {
        context.beginPath()
        context.arc(points[0][0], points[0][1], (stroke.width * points[0][2]) / 2, 0, Math.PI * 2)
        context.fill()
        continue
      }
      for (let index = 1; index < points.length; index += 1) {
        const [x0, y0, f0] = points[index - 1]
        const [x1, y1, f1] = points[index]
        context.lineWidth = stroke.width * (f0 + f1) / 2
        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.stroke()
      }
    }
    context.globalAlpha = 1

    const box = rubberRef.current ?? selectionRef.current?.box
    if (box) {
      context.setLineDash([6 / scale, 4 / scale])
      context.strokeStyle = '#80d8bc'
      context.lineWidth = 1.2 / scale
      context.strokeRect(Math.min(box.x0, box.x1), Math.min(box.y0, box.y1), Math.abs(box.x1 - box.x0), Math.abs(box.y1 - box.y0))
      context.setLineDash([])
    }
    if (cursorRef.current && tool === 'eraser') {
      context.strokeStyle = '#e9edf1'
      context.lineWidth = 1.2 / scale
      context.beginPath()
      context.arc(cursorRef.current[0], cursorRef.current[1], eraserRadius / scale, 0, Math.PI * 2)
      context.stroke()
    }
  }, [tool])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
      render()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [render])

  const setView = useCallback((next: View) => {
    viewRef.current = { ...next, scale: clamp(next.scale, minScale, maxScale) }
    setZoom(viewRef.current.scale)
    render()
  }, [render])

  const zoomAt = useCallback((factor: number, screenX: number, screenY: number) => {
    const { scale, x, y } = viewRef.current
    const nextScale = clamp(scale * factor, minScale, maxScale)
    const worldX = (screenX - x) / scale
    const worldY = (screenY - y) / scale
    setView({ scale: nextScale, x: screenX - worldX * nextScale, y: screenY - worldY * nextScale })
  }, [setView])

  // Strg/⌘ + Mausrad zoomt; ohne Taste scrollt die Seite wie gewohnt.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      zoomAt(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX - rect.left, event.clientY - rect.top)
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const commit = (next: Stroke[]) => {
    historyRef.current = [...historyRef.current, copyStrokes(strokesRef.current)].slice(-100)
    strokesRef.current = next
    setHistorySize(historyRef.current.length)
    setHasStrokes(next.length > 0)
  }

  const clearSelection = () => {
    selectionRef.current = null
    setHasSelection(false)
  }

  const setTool = (next: Tool) => {
    clearSelection()
    cursorRef.current = null
    setToolState(next)
  }

  const screenPoint = (event: ReactPointerEvent<HTMLCanvasElement>): [number, number] => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top]
  }
  const worldPoint = (event: ReactPointerEvent<HTMLCanvasElement>): [number, number] => {
    const [sx, sy] = screenPoint(event)
    const { scale, x, y } = viewRef.current
    return [(sx - x) / scale, (sy - y) / scale]
  }
  const pressureFactor = (event: ReactPointerEvent<HTMLCanvasElement>) => (pressureEnabled && event.pointerType === 'pen' && event.pressure > 0
    ? 0.3 + event.pressure * 1.4
    : 1)

  const pinchState = () => {
    const [a, b] = [...touchesRef.current.values()]
    return { distance: Math.hypot(a[0] - b[0], a[1] - b[1]), center: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number] }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') {
      touchesRef.current.set(event.pointerId, screenPoint(event))
      if (touchesRef.current.size === 2) {
        // Zwei Finger: Zoom und Verschieben der Ansicht; laufende Eingaben werden verworfen.
        actionRef.current = null
        pinchRef.current = pinchState()
        render()
        return
      }
      if (touchesRef.current.size > 2) return
    }
    if (actionRef.current) return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Ohne Capture funktioniert die Eingabe weiter, solange der Zeiger auf der Fläche bleibt.
    }
    const touchWithoutDrawing = event.pointerType === 'touch' && !fingerDrawing
    if (touchWithoutDrawing) {
      actionRef.current = viewRef.current.scale > 1
        ? { kind: 'pan', pointerId: event.pointerId, last: screenPoint(event) }
        : { kind: 'scroll', pointerId: event.pointerId, lastY: event.clientY }
      return
    }
    event.preventDefault()
    const point = worldPoint(event)
    if (tool === 'pan') {
      actionRef.current = { kind: 'pan', pointerId: event.pointerId, last: screenPoint(event) }
    } else if (tool === 'pen') {
      clearSelection()
      actionRef.current = { kind: 'draw', pointerId: event.pointerId, stroke: { color, width, points: [[point[0], point[1], pressureFactor(event)]] } }
    } else if (tool === 'eraser') {
      historyRef.current = [...historyRef.current, copyStrokes(strokesRef.current)].slice(-100)
      setHistorySize(historyRef.current.length)
      strokesRef.current = eraseAlong(strokesRef.current, point, point, eraserRadius / viewRef.current.scale)
      cursorRef.current = point
      actionRef.current = { kind: 'erase', pointerId: event.pointerId, last: point }
    } else {
      const box = selectionRef.current?.box
      if (box && point[0] >= box.x0 && point[0] <= box.x1 && point[1] >= box.y0 && point[1] <= box.y1) {
        historyRef.current = [...historyRef.current, copyStrokes(strokesRef.current)].slice(-100)
        setHistorySize(historyRef.current.length)
        actionRef.current = { kind: 'move', pointerId: event.pointerId, last: point }
      } else {
        clearSelection()
        rubberRef.current = { x0: point[0], y0: point[1], x1: point[0], y1: point[1] }
        actionRef.current = { kind: 'rubber', pointerId: event.pointerId, start: point }
      }
    }
    render()
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch' && touchesRef.current.has(event.pointerId)) {
      touchesRef.current.set(event.pointerId, screenPoint(event))
      if (touchesRef.current.size === 2 && pinchRef.current) {
        const next = pinchState()
        const previous = pinchRef.current
        const { scale, x, y } = viewRef.current
        const nextScale = clamp(scale * (next.distance / previous.distance), minScale, maxScale)
        const worldX = (previous.center[0] - x) / scale
        const worldY = (previous.center[1] - y) / scale
        setView({ scale: nextScale, x: next.center[0] - worldX * nextScale, y: next.center[1] - worldY * nextScale })
        pinchRef.current = next
        return
      }
    }
    const action = actionRef.current
    if (tool === 'eraser' && event.pointerType !== 'touch') {
      cursorRef.current = worldPoint(event)
      if (!action) render()
    }
    if (!action || action.pointerId !== event.pointerId) return
    if (action.kind === 'scroll') {
      window.scrollBy(0, action.lastY - event.clientY)
      action.lastY = event.clientY
      return
    }
    if (action.kind === 'pan') {
      const point = screenPoint(event)
      const { scale, x, y } = viewRef.current
      setView({ scale, x: x + point[0] - action.last[0], y: y + point[1] - action.last[1] })
      action.last = point
      return
    }
    const point = worldPoint(event)
    if (action.kind === 'draw') {
      const points = action.stroke.points
      const [lastX, lastY, lastFactor] = points[points.length - 1]
      const factor = pressureFactor(event)
      const steps = Math.max(1, Math.floor(Math.hypot(point[0] - lastX, point[1] - lastY) / sampleSpacing))
      for (let step = 1; step <= steps; step += 1) {
        const t = step / steps
        points.push([lastX + (point[0] - lastX) * t, lastY + (point[1] - lastY) * t, lastFactor + (factor - lastFactor) * t])
      }
    } else if (action.kind === 'erase') {
      strokesRef.current = eraseAlong(strokesRef.current, action.last, point, eraserRadius / viewRef.current.scale)
      setHasStrokes(strokesRef.current.length > 0)
      cursorRef.current = point
      action.last = point
    } else if (action.kind === 'rubber' && rubberRef.current) {
      rubberRef.current = { ...rubberRef.current, x1: point[0], y1: point[1] }
    } else if (action.kind === 'move' && selectionRef.current) {
      const dx = point[0] - action.last[0]
      const dy = point[1] - action.last[1]
      for (const stroke of selectionRef.current.strokes) {
        for (const strokePoint of stroke.points) { strokePoint[0] += dx; strokePoint[1] += dy }
      }
      const box = selectionRef.current.box
      selectionRef.current.box = { x0: box.x0 + dx, y0: box.y0 + dy, x1: box.x1 + dx, y1: box.y1 + dy }
      action.last = point
    }
    render()
  }

  const onPointerEnd = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') {
      touchesRef.current.delete(event.pointerId)
      if (touchesRef.current.size < 2) pinchRef.current = null
    }
    const action = actionRef.current
    if (!action || action.pointerId !== event.pointerId) return
    actionRef.current = null
    if (action.kind === 'draw') {
      commit([...strokesRef.current, action.stroke])
    } else if (action.kind === 'rubber' && rubberRef.current) {
      const box = rubberRef.current
      const area = { x0: Math.min(box.x0, box.x1), y0: Math.min(box.y0, box.y1), x1: Math.max(box.x0, box.x1), y1: Math.max(box.y0, box.y1) }
      const picked = strokesRef.current.filter((stroke) => stroke.points.some(([x, y]) => x >= area.x0 && x <= area.x1 && y >= area.y0 && y <= area.y1))
      rubberRef.current = null
      const bounds = boundsOf(picked)
      selectionRef.current = bounds ? { strokes: picked, box: bounds } : null
      setHasSelection(Boolean(bounds))
    } else if (action.kind === 'move' && selectionRef.current) {
      setHasStrokes(strokesRef.current.length > 0)
    } else if (action.kind === 'erase') {
      setHasStrokes(strokesRef.current.length > 0)
      if (event.pointerType === 'touch') cursorRef.current = null
    }
    render()
  }

  const onPointerLeave = () => {
    if (!actionRef.current && cursorRef.current) {
      cursorRef.current = null
      render()
    }
  }

  const undo = () => {
    const previous = historyRef.current.at(-1)
    if (!previous) return
    historyRef.current = historyRef.current.slice(0, -1)
    strokesRef.current = previous
    clearSelection()
    setHistorySize(historyRef.current.length)
    setHasStrokes(previous.length > 0)
    render()
  }

  const deleteSelection = () => {
    const selected = new Set(selectionRef.current?.strokes)
    if (!selected.size) return
    commit(strokesRef.current.filter((stroke) => !selected.has(stroke)))
    clearSelection()
    render()
  }

  const clear = () => {
    if (!window.confirm('Alles auf der Schreibfläche löschen?')) return
    commit([])
    clearSelection()
    render()
  }

  const zoomFromButton = (factor: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    zoomAt(factor, rect.width / 2, rect.height / 2)
  }

  const toolButton = (value: Tool, text: string) => <button type="button" aria-pressed={tool === value} onClick={() => setTool(value)}>{text}</button>

  return <div className="handwriting-pad">
    <div className="handwriting-toolbar" role="toolbar" aria-label="Werkzeuge der Schreibfläche">
      <div className="handwriting-group">
        {toolButton('pen', 'Stift')}
        {toolButton('eraser', 'Radierer')}
        {toolButton('select', 'Auswählen')}
        {toolButton('pan', 'Ansicht')}
      </div>
      <div className="handwriting-group" aria-label="Farbe">
        {inkColors.map((ink) => <button type="button" key={ink.value} className="handwriting-swatch" aria-label={`Farbe ${ink.label}`}
          aria-pressed={tool === 'pen' && color === ink.value} style={{ '--swatch': ink.value } as CSSProperties}
          onClick={() => { setColor(ink.value); setTool('pen') }}/>)}
      </div>
      <div className="handwriting-group" aria-label="Strichstärke">
        {widths.map((option) => <button type="button" key={option.value} aria-pressed={tool === 'pen' && width === option.value}
          onClick={() => { setWidth(option.value); setTool('pen') }}>{option.label}</button>)}
      </div>
      <div className="handwriting-group" aria-label="Zoom">
        <button type="button" aria-label="Verkleinern" onClick={() => zoomFromButton(1 / 1.25)} disabled={zoom <= minScale}>−</button>
        <button type="button" aria-label="Ansicht zurücksetzen" onClick={() => setView({ scale: 1, x: 0, y: 0 })}>{Math.round(zoom * 100)} %</button>
        <button type="button" aria-label="Vergrößern" onClick={() => zoomFromButton(1.25)} disabled={zoom >= maxScale}>+</button>
      </div>
      <div className="handwriting-group">
        <button type="button" onClick={undo} disabled={historySize === 0}>Rückgängig</button>
        {hasSelection && <button type="button" onClick={deleteSelection}>Auswahl löschen</button>}
        <button type="button" onClick={clear} disabled={!hasStrokes}>Alles löschen</button>
      </div>
      <label className="handwriting-finger">
        <input type="checkbox" checked={pressureEnabled} onChange={(event) => setPressureEnabled(event.target.checked)}/>
        Druckempfindlich
      </label>
      <label className="handwriting-finger">
        <input type="checkbox" checked={fingerDrawing} onChange={(event) => setFingerDrawing(event.target.checked)}/>
        Mit Finger zeichnen
      </label>
    </div>
    <canvas ref={canvasRef} className={`handwriting-canvas tool-${tool}`} role="img" aria-label={label}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
      onPointerLeave={onPointerLeave}/>
    <p className="handwriting-note">
      Stift oder Maus schreiben, ein Finger scrollt (bei Zoom: verschiebt die Ansicht), zwei Finger zoomen. Am Computer zoomt Strg + Mausrad.
      {' '}Die Handschrift wird nicht gespeichert und geht beim Schließen der Aufgabe verloren.
    </p>
  </div>
}
