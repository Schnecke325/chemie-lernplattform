# Projektkontext – Chemie Lernraum

**Bestandsaufnahme:** 31.10.2026  
**Zweck:** Technische Übergabe auf Basis des aktuellen Repository-Stands. Bei Abweichungen hat der Code Vorrang vor älteren Planungsdokumenten.

## Projekt und Technologien

Statische Lernplattform für die Vorbereitung auf das hessische Chemie-Landesabitur im Leistungskurs. Kein Backend und keine Authentifizierung.

| Bereich | Ist-Stand |
|---|---|
| UI | React 19.1 (Lockfile: 19.3.1), React DOM 19.3.1 |
| Sprache | TypeScript 5.8.3, strict aktiviert |
| Bundler/Dev-Server | Vite 6.4.5, `@vitejs/plugin-react` 4.7.0 |
| Paketformat | npm, ES Modules, Lockfile v3 |
| Basis-URL | `/` in `vite.config.ts` (Veröffentlichung unter `https://schnecke325.github.io/`) |
| CI-Node | Node 22 in `.github/workflows/deploy.yml` |
| Lokal ermittelte Laufzeit | Node 24.22.1, npm 11.20.0 (nur Bestandsaufnahme; nicht als Projektvorgabe festgeschrieben) |
| Externe Laufzeitdienste | Keine |

Die Paketbereiche sind in `package.json` festgelegt; genaue installierte Versionen stehen in `package-lock.json`. Es gibt kein `.nvmrc` und keine dokumentierte Mindestversion lokaler Node-Laufzeiten.

## Verzeichnisstruktur

```text
.
├── .github/workflows/deploy.yml   # Build und Veröffentlichung nach Schnecke325.github.io
├── research/                      # KCGO-, Prüfungs- und Inhaltsdokumentation
├── scripts/validate-exercise-bank.mjs
├── src/
│   ├── components/                # Sidebar, AppShell, Icons, Platzhalterbadge
│   ├── content/
│   │   ├── catalog.json           # Hauptkapitel und Unterkapitel
│   │   ├── exercises.json         # zentraler Aufgabenbestand
│   │   ├── index.ts               # Loader und Laufzeitvalidierung
│   │   ├── types.ts               # Content-Verträge
│   │   └── lessons/*.json         # eine Daten-Datei je ausgearbeitetem Unterkapitel
│   ├── pages/                     # Dashboard, Lernseite, Übungen, weitere Platzhalter
│   ├── styles/global.css          # Farben, Layoutbasis, globale Responsive-Regeln
│   ├── types/navigation.ts        # PageId und NavigationItem
│   ├── App.tsx                    # zustandsbasierte Seitenumschaltung
│   └── main.tsx                   # React-Einstieg und CSS-Import
├── index.html
├── package.json / package-lock.json
├── tsconfig*.json
└── vite.config.ts
```

`local-material/` ist laut `.gitignore` ausgeschlossen. Die Forschungsdokumentation beschreibt dort 131 Prüfungs-PDFs und eine Excel-Datei; diese Originalmaterialien gehören nicht in den öffentlichen Quellstand oder Build.

## Navigation und Seiten

`src/App.tsx` hält eine `PageId` in React-State. Das ist keine URL-Router-Lösung: Ein Wechsel wird nicht als eigenständige Browserroute gespeichert und ein Neuladen beginnt wieder beim Dashboard. Die Seiten-IDs sind `dashboard`, `lernen`, `uebungen`, `abiturarchiv` und `fortschritt`.

