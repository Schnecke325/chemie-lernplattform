# Strukturiertes Inhaltsmodell für den Lernbereich

Dieses Modell bereitet die spätere Umsetzung vor. Es implementiert keine Funktion und verändert keine React-Datei. Ziel ist, Lerntexte und Aufgaben als eigenständige, versionierbare Daten zu pflegen und wiederverwendbar darzustellen.

## Ablagevorschlag

```text
src/content/
  catalog.json                 # Kapitelbaum, Reihenfolge, KCGO-Felder, Labels
  lessons/
    chem.basics.quantities.json
    chem.q1.1.interactions.json
    chem.q2.1.carbohydrates.json
    ...
  sources.json                 # Quellenregister für KCGO/KMK/Erlasse und Prüfungsbelege
```

Alle Lerntexte und Aufgaben gehören in `lessons/*.json`, nicht in Komponenten. React erhält Lesson-Daten über Import/Loader und rendert generische Bausteine. Ein JSON-Format ist ohne Laufzeitdienst nutzbar und lässt sich mit TypeScript-Typen sowie einem Build-/Content-Validator prüfen. Bei längeren Erklärungen können Markdown-Strings in JSON stehen; die UI sollte dafür später einen einzigen kontrollierten Renderer verwenden. Das Datenmodell benötigt weder Anmeldung noch Datenbank.

## ID-Regeln

- IDs sind dauerhaft, eindeutig, klein geschrieben und unabhängig von sichtbaren Überschriften, Reihenfolge und Dateinamen, z. B. `chem.q2.1.carbohydrates`.
- IDs werden nach Veröffentlichung nicht umbenannt oder wiederverwendet. Eine Umordnung ändert `order`, nicht die ID.
- Fragen verwenden eigene IDs unter der Lektion, z. B. `chem.q2.1.carbohydrates.exercise.fe01`.
- KCGO-Feld-IDs (`Q2.1`) sind Quellen-/Curriculum-Referenzen und ersetzen nicht die interne Inhalts-ID.
- Verweise zwischen Lerneinheiten nutzen IDs, keine Dateipfade oder Titelstrings.

## TypeScript-Vertrag

Die folgenden Typen liegen als `src/content/types.ts` vor. `src/content/index.ts` typisiert den JSON-Katalog beim Build gegen `LearningCatalog`. Das bleibt eine Daten-/Typschicht; die vorhandene Oberfläche konsumiert sie noch nicht.

```ts
type Relevance = "high" | "medium" | "supplementary";
type PublicationStatus = "draft" | "review" | "published";
type Difficulty = "basic" | "standard" | "transfer";
type Competency = "S" | "E" | "K" | "B";

interface CurriculumRef {
  sourceId: string;             // z. B. "kcgo-chemie-2026-04"
  fieldId: string;              // z. B. "Q2.1"
  subsection?: string;          // Originalbezeichnung/Teilbereich, falls sicher belegt
  status: "required" | "additional" | "year-specific";
}

interface ExamRef {
  sourceId: string;             // z. B. "hessen-la-2023-nt-d"
  year: number;
  term: "HT" | "NT";
  proposal: "A" | "B" | "C" | "D";
  pageStart: number;
  pageEnd?: number;
  taskLabel?: string;           // nur wenn auf dem Blatt nachvollziehbar
  evidenceRole: "main-topic" | "additional-topic" | "competency";
  sourceAvailability: "local-only" | "public-reference";
}

interface LearningGoal {
  id: string;
  statement: string;            // beobachtbare Handlung, Operator möglichst explizit
  competencies: Competency[];
  operators: string[];
}

interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;               // selbst verfasst, nicht kopierte Prüfungsaufgabe
  subpart?: string;
  hints: string[];
  solution: string;
  competencies: Competency[];
  operators: string[];
  sourceExamRefs?: ExamRef[];    // Aufgabenbezug, nicht automatisch Originalaufgabe
}

interface LessonContent {
  schemaVersion: 1;
  id: string;
  title: string;
  summary: string;
  order: number;
  publicationStatus: PublicationStatus;
  relevance: {
    label: Relevance;
    basis: "proposal-count-proxy" | "curriculum-only" | "cross-cutting";
    kcgoProposalCount?: number; // count of proposals, never task count
    note: string;
  };
  curriculum: CurriculumRef[];
  prerequisites: string[];       // other lesson IDs
  learningGoals: LearningGoal[];
  introduction: string;
  explanation: string;           // Markdown
  fundamentals: Array<{ term: string; explanation: string }>;
  equations: Array<{ id: string; notation: string; explanation: string }>;
  equationNote: string;
  mechanisms: Array<{ id: string; title: string; steps: string[] }>;
  workedExamples: Array<{ id: string; title: string; prompt: string; steps: string[]; result: string }>;
  examReferences: ExamRef[];
  typicalTaskTypes: string[];
  exercises: Exercise[];
  tipsAndErrors: Array<{ tip: string; commonError: string }>;
  selfTest: Exercise[];
  review: { reviewedBy?: string; reviewedOn?: string; sourceCheckedOn?: string };
}
```

