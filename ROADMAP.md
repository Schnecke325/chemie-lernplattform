# Roadmap – Chemie Lernraum

**Stand:** 04.11.2026 (Bestandsaufnahme 31.10.2026, zuletzt aufgeräumt nach Konten, Archiv, Notizen, Diskussion und Abbildungen)  
Diese Übersicht dokumentiert den aktuellen Repository-Stand und bereits geäußerte Projektabsichten. Sie legt keine Termine oder neue Reihenfolge fest. Eine Prioritätsänderung bleibt Entscheidung des Nutzers.

## Abgeschlossen

- **Technische Grundplattform:** React + TypeScript + Vite, dunkles responsives Shell-Layout, Dashboard, Sidebar mit Lern-, Übungs-, Archiv- und Fortschrittsbereich sowie Benutzerverwaltung für Admins.
- **Veröffentlichung:** Die Site ist unter https://schnecke325.github.io/ erreichbar (Vite-Basis `/`). Ein GitHub-Actions-Workflow validiert die Inhalte, baut die Anwendung und überträgt nur den Build in das separate Repository `Schnecke325.github.io`; Details in `PROJECT_CONTEXT.md`.
- **Quellen- und Lehrplanrecherche:** Research-Unterlagen zu KCGO 2026, KCGO 2016, KMK, LA 2027 und Operatoren sind vorhanden. Lokaler Prüfungsbestand und Excel-Übersicht sind inventarisiert; Details siehe Research-Dateien.
- **Inhaltsstruktur:** 12 Hauptkapitel/47 Unterkapiteleinträge im Katalog; alle 47 haben ausgearbeitete Lesson-Datensätze.
- **Lernseiten:** 47 Seiten sind als vollständige Datensätze in `src/content/lessons/` vorhanden. Das Gleichgewichtskapitel wurde fachlich/redaktionell gezielt überarbeitet.
- **Experimentelle Chemie & Nachweisreaktionen:** Fünf Lernseiten (Experimentieren und Auswerten, qualitative Nachweise, organische Nachweise, Trennverfahren, quantitative Analyse) mit 45 Aufgaben, am 02.11.2026 ergänzt. Methoden ohne Beleg im KCGO-Themenkatalog sind auf den Seiten gekennzeichnet.
- **Lernbereich-UX:** Katalognavigation, mobile Accordion-Verhalten, aktiver Seitenbezug, Inhaltsnavigation und Scrollposition beim Seitenwechsel sind implementiert.
- **Zentrale Aufgabenbank:** Alle Aufgaben liegen in `src/content/exercises.json`; 425 Einträge mit stabilen IDs (282 Übungen, 143 Selbsttests). Referenz- und Bestandsvalidator vorhanden. Am 02.11.2026 bereinigt: vorangestellte Satzbausteine entfernt, 146 schablonenhafte Aufgaben neu geschrieben, keine identischen Aufgabentexte mehr.
- **Aufgabenklassifizierung:** Alle 425 Aufgaben haben AFB und Aufgabentyp nach dokumentierten Regeln auf Grundlage des Operatorenblatts LA 2027 (`research/aufgabenklassifikation.md`, `research/operatoren-afb.md`). Der Validator verlangt beide Felder.
- **Übungsbereich, Phase 2:** Themenauswahl und Filter (Kapitel, Unterkapitel, Schwierigkeit, Quelle, Kompetenz, AFB) sind umgesetzt.
- **Übungsbereich, Phase 3 – Aufgabenbearbeitung:** Aufgaben lassen sich im Übungsbereich öffnen und bearbeiten. 37 Zahlen- und 6 Zuordnungsaufgaben werden automatisch geprüft; bei allen übrigen gibt es Musterlösung und Selbsteinschätzung. Ergebnisse sind zurücksetzbar; seit Paket K2 liegen sie angemeldet im Konto.
- **Bearbeitungsmodi und Handschrift:** Alle 425 Aufgaben sind nach Bildschirm/Handschrift eingestuft, der Filter ist aktiv. Eine Schreibfläche für Stift, Maus und optional Finger steht bei freien Aufgaben und als Rechenweg-Fläche bei Zahlenaufgaben zur Verfügung; Handschrift wird seit 04.11.2026 als Notiz im Konto gespeichert (siehe Notizen).
- **Bearbeitung auf den Lernseiten:** Übungen und Selbsttests der Lernseiten sind direkt bearbeitbar, mit derselben Komponente und demselben Ergebnisspeicher wie der Übungsbereich.
- **Überarbeitung der 16 Schablonen-Lernseiten:** Lernziele, Erklärtexte, Fachbegriffe, Gleichungen, Beispiele, Aufgabenformate und typische Fehler der 16 Seiten (Q2.1, Q2.2, Q2.4, Q4.1, Q4.2, Kinetik, Tenside, Anwendungen bewerten) wurden in vier Paketen am 03. und 04.11.2026 themenspezifisch neu geschrieben; siehe `PROJECT_CONTEXT.md`.
- **Ausbau knapper Lernseiten:** Acht Seiten mit Erklärtexten unter 2.000 Zeichen (vier Q3.3-Seiten zur Elektrochemie sowie Protolyse, Carbonsäuren, Aldehyde und Ketone, technische Gleichgewichte) wurden am 04.11.2026 in zwei Paketen ergänzt, einschließlich der zuvor fehlenden KCGO-Inhalte Konzentrationszelle und Wasserelektrolyse.
- **Freigabe der Lernseiten:** Alle 47 Lernseiten stehen seit 04.11.2026 auf `publicationStatus: "published"` (Entscheidung des Nutzers nach Abschluss der inhaltlichen Überarbeitungen, ohne formale Prüfkriterien). Der Redaktionshinweis wird nur noch für nicht freigegebene Seiten angezeigt.
- **Periodensystem:** Über den Knopf „PSE“ in der Kopfzeile lässt sich seit 04.11.2026 ein Periodensystem mit Detailansicht je Element öffnen.
- **Abbildungen (04.11.2026):** Aufgaben und Lernseiten zeigen eigene SVG-Abbildungen. Pilot mit 12 Aufgaben, Paket A mit sieben Versuchsabbildungen für die experimentellen Lernseiten, Paket B mit vier berechneten Diagrammen (Titrationskurven mit Indikatoren, Gleichgewichtsstörung, Puffer gegen Wasser, Siedetemperaturen). Insgesamt 23 Aufgaben- und 11 Lernseitenabbildungen; Pakete A und B vom Nutzer bestätigt.
- **Qualitätskontrolle durch den Nutzer:** Am 02.11.2026 ohne Beanstandungen abgeschlossen.
- **Benutzerkonten, Paket K1 (04.11.2026):** Konten mit Benutzername und Zugangscode, vergeben von Admins in der Benutzerverwaltung (Rechte „Abiturarchiv“ und „Admin“, Ablaufdatum, neuer Code, entfernen); abgelaufene Konten werden automatisch gelöscht. Datenschutzseite, Supabase-Schema, Edge Function und Einrichtungsanleitung unter `supabase/`. Nicht Angemeldete sehen nur eine Zugangsseite; das grenzt den Nutzerkreis ein, schützt die Inhalte aber nicht. Vom Nutzer bestätigt.
- **Startseite mit Fächerauswahl (04.11.2026):** Nach der Anmeldung erscheint die Fächerauswahl (bisher Chemie LK); „Alle Fächer“ führt zurück. Vom Nutzer bestätigt.
- **Ergebnisse im Konto, Paket K2 (04.11.2026):** Aufgabenergebnisse werden je Konto gespeichert und zwischen Geräten abgeglichen (beim Start, Seitenwechsel und bei Rückkehr zum Tab); ohne Konto gespeicherte Ergebnisse lassen sich übernehmen. Vom Nutzer bestätigt.
- **Lernfortschritt, Paket K3 (04.11.2026):** Seite „Lernfortschritt“ (Stand je Kapitel und Lernseite, AFB-Aufteilung, Wiederholungsliste mit Sprung zur Aufgabe), echte Kennzahlen auf dem Dashboard und Reiter „Lernstand“ für Admins. Vom Nutzer bestätigt.
- **Abiturarchiv (04.11.2026):** Jede Prüfung einzeln mit Themen, Filtern (Jahr, Termin, KCGO-Feld, Thema, Unterthema), Original-PDF aus privatem Supabase-Speicher und „Passend üben“; nur für Konten mit dem Recht „Abiturarchiv“ (laut Nutzer nur die beiden Admins). Ohne das Recht sind Archiv und Prüfungsbelege auf den Lernseiten ausgeblendet. Alle 131 PDFs hochgeladen; vom Nutzer bestätigt.
- **Notizen zu Aufgaben (04.11.2026):** Handschrift, Rechenweg und getippte Antwort werden je Aufgabe im Konto gespeichert; Notizen sind privat (auch für Admins unlesbar) oder geteilt (Handschrift mit Namen für alle Konten, getippte Antwort nie). Vom Nutzer bestätigt.
- **Diskussion zu Aufgaben (04.11.2026):** Beiträge mit einer Antwortebene, Bearbeiten und Löschen eigener Beiträge, Entfernen durch Admins mit Platzhalter, Namen sichtbar für alle Konten. Umgesetzt nach dem Konzept in `research/zusammenarbeit-und-notizen.md`. Vom Nutzer bestätigt.