- **Dashboard:** `src/pages/DashboardPage.tsx`; vorhandene Oberfläche, aber Kennzahlen und Lernpfad sind Platzhalter.
- **Lernbereich:** `src/pages/LearningPage.tsx`; Katalogauswahl, vollständige JSON-Lernseiten, Inhaltsübersicht und bestehende Aufgaben-/Selbsttestdarstellung. Die mobile Katalogansicht verwendet aufklappbare Hauptkapitel; mehrere Kapitel können offen sein. Beim Wechsel der Lernseiten-ID wird der Dokument-Scrollbereich an den Seitenanfang positioniert, mit `prefers-reduced-motion` berücksichtigt.
- **Übungsbereich:** `src/pages/ExercisesPage.tsx` und `.css`; lädt die zentrale Aufgabenbank und zeigt Titel, Thema, Schwierigkeitsgrad, Quelle und vorhandene Kompetenzen. Filter: Kapitel, Unterkapitel, Schwierigkeit, Quelle, Kompetenz. AFB und Bearbeitungsmodus erscheinen als nicht klassifiziert/deaktiviert, da keine Aufgaben entsprechende Angaben besitzen. Alle passenden Ergebnisse werden direkt gerendert; Suche und Pagination gibt es nicht.
- **Abiturarchiv und Lernfortschritt:** `src/pages/PlaceholderPage.tsx`; Platzhalteransichten. Keine Originalprüfungen im App-Archiv, keine Nutzerfortschritte.
- **Gemeinsames Layout:** `src/components/AppShell.tsx` und `Sidebar.tsx`; mobile Navigation als seitliches Menü.

Die mobile Sidebar greift bei `max-width: 800px`, zusätzliche enge Layoutregeln liegen u. a. bei `max-width: 600px`. Lern- und Übungsseiten haben separate CSS-Dateien; globale Design-Tokens und Dashboard-/Shell-Stile stehen in `src/styles/global.css`.

## Katalog, Lerninhalte und Aufgaben

### Katalog

`src/content/catalog.json` hat Schema-Version 1 und enthält derzeit **12 Hauptkapitel und 47 Unterkapiteleinträge**. Davon sind **42 mit einer `lessonId` verknüpft**. Das zuletzt ergänzte Kapitel `chem.experimental` hat fünf Einträge mit Status `planned`, ohne `lessonId` und ohne Lernseiten-Dateien. Die Oberfläche stellt diese als geplant/deaktiviert dar.

IDs wie `chem.q3.1.mwg` sind stabile Daten-IDs und nicht aus Routepfaden abzuleiten. Kapitelzugehörigkeit und sichtbare Themenbezeichnungen werden über den Katalog bestimmt.

### Lernseiten

- 42 JSON-Dateien in `src/content/lessons/`.
- Aktuelles Rohformat: `LessonContentRecord`, `schemaVersion: 2`.
- Alle 42 Einträge tragen momentan `publicationStatus: "review"`.
- Lektionen enthalten strukturierte Lernziele, Curriculum-Referenzen, Erklärungstexte, Fachbegriffe, Gleichungen, Beispiele, Prüfungsreferenzen, Hinweise sowie Referenzlisten `exerciseIds` und `selfTestIds`.
- Die Oberfläche zeigt einen redaktionellen Review-Hinweis. Technisch prüft die Katalognavigation im aktuellen Code die Existenz einer Lesson-Datei; sie erzwingt keinen Gate anhand von `publicationStatus`.

### Aufgabenbank

`src/content/exercises.json` hat Schema-Version 1 und **380 eindeutige Aufgaben**: 252 mit `sourceKind: "exercise"` und 128 mit `sourceKind: "selfTest"`. Lektionen speichern nur die zugehörigen IDs. `sourceLessonId` und `sourceKind` verknüpfen jeden Eintrag zurück zur Lektion und zur jeweiligen Liste.

Eine Aufgabe besitzt u. a. ID, Titel, Schwierigkeitsgrad, Prompt, Hinweise, Lösung, Kompetenzbereiche und Operatoren. Aktuell sind bei **0/380** Aufgaben `taskType`, `afb`, `supportedModes` oder `sourceExamRefs` gesetzt. Der Übungsbereich darf diese Angaben nicht inferieren. Kompetenzfilter können mit den tatsächlich vorhandenen Kompetenzcodes arbeiten.

Das Modell enthält keine Nutzerantworten, Versuche, Punktzahlen oder Fortschrittsdaten. Die Lernseite kann weiterhin die Hinweise/Lösung über `<details>` anzeigen; der eigenständige Übungsbereich bietet derzeit nur Suche über Filter/Anzeige, keine Bearbeitung oder Bewertung.

## Loader und Validierung

`src/content/index.ts`:

