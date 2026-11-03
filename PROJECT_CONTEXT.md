# Projektkontext – Chemie Lernraum

**Bestandsaufnahme:** 31.10.2026  
**Zweck:** Technische Übergabe auf Basis des aktuellen Repository-Stands. Bei Abweichungen hat der Code Vorrang vor älteren Planungsdokumenten.

## Projekt und Technologien

Statische Lernplattform für die Vorbereitung auf das hessische Chemie-Landesabitur im Leistungskurs. Seit 04.11.2026 gibt es optionale Benutzerkonten über Supabase (siehe „Benutzerkonten“); ohne Supabase-Konfiguration läuft die Seite wie bisher rein statisch.

| Bereich | Ist-Stand |
|---|---|
| UI | React 19.1 (Lockfile: 19.3.1), React DOM 19.3.1 |
| Sprache | TypeScript 5.8.3, strict aktiviert |
| Bundler/Dev-Server | Vite 6.4.5, `@vitejs/plugin-react` 4.7.0 |
| Paketformat | npm, ES Modules, Lockfile v3 |
| Basis-URL | `/` in `vite.config.ts` (Veröffentlichung unter `https://schnecke325.github.io/`) |
| CI-Node | Node 22 in `.github/workflows/deploy.yml` |
| Lokal ermittelte Laufzeit | Node 24.22.1, npm 11.20.0 (nur Bestandsaufnahme; nicht als Projektvorgabe festgeschrieben) |
| Externe Laufzeitdienste | Supabase (Auth, PostgreSQL mit RLS, Edge Function `admin-users`), nur wenn beim Build konfiguriert; Bibliothek `@supabase/supabase-js` 2.118 |

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

`src/App.tsx` hält eine `PageId` in React-State. Das ist keine URL-Router-Lösung: Ein Wechsel wird nicht als eigenständige Browserroute gespeichert und ein Neuladen beginnt wieder beim Dashboard. Die Seiten-IDs sind `dashboard`, `lernen`, `uebungen`, `abiturarchiv` (nur mit Recht „Abiturarchiv“ im Menü), `fortschritt`, `admin` (Benutzerverwaltung, nur für Admins im Menü) und `datenschutz` (Link in der Fußzeile und im Anmeldefenster).

