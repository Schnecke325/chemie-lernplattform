# Phase 2 – Quellenlage und Arbeitsstand

Stand der Recherche: 31.10.2026. Diese Dokumentation trennt **curriculare Vorgaben** von **empirisch gezählten Prüfungsvorkommen**. Für die Lernstruktur wurden zusätzlich ein statischer Kapitelkatalog und TypeScript-Content-Verträge in `src/content/` angelegt; bestehende UI-Komponenten, Navigation und Darstellung wurden nicht geändert.

## Ergebnis in Kürze

- Die offiziellen curricularen Quellen wurden ausgewertet: hessisches KCGO Chemie, Ausgabe April 2026; KCGO Chemie 2016 für einen Vergleich; KMK-Bildungsstandards Chemie für die Allgemeine Hochschulreife (2020); hessischer Abiturerlass Landesabitur 2027 samt Änderungserlass; Operatorenliste Landesabitur 2027.
- Im lokalen, durch `.gitignore` geschützten Ordner `local-material/` liegen jetzt **131 Prüfungs-PDFs** (578 Seiten) und die Excel-Übersicht für 2014–2025. Es wird keine pauschale 152-Dateien-Sollzahl angenommen: Prüfungsjahre hatten unterschiedliche Vorschlagszahlen; für einzelne Nachtermine/Unterlagen ist die historische Verfügbarkeit ungeklärt. Alle vorhandenen PDFs ließen sich textuell extrahieren; Formel-/Diagrammseiten sind damit nicht automatisch visuell verifiziert.
- Die Prüfungen sind nach Jahr/Termin/Vorschlag inventarisiert und thematisch mit KCGO-Feldern verknüpft. Vorschlagsvorkommen pro KCGO-Feld sind vorläufig gezählt und nach Jahr/HT/NT/A–D aufgeschlüsselt. Eine fein codierte Teilfragenzählung ist noch offen; Häufigkeitsklassen werden daher nicht vergeben.
- Die Excel-Übersicht hat 76 Detailzeilen, aber keine erkannten Titel; die 2019er HT-Vorschläge A–C fehlen darin. Acht 2023-Dateiverweise enthalten einen nicht mehr gültigen `(1)`-Suffix. Außerdem sind 48 Schwerpunktfelder durch Deckblatt-/Prüfungsanweisungstext kontaminiert. Einzelheiten: [Prüfungsinventar](pruefungsinventar.md).
- Das hessische Kultusministerium erklärt, dass Schulen bereits verwendete Aufgaben samt Materialien und Lösungs-/Bewertungshinweisen zum schulinternen Gebrauch erhalten. Ein frei zugängliches vollständiges offizielles Archiv ließ sich in den offiziellen Quellen nicht feststellen. Der bereitgestellte lokale Bestand ist daher der Arbeitskorpus; die dokumentierten Lücken bleiben offen.
- Der Abiturerlass 2027 (veröffentlicht 2025) verweist in Kapitel 25 Chemie noch auf KCGO „Ausgabe 2024“; das offizielle KCGO-PDF trägt den Stand 21.04.2026. Der Änderungserlass ist ebenfalls berücksichtigt. Die Versionsdifferenz ist hier offen ausgewiesen.

## Quellen und Status