## Kapitelbaum / Katalogdaten

`catalog.json` enthält nur Inhalts-/Navigationsmetadaten und verweist auf Lessons per ID. Kapitel und Unterkapitel tragen `id`, `title`, `order`, Curriculum-IDs und einen transparenten Relevanzproxy. Keine Themenbezeichnung wird über JSX-`switch`-Blöcke oder URL-Pfade als Inhaltslogik doppelt gepflegt.

Beispiel für reine Katalogmetadaten:

```json
{
  "schemaVersion": 1,
  "id": "chem.q2.1",
  "title": "Naturstoffe",
  "order": 80,
  "curriculumRefs": ["Q2.1"],
  "children": [
    { "id": "chem.q2.1.amino-acids-peptides", "lessonId": "chem.q2.1.amino-acids-peptides", "order": 10 },
    { "id": "chem.q2.1.proteins", "lessonId": "chem.q2.1.proteins", "order": 20 },
    { "id": "chem.q2.1.carbohydrates", "lessonId": "chem.q2.1.carbohydrates", "order": 30 },
    { "id": "chem.q2.1.fats-oils", "lessonId": "chem.q2.1.fats-oils", "order": 40 }
  ]
}
```

## Festgelegter ID-Katalog

Diese stabilen IDs entsprechen der Gliederung in [Lernstruktur](lernstruktur.md). Sichtbare Titel dürfen redaktionell angepasst werden; IDs bleiben bestehen.

| Kapitel / Lerneinheit | ID |
|---|---|
| Chemische Werkzeuge und quantitative Grundlagen | `chem.basics` |
| Fachsprache und Stoff-Teilchen-Modell | `chem.basics.representation` |
| Stoffmenge, Konzentration und Stöchiometrie | `chem.basics.quantities` |
| Daten, Diagramme und experimentelle Evidenz | `chem.basics.data` |
| Bindung, Struktur und Stoffeigenschaften | `chem.q1.1` |
| Bindungsarten und Teilchenstrukturen | `chem.q1.1.bonding` |
| Molekülgeometrie und Wechselwirkungen | `chem.q1.1.interactions` |
| Anorganische Strukturen | `chem.q1.1.inorganic-structures` |
| Kohlenwasserstoffe und Aromaten | `chem.q1.1.q2.3` |
| Sauerstoff-/stickstoffhaltige organische Stoffklassen | `chem.q1.organic-functional-groups` |
| Alkane, Alkene und Alkine | `chem.q1.1.hydrocarbons` |
| Aliphatische Reaktionsmechanismen | `chem.q1.1.mechanisms` |
| Aromatische Verbindungen | `chem.q2.3.aromatics` |
| Alkanole und ihre Oxidation | `chem.q1.2.alcohols` |
| Aldehyde und Ketone | `chem.q1.2.carbonyls` |
| Carbonsäuren und Säurestärke | `chem.q1.3.carboxylic-acids` |
| Esterbildung und Esterhydrolyse | `chem.q1.3.esters` |
| Säure-Base-Chemie und Protolyse | `chem.q3.2` |
| Brønsted-Säuren/Basen und Protolyse | `chem.q3.2.protolysis` |
| pH, pKS/pKB und mehrprotonige Säuren | `chem.q3.2.ph` |
| Titrationen und Analyse | `chem.q3.2.titration` |
| Puffersysteme | `chem.q3.4.buffers` |
| Konservierungsstoffe/Analytik | `chem.q1.5.preservatives` |
| Chemisches Gleichgewicht | `chem.q3.1` |
| Dynamisches Gleichgewicht und MWG | `chem.q3.1.mwg` |
| Gleichgewichtsverschiebung | `chem.q3.1.shifts` |
| Technische/organische Gleichgewichte | `chem.q3.1.applications` |
| Redoxchemie und Elektrochemie | `chem.q3.3` |
| Redoxreaktionen und Redoxgleichungen | `chem.q3.3.redox` |
| Galvanische Zellen und Zellspannung | `chem.q3.3.galvanic-cells` |
| Elektrolyse, Akkumulatoren und Korrosion | `chem.q3.3.electrolysis-corrosion` |
| LK-Vertiefungen Elektrochemie | `chem.q3.3.advanced` |
| Naturstoffe | `chem.q2.1` |
| Aminosäuren und Peptide | `chem.q2.1.amino-acids-peptides` |
| Proteine | `chem.q2.1.proteins` |
| Kohlenhydrate | `chem.q2.1.carbohydrates` |
| Fette, Öle und Fettsäuren | `chem.q2.1.fats-oils` |
| Biogene Makromoleküle im Kontext | `chem.q2.1.biopolymers` |
| Kunststoffe und organische Werkstoffe | `chem.q2.2` |
| Polymerisationsreaktionen | `chem.q2.2.polymerization` |
| Polykondensation und Polyaddition | `chem.q2.2.polycondensation-polyaddition` |
| Struktur, Eigenschaften und Anwendung | `chem.q2.2.properties` |
| Recycling und ökologische Werkstoffbewertung | `chem.q2.2.sustainability` |
| Organische Werkstoffe (PLA, Copolymere etc.) | `chem.q2.4.organic-materials` |
| Energie und Reaktionsgeschwindigkeit | `chem.q4.1` |
| Energieumsatz/Enthalpie/Kalorimetrie | `chem.q4.1.enthalpy` |
| Satz von Hess | `chem.q4.1.hess` |
| Entropie und freie Enthalpie | `chem.q4.1.entropy-gibbs` |
| Reaktionskinetik und Katalyse | `chem.q3.5.kinetics` |
| Ergänzende Anwendungen und Nachhaltigkeit | `chem.applications` |
| Seifen, Tenside und Waschen | `chem.q1.4.q4.3.surfactants` |
| Energieumwandlung/nachhaltige Chemie | `chem.q4.2.energy-sustainability` |
| Bewertung chemischer Anwendungen | `chem.applications.evaluation` |