- **Dashboard:** `src/pages/DashboardPage.tsx`; seit K3 mit echten Kennzahlen (sicher von 425, Wiederholungsliste, in den letzten 7 Tagen bearbeitet) und „Dein nächster Schritt“ (oberster Eintrag der Wiederholungsliste, sonst erste offene Aufgabe in Katalogreihenfolge, mit Sprung in den Übungsbereich). Die Abiturarchiv-Karte bleibt Platzhalter.
- **Lernbereich:** `src/pages/LearningPage.tsx`; Katalogauswahl, vollständige JSON-Lernseiten, Inhaltsübersicht sowie direkt bearbeitbare Übungen und Selbsttests mit derselben Komponente wie im Übungsbereich (Eingabefelder sofort sichtbar, Ergebnis-Etiketten im Kartenkopf). Der Abschnitt „Lösungshinweise und typische Fehler“ bleibt erhalten und heißt in der Inhaltsnavigation „Typische Fehler“. Die mobile Katalogansicht verwendet aufklappbare Hauptkapitel; mehrere Kapitel können offen sein. Beim Wechsel der Lernseiten-ID wird der Dokument-Scrollbereich an den Seitenanfang positioniert, mit `prefers-reduced-motion` berücksichtigt.
- **Übungsbereich:** `src/pages/ExercisesPage.tsx` und `.css`; lädt die zentrale Aufgabenbank und zeigt Titel, Thema, Schwierigkeitsgrad, Quelle und vorhandene Kompetenzen. Filter: Kapitel, Unterkapitel, Schwierigkeit, Quelle, Kompetenz. Seit 02.11.2026 ist der AFB-Filter aktiv, weil alle Aufgaben einen AFB besitzen; seit der Einstufung der Bearbeitungsmodi ist auch der Filter „Bearbeitungsmodus“ aktiv. Alle passenden Ergebnisse werden direkt gerendert; Suche und Pagination gibt es nicht. **Aufgabenbearbeitung (seit 02.11.2026):** Ein Klick auf eine Aufgabe öffnet `src/components/ExercisePractice.tsx` direkt in der Liste. Je nach `taskType`: Zahlenaufgaben mit Eingabefeldern und automatischer Prüfung gegen `answer` (Toleranz standardmäßig ±2 % relativ, Komma, Minuszeichen und Zehnerpotenzen wie `6,2·10^-4` werden akzeptiert; Logik in `src/practice/checkAnswer.ts`), Zuordnungsaufgaben mit Auswahllisten und automatischer Prüfung, alle übrigen mit optionalem, nicht gespeichertem Textfeld, Musterlösung und Selbsteinschätzung (richtig/teilweise/noch nicht). Hinweise werden einzeln aufgedeckt. **Handschrift:** Bei freien und mehrteiligen Aufgaben lässt sich zwischen „Antwort tippen“ und „Handschriftlich“ wechseln (voreingestellt nach `supportedModes`); bei Zahlenaufgaben kann der Rechenweg auf einer Schreibfläche notiert werden. Die Schreibfläche (`src/components/HandwritingPad.tsx`) nutzt Pointer Events ohne Zusatzbibliothek. Stift und Maus zeichnen; der Stiftdruck steuert die Strichbreite (abschaltbar). Ein Finger scrollt die Seite bzw. verschiebt bei Zoom die Ansicht, zwei Finger zoomen; „Mit Finger zeichnen“ erlaubt Fingereingabe. Werkzeuge: Stift, Radierer (vektorbasiert, teilt Striche; Radierbereich als Kreis angezeigt), Auswählen (Rechteck aufziehen, Auswahl verschieben oder löschen), Ansicht verschieben, Zoom 50–400 % per Knopf, Zwei-Finger-Geste oder Strg + Mausrad, drei Farben, zwei Strichstärken, Rückgängig (bis 100 Schritte) und Alles löschen. Das Karomuster wird mitgezoomt. Striche liegen als Vektordaten in Weltkoordinaten vor, werden aber bewusst nicht gespeichert und gehen beim Schließen der Aufgabe verloren. Seit 02.11.2026 nutzen auch die Lernseiten diese Bearbeitung. Styles liegen in `src/components/ExercisePractice.css`, der gemeinsame Ergebnisspeicher in `src/practice/usePracticeRecords.ts`; Ergebnisse von Lernseite und Übungsbereich sind identisch.
- **Abiturarchiv:** siehe Abschnitt „Abiturarchiv“ unten.
- **Lernfortschritt (seit 04.11.2026, Paket K3):** `src/pages/ProgressPage.tsx` mit `src/components/ProgressOverview.tsx`; Berechnung in `src/progress/progress.ts` nach dem Konzept vom 02.11.2026: Je Aufgabe zählt das letzte Ergebnis (sicher, teilweise, noch nicht, offen), keine Punkte oder Prozentwerte. Gesamtstand mit Aufteilung nach AFB I–III, Stand je Kapitel und Lernseite als Balken, Wiederholungsliste („noch nicht“, dann „teilweise“, dann sichere Aufgaben älter als 21 Tage; jeweils älteste zuerst) mit „Üben“-Sprung. Der Übungsbereich nimmt dafür `focusExerciseId` entgegen, filtert auf die Lernseite, klappt die Aufgabe auf und scrollt hin. Aktivität nur als Nebenzeile (zuletzt aktiv, Aufgaben der letzten 7 Tage; gezählt wird das letzte Ergebnis je Aufgabe).
- **Gemeinsames Layout:** `src/components/AppShell.tsx` und `Sidebar.tsx`; mobile Navigation als seitliches Menü. Die Kopfzeile (`.topbar`) bleibt seit 04.11.2026 beim Scrollen oben stehen; der automatische Sprung zum Seitenanfang einer Lernseite rechnet ihre Höhe heraus.
- **Periodensystem (seit 04.11.2026):** Ein Knopf „PSE“ in der Kopfzeile öffnet `src/components/PeriodicTable.tsx` (eigenes Stylesheet, per `React.lazy` erst beim ersten Öffnen geladen) als Fenster mit allen 118 Elementen, Farbcodierung nach Elementkategorie, Hover-Vergrößerung und einer Detailkarte (Schalenmodell, Elektronen je Schale, Atommasse, Kategorie, Gruppe, Periode, Elektronegativität, Elektronenkonfiguration, häufige Oxidationszahlen). Schließen per Esc, Klick daneben oder Schließen-Knopf. Auf schmalen Bildschirmen zeigen die Kästchen nur Symbol und Ordnungszahl, die Tabelle ist seitlich scrollbar und die Detailkarte erscheint im Vollbild. Daten: `src/periodic/elements.json`. Atommassen nach IUPAC (gerundet; abgeglichen mit der Elementliste der deutschsprachigen Wikipedia, Abweichung nur bei Mangan, dort Tippfehler der Liste), Pauling-Elektronegativitäten abgeglichen mit der Wikipedia-Datenseite „Electronegativities of the elements“. Elektronenkonfigurationen wurden nach der Madelung-Regel mit den bekannten Ausnahmen berechnet, die Schalenbesetzung daraus abgeleitet; ab Z = 104 sind sie als vorhergesagt gekennzeichnet. Häufige Oxidationszahlen sind eine schulbezogene Auswahl. Bei Elementen ab Z = 104 schwanken die Massenzahlen der langlebigsten Isotope je nach Quelle.
- **Benutzerkonten (seit 04.11.2026, Paket K1):** siehe eigener Abschnitt unten.

