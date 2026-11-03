import { useEffect, useRef, useState } from 'react'
import elementData from '../periodic/elements.json'
import { Icon } from './Icon'
import './PeriodicTable.css'

type Category = 'alkali' | 'alkaline' | 'lanthanide' | 'actinide' | 'transition' | 'metal' | 'metalloid' | 'nonmetal' | 'noble' | 'unknown'

interface ChemicalElement {
  number: number
  symbol: string
  name: string
  mass: string
  electronegativity: string | null
  category: Category
  oxidationStates: string[]
  configuration: string
  shells: number[]
  predicted: boolean
  period: number
  group: number | null
  row: number
  col: number
}

const elements = elementData as ChemicalElement[]

const categories: Array<{ id: Category; label: string }> = [
  { id: 'alkali', label: 'Alkalimetalle' },
  { id: 'alkaline', label: 'Erdalkalimetalle' },
  { id: 'lanthanide', label: 'Lanthanoide' },
  { id: 'actinide', label: 'Actinoide' },
  { id: 'transition', label: 'Übergangsmetalle' },
  { id: 'metal', label: 'Metalle' },
  { id: 'metalloid', label: 'Halbmetalle' },
  { id: 'nonmetal', label: 'Nichtmetalle' },
  { id: 'noble', label: 'Edelgase' },
  { id: 'unknown', label: 'Unbekannt' },
]

const categoryLabels = Object.fromEntries(categories.map(({ id, label }) => [id, label])) as Record<Category, string>

/** Schalenmodell als Hintergrund der Detailkarte: ein Ring je Schale, Elektronen gleichmäßig verteilt. */
function ShellModel({ shells }: { shells: number[] }) {
  const inner = 30
  const step = (92 - inner) / Math.max(shells.length - 1, 1)
  return <svg className="pse-shells" viewBox="-100 -100 200 200" aria-hidden="true">
    {shells.map((count, index) => {
      const radius = inner + index * step
      return <g key={index}>
        <circle r={radius} className="pse-shell-ring"/>
        {Array.from({ length: count }, (_, electron) => {
          const angle = (electron / count) * Math.PI * 2 - Math.PI / 2 + index * 0.4
          return <circle key={electron} className="pse-shell-electron" r={2.2} cx={Math.cos(angle) * radius} cy={Math.sin(angle) * radius}/>
        })}
      </g>
    })}
  </svg>
}

function ElementDetail({ element, onClose }: { element: ChemicalElement; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { closeRef.current?.focus() }, [element])
  const isFBlock = element.category === 'lanthanide' || element.category === 'actinide'

  return <div className="pse-detail-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className={`pse-detail cat-${element.category}`} role="dialog" aria-modal="true" aria-label={`${element.name}, Details`}>
      <button ref={closeRef} type="button" className="pse-detail-close" aria-label="Details schließen" onClick={onClose}><Icon name="close" size={18}/></button>
      <div className="pse-detail-tile">
        <ShellModel shells={element.shells}/>
        <span className="pse-detail-number">{element.number}</span>
        <span className="pse-detail-shells" aria-label={`Elektronen je Schale: ${element.shells.join(', ')}`}>
          {element.shells.map((count, index) => <span key={index}>{count}</span>)}
        </span>
        <span className="pse-detail-symbol">{element.symbol}</span>
        <span className="pse-detail-name">{element.name}</span>
        <span className="pse-detail-mass">{element.mass}</span>
      </div>
      <dl className="pse-facts">
        <div><dt>Kategorie</dt><dd>{categoryLabels[element.category]}</dd></div>
        <div><dt>Gruppe</dt><dd>{element.group ?? (isFBlock ? 'f-Block' : '–')}</dd></div>
        <div><dt>Periode</dt><dd>{element.period}</dd></div>
        <div><dt>Elektronegativität</dt><dd>{element.electronegativity ?? '–'}</dd></div>
        <div className="pse-fact-wide"><dt>Elektronenkonfiguration</dt><dd>{element.configuration}{element.predicted && ' (vorhergesagt)'}</dd></div>
        <div className="pse-fact-wide"><dt>Häufige Oxidationszahlen</dt><dd>{element.oxidationStates.length > 0 ? element.oxidationStates.join('  ') : '–'}</dd></div>
      </dl>
    </div>
  </div>
}

export default function PeriodicTable({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<ChemicalElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const cellRefs = useRef(new Map<number, HTMLButtonElement>())

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  const closeDetail = () => {
    const number = selected?.number
    setSelected(null)
    if (number) requestAnimationFrame(() => cellRefs.current.get(number)?.focus())
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selected) closeDetail()
      else onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return <div className="pse-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="pse-dialog" role="dialog" aria-modal="true" aria-labelledby="pse-title">
      <header className="pse-header">
        <h2 id="pse-title">Periodensystem der Elemente</h2>
        <button ref={closeRef} type="button" className="icon-button" aria-label="Periodensystem schließen" onClick={onClose}><Icon name="close" size={18}/></button>
      </header>
      <ul className="pse-legend pse-legend-outside">
        {categories.map(({ id, label }) => <li key={id} className={`cat-${id}`}>{label}</li>)}
      </ul>
      <div className="pse-scroll">
        <div className="pse-grid">
          <ul className="pse-legend">
            {categories.map(({ id, label }) => <li key={id} className={`cat-${id}`}>{label}</li>)}
          </ul>
          {elements.map((element) => <button type="button" key={element.number}
            ref={(node) => { if (node) cellRefs.current.set(element.number, node); else cellRefs.current.delete(element.number) }}
            className={`pse-cell cat-${element.category}`} style={{ gridRow: element.row, gridColumn: element.col }}
            aria-label={`${element.name}, Ordnungszahl ${element.number}`} onClick={() => setSelected(element)}>
            <span className="pse-number">{element.number}</span>
            <span className="pse-symbol">{element.symbol}</span>
            <span className="pse-name">{element.name}</span>
            <span className="pse-mass">{element.mass}</span>
          </button>)}
          <span className="pse-placeholder cat-lanthanide" style={{ gridRow: 6, gridColumn: 3 }}>57–71</span>
          <span className="pse-placeholder cat-actinide" style={{ gridRow: 7, gridColumn: 3 }}>89–103</span>
        </div>
      </div>
      <p className="pse-note">Atommassen nach IUPAC (gerundet); in eckigen Klammern die Massenzahl eines langlebigen Isotops. Elektronegativität nach Pauling. Ab Ordnungszahl 104 sind Elektronenkonfigurationen vorhergesagt.</p>
      {selected && <ElementDetail element={selected} onClose={closeDetail}/>}
    </div>
  </div>
}