| Quelle | Stand / Zweck | Bearbeitungsstatus |
|---|---|---|
| [Hessen: Landesabitur](https://kultus.hessen.de/Schulsystem/Schulformen-und-Bildungsgaenge/Gymnasium/Landesabitur) | Prüfungsorganisation und Verfügbarkeit zurückliegender Aufgaben | Ausgewertet; belegt schulinterne Verteilung vergangener Aufgaben, nicht öffentliches Vollarchiv |
| [KCGO Chemie, Ausgabe April 2026 (PDF)](https://kultus.hessen.de/sites/kultus.hessen.de/files/2026-07/kcgo_chemie_21.04.2026.pdf) | Aktuelle Themenfelder, Inhalte und Kompetenzerwartungen | 52 Seiten ausgewertet; Grundlage des Themenkatalogs |
| [KCGO Chemie, Ausgabe 2016 (PDF)](https://kultus.hessen.de/sites/kultus.hessen.de/files/2024-11/kcgo-chemie_2016.pdf) | Ältere Themenfeldstruktur | Für strukturellen Vergleich ausgewertet; kein Ersatz für Prüfungsauswertung |
| [KMK-Bildungsstandards Chemie AHR (PDF, 2020)](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2020/2020_06_18-BildungsstandardsAHR_Chemie.pdf) | Fachkompetenzen und Anforderungsbereiche | Ausgewertet |
| [Abiturerlass Hessen Landesabitur 2027 (PDF)](https://kultus.hessen.de/sites/kultus.hessen.de/files/2025-07/abiturerlass_la_2027.pdf) | Prüfungsformat und fachliche Schwerpunkte Chemie | Chemieabschnitt ausgewertet; Versionsabweichung zum KCGO April 2026 markiert |
| [Änderungserlass LA 2027 (PDF)](https://kultus.hessen.de/sites/kultus.hessen.de/files/2026-02/la27_abiturerlass_aenderungserlass_.pdf) | Änderungen am Erlass | Ausgewertet; keine Änderung am Chemieabschnitt 25 festgestellt |
| [Operatoren LA 2027 (PDF, Stand 01.08.2026)](https://kultus.hessen.de/sites/kultus.hessen.de/files/2026-08/la27-operatoren-biologie-chemie-informatik-mathematik-physik.pdf) | Definition und Zuordnung der Operatoren zu AFB | Ausgewertet; normativer Erwartungshorizont, keine empirische Häufigkeitsmessung |
| Lokale Prüfungs-PDFs 2007–2025, HT/NT, A–D | Inventar, Lesbarkeit und historische Themenzuordnung | 131 PDFs vorhanden, 131/131 Textextraktion erfolgreich; Status aller nicht vorhandenen Kombinationen im [Inventar](pruefungsinventar.md) differenziert |
| Lokale Excel-Prüfungsübersicht 2014–2025 | Abgleich mit Dateien und Tabellenqualität | Geprüft; 3 fehlende Zeilen und 8 alte Dateinamen (2023) sowie Platzhalter-/Deckblattfehler dokumentiert |

## Regeln für die spätere Prüfungsauswertung

1. Eine Prüfungseinheit wird nur dann gezählt, wenn Originalaufgabe und Referenz (Jahr, Termin, Vorschlag, Aufgabenteil) vorliegen.
2. Mehrfachthemen können auf Aufgabenebene mehreren Themen zugeordnet werden; Hauptthema und Nebenthemen sind getrennt zu kennzeichnen, damit Summen nicht als exklusive Kategorien missverstanden werden.
3. Die aktuelle Häufigkeitsübersicht zählt Vorschläge mit mindestens einem Beleg pro Feld. Häufig/gelegentlich/selten wird erst nach vollständiger Teilfragen-Codierung und transparenter Schwellenfestlegung definiert.
4. Alte Prüfungsaufgaben belegen vergangene Prüfungspraxis, aber nicht automatisch die Gültigkeit eines Themas für Landesabitur 2027. Maßgeblich dafür sind KCGO und Abiturerlass des betreffenden Jahrgangs.
5. Fehlende Prüfungsvorschläge werden als fehlendes Material dokumentiert, nie als Nichtvorkommen.

## Dateien dieser Recherche

- [Themenkatalog](themenkatalog.md): fachsystematische Gliederung auf Basis des aktuellen KCGO.
- [Curriculum-Abgleich](curriculum-abgleich.md): KCGO 2016 ↔ April 2026 ↔ Abiturerlass 2027.
- [Prüfungsinventar](pruefungsinventar.md): Prüfungsformat, PDF-Lesbarkeit, Status nicht vorhandener Kombinationen und Excel-Audit.
- [Prüfungsanalyse 2007–2025](pruefungsanalyse_2007-2025.md): Themenzuordnung nach Jahr/Termin/Vorschlag mit Seitenbelegen; historische Evidenz, keine curriculare Rückprojektion.
- [Prüfungshäufigkeit](pruefungshaeufigkeit.md): Materialabdeckung und vorläufige Themenzählung auf Vorschlagsebene; Teilfragen-Zahlen/Häufigkeitsklassen bleiben offen.
- [Kompetenzen und Aufgabentypen](kompetenzen-und-aufgabentypen.md): KMK/KCGO/Operatoren mit empirischen Aufgabenbeispielen, ohne unbelegte Rangliste.
- [Endgültige Lernstruktur](lernstruktur.md): hierarchischer Lernpfad, Lernziele, Prüfungsrelevanz und Aufgabenbelege je Unterkapitel.
- [Inhaltsmodell](inhaltsmodell.md): stabile Inhalts-IDs, Datenvertrag und redaktionelle Quellenregeln.
- [Endgültige Lernstruktur](lernstruktur.md): hierarchischer Lernpfad, Lernziele, Feldgewichtung und Aufgabenbelege.
- [Inhaltsmodell](inhaltsmodell.md): stabile Inhalts-IDs, Datenstruktur, Quellenreferenzen und Regeln für eine von React getrennte Ablage.
- [Zusammenarbeit und Notizen](zusammenarbeit-und-notizen.md): konzeptionelle Anforderungen für spätere Aufgabendiskussionen und private/geteilte Handschriftnotizen; nicht implementiert.