Die mobile Sidebar greift bei `max-width: 800px`, zusätzliche enge Layoutregeln liegen u. a. bei `max-width: 600px`. Lern- und Übungsseiten haben separate CSS-Dateien; globale Design-Tokens und Dashboard-/Shell-Stile stehen in `src/styles/global.css`.

## Benutzerkonten

Paket K1 nach Nutzerentscheidung vom 04.11.2026. Es gibt keine Selbstregistrierung: Admins legen Konten in der Benutzerverwaltung an, legen dabei den Namen, ein optionales Ablaufdatum („gültig bis“, einschließlich, deutsche Zeit) und die Rechte „Abiturarchiv“ und „Admin“ fest. Benutzername (aus dem Namen gebildet, z. B. `lena.k`) und ein zufälliger Zugangscode (16 Zeichen, Viererblöcke) werden erzeugt; der Code erscheint nur einmal. Abgelaufene Konten sperrt die Datenbank sofort und löscht sie am Folgetag automatisch mit allen Daten (Nutzerentscheidung).

- **Zugangstor (seit 04.11.2026, Nutzerentscheidung „Variante B“):** Sind Konten eingerichtet, sehen nicht angemeldete Besucher nur die Zugangsseite `src/components/LoginGate.tsx` (Anmeldeformular `LoginForm.tsx`, Link zur Datenschutzseite). Das ist kein Schutz der Inhalte: Lernseiten und Aufgaben liegen weiterhin im öffentlichen Build und im öffentlichen Repository. Echter Schutz ist nur für das spätere Abiturarchiv vorgesehen (Dateien über Supabase, nur mit Recht „Abiturarchiv“). Nach jeder Anmeldung beginnt die Ansicht beim Dashboard. Ohne Supabase-Konfiguration (z. B. lokal) bleibt alles ohne Anmeldung zugänglich.
- **Client:** `src/account/AccountContext.tsx` (Anmeldestatus, Profil, An-/Abmelden; lädt `src/account/client.ts` mit der Supabase-Bibliothek erst nach dem ersten Rendern), `src/account/profile.ts`, Kontofenster mit Abmelden `src/components/AccountDialog.tsx`, Benutzerverwaltung `src/pages/AdminPage.tsx` (per `React.lazy`), Datenschutzseite `src/pages/PrivacyPage.tsx`. Anmeldung intern als E-Mail `<benutzername>@chemie-lernraum.invalid` mit dem Code als Passwort; es werden keine E-Mails verschickt. Die Anmeldung prüft den Code zuerst wie eingegeben (von Hand gesetzte Passwörter, etwa beim ersten Admin) und danach in Großbuchstaben ohne Trennzeichen (erzeugte Codes); ein mit eingegebener Adressteil `@…` im Benutzernamen wird ignoriert.
- **Datenbank:** `supabase/migrations/20261104120000_accounts.sql` – Tabelle `profiles` mit RLS (eigenes Profil oder Admin liest; nur Admins ändern Anzeigename, Rechte und Ablaufdatum), Trigger gegen das Entfernen des letzten gültigen Admins, täglicher `pg_cron`-Job `delete_expired_accounts()`.
- **Edge Function:** `supabase/functions/admin-users/index.ts` – Anlegen, neuer Code, Entfernen; prüft, dass der Aufrufer ein gültiger Admin ist. Der geheime Schlüssel bleibt in Supabase.
- **Konfiguration:** `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` beim Build aus den GitHub-Repository-Variablen `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY`. Fehlen sie, sind Konten ausgeschaltet (kein Anmelden-Knopf). Der Publishable Key ist öffentlich; dass er im Build steht, hat der Nutzer am 04.11.2026 entschieden. Geheime Schlüssel prüft `scripts/check-build-secrets.mjs` im Deployment.
- **Einrichtung:** Schritt-für-Schritt in `supabase/EINRICHTUNG.md`.
- **Ergebnisse im Konto (Paket K2, seit 04.11.2026):** Tabelle `practice_records` (`supabase/migrations/20261104130000_practice_records.sql`; je Konto und Aufgabe das letzte Ergebnis, Prüfart und Zeitpunkt; RLS: eigene Zeilen mit gültigem Konto, Admins lesen alle; Trigger behält bei Konflikten das neuere Ergebnis). Client: `src/practice/PracticeRecordsContext.tsx` (gemeinsamer Bestand für Lern- und Übungsbereich, ersetzt `usePracticeRecords.ts`), `src/practice/remote.ts`. Angemeldet ist das Konto maßgeblich; `localStorage` dient als Zwischenspeicher je Konto (`chemie-lernraum.practice.v1.<id>`) mit einer Liste noch nicht übertragener Aufgaben (`….pending`) und wird beim Abmelden gelöscht. Abgeglichen wird beim Start, beim Öffnen von Lern- oder Übungsbereich und bei der Rückkehr zum Tab bzw. Fenster (höchstens alle 5 s): Der Stand des Kontos wird übernommen, nur ausstehende lokale Ergebnisse werden nachgetragen, wenn sie neuer sind. So macht eine alte Kopie auf einem zweiten Gerät ein Zurücksetzen nicht rückgängig. Ohne Konto gespeicherte Ergebnisse (`chemie-lernraum.practice.v1`) werden nach der Anmeldung zur Übernahme angeboten (Übernehmen, Verwerfen, Später). „Ergebnisse zurücksetzen“ löscht auch die Kontodaten. Im echten Projekt eingerichtet; der Nutzer hat gespeicherte Zeilen in `practice_records` bestätigt. Der Abgleich zwischen zwei Geräten ist gegen den lokalen Supabase-Ersatz getestet.
- **Lernstand für Admins (Paket K3):** Reiter „Lernstand“ in der Benutzerverwaltung (`src/pages/AdminProgress.tsx`): je Konto bearbeitet/sicher/teilweise/noch nicht und zuletzt aktiv über die Datenbankfunktion `admin_practice_summary()` (`supabase/migrations/20261104140000_admin_progress.sql`, liefert nur gültigen Admins Zeilen); ein Klick zeigt dieselbe Fortschrittsansicht für das Konto, nur lesend. Im echten Projekt eingerichtet; Lernfortschritt und Lernstand vom Nutzer am 04.11.2026 bestätigt.
- **Datenschutzseite:** Sie nennt nach Nutzerentscheidung vom 04.11.2026 (Nutzung nur im eigenen Kurs) keinen Namen und keine Kontaktadresse der verantwortlichen Person; das ist nachzutragen, falls die Nutzung über den Kurs hinausgeht.
- **Getestet:** Build und Browser-Test gegen einen lokalen Supabase-Ersatz (Anmelden, falscher Code, abgelaufener Zugang, Abmelden, Benutzer anlegen/bearbeiten, neuer Code, entfernen, Handyansicht). Am 04.11.2026 mit dem echten Projekt verbunden: Registrierung aus, RLS, Funktionen und Edge Function von außen geprüft. Die Anmeldung des ersten Admins scheiterte zunächst an der Großschreibungs-Umwandlung eines selbst gewählten Passworts; behoben durch die Prüfung in zwei Schritten. Vom Nutzer bestätigt: Admin-Anmeldung, Benutzer anlegen und entfernen über die Edge Function.