## Begonnen, aber noch nicht abgeschlossen

- **Feingranulare Prüfungsanalyse:** Die vorhandenen 131 PDFs sind laut Research inventarisiert und breit nach Jahr, Termin, Vorschlag und KCGO-Feld zugeordnet. Teilfragen-/Punkte-Codierung und belastbare Häufigkeitsklassen sind offen. Es gibt keinen Grund, hierfür Häufigkeiten zu schätzen.
- **Aufgabenbezogene Prüfungsreferenzen:** `sourceExamRefs` ist bei 0 von 425 Aufgaben gesetzt; nach Entscheidung vom 02.11.2026 bewusst leer, weil alle Aufgaben eigene Formulierungen sind.

## Geplant

Diese Punkte sind Zielrichtungen, nicht automatisch freigegebene Umsetzungsschritte. Umfang und Reihenfolge sind offen.

- Zusammenhängende Prüfungssimulationen und Abiturtraining.
- Weitere Abbildungen: Paket C (Reaktionsmechanismen in Musterlösungen).

## Bewusst zurückgestellt oder noch nicht freigegeben

- Prüfungssimulationen sind nicht Bestandteil des aktuellen Stands.
- Benachrichtigungen über neue Diskussionsbeiträge sind bewusst noch nicht enthalten.
- Weitere Supabase-Funktionen über den jetzigen Stand hinaus werden nicht begonnen, bis der Nutzer den konkreten Umfang freigibt.
- Es gibt keine festgelegten Termine, Prioritäten zwischen diesen Punkten oder eine Entscheidung zur Offline-Speicherung.

## Offene Entscheidungen

- Sollen für künftige neue oder geänderte Lernseiten formale Prüfkriterien vor der Freigabe gelten?
- Soll zunächst die fachliche Redaktion, weitere Prüfungsauswertung oder eine spätere Nutzerfunktion priorisiert werden?
- Welche Datenschutzfristen gelten für IP-Protokolle und Sessions bei Supabase? Bereits entschieden: Abgelaufene Konten werden mit allen Daten gelöscht; Notizen werden mit dem Konto gelöscht, Diskussionsbeiträge entfernt oder ohne Namen und Text als Platzhalter belassen.
- Wie wird die im Research beschriebene Versionsabweichung zwischen KCGO April 2026 und LA-2027-Erlass für eine konkrete fachliche Freigabe behandelt?