- importiert und validiert `catalog.json`;
- erstellt einen `import.meta.glob`-Loader über die vorhandenen Lektionen;
- lädt `exercises.json` dynamisch und baut eine ID-Map;
- validiert Aufgabenstruktur und eindeutige IDs und prüft, ob Aufgaben auf eine katalogisierte Lesson-Datei zeigen;
- exportiert `getAllExercises()`, `getExerciseById()` und `getLessonById()`;
- löst bei `getLessonById()` `exerciseIds`/`selfTestIds` auf und kontrolliert Zugehörigkeit und Quellentyp.

`npm run validate:content` ruft `scripts/validate-exercise-bank.mjs` auf. Es prüft Katalog-/Lesson-Abdeckung, aktuell 42 Lesson-Dateien, Aufgabenreferenzen, Duplikate/Waisen, Quelltyp, Kapitelverknüpfungen und Sollzählungen 252/128/380. Es ersetzt keine chemische oder redaktionelle Prüfung.

## Research-Stand und Grenzen

Vorhandene Kernunterlagen: `research/pruefungsinventar.md`, `pruefungsanalyse_2007-2025.md`, `pruefungshaeufigkeit.md`, `themenkatalog.md`, `curriculum-abgleich.md`, `kompetenzen-und-aufgabentypen.md`, `lernstruktur.md`, `inhaltsmodell.md`, `phase4-fortschritt.md`, `zusammenarbeit-und-notizen.md`.

Die Research-Dateien dokumentieren KCGO Chemie April 2026, KCGO 2016 zum Vergleich, KMK-Bildungsstandards sowie Abiturerlass und Operatorenblatt 2027. Dort wird eine Versionsabweichung beschrieben: LA 2027 verweist im Chemieabschnitt auf KCGO-Ausgabe 2024, während die neue offizielle KCGO-Ausgabe April 2026 existiert. Nicht selbst durch Vermutung auflösen.

Die 131 lokalen Prüfungspdfs sind laut Research textextrahiert und thematisch nach Jahr/Termin/Vorschlag ausgewertet. Der Korpus ist nicht versioniert und soll nicht veröffentlicht werden. Vorschlagszählungen sind empirische historische Belege, keine amtliche Relevanz. Eine vollständige Teilfragen-/Punkte-Codierung und Häufigkeitsklassen stehen noch aus. Visuelle Details in Formeln, Diagrammen und Abbildungen können Textextraktion entgehen.

## Design

Dunkles industriell-wissenschaftliches Erscheinungsbild mit Grundfarbe `#0b0f14`, dunklen Flächen, fein abgestuften Linien und Mint-Akzent (`#80d8bc`). Systemschriftstapel, klare Karten, monospace Metadaten. CSS ist weitgehend ohne Komponentenbibliothek umgesetzt. Responsivität wird in `global.css`, `LearningPage.css` und `ExercisesPage.css` gepflegt. Neue UI sollte dieselben Token/Farben und Breakpoints nutzen, mobile Steuerflächen gut bedienbar halten und Animationen sparsam gestalten.

## Scripts, Build und Deployment

```bash
npm install
npm run dev
npm run validate:content
npm run build
npm run preview
```

`npm run build` führt `tsc -b` und danach `vite build --configLoader runner` aus. `vite.config.ts` setzt `base: "/"`, weil die Site an der Domainwurzel ausgeliefert wird. Es gibt kein Testframework und keine automatisierten Unit-/Komponententests; neben TypeScript/Build existiert der Content-Validator. UI-Tests erfolgten in bisherigen Arbeitsphasen manuell im Browser, sind aber kein im Repository liegender Testlauf.

### Deployment-Architektur

| Repository | Rolle |
|---|---|
| `Schnecke325/chemie-lernplattform` | Quellcode, Inhalte, Research-Dokumentation, Workflow. Einziges Entwicklungsrepository. |
| `Schnecke325/Schnecke325.github.io` | Reines Veröffentlichungsziel. GitHub Pages liefert Branch `main`, Ordner `/ (root)` unter `https://schnecke325.github.io/` aus. |

Ablauf (`.github/workflows/deploy.yml`, bei Push auf `main` oder manuell):