## Abiturarchiv

Seit 04.11.2026 nach ausdrücklicher Entscheidung des Nutzers. **Ausnahme von der Regel, dass lokales Recherchematerial nie veröffentlicht wird:** Die 131 Prüfungs-PDFs aus `local-material/` dürfen in einem privaten Supabase-Speicherbereich (`abitur-archiv`) liegen. Zugriff haben nur gültige Konten mit dem Recht „Abiturarchiv“, nach Nutzerangabe nur die beiden Admins. Hochladen erfolgt durch den Nutzer im Supabase-Dashboard; Claude lädt nichts aus `local-material/` hoch. Excel-Datei, Operatoren-PDF und alle anderen lokalen Dateien bleiben lokal. Die PDFs gehören weiterhin nicht in Git oder den Site-Build (Build-Prüfung erlaubt nur `.js`, `.css`, `.svg`).

- **Seite:** `src/pages/ArchivePage.tsx` (per `React.lazy`). Jede Prüfung einzeln mit Jahr, Termin, Vorschlag, Hauptfokus, weiteren Themen, KCGO-Feldern und Seitenangabe; Filter nach Jahr, Termin, KCGO-Feld, Thema (Kapitel aus den Lernseiten-Belegen und den Hauptfokus-Feldern) und Unterthema (Lernseiten, die die Prüfung als Beleg nennen); Hinweise zu nicht vorhandenen Terminen und Vorschlägen; Hinweis, dass historische Vorkommen keine aktuelle Verbindlichkeit belegen. „PDF öffnen“ erzeugt einen 5 Minuten gültigen Link (`createSignedUrl`). „Passend üben“ springt in den Übungsbereich, gefiltert auf die Lernseiten, die die Prüfung als Beleg nennen (63 Prüfungen), sonst auf die Kapitel der Hauptfokus-Felder. Admins sehen, welche PDFs im Speicher noch fehlen.
- **Daten:** `src/content/exam-archive.json`, erzeugt mit `node scripts/build-exam-archive.mjs` aus `research/pruefungsanalyse_2007-2025.md`, `research/pruefungsinventar.md` (Dateinamen) und den `examReferences` der Lernseiten. Nur Metadaten, keine Prüfungstexte. Nach Änderungen an diesen Quellen neu erzeugen.
- **Zugriffsschutz:** `supabase/migrations/20261104150000_exam_archive.sql` legt den privaten Bucket und eine Storage-Policy an (Lesen nur mit `can_view_archive()`); Schreiben ist nur mit der Service-Rolle im Dashboard möglich.
- **Sichtbarkeit ohne Recht (Nutzerwunsch):** Kein Menüpunkt, keine Archivkarte auf dem Dashboard, und auf den Lernseiten werden die Prüfungsbelege (Jahr, Termin, Vorschlag, Seiten) im Abschnitt „Typische Abitur-Aufgabentypen“ ausgeblendet (`useCanViewArchive`). Zwei Erklärtexte (`chem.q1.5.preservatives`, `chem.q3.4.buffers`) nennen keine konkreten Prüfungen mehr. Das ist eine Anzeigeregel: Die Metadaten stehen weiterhin im öffentlichen Repository (`research/`) und in den öffentlichen JavaScript-Dateien.
- **Getestet** gegen einen lokalen Supabase-Ersatz (mit und ohne Recht, PDF-Link, fehlende Datei, Passend üben, Handyansicht). Im echten Projekt eingerichtet; der Nutzer hat am 04.11.2026 bestätigt, dass alle 131 PDFs im Speicher sind.

