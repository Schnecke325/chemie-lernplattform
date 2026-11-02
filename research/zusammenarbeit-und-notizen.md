# Zukunftsanforderungen: Aufgabendiskussionen und digitale Notizen

**Status:** Konzeptanforderungen, nicht implementiert. Diese Funktionen gehören nicht zur aktuellen Phase 2 und verändern weder die Anwendung noch deren Datenhaltung.

## 1. Diskussionen an Übungsaufgaben

Jede Übungsaufgabe erhält einen eigenen Diskussionsbereich. Beiträge können Fragen, fachliche Erklärungen und Lösungswege enthalten; Antworten bilden eine nachvollziehbare Thread-Struktur. Beiträge sollen, wenn die Aufgabe in Teilaufgaben gegliedert ist, einer konkreten Teilaufgabe zugeordnet werden können.

Nutzer können eigene Beiträge bearbeiten und löschen. Für Administratoren sind spätere Moderationsfunktionen vorzusehen (beispielsweise Beiträge prüfen, ausblenden oder entfernen). Die genauen Moderationsregeln und Aufbewahrungsfristen sind vor einer Implementierung festzulegen.

## 2. Handschriftliche Notizen

Eine digitale Schreibfläche soll Handschrift und Zeichnungen unterstützen, mit besonderem Augenmerk auf Tablets und aktive Stifte wie Apple Pencil, Samsung S Pen und vergleichbare Eingabegeräte.

Vorgesehene Grundfunktionen:

- Stift und Radierer
- auswählbare Farben und Strichstärken
- mehrere Seiten pro Notiz
- automatische Speicherung
- private Sichtbarkeit als Standard

Die Oberfläche soll auf Touch-Eingabe optimiert sein, Stifteingabe zuverlässig von Gesten unterscheiden und für gängige Tablet-Größen funktionieren. Die technische Auswahl der Zeichen-/Speicherlösung ist später anhand von Pointer-/Stiftunterstützung, Export-/Importbedarf, Speichergröße und Geräteleistung zu treffen.

## 3. Teilen und Zuordnen

Nutzer sollen einzelne Notizen oder ganze Sammlungen gezielt mit anderen Nutzern teilen können. Zu unterscheiden sind:

- **Privat:** nur für den Eigentümer sichtbar; dies ist die Voreinstellung.
- **Geteilt:** ausgewählte Personen erhalten expliziten Zugriff.
- **Gemeinschaftlich:** eine Sammlung kann von mehreren berechtigten Personen genutzt oder gepflegt werden; konkrete Rollen sind noch zu definieren.

Echtzeit-Zusammenarbeit ist nicht Teil der ersten Ausbaustufe. Eine Notiz kann optional mit einer Übungsaufgabe oder einem konkreten Aufgabenteil verknüpft werden.

## 4. Sicherheits- und Architekturleitlinien

- Die Funktionen müssen in das geplante Benutzer- und Berechtigungssystem integriert werden.
- Sichtbarkeit und Berechtigungen werden serverseitig geprüft; das Ausblenden von UI-Elementen ist keine Zugriffskontrolle.
- Private Notizen bleiben standardmäßig privat. Teilen erfordert eine ausdrückliche, nachvollziehbare Freigabe durch den Eigentümer.
- Datenmodell und Berechtigungsregeln müssen Eigentümerschaft, Empfänger, Rollen, Entzug von Freigaben und Löschung abbilden.
- Bei einer späteren Supabase-Umsetzung sind Row Level Security für Datensätze und sichere, eng begrenzte Zugriffswege für Notizdateien/Anhänge vorzusehen. Service-Schlüssel bleiben serverseitig.
- Automatisches Speichern sollte ressourcenschonend umgesetzt werden (z. B. lokale Zwischenspeicherung und verzögertes Persistieren); Konfliktverhalten bei mehreren Geräten muss vorab festgelegt werden.
- Datenminimierung und Löschkonzept gelten auch für Kommentare, Änderungsverläufe und geteilte Inhalte.

## 5. Offene Entscheidungen vor einer Implementierung

1. Dürfen Kommentare anonym/pseudonym erscheinen oder nur mit Benutzerprofil?
2. Wie werden Bearbeitung, Löschung und Moderation sichtbar protokolliert?
3. Welche Berechtigungsrollen gibt es für geteilte Notizen (Lesen, Bearbeiten, Weiterteilen)?
4. Was geschieht mit geteilten Notizen, wenn Eigentümer oder Empfänger gesperrt/gelöscht wird?
5. Welche Exportformate und maximale Notiz-/Seitengrößen werden benötigt?
6. Wie werden Offline-Änderungen und konkurrierende Speicherstände auf mehreren Geräten behandelt?

Diese Fragen sind Architekturentscheidungen für eine spätere Umsetzungsphase, keine Blocker für die aktuelle fachliche Recherche.

## Bezug zur übrigen Planung

Die geplante Supabase-Architektur mit Auth, PostgreSQL/RLS, Edge Functions und privatem Storage bleibt eine mögliche Grundlage. Die konkrete Modellierung (z. B. Aufgabenkommentare, Thread-Antworten, Notizsammlungen, Seiten und explizite Freigaben) wird erst entworfen, wenn die Funktionen zur Umsetzung freigegeben sind. Diese Anforderungsnotiz ergänzt die bisherige [Quellenlage und den Arbeitsstand](README.md); fachliche Prüfungszählungen werden dadurch nicht verändert.
