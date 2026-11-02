import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'

/**
 * Schreibfläche für Stift, Maus und optional Finger. Striche werden als Vektordaten
 * gehalten, damit sie später kontogebunden gespeichert werden können; derzeit
 * existieren sie nur, solange die Komponente geöffnet ist.
 */
export interface Stroke {
  tool: 'pen' | 'eraser'
  color: string
  width: number
  points: Array<[x: number, y: number, pressure: number]>
}

const inkColors = [
  { value: '#e9edf1', label: 'Hell' },
  { value: '#80d8bc', label: 'Mint' },
  { value: '#e0c48d', label: 'Gelb' },
]
const widths = [{ value: 2.5, label: 'Fein' }, { value: 5, label: 'Breit' }]
const eraserWidth = 22

function drawStroke(context: CanvasRenderingContext2D, stroke: Stroke) {
  context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
  context.strokeStyle = stroke.color
  context.fillStyle = stroke.color
  context.lineCap = 'round'
  context.lineJoin = 'round'
  const [first] = stroke.points
  if (stroke.points.length === 1) {
    context.beginPath()
    context.arc(first[0], first[1], stroke.width / 2, 0, Math.PI * 2)
    context.fill()
    return
  }
  for (let index = 1; index < stroke.points.length; index += 1) {
    const [x0, y0] = stroke.points[index - 1]
    const [x1, y1, pressure] = stroke.points[index]
    context.lineWidth = stroke.tool === 'eraser' ? stroke.width : stroke.width * (0.6 + pressure * 0.8)
    context.beginPath()
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    context.stroke()
  }
}

export function HandwritingPad({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const activeRef = useRef<{ pointerId: number; stroke?: Stroke; scrollY?: number } | null>(null)
  const [strokeCount, setStrokeCount] = useState(0)
  const [tool, setTool] = useState<Stroke['tool']>('pen')
  const [color, setColor] = useState(inkColors[0].value)
  const [width, setWidth] = useState(widths[0].value)
  const [fingerDrawing, setFingerDrawing] = useState(false)

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const ratio = window.devicePixelRatio || 1
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokesRef.current) drawStroke(context, stroke)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect()
      canvas.width = Math.round(cssWidth * ratio)
      canvas.height = Math.round(cssHeight * ratio)
      redraw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [redraw])

  const pointFrom = (event: ReactPointerEvent<HTMLCanvasElement>): Stroke['points'][number] => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pressure = event.pointerType === 'pen' && event.pressure > 0 ? event.pressure : 0.5
    return [event.clientX - rect.left, event.clientY - rect.top, pressure]
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (activeRef.current) return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Ohne Capture funktioniert das Zeichnen weiter, solange der Zeiger auf der Fläche bleibt.
    }
    if (event.pointerType === 'touch' && !fingerDrawing) {
      // Finger scrollt die Seite; die Fläche fängt Touch ab, damit ein Stift nie scrollt.
      activeRef.current = { pointerId: event.pointerId, scrollY: event.clientY }
      return
    }
    event.preventDefault()
    const stroke: Stroke = {
      tool,
      color,
      width: tool === 'eraser' ? eraserWidth : width,
      points: [pointFrom(event)],
    }
    activeRef.current = { pointerId: event.pointerId, stroke }
    const context = event.currentTarget.getContext('2d')
    if (context) drawStroke(context, stroke)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const active = activeRef.current
    if (!active || active.pointerId !== event.pointerId) return
    if (active.scrollY !== undefined) {
      window.scrollBy(0, active.scrollY - event.clientY)
      active.scrollY = event.clientY
      return
    }
    if (!active.stroke) return
    const previous = active.stroke.points[active.stroke.points.length - 1]
    active.stroke.points.push(pointFrom(event))
    const context = event.currentTarget.getContext('2d')
    if (context) drawStroke(context, { ...active.stroke, points: [previous, active.stroke.points[active.stroke.points.length - 1]] })
  }

  const onPointerEnd = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const active = activeRef.current
    if (!active || active.pointerId !== event.pointerId) return
    activeRef.current = null
    if (active.stroke) {
      strokesRef.current = [...strokesRef.current, active.stroke]
      setStrokeCount(strokesRef.current.length)
    }
  }

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1)
    setStrokeCount(strokesRef.current.length)
    redraw()
  }

  const clear = () => {
    if (!window.confirm('Alles auf der Schreibfläche löschen?')) return
    strokesRef.current = []
    setStrokeCount(0)
    redraw()
  }

  return <div className="handwriting-pad">
    <div className="handwriting-toolbar" role="toolbar" aria-label="Werkzeuge der Schreibfläche">
      <div className="handwriting-group">
        <button type="button" aria-pressed={tool === 'pen'} onClick={() => setTool('pen')}>Stift</button>
        <button type="button" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}>Radierer</button>
      </div>
      <div className="handwriting-group" aria-label="Farbe">
        {inkColors.map((ink) => <button type="button" key={ink.value} className="handwriting-swatch" aria-label={`Farbe ${ink.label}`}
          aria-pressed={tool === 'pen' && color === ink.value} style={{ '--swatch': ink.value } as CSSProperties}
          onClick={() => { setColor(ink.value); setTool('pen') }}/>)}
      </div>
      <div className="handwriting-group" aria-label="Strichstärke">
        {widths.map((option) => <button type="button" key={option.value} aria-pressed={width === option.value}
          onClick={() => { setWidth(option.value); setTool('pen') }}>{option.label}</button>)}
      </div>
      <div className="handwriting-group">
        <button type="button" onClick={undo} disabled={strokeCount === 0}>Rückgängig</button>
        <button type="button" onClick={clear} disabled={strokeCount === 0}>Alles löschen</button>
      </div>
      <label className="handwriting-finger">
        <input type="checkbox" checked={fingerDrawing} onChange={(event) => setFingerDrawing(event.target.checked)}/>
        Mit Finger zeichnen
      </label>
    </div>
    <canvas ref={canvasRef} className="handwriting-canvas" role="img" aria-label={label}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}/>
    <p className="handwriting-note">Schreibe mit Stift oder Maus. Die Handschrift wird nicht gespeichert und geht beim Schließen der Aufgabe verloren.</p>
  </div>
}
