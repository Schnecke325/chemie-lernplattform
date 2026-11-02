# Arbeitsanweisung für Claude

## Projekt

Dies ist eine statische React-/TypeScript-Lernplattform für Schülerinnen und Schüler im Chemie-Leistungskurs der gymnasialen Oberstufe in Hessen. Ziel ist die verständliche, fachlich präzise Vorbereitung auf das hessische Chemie-Landesabitur. Die Anwendung wird ohne dauerhaftes Backend als GitHub-Pages-Site betrieben.

Lies vor der Arbeit:

1. `PROJECT_CONTEXT.md` für den tatsächlichen technischen Stand.
2. `WORKFLOW.md` für den vereinbarten Arbeitsablauf und Freigabegrenzen.
3. `ROADMAP.md` für den dokumentierten Projektstand.
4. Die einschlägigen Dateien unter `research/`, `src/content/` und `src/pages/` für die konkrete Aufgabe.

Prüfe bei jedem Auftrag zuerst den aktuellen Code und die betroffenen Dateien. Diese Dateien sind maßgeblich, wenn ältere Planungsdokumente oder frühere Übergabestände davon abweichen. Behaupte keine Implementierung allein aufgrund eines Roadmap-Eintrags.

## Arbeitsmodus und Freigaben

- Bei einer Analyse- oder Planungsanfrage: nur untersuchen und berichten; keine Umsetzung vornehmen.
- Bei größeren, mehrdeutigen oder mehrere Bereiche betreffenden Änderungen: Ist-Zustand untersuchen, einen konkreten Umfang samt betroffenen Dateien vorschlagen und vor der Umsetzung auf Freigabe warten.
- Wenn der Nutzer eine klar abgegrenzte Umsetzung ausdrücklich freigibt oder direkt beauftragt, arbeite innerhalb dieses Umfangs weiter, ohne dieselbe Freigabe erneut abzufragen.
- Ändere nur Projektdateien, die für den Auftrag erforderlich sind. Keine Refactorings oder Designänderungen „nebenbei“.
- Roadmap-Inhalte und Prioritäten nicht eigenmächtig ändern. Einen Status nur nach bestätigtem Arbeitsstand und mit nachvollziehbarem Beleg aktualisieren.
- Keine Git-Commits, Pushes, Veröffentlichungen oder Änderungen an Repository-Einstellungen ohne ausdrückliche Zustimmung.
- Niemals außerhalb des Projektordners arbeiten. `local-material/` enthält lokale Arbeitsquellen und ist durch `.gitignore` ausgeschlossen. Prüfungsoriginale nicht in Git aufnehmen, in die Anwendung einbetten oder in die öffentliche Site kopieren.

## Architektur im Überblick

- React 19, TypeScript 5.8 und Vite 6.
- Einstieg: `src/main.tsx`; Seitenumschaltung über React-State in `src/App.tsx`, keine URL-basierte Router-Bibliothek.
- Navigation/Layout: `src/components/AppShell.tsx`, `Sidebar.tsx`; Seitentypen in `src/types/navigation.ts`.
- Datengetriebener Lernbereich: `src/content/catalog.json`, `src/content/lessons/*.json`, zentrale Aufgabenbank `src/content/exercises.json`, Verträge und Loader in `src/content/types.ts` und `src/content/index.ts`.
- Seiten und lokale Styles liegen in `src/pages/`; gemeinsame Basisstile in `src/styles/global.css`.
- Es gibt keine Authentifizierung, Datenbank, Server-API, Nutzerantworten oder Fortschrittsspeicherung.

Details, Schema-IDs, Ladepfade, Scripts und Einschränkungen stehen in `PROJECT_CONTEXT.md`.

## Lerninhalte und Aufgaben ergänzen