## Katalog, Lerninhalte und Aufgaben

### Katalog

`src/content/catalog.json` hat Schema-Version 1 und enthält derzeit **12 Hauptkapitel und 47 Unterkapiteleinträge**. Alle **47 sind mit einer `lessonId` verknüpft**; es gibt derzeit keine Einträge mit Status `planned`. Das Kapitel `chem.experimental` erhielt am 02.11.2026 seine fünf Lernseiten. Einzelne dort behandelte Methoden (Halogenid-Nachweis, Baeyer-Probe, Bromwasser, Xanthoprotein- und Ninhydrin-Probe, Dünnschichtchromatografie) sind im KCGO-Themenkatalog nicht ausgewiesen und auf den Lernseiten entsprechend gekennzeichnet.

IDs wie `chem.q3.1.mwg` sind stabile Daten-IDs und nicht aus Routepfaden abzuleiten. Kapitelzugehörigkeit und sichtbare Themenbezeichnungen werden über den Katalog bestimmt.

### Lernseiten

- 47 JSON-Dateien in `src/content/lessons/`.
- Aktuelles Rohformat: `LessonContentRecord`, `schemaVersion: 2`.
- Alle 47 Einträge tragen `publicationStatus: "published"`. Am 04.11.2026 hat der Nutzer entschieden, alle 47 Lernseiten auf `published` zu setzen, weil ihr inhaltlicher Stand nach den Überarbeitungen ausreicht; formale Prüfkriterien wurden dafür nicht festgelegt.
- Lektionen enthalten strukturierte Lernziele, Curriculum-Referenzen, Erklärungstexte, Fachbegriffe, Gleichungen, Beispiele, Prüfungsreferenzen, Hinweise sowie Referenzlisten `exerciseIds` und `selfTestIds`.
- Die Lernseite zeigt den Hinweis „In fachlicher Redaktion“ (bzw. „Entwurf“) nur noch für Seiten mit Status `review` bzw. `draft`; freigegebene Seiten tragen keinen Statushinweis. Technisch prüft die Katalognavigation im aktuellen Code die Existenz einer Lesson-Datei; sie erzwingt keinen Gate anhand von `publicationStatus`.