## Quellenregister und Aufgabenreferenzen

- `sources.json` enthält stabile `sourceId`s für KCGO April 2026, KCGO 2016, KMK-Standards, Abiturerlass 2027, Operatorenblatt und jeden verwendeten Prüfungsbeleg.
- Eine Exam-Referenz speichert Jahr, HT/NT, Vorschlag, aufgedruckte Seite und gegebenenfalls Teilaufgabenlabel. Keine Referenz darf erfunden werden; unbekannte Aufgabe bleibt ohne `taskLabel`.
- Originalaufgaben sind geschützte lokale Quellen. `sourceAvailability: "local-only"` bedeutet: Metadatum für interne Redaktion, kein Dateilink und keine Datei im öffentlichen Bundle.
- Öffentlich auslieferbare Übungsaufgaben sind eigenständig formuliert oder rechtlich freigegeben. Das Modell erlaubt eine Quellenreferenz zur Kompetenz-/Kontextorientierung, aber kopiert keine Original-Aufgabenstellung oder Lösung.
- Alte Aufgabenbelege und KCGO-Gültigkeit sind getrennte Felder. Ein Exam-Verweis kann eine historische Kompetenz stützen, setzt nicht `CurriculumRef.status`.

## Qualitätsregeln für Veröffentlichung

1. Jede veröffentlichte Lektion hat Lernziele, Voraussetzungen, Erklärung, Fachbegriffe, Übungsaufgaben samt Lösung und Selbsttest; nicht zutreffende Gleichungs-/Mechanismusfelder sind leere Arrays, keine ausgedachten Inhalte.
2. Jede fachliche Aussage mit Erlassabhängigkeit wird auf die Ausgabe/Jahrgangsvorgabe bezogen.
3. Jede Prüfungshäufigkeitszahl trägt die Einheit „Vorschläge mit Themenbeleg“ und wird nicht als Anzahl von Aufgaben oder Bewertungseinheiten beschriftet.
4. Prüfungsreferenzen müssen auf vorhandene Originalseiten verweisen. Ungeklärte Inventarstellen werden nicht als negative Belege genutzt.
5. Veröffentlichung erfolgt erst nach fachlicher Prüfung; `draft` und `review` werden im öffentlichen Katalog nicht gerendert.
6. Inhaltsvalidierung sollte IDs/Dubletten, tote interne Verweise, fehlende Pflichtfelder, unbekannte KCGO-IDs und das Auftreten lokaler Dateipfade erkennen.

## Bewusst nicht Teil des Modells

Dieses statische Inhaltsmodell legt weder Benutzerkonten noch persönliche Lernstände, Kommentare, Handschriftnotizen oder Berechtigungen fest. Diese Daten gehören in die spätere, separat geplante Auth-/Datenbankarchitektur und dürfen nicht als globale Lerninhalte publiziert werden.
