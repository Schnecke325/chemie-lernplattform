# Roadmap – Chemie Lernraum

**Stand der Bestandsaufnahme:** 31.10.2026  
Diese Übersicht dokumentiert den aktuellen Repository-Stand und bereits geäußerte Projektabsichten. Sie legt keine Termine oder neue Reihenfolge fest. Eine Prioritätsänderung bleibt Entscheidung des Nutzers.

## Abgeschlossen

- **Technische Grundplattform:** React + TypeScript + Vite, dunkles responsives Shell-Layout, Dashboard, Sidebar und fünf Navigationsbereiche.
- **GitHub Pages:** Vite-Basis `/chemie-lernplattform/`, GitHub-Actions-Workflow für Pages-Deployment ist vorhanden.
- **Quellen- und Lehrplanrecherche:** Research-Unterlagen zu KCGO 2026, KCGO 2016, KMK, LA 2027 und Operatoren sind vorhanden. Lokaler Prüfungsbestand und Excel-Übersicht sind inventarisiert; Details siehe Research-Dateien.
- **Inhaltsstruktur:** 12 Hauptkapitel/47 Unterkapiteleinträge im Katalog; 42 haben ausgearbeitete Lesson-Datensätze. Experimentelle Chemie hat fünf katalogisierte, als geplant deaktivierte Unterkapitel.
- **Lernseiten:** 42 Seiten sind als vollständige Datensätze in `src/content/lessons/` vorhanden. Das Gleichgewichtskapitel wurde fachlich/redaktionell gezielt überarbeitet.
- **Lernbereich-UX:** Katalognavigation, mobile Accordion-Verhalten, aktiver Seitenbezug, Inhaltsnavigation und Scrollposition beim Seitenwechsel sind implementiert.
- **Zentrale Aufgabenbank:** Aufgaben aus den Lernseiten sind in `src/content/exercises.json` zentralisiert; 380 Einträge mit stabilen IDs (252 Übungen, 128 Selbsttests). Referenz- und Bestandsvalidator vorhanden.
- **Übungsbereich, Phase 2:** Themenauswahl und Filter für vorhandene Metadaten sind umgesetzt. Die Übersicht zeigt Aufgaben, findet keine Antworten/Bewertungen statt. Für nicht vorhandene AFB-/Modus-Metadaten zeigt sie den Klassifizierungsstand, statt Werte zu erfinden.
- **Dokumentierte Zusammenarbeit/Notizen:** Anforderungen an Aufgabenkommentare sowie private und geteilte Handschriftnotizen sind konzeptionell in `research/zusammenarbeit-und-notizen.md` beschrieben, nicht implementiert.

## Begonnen, aber noch nicht abgeschlossen

- **Feingranulare Prüfungsanalyse:** Die vorhandenen 131 PDFs sind laut Research inventarisiert und breit nach Jahr, Termin, Vorschlag und KCGO-Feld zugeordnet. Teilfragen-/Punkte-Codierung und belastbare Häufigkeitsklassen sind offen. Es gibt keinen Grund, hierfür Häufigkeiten zu schätzen.
- **Fachredaktion und Review:** Alle 42 Lesson-Dateien stehen derzeit auf `publicationStatus: "review"`. Der Umfang ist technisch vorhanden, aber nicht als abschließend fachredaktionell freigegeben zu behandeln.
- **Experimentelle Chemie & Nachweisreaktionen:** Kategorie und fünf geplante Katalogeinträge sind vorhanden; vollständige Lernseiten, Quellenprüfung im Detail und Abbildungen fehlen.
- **Aufgabenklassifizierung:** Bestehende Aufgaben haben Schwierigkeit, Kompetenzbereiche und Operatoren. `taskType`, AFB, unterstützte Modi und aufgabenbezogene Prüfungsreferenzen sind derzeit bei 0 von 380 belegt. Klassifikation erfordert fachliche Prüfung.
- **Veraltete Dokumentationsstellen:** README und Teile der Research-Planungsdokumente stimmen nicht mehr vollständig mit dem aktuellen Inhaltsschema bzw. der Kataloggröße überein. Diese Übergabe erstellt die technische Klarstellung, aktualisiert aber nicht automatisch andere Dokumente.