### Aufgabenbank

`src/content/exercises.json` hat Schema-Version 1 und **425 eindeutige Aufgaben**: 282 mit `sourceKind: "exercise"` und 143 mit `sourceKind: "selfTest"`. Lektionen speichern nur die zugehörigen IDs. `sourceLessonId` und `sourceKind` verknüpfen jeden Eintrag zurück zur Lektion und zur jeweiligen Liste.

Eine Aufgabe besitzt u. a. ID, Titel, Schwierigkeitsgrad, Prompt, Hinweise, Lösung, Kompetenzbereiche und Operatoren. `afb` und `taskType` sind seit 02.11.2026 bei **425/425** Aufgaben gesetzt (AFB I 204, II 194, III 27; frei 357, numerisch 37, mehrteilig 25, Zuordnung 6). Grundlage, Regeln und eine Begründung je Aufgabe stehen in `research/aufgabenklassifikation.md` und `research/operatoren-afb.md`; der Validator verlangt seitdem beide Felder für jede Aufgabe. `supportedModes` ist seit 02.11.2026 bei allen Aufgaben gesetzt (nur Bildschirm 328, Bildschirm und Handschrift 95, nur Handschrift 2; Regeln in `research/aufgabenklassifikation.md`) und wird vom Validator verlangt. `sourceExamRefs` ist nach Entscheidung vom 02.11.2026 bei 0/425 gesetzt. Der Übungsbereich darf fehlende Angaben nicht inferieren. Kompetenzfilter können mit den tatsächlich vorhandenen Kompetenzcodes arbeiten.

**Bereinigung vom 02.11.2026:** Bei 72 Aufgaben wurde ein automatisch vorangestellter Satzbaustein („Nenne die passende Grundlage und …“, „Erkläre den chemischen Zusammenhang und …“, „Bewerte die Reichweite der Aussage und …“) entfernt. Die 144 Aufgaben der 16 Lernseiten mit durchnummerierten Aufgaben-IDs (`exercise.1` … `selftest.3`) folgten einer Schablone mit doppelten Aufgaben, generischen Hinweisen und Aufgaben über Prüfungsbelege; sie wurden unter Beibehaltung von ID, Quelle und Schwierigkeit inhaltlich neu geschrieben. 71 Selbsttests mit englischen ID-Resten als Titel erhielten deutsche Titel. Danach gibt es keine identischen Aufgabentexte mehr. Zwei Aufgaben in `chem.q3.3.advanced` (`ex.transfer-scope`, `st.3`), die nach Curriculumsunterlagen statt nach Chemie fragten, wurden durch Aufgaben zur Nernst-Gleichung ersetzt.