1. Checkout, Node 22, `npm ci`.
2. `npm run validate:content` und `npm run build`. Schlägt ein Schritt fehl, endet der Job, bevor das Zielrepository berührt wird.
3. Build-Prüfung: `dist/` darf nur `index.html` und `.js`/`.css` unter `assets/` enthalten und nicht auf `local-material` verweisen.
4. Klon des Zielrepositorys per SSH-Deploy-Key. Ersetzt werden ausschließlich die verwalteten Pfade `index.html`, `assets/`, `.nojekyll` und die Markierungsdatei `.chemie-lernplattform-deploy` (enthält Quell-Repository und Commit-SHA). Ein Commit „Build aus Schnecke325/chemie-lernplattform@<sha>“ wird nach `main` gepusht.
5. Der Push löst im Zielrepository den GitHub-Workflow `pages-build-deployment` aus, der die Site veröffentlicht.

Sicherungen: Der Workflow bricht ab, wenn beim ersten Deployment bereits eine fremde `index.html` oder ein fremdes `assets/` existiert, oder wenn eine Änderung außerhalb der verwalteten Pfade vorgemerkt wäre. Die übrigen Dateien im Zielrepository (frühere HTML-Seiten, Bilder, `images/`, `README.md`, Branch `images`) bleiben unverändert und unter ihren bisherigen Adressen erreichbar. `.nojekyll` schaltet die Jekyll-Verarbeitung für das gesamte Zielrepository ab. Das Quellrepository selbst nutzt kein GitHub Pages.

Berechtigungen und Einstellungen:

- Zielrepository → *Settings → Deploy keys*: öffentlicher Schlüssel eines eigens erzeugten SSH-Schlüsselpaars mit **Allow write access**.
- Quellrepository → *Settings → Secrets and variables → Actions*: privater Schlüssel als Secret `PAGES_DEPLOY_KEY`. Er steht weder im Code noch im Build. Der Workflow selbst hat nur `contents: read` auf das Quellrepository.
- Zielrepository → *Settings → Pages*: *Deploy from a branch*, `main`, `/ (root)`.

Fehlererkennung: roter Lauf unter *Actions* im Quellrepository (Validierung, Build, Build-Prüfung oder Push) bzw. roter Lauf `pages-build-deployment` im Zielrepository; GitHub benachrichtigt bei fehlgeschlagenen Läufen standardmäßig per E-Mail.

Navigation an der Domainwurzel: Seiten werden über React-State gewechselt, es gibt nur die Adresse `/`. Neuladen führt zum Dashboard; direkte Pfade wie `/lernen` existieren nicht und liefern 404. Eine `404.html`-Weiterleitung ist deshalb nicht nötig.

## Dokumentationsabweichungen

- `README.md` enthält noch den Satz, dass alle sichtbaren Lern- und Prüfungsdaten Platzhalter seien. Das ist für den aktuellen Stand nicht mehr korrekt: 42 strukturierte Lernseiten und 380 Aufgaben sind im Repository. Sie sind allerdings weiterhin im Review-Status und nicht als fachlich freigegeben zu behandeln. Dieser Übergabeauftrag ändert die README nicht.
- `research/phase4-fortschritt.md` nennt 11 Hauptkapitel/42 Unterkapitel; der aktuelle Katalog enthält zusätzlich das Experimentierkapitel mit fünf geplanten Unterkapiteln (12/47 gesamt, weiterhin 42 Lesson-Dateien).
- `research/inhaltsmodell.md` beschreibt teilweise den ursprünglichen Vorschlag (Schema 1, Aufgaben direkt in Lessons). Der tatsächliche Code verwendet Lesson-Rohschema 2, ID-Referenzen und eine zentrale Aufgabenbank.
- `research/README.md` ist als Forschungsstand zu lesen und nicht als aktueller technischer Änderungsbericht.
- `research/lernziele.md` liegt laut Repository nicht vor; die Lernziele stehen in `research/lernstruktur.md` und den einzelnen Lesson-Datensätzen.

## Noch nicht implementiert

Aufgabenbearbeitung und automatische Bewertung, Handschrift/Stifteingabe, Nutzerlösungen und deren Persistenz, persönlicher Lernfortschritt, Prüfungssimulation, Kommentarfunktion, private/geteilte Notizen, Benutzerkonten, Admin-Oberfläche, Supabase Auth/PostgreSQL/RLS/Edge Functions sowie privater Dateispeicher. Diese Themen sind teils konzeptionell in `research/zusammenarbeit-und-notizen.md` oder vorherigen Übergabeanforderungen erwähnt, aber nicht im Anwendungscode implementiert.