## Geplant

Diese Punkte sind Zielrichtungen, nicht automatisch freigegebene Umsetzungsschritte. Umfang und Reihenfolge sind offen.

- Filter/Listenansicht im Übungsbereich fachlich weiter klassifizieren, soweit belastbare Angaben vorliegen.
- Aufgabenbearbeitung für geeignete Typen und automatische Kontrolle eindeutig bewertbarer Antworten.
- Handschriftliche Eingabe mit Touch/Stift sowie spätere lokale oder serverseitige Speicherung.
- Lernfortschritt und Wiederholungsbedarf.
- Zusammenhängende Prüfungssimulationen und Abiturtraining.
- Ausarbeitung der fünf experimentellen Lernseiten einschließlich sicherer, quellenbasierter Versuchs- und Nachweisdarstellungen.
- Nutzerkonten und geschützter Zugang zum Abiturarchiv. Vor einer Implementierung sind Berechtigungsmodell, Datenschutz, Sessions, Geräteverwaltung, IP-Aufbewahrung und Schutz von Originalprüfungen zu konkretisieren.
- Supabase Auth, PostgreSQL mit Row Level Security, Edge Functions und privater Storage sind als technische Grundlage in Nutzeranforderungen genannt; im Repository existiert dafür noch kein Backend-Code oder Schema.
- Aufgabenkommentare, Moderation, persönliche Notizen und gezieltes Teilen gemäß Konzept in `research/zusammenarbeit-und-notizen.md`.
- Administration für Benutzer und individuelle Berechtigungen.

## Bewusst zurückgestellt oder noch nicht freigegeben

- Die fünf experimentellen Unterkapitel sind ausdrücklich `planned`; sie dürfen nicht als leere Lernseiten geöffnet werden.
- Dashboard-Fortschrittswerte und Lernpfad bleiben statische Platzhalter, bis echte Fortschrittsdaten implementiert und freigegeben sind.
- Abiturarchiv bleibt Platzhalter; Original-PDFs werden nicht in das öffentliche Repository oder den Site-Build übernommen.
- Kommentare, Notizen, Aufgabenbearbeitung, Bewertung, Prüfungssimulationen und Speicherung sind nicht Bestandteil des aktuellen Stands.
- Supabase/Auth/Backend und Datenbank werden nicht begonnen, bis der Nutzer den konkreten Umfang freigibt.
- Es gibt keine festgelegten Termine, Prioritäten zwischen diesen Punkten oder endgültige Entscheidung zur konkreten Ausgestaltung von Teilen/Moderation/Offline-Speicherung.

## Offene Entscheidungen

- Wann und anhand welcher Prüfkriterien werden Lesson-Inhalte von `review` zu `published` gesetzt?
- Soll zunächst die fachliche Redaktion, weitere Prüfungsauswertung oder eine spätere Nutzerfunktion priorisiert werden?
- Welche Daten zur automatischen Bewertung sind in Aufgaben zuverlässig klassifizierbar?
- Wie groß soll der erste Aufgabenbearbeitungsumfang sein und welche Antworttypen sind sinnvoll?
- Welche Inhalte im Abiturarchiv dürfen geschützt bereitgestellt werden, und wie wird der Zugriff serverseitig durchgesetzt?
- Welche Datenschutzfristen und Rollen gelten für Benutzer, IP-Protokolle, Sessions, Kommentare und Notizfreigaben?
- Wie wird die im Research beschriebene Versionsabweichung zwischen KCGO April 2026 und LA-2027-Erlass für eine konkrete fachliche Freigabe behandelt?

