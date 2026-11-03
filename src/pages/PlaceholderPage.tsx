import { Icon } from '../components/Icon'
import { PlaceholderBadge } from '../components/PlaceholderBadge'
import type { PageId } from '../types/navigation'

type PlaceholderPageId = Extract<PageId, 'lernen' | 'uebungen' | 'abiturarchiv' | 'fortschritt'>

const pageInfo: Record<PlaceholderPageId, { eyebrow: string; title: string; description: string; icon: string }> = {
  lernen: { eyebrow: 'WISSEN AUFBAUEN', title: 'Lernbereich', description: 'Kapitel, verständliche Erklärungen und Beispiele werden hier strukturiert ergänzt.', icon: 'flask' },
  uebungen: { eyebrow: 'WISSEN ANWENDEN', title: 'Übungsbereich', description: 'Aufgaben, Hinweise und Musterlösungen werden hier ergänzt, sobald die Inhalte fachlich ausgearbeitet sind.', icon: 'book' },
  abiturarchiv: { eyebrow: 'MIT ORIGINALPRÜFUNGEN LERNEN', title: 'Abiturarchiv', description: 'Das Archiv wird nach Jahrgang, HT/NT und Vorschlag organisiert. Themenangaben folgen der Auswertung verfügbarer Prüfungen.', icon: 'archive' },
  fortschritt: { eyebrow: 'DEIN WEG IM BLICK', title: 'Lernfortschritt', description: 'Dein persönlicher Lernstand wird in einer späteren Phase ergänzt. In diesem Grundgerüst werden keine Daten gespeichert.', icon: 'chart' },
}

interface PlaceholderPageProps { page: PlaceholderPageId }

export function PlaceholderPage({ page }: PlaceholderPageProps) {
  const info = pageInfo[page]
  return <div className="placeholder-page"><div className="eyebrow"><span className="eyebrow-line"/> {info.eyebrow}</div>
    <section className="placeholder-panel"><div className="placeholder-icon"><Icon name={info.icon} size={25}/></div><PlaceholderBadge/><h1>{info.title}</h1><p>{info.description}</p><div className="placeholder-rule"/><div className="placeholder-status"><span className="status-dot"/> BEREICH IM AUFBAU</div></section>
  </div>
}
