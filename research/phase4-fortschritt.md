# Phase 4 – Fortschritt

Stand: 31.10.2026

## Umfang

Der verbindliche Katalog enthält 11 Hauptkapitel und 42 Unterkapitel. Die Musterseite „Aminosäuren und Peptide“ zählt als bestehende vollständige Referenzseite. Alle 42 Katalog-Unterkapitel besitzen jetzt einen verknüpften Inhaltsdatensatz; alle Seiten bleiben im Review-Status für die fachredaktionelle Freigabe.

## Abgeschlossene Kapitel

| Hauptkapitel | Vollständige Unterkapitel | Status | Prüfung |
|---|---:|---|---|
| 1. Chemische Werkzeuge, Sprache und quantitative Grundlagen | 3/3 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 2. Bindung, Struktur und Stoffeigenschaften (Q1.1) | 3/3 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 3. Kohlenwasserstoffe, Aromaten und Reaktionsmechanismen | 3/3 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 4. Sauerstoff- und stickstoffhaltige organische Stoffklassen | 4/4 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 5. Säure-Base-Chemie und Protolyse | 5/5 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 6. Chemisches Gleichgewicht | 3/3 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 7. Redoxchemie und Elektrochemie | 4/4 | Abgeschlossen | TypeScript und Produktionsbuild erfolgreich |
| 8. Naturstoffe | 5/5 | Abgeschlossen | Gesamtbuild erfolgreich; Inhalte im Review |
| 9. Kunststoffe und organische Werkstoffe | 5/5 | Abgeschlossen | Gesamtbuild erfolgreich; Inhalte im Review |
| 10. Energie, Reaktionsgeschwindigkeit und Katalyse | 4/4 | Abgeschlossen | Gesamtbuild erfolgreich; Inhalte im Review |
| 11. Anwendungen, Nachhaltigkeit und ergänzende Themenfelder | 3/3 | Abgeschlossen | Gesamtbuild erfolgreich; Inhalte im Review |

## Gesamtfortschritt

- Vollständige Unterkapitel: 42/42 (einschließlich Aminosäuren-Musterseite)
- Offene Unterkapitel: 0
- Abgeschlossene Hauptkapitel: 11/11
- Die angeforderte Datei `research/lernziele.md` ist im Repository nicht vorhanden. Für Kapitel 1 wurden daher ausschließlich die Lernziele aus `research/lernstruktur.md` verwendet.

## Technische Umsetzung

- `src/content/index.ts` lädt Lektionen datengetrieben aus `src/content/lessons/*.json` und prüft deren IDs sowie Katalogverknüpfungen.
- `src/pages/LearningPage.tsx` stellt die Katalogauswahl bereit. Nur vollständige bzw. redaktionell freigegebene Seiten lassen sich öffnen.
- Lektionstexte werden beim Öffnen der jeweiligen Seite geladen und liegen dadurch in eigenen kleinen statischen Chunks statt im initialen Hauptbundle.
- Originalprüfungen bleiben lokale Quellen; in den öffentlichen Seiten stehen nur Referenzmetadaten und eigens formulierte Aufgaben.

## Prüfschritte je Hauptkapitel

Die Gesamtprüfung validiert Katalogverknüpfungen, eindeutige IDs, Mindestanzahl an Beispielen und Übungen je Schwierigkeitsgrad, Prüfungsreferenzstruktur sowie TypeScript und Produktionsbuild. Historische Feldhäufigkeiten bleiben von der Häufigkeit einzelner Unterkapitel getrennt.

