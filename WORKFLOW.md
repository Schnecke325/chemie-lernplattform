# Arbeitsablauf und Projektregeln

Dieses Dokument hält den gewünschten Arbeitsstil für Claude/Codex fest. Nutzeraufträge und ihre konkreten Freigaben bestimmen den Umfang.

## Standardablauf

1. **Ziel und Grenzen lesen.** Herausarbeiten, ob der Nutzer Analyse/Planung oder ausdrücklich Implementierung verlangt. Geltende frühere Einschränkungen beachten.
2. **Ist-Zustand untersuchen.** Relevante Komponenten, Daten, Typen, Research-Belege, Validierung und Tests prüfen. Bei Fehlern zuerst die Ursache isolieren und nicht ungezielt weitere Änderungen stapeln.
3. **Umfang abgrenzen.** Für größere oder mehrdeutige Vorhaben einen konkreten Vorschlag mit betroffenen Dateien, Verhalten, Risiken und Prüfungen erstellen. In einer reinen Analysephase keine Änderungen vornehmen.
4. **Freigabe beachten.** Auf Zustimmung warten, wenn sie für die geplante größere/mehrdeutige Umsetzung erforderlich ist. Eine klare direkte Implementierungsanweisung gilt für den bezeichneten Umfang; dafür nicht redundant nachfragen.
5. **In kleinen, nachvollziehbaren Schritten umsetzen.** Bestehende Architektur weiterverwenden. Fachinhalte als Daten pflegen; keine unnötigen Abhängigkeiten, Refactorings oder Änderungen an anderen Bereichen.
6. **Prüfen.** Betroffene Content-Validierung und Produktionsbuild ausführen. UI-Verhalten bei passenden Werkzeugen im Browser kontrollieren. Fehlgeschlagene Tests analysieren und beheben, bevor das Ergebnis gemeldet wird.
7. **Ergebnis berichten.** Geänderte Dateien, Verhalten, Prüfungen, Grenzen und noch offene Punkte knapp und konkret nennen.
8. **Nächste Phase dem Nutzer überlassen.** Keine Roadmap-Prioritäten oder Folgeschritte ohne Auftrag ändern.

## Inhaltliche Regeln

- Chemie fachlich auf LK-/Abiturniveau behandeln und verständlich formulieren.
- Kein erfundener Inhalt, KCGO-Bezug, Operator, Prüfungsnachweis, Seitenverweis oder Häufigkeitswert.
- KCGO und jahrgangsbezogenen Abiturerlass von historischer Prüfungspraxis trennen.
- Quellenstellen konkret angeben; unsichere Zuordnungen als ungeklärt kennzeichnen.
- Originalaufgaben nicht vollständig kopieren. Für neue Übungsaufgaben eigene Formulierungen verwenden.
- Wenn Quellen fehlen oder eine PDF nur teilweise ausgewertet ist, das benennen, nicht stillschweigend auslassen.
- Nutzerantworten, Fortschritt oder persönliche Daten nicht in statische Aufgaben-/Lerninhalte einbauen.

## Technische und redaktionelle Regeln

- Nur Dateien im Projektverzeichnis bearbeiten und nur die für den freigegebenen Umfang erforderlichen Dateien ändern.
- Zuerst vorhandene Datenmodelle und Loader lesen. Für eine Aufgabe keine zweite parallele Aufgabenverwaltung anlegen.
- IDs stabil halten; keine bestehende Katalog- oder Lesson-ID umbenennen, nur weil ein sichtbarer Titel geändert wird.
- Fehlt optionale Metadaten, leer/ungeklassifiziert lassen. Keine AFB-, Aufgabenformat-, Bearbeitungsmodus- oder Prüfungszuordnung aus dem Bauch heraus setzen.
- `local-material/` ist durch `.gitignore` ausgeschlossen. Prüfungsoriginale und vertrauliche Materialien nicht kopieren, committen, pushen oder in öffentliche Builds aufnehmen.
- Neue Funktionen mit möglicher Nutzer-/Fortschrittsspeicherung erst nach vereinbartem Daten- und Datenschutzumfang entwickeln. UI-Ausblendung ist keine serverseitige Berechtigungskontrolle.
- Große Architekturentscheidungen (Routing, externe Dienste, Auth, Backend, Speicherung, fachliche Kapitelstruktur) vorher abstimmen.
- Keine zusätzlichen Bibliotheken einführen, wenn bestehende Browser-/React-Mittel genügen.

## Qualitätskontrollen

Für Inhalts-/Katalog-/Aufgabenänderungen:

```bash
npm run validate:content
npm run build
```

Der Build enthält die TypeScript-Projektprüfung (`tsc -b`) und den Vite-Produktionsbuild. Für UI-Änderungen mindestens `npm run build` ausführen und die betroffenen Desktop-/Mobilansichten kontrollieren, sofern Browserprüfung verfügbar ist.

Im Repository gibt es aktuell kein Testframework und keine automatisierten UI-Tests. `npm run validate:content` prüft strukturelle Zuordnungen, nicht die chemische Korrektheit. Die GitHub-Action führt `npm ci`, `npm run validate:content` und `npm run build` aus; schlägt einer dieser Schritte fehl, wird nicht veröffentlicht.

## Git und Veröffentlichung

- Keine Commits oder Pushes ohne ausdrückliche Zustimmung.
- Keine Releases, Pages-Einstellungen oder Deployments manuell ändern, sofern es nicht ausdrücklich beauftragt ist.
- Beachten, dass ein Push auf `main` den Deploy-Workflow startet und die Site unter `https://schnecke325.github.io/` sofort aktualisiert. Bei Freigabe eines Pushs muss dieser Effekt klar sein.
- Das Repository `Schnecke325.github.io` ist nur Veröffentlichungsziel. Dort nicht manuell entwickeln; der Workflow verwaltet ausschließlich `index.html`, `assets/`, `.nojekyll` und `.chemie-lernplattform-deploy`. Die übrigen Dateien dort gehören zu anderen Projekten und werden nicht verändert. Details: `PROJECT_CONTEXT.md`, Abschnitt „Deployment-Architektur“.
- Den Deploy-Key (`PAGES_DEPLOY_KEY`) nur als Actions-Secret hinterlegen, nie in Dateien, Logs oder Chats.
- Vor jeder möglichen Veröffentlichung sicherstellen, dass `local-material/`, Originalprüfungen und geschützte Inhalte nicht enthalten sind.

## Abschlussbericht – Mindestangaben

- Was geändert wurde (Dateien und Funktion).
- Was geprüft wurde und mit welchem Ergebnis.
- Was offen oder nicht eindeutig ist.
- Ob außerhalb des vereinbarten Umfangs oder außerhalb der Dokumentation etwas geändert wurde.
- Commit/Push-Status; standardmäßig keine dieser Aktionen ausgeführt.