**Befund Lernseitentexte (behoben 04.11.2026):** Die Lernseitentexte derselben 16 Seiten waren ebenfalls schablonenhaft. Beispiele: gleichlautende Lernziele („Ich kann zentrale Begriffe, Modelle und Zusammenhänge des Themenfelds …“) in 11 Seiten, identische Fachbegriffe und Lernziele in den fünf Q2.2/Q2.4-Seiten, „AFB III“ als Fachbegriff und themenfremde typische Fehler in sieben Seiten, Grammatikfehler wie „Strukturmerkmale von Proteine“ in vier Q2.1-Seiten. Die Überarbeitung erfolgt in vier thematischen Paketen. **Paket 1 (03.11.2026, erledigt):** `chem.q4.1.enthalpy`, `chem.q4.1.hess`, `chem.q4.1.entropy-gibbs` und `chem.q4.2.energy-sustainability` haben themenspezifische Lernziele, Einleitungen, gegliederte Erklärtexte (3.400–4.700 Zeichen statt rund 600), Fachbegriffe, Gleichungen, Rechenbeispiele mit realen Stoffen, Aufgabenformate und typische Fehler. IDs, Lehrplanzuordnung, Prüfungsbelege und Aufgaben blieben unverändert. Tabellenwerte sind gängige Standardwerte und nicht mit einem bestimmten Tafelwerk abgeglichen. **Paket 2 (03.11.2026, erledigt):** `chem.q2.1.carbohydrates`, `chem.q2.1.fats-oils`, `chem.q2.1.proteins` und `chem.q2.1.biopolymers` nach demselben Muster überarbeitet, einschließlich neuer Kurzbeschreibungen (vorher mit Grammatikfehlern). Dabei wurde die falsch ausgeglichene Fehling-Gleichung korrigiert (R–CHO + 2 Cu²⁺ + 5 OH⁻ → R–COO⁻ + Cu₂O + 3 H₂O). **Paket 3 (04.11.2026, erledigt):** `chem.q2.2.polymerization`, `chem.q2.2.polycondensation-polyaddition`, `chem.q2.2.properties`, `chem.q2.2.sustainability` und `chem.q2.4.organic-materials` nach demselben Muster überarbeitet. Erstmals sind auf diesen Seiten Einträge im Feld `mechanisms` gesetzt (radikalische Polymerisation, Bildung einer Urethangruppe). **Paket 4 (04.11.2026, erledigt):** `chem.q3.5.kinetics`, `chem.q1.4.q4.3.surfactants` und `chem.applications.evaluation` nach demselben Muster überarbeitet. Atomökonomie und Kriterien der Grünen Chemie sind auf der Bewertungsseite als Hilfsmittel eingeführt, ohne KCGO-Beleg. Eine Prüfung aller 47 Seiten fand danach keine gleichlautenden Lernziele, Tipps, Aufgabenformate oder Gleichungshinweise mehr; mehrfach vorkommende Fachbegriffe sind echte Querschnittsbegriffe. Acht der übrigen Seiten hatten Erklärtexte unter 2.000 Zeichen; sie sind nicht schablonenhaft, aber knapper. **Ausbau Paket A (04.11.2026, erledigt):** Die vier Q3.3-Seiten `chem.q3.3.redox`, `chem.q3.3.galvanic-cells`, `chem.q3.3.electrolysis-corrosion` und `chem.q3.3.advanced` wurden ergänzt (bestehende Texte erhalten; neue Abschnitte, Begriffe, Gleichungen, Beispiele und Tipps). Dabei wurden zwei bis dahin fehlende KCGO-Inhalte aufgenommen: Konzentrationszelle (LK) und Wasserelektrolyse/Wasserstoffgewinnung. **Ausbau Paket B (04.11.2026, erledigt):** `chem.q3.2.protolysis`, `chem.q1.3.carboxylic-acids`, `chem.q1.2.carbonyls` und `chem.q3.1.applications` nach demselben Muster ergänzt, u. a. Autoprotolyse und Salzlösungen, Substituenteneffekte mit pKa-Reihen, Tollens-Probe und Halbacetalbildung, Haber-Bosch-Kreisprozess und quantitatives Estergleichgewicht. Danach hat keine der 47 Seiten weniger als 2.000 Zeichen Erklärtext (Minimum 2.049, Median 3.357). **Darstellungsbefund (behoben 04.11.2026):** Der Lernseiten-Renderer stellt Markdown-Fettdruck nicht dar; `**…**` erschien wörtlich. Die Markierungen wurden aus allen sechs betroffenen Lernseiten entfernt; Inhaltsdateien sollen keinen Markdown-Fettdruck verwenden.

**Maschinenlesbare Antworten:** Die 37 Aufgaben mit `taskType: "numeric"` und die 6 mit `"matching"` besitzen ein Feld `answer` (Zahlenwerte mit Bezeichnung, Einheit und optionaler Toleranz bzw. Optionen und richtige Zuordnungen). Der Validator verlangt es für diese Typen und verbietet es für alle anderen.

**Abbildungen (Pilot seit 04.11.2026):** Aufgaben können ein optionales Feld `figures` tragen (Datei, Alternativtext, optionale Bildunterschrift, Position `prompt` oder `solution`). Die SVG-Dateien liegen in `src/content/figures/` und werden über `getFigureUrl` in `src/content/index.ts` eingebunden; `ExercisePractice` zeigt Aufgabenabbildungen unter dem Aufgabentext und Lösungsabbildungen in der Musterlösung, im Übungsbereich wie auf den Lernseiten. Der Validator prüft, dass jede Datei existiert, jede Abbildung einen Alternativtext hat und keine SVG-Datei ungenutzt ist. Im Pilot haben 12 Aufgaben je eine Abbildung: sechs als Material (Titrationskurve, Konzentrations-Zeit-Diagramm, unbeschriftetes Temperaturdiagramm, Kinetik-Messwerte, Daniell-Element, Elektronengasmodell) und sechs in der Musterlösung (Lewis-Formel HCl, Alanin-Zwitterion, Haworth-Projektionen von α-/β-Glucose, Polyamid 6,6 mit Wasserstoffbrücken, Energiediagramm mit Katalysator, Waschvorgang). Bei den Material-Aufgaben wurde der Aufgabentext auf die Abbildung bezogen; bei der Titrationsaufgabe nennt die Musterlösung zusätzlich das abgelesene Äquivalenzvolumen. Alle Abbildungen sind selbst erstellt; Kurven sind aus Formeln berechnet (Titrationskurve: 20,0 mL Ethansäure, c = 0,10 mol·L⁻¹, pKs 4,76, mit Natronlauge c = 0,10 mol·L⁻¹). Nichts stammt aus Prüfungsunterlagen.