1. Zuerst den bestehenden Eintrag in `src/content/catalog.json`, das Datenmodell in `src/content/types.ts` und die Validierung in `src/content/index.ts` prüfen.
2. IDs sind stabil und unabhängig von sichtbaren Titeln. Bestehende IDs nicht umbenennen oder wiederverwenden. Neue IDs nach dem existierenden Schema und eindeutig vergeben.
3. Neue Unterkapitel nur in Abstimmung mit dem Nutzer in den Katalog aufnehmen. Geplante Einträge bekommen `status: "planned"` und keine `lessonId`; sie dürfen nicht auf fehlende Dateien verweisen.
4. Vollständige Lernseiten als JSON unter `src/content/lessons/` pflegen, nicht als fachliche Texte in React-Komponenten. Schema-Version und Pflichtfelder mit `LessonContentRecord` abgleichen.
5. Aufgaben zentral genau einmal in `src/content/exercises.json` pflegen. Lektionen referenzieren sie über `exerciseIds` und `selfTestIds`. `sourceLessonId` und `sourceKind` müssen dazu passen. Keine Aufgabenobjekte zusätzlich in Lektionen duplizieren.
6. Nur belegte Metadaten eintragen. `taskType`, `afb`, `supportedModes` und `sourceExamRefs` sind optional. In der vorhandenen Bank sind diese Felder derzeit nicht klassifiziert; keine Einstufung aus dem Aufgabentitel oder Bauchgefühl ableiten.
7. Historische Prüfungsbezüge mit Jahr, HT/NT, Vorschlag und Aufgaben-/Seitenreferenz aus den Quellen dokumentieren. Originalaufgabentexte nicht vollständig übernehmen; eigene Übungsaufgaben formulieren.
8. Für neue Lektionen sind vorhandene Kompetenzbereiche, Operatoren, Lernziele, Vorkenntnisse, Quellenbezüge, Beispiele, Aufgaben, Hinweise und Musterlösungen gemäß Typmodell zu verwenden. Inhalte müssen tatsächlich fachlich geprüft sein.
9. Nach Änderungen an Katalog, Aufgaben oder Lektionen `npm run validate:content` und `npm run build` ausführen. Für reine CSS- oder UI-Änderungen zumindest den Build ausführen und die betroffene Ansicht bei verfügbaren Browserwerkzeugen kontrollieren.

## Chemische Fachlichkeit und Recherche

- Zielniveau: Chemie-LK und hessisches Landesabitur. Modern, direkt und verständlich schreiben, ohne Slang oder fachliche Verkürzungen.
- Formeln, Reaktionsgleichungen, Ladungen, Einheiten, Rechenwege, Mechanismen und Musterlösungen sorgfältig prüfen. Voraussetzungen, Annahmen, Gültigkeitsgrenzen und typische Fehler nennen, wenn sie fachlich relevant sind.
- Keine chemischen Inhalte, Quellen, Prüfungsbezüge, KCGO-Anforderungen, Operatorzuordnungen oder Häufigkeiten erfinden.
- Normative curriculare Gültigkeit (KCGO und jahrgangsspezifischer Abiturerlass) von empirischen historischen Prüfungsvorkommen trennen. Altprüfungen sind kein automatischer Beleg für aktuelle Verbindlichkeit.
- Die Forschungsunterlagen dokumentieren 131 lokal verfügbare Prüfungs-PDFs (2007–2025) und eine Excel-Übersicht; sie sind kein öffentliches Archiv. Historische Häufigkeiten werden dort derzeit auf Vorschlagsebene gezählt. Eine detaillierte Teilfragenzählung und belastbare Häufigkeitsklassen sind nicht vollständig vorhanden.
- Das KCGO April 2026 und der Abiturerlass 2027 haben laut `research/curriculum-abgleich.md` eine Versionsabweichung. Diese nicht eigenmächtig auflösen; für konkrete Aussagen die jeweilige geltende Quelle benennen und Unsicherheit offenlegen.
- Falls Material fehlt, nicht lesbar oder nicht eindeutig zuzuordnen ist, kennzeichne es als fehlend, unlesbar oder ungeklärt. „Ungeklärt“ nicht zu einer Datenlücke umdeuten.

## Mit dem Nutzer abzustimmen

Vorherige ausdrückliche Nutzerentscheidungen gelten weiter. Im Übrigen die Zustimmung des Nutzers einholen, bevor du:

- eine freigegebene Kapitelstruktur wesentlich änderst, Themen umsortierst oder neue Hauptbereiche ergänzt;
- Inhalte als fachlich freigegeben/veröffentlicht markierst oder historische Prüfungszahlen zu Prioritäten erklärst;
- die statische Architektur um Authentifizierung, Backend, Datenbank, Speicherung oder externe Dienste erweiterst;
- Originalprüfungen oder andere wichtige lokale Quellen verschiebst, löschst, veröffentlichst oder in den Build aufnimmst;
- Roadmap-Reihenfolge oder Projektprioritäten änderst;
- einen Commit, Push, Release oder Deployment außerhalb des bereits konfigurierten CI-Ablaufs auslöst.

Kleine, klar beauftragte Änderungen innerhalb der bestehenden Architektur brauchen keine erneute Planungsfreigabe.