**Lokale Speicherung:** Die Inhaltsdaten enthalten keine Nutzerantworten oder Fortschrittsdaten. Bearbeitungsergebnisse (Ergebnis, Art der Prüfung, Zeitpunkt; keine Antworttexte) werden ausschließlich im `localStorage` des Browsers unter dem Schlüssel `chemie-lernraum.practice.v1` gespeichert (`src/practice/storage.ts`, gemeinsamer Zugriff über `src/practice/usePracticeRecords.ts`). Übungsbereich und Lernseiten nutzen denselben Speicher. Die Ergebnisse sind im Übungsbereich als „nur auf diesem Gerät“ gekennzeichnet und dort zurücksetzbar. Es gibt keine Übertragung an einen Server und keine geräteübergreifende Synchronisierung.

## Loader und Validierung

`src/content/index.ts`:

- importiert und validiert `catalog.json`;
- erstellt einen `import.meta.glob`-Loader über die vorhandenen Lektionen;
- lädt `exercises.json` dynamisch und baut eine ID-Map;
- validiert Aufgabenstruktur und eindeutige IDs und prüft, ob Aufgaben auf eine katalogisierte Lesson-Datei zeigen;
- exportiert `getAllExercises()`, `getExerciseById()` und `getLessonById()`;
- löst bei `getLessonById()` `exerciseIds`/`selfTestIds` auf und kontrolliert Zugehörigkeit und Quellentyp.

`npm run validate:content` ruft `scripts/validate-exercise-bank.mjs` auf. Es prüft Katalog-/Lesson-Abdeckung, aktuell 47 Lesson-Dateien, Aufgabenreferenzen, Duplikate/Waisen, Quelltyp, Kapitelverknüpfungen und Sollzählungen 282/143/425. Es ersetzt keine chemische oder redaktionelle Prüfung.

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
3. Build-Prüfung: `dist/` darf nur `index.html` sowie `.js`/`.css`/`.svg` unter `assets/` enthalten, nicht auf `local-material` verweisen und keine geheimen Supabase-Schlüssel enthalten (`scripts/check-build-secrets.mjs`: `sb_secret_…` oder JWT mit Rolle `service_role`). `.svg` ist seit 04.11.2026 für die selbst erstellten Aufgabenabbildungen erlaubt (Zustimmung des Nutzers); andere Bild- oder Dokumentformate bleiben gesperrt.
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

- `research/phase4-fortschritt.md` nennt 11 Hauptkapitel/42 Unterkapitel; der aktuelle Katalog enthält zusätzlich das Experimentierkapitel mit fünf Unterkapiteln (12/47 gesamt, 47 Lesson-Dateien).
- `research/lernstruktur.md` nennt 2024 NT B als Titrationsbeleg; eine Textsuche im lokalen PDF dieser Prüfung findet keine Titration. Die Lernseite `chem.experimental.quantitative` verwendet diesen Beleg deshalb nicht. Ungeklärt, ob die Angabe auf einer nicht textlich erfassten Abbildung beruht.
- `research/inhaltsmodell.md` beschreibt teilweise den ursprünglichen Vorschlag (Schema 1, Aufgaben direkt in Lessons). Der tatsächliche Code verwendet Lesson-Rohschema 2, ID-Referenzen und eine zentrale Aufgabenbank.
- `research/README.md` ist als Forschungsstand zu lesen und nicht als aktueller technischer Änderungsbericht.
- `research/lernziele.md` liegt laut Repository nicht vor; die Lernziele stehen in `research/lernstruktur.md` und den einzelnen Lesson-Datensätzen.

## Noch nicht implementiert

Speicherung von Handschrift und Antworttexten, Prüfungssimulation, Kommentarfunktion, private/geteilte Notizen sowie privater Dateispeicher für Handschrift. Diese Themen sind teils konzeptionell in `research/zusammenarbeit-und-notizen.md` oder vorherigen Übergabeanforderungen erwähnt, aber nicht im Anwendungscode implementiert.

