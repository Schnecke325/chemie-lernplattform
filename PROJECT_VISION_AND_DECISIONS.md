# Projektvision und Grundsatzentscheidungen

## 1. Ursprung und Ziel des Projekts

Die Chemie-Lernplattform soll eine umfassende, langfristig nutzbare Lernumgebung für das Chemie-Leistungskurs-Abitur in Hessen werden.

Sie ist nicht als gewöhnliche Sammlung von Lernzetteln gedacht. Das Ziel ist eine zusammenhängende Plattform, in der Schülerinnen und Schüler:

- chemische Inhalte verstehen und wiederholen können;
- gezielt nach Themen und Unterthemen lernen können;
- passende Übungsaufgaben bearbeiten können;
- sich mit originalen hessischen Abituraufgaben vorbereiten können;
- ihren Lernfortschritt verfolgen können;
- eigene Notizen und handschriftliche Aufzeichnungen erstellen können;
- langfristig eine persönliche Lernumgebung erhalten.

Die Plattform soll die Verbindung zwischen Lehrplan, fachlichen Erklärungen, Übungen und tatsächlichen Abiturprüfungen herstellen.

## 2. Zielgruppe und fachliche Ausrichtung

Primäre Zielgruppe sind Schülerinnen und Schüler der gymnasialen Oberstufe, insbesondere im Chemie-Leistungskurs in Hessen.

Die Plattform orientiert sich an:

- den hessischen Kerncurricula für die gymnasiale Oberstufe;
- den jeweiligen hessischen Abiturerlassen;
- den Anforderungen und Operatoren des Landesabiturs;
- historischen hessischen Chemie-LK-Abituraufgaben.

Wichtig ist die Unterscheidung zwischen:

1. aktuellen curricularen Anforderungen;
2. jahrgangsbezogenen Vorgaben der Abiturerlasse;
3. historischen Prüfungsaufgaben;
4. aus historischen Aufgaben abgeleiteten Häufigkeiten und Beobachtungen.

Historische Häufigkeiten sind keine offiziellen Relevanzbewertungen.

Die Aufgabenorientierung soll sich nicht auf das Auswendiglernen von Definitionen beschränken. Besonders wichtig sind:

- materialgestütztes Arbeiten;
- Anwenden chemischer Kenntnisse;
- Erklären und Begründen;
- Auswerten von Versuchsergebnissen;
- Interpretieren von Diagrammen und Daten;
- fachgerechtes Verwenden von Operatoren.

## 3. Historisches Abiturarchiv und Recherche

Ein wesentlicher Bestandteil der ursprünglichen Projektidee ist die systematische Auswertung historischer hessischer Chemie-LK-Abiturprüfungen.

Dafür wurden 131 PDF-Dateien mit insgesamt 578 Seiten gesammelt und untersucht. Der betrachtete Zeitraum reicht von 2007 bis 2025.

Bei der Auswertung ist die ursprüngliche Prüfungsstruktur wichtig:

- Prüfungsjahr;
- Haupttermin (HT) oder Nachtermin (NT);
- Vorschlag A, B, C oder D;
- Themen und chemische Inhalte der jeweiligen Prüfung.

Die einzelnen Prüfungen sollen nachvollziehbar bleiben. Es soll nicht einfach eine allgemeine Zusammenfassung entstehen, die die Zuordnung zu den ursprünglichen Prüfungen verliert.

Bei der Auflistung gilt daher:

- jede Prüfung separat behandeln;
- Jahr und Termin nennen;
- Vorschlagsbuchstaben beibehalten;
- fehlende Prüfungen oder Vorschläge ausdrücklich kennzeichnen;
- keine Inhalte ergänzen, die in den verfügbaren Unterlagen nicht nachweisbar sind.

Der Nutzer bevorzugt bei der Prüfungsübersicht eine klare Einzelauflistung pro Prüfung und keine ersetzenden Vergleichszusammenfassungen.

Die ursprünglichen PDF-Dateien und das lokale Recherchematerial liegen unter `local-material/` und werden nicht in das Git-Repository übernommen. Die Forschungsdokumentation liegt unter `research/`.

## 4. Lernbereich

Der Lernbereich ist das fachliche Herzstück der Plattform.

Die Inhalte sind hierarchisch organisiert: Hauptkapitel → Unterkapitel → Lernseite.

Die Lernseiten sollen nicht nur kurze Zusammenfassungen enthalten, sondern den Stoff verständlich und auf Leistungskursniveau vermitteln. Die Muster-Lernseite zu Aminosäuren war die Grundlage für den Aufbau der weiteren Lernseiten.

Die angestrebten Bestandteile einer Lernseite sind:

- Lernziele;
- notwendige Vorkenntnisse;
- verständliche fachliche Erklärungen;
- Fachbegriffe;
- Formeln und Reaktionsgleichungen;
- Reaktionsmechanismen, wo erforderlich;
- Beispiele;
- typische Abituraufgaben und Prüfungsbezüge, sofern belegt;
- Übungsaufgaben verschiedener Schwierigkeitsstufen;
- Hinweise und gestufte Hilfen;
- Lösungen;
- typische Fehler und Missverständnisse;
- Selbsttests.

Die Lerninhalte sollen:

- fachlich korrekt sein;
- verständlich und strukturiert formuliert sein;
- keine unnötig komplizierte Sprache verwenden;
- trotzdem das Niveau des Chemie-Leistungskurses beibehalten;
- Fachbegriffe im passenden Kontext erklären;
- keine fachlichen Zusammenhänge übermäßig vereinfachen.

Seit 04.11.2026 stehen alle Lernseiten im Status `published`. Der Nutzer hat diese Freigabe nach den inhaltlichen Überarbeitungen ausdrücklich entschieden, ohne dafür formale Prüfkriterien festzulegen. Neue oder wesentlich geänderte Lernseiten werden nur mit Zustimmung des Nutzers als freigegeben markiert.

## 5. Übungsbereich

Der Übungsbereich soll langfristig eine eigenständige Lernumgebung sein und nicht nur eine Wiederholung der Aufgaben auf den Lernseiten darstellen.

Die Aufgaben liegen zentral in `src/content/exercises.json`. Die Lernseiten verweisen über IDs auf diese Aufgaben. Aufgabeninhalte sollen nicht mehrfach an verschiedenen Stellen gepflegt werden.

Der aktuelle Bestand umfasst:

- 282 Übungen;
- 143 Selbsttests;
- insgesamt 425 Aufgaben.

Bereits umgesetzt:

- zentrale Aufgabenbank;
- Zuordnung zu Lernseiten;
- eigenständige Aufgabenübersicht;
- Auswahl nach Haupt- und Unterkapiteln;
- Filter nach Schwierigkeit;
- Filter nach Aufgabenquelle;
- Filter nach Kompetenzbereich;
- kombinierbare Filter;
- Zurücksetzen der Filter;
- Klassifizierung aller Aufgaben nach AFB, Aufgabentyp und Bearbeitungsmodus (Regeln und Begründungen in `research/aufgabenklassifikation.md`), dazu passende Filter;
- Aufgabenbearbeitung im Übungsbereich und auf den Lernseiten: automatische Prüfung bei Zahlen- und Zuordnungsaufgaben, sonst Musterlösung und Selbsteinschätzung;
- Handschrift-Schreibfläche für freie Aufgaben und Rechenwege;
- lokale Speicherung der Ergebnisse im Browser (ohne Antworttexte und Handschrift).

Noch nicht klassifiziert sind historische Prüfungsbezüge (`sourceExamRefs`). Solche Angaben dürfen nicht erfunden oder pauschal ergänzt werden. Sie benötigen eine fachliche Prüfung.

### Langfristige Funktionen

Mögliche beziehungsweise geplante Bereiche:

- thematische Übungen;
- gemischte Aufgaben;
- Abiturtraining;
- Prüfungssimulationen;
- Lernfortschritt.

Die Aufgabenbearbeitung soll später unterschiedliche Aufgabentypen unterstützen können, beispielsweise:

- freie Texteingabe;
- Zahlen- und Rechenaufgaben;
- Single- und Multiple-Choice;
- Zuordnungsaufgaben;
- mehrteilige Aufgaben.

Eine automatische Bewertung ist nur dort sinnvoll, wo die Antwort eindeutig und zuverlässig überprüfbar ist.

Freie chemische Erklärungen sollen nicht durch eine scheinbar objektive automatische Bewertung falsch beurteilt werden. Hier sind Musterlösungen und Selbstkontrolle geeigneter, solange kein zuverlässiges Bewertungsverfahren existiert.

## 6. Handschriftliche Eingabe und persönliche Notizen

Eine wichtige langfristige Idee ist die Unterstützung handschriftlicher Eingaben. Die Plattform soll perspektivisch insbesondere auf Tablets mit Stift gut nutzbar sein.

Mögliche Anwendungsfälle:

- Rechenwege handschriftlich aufschreiben;
- Reaktionsmechanismen zeichnen;
- Strukturformeln skizzieren;
- Diagramme erstellen;
- Notizen zu Lernseiten ergänzen;
- Aufgaben handschriftlich beantworten.

Eine technische Grundlage dafür könnte eine wiederverwendbare Zeichenfläche sein, die Stiftbewegungen als Vektordaten speichert.

Dabei müssen Stift- und Touch-Eingaben sinnvoll unterschieden werden. Die normale Seitennavigation und das Scrollen dürfen durch die Zeichenfunktion nicht beeinträchtigt werden.

### Private Notizen und selektives Teilen

Eine weitere wichtige Idee ist ein persönlicher Notizbereich.

Notizen sollen grundsätzlich privat sein können. Der Nutzer soll später gezielt entscheiden können, ob einzelne Notizen oder Inhalte geteilt werden.

Private Lernnotizen dürfen nicht versehentlich öffentlich werden.

Die Notizfunktion ist noch nicht implementiert. Die Datenstruktur und spätere Berechtigungen müssen deshalb sorgfältig geplant werden.

## 7. Lernfortschritt und persönliche Lernumgebung

Langfristig soll die Plattform einen persönlichen Lernfortschritt darstellen können.

Denkbare Informationen:

- bearbeitete Aufgaben;
- abgeschlossene Lernseiten;
- Ergebnisse von Selbsttests;
- persönliche Notizen;
- wiederholungsbedürftige Themen;
- Fortschritt innerhalb einzelner Kapitel.

Der Lernfortschritt soll nicht nur eine dekorative Prozentanzeige sein, sondern dem Nutzer dabei helfen, seine Wissenslücken zu erkennen und gezielt zu lernen.

Die konkrete Berechnung und Darstellung des Lernfortschritts ist noch offen.

## 8. Prüfungssimulationen

Ein weiterer langfristiger Bestandteil ist das Training unter realistischen Prüfungsbedingungen. Die ursprüngliche Lernidee umfasst auch vollständige Abiturtrainings und Prüfungssimulationen.

Dabei sollen unter anderem berücksichtigt werden:

- Aufgaben aus mehreren Themengebieten;
- typische hessische Aufgabenstellungen;
- Operatoren;
- unterschiedliche Anforderungsbereiche;
- mehrteilige Aufgaben;
- Bearbeitungszeit;
- Punkteverteilung und Musterlösungen.

Historische Originalaufgaben sollen als solche erkennbar bleiben. Neu zusammengestellte Übungssimulationen dürfen nicht fälschlich als originale Abiturprüfungen bezeichnet werden.

## 9. Konten und Backend

Aktuell ist die Plattform statisch aufgebaut und besitzt noch keine Benutzerkonten oder Datenbankanbindung.

Für eine spätere persönliche Lernumgebung wurde Supabase als mögliche technische Grundlage vorgesehen.

Mögliche spätere Komponenten:

- Supabase Auth für Benutzerkonten;
- PostgreSQL für strukturierte persönliche Daten;
- Row Level Security (RLS) für Zugriffsschutz;
- privater Storage für persönliche Dateien und handschriftliche Inhalte.

Die genaue Umsetzung und Berechtigungsstruktur ist noch nicht abgeschlossen.

Eine lokale Speicherung kann für erste Funktionen sinnvoll sein, muss aber klar von einer späteren kontogebundenen Synchronisierung unterschieden werden.

Private Daten dürfen nicht allein aufgrund einer clientseitigen Benutzeroberfläche als sicher gelten.

## 10. Gestaltung und Benutzererlebnis

Die Plattform soll einen modernen, dunklen, industriell-wissenschaftlichen Stil besitzen.

Die Gestaltung soll:

- sachlich und modern wirken;
- eine klare Informationshierarchie haben;
- gut lesbare Texte und Formeln ermöglichen;
- auf Smartphone, Tablet und Desktop funktionieren;
- auch bei längeren Lernseiten übersichtlich bleiben.

Der Stil soll nicht wie ein klassisches Pixel-Art-Spiel oder eine verspielte Schul-App wirken.

Wichtig sind außerdem:

- verständliche Navigation;
- sinnvolle Abstände;
- gute Kontraste;
- angenehme Textgrößen;
- klare Kennzeichnung aktiver Bereiche;
- responsive Kapitel- und Unterkapitelnavigation.

Bereits umgesetzte Verbesserungen:

- mobile Kapitelübersicht als Akkordeon;
- mehrere gleichzeitig geöffnete Kapitel;
- angepasste Lernseiten-Navigation;
- sanftes Scrollen beim Wechsel von Lernseiten;
- Berücksichtigung von `prefers-reduced-motion`.

Diese bestehenden Funktionen sollen erhalten bleiben.

## 11. Technische und organisatorische Entscheidungen

### Aktuelle technische Grundlage

- React;
- TypeScript;
- Vite;
- JSON-basierte Inhaltsdaten;
- GitHub Pages;
- GitHub Actions.

Das Projekt ist aktuell statisch. Es existiert noch kein Backend.

Die lokale Recherche mit den originalen Abiturunterlagen bleibt außerhalb des öffentlichen Repositorys.

### Inhaltsverwaltung

Die Inhalte sollen modular und datengetrieben bleiben.

Neue Lerninhalte und Aufgaben müssen in die bestehenden Datenmodelle und Validierungsmechanismen integriert werden.

Die zentrale Aufgabenbank darf nicht durch duplizierte Aufgabenbestände ersetzt werden.

### Keine eigenmächtigen Architekturänderungen

Neue Technologien oder größere Architekturänderungen müssen vor der Umsetzung mit dem Nutzer abgestimmt werden.

Bestehende Funktionen dürfen nicht ohne konkreten Grund ersetzt werden.

## 12. Zusammenarbeit und Entscheidungsregeln

Der Nutzer möchte die Entwicklung aktiv begleiten und die wesentlichen Entscheidungen selbst treffen.

Der verbindliche Ablauf lautet:

1. Nutzer beschreibt das gewünschte Ziel.
2. Claude untersucht den bestehenden Zustand.
3. Claude erklärt mögliche Lösungen und betroffene Dateien.
4. Claude schlägt einen konkreten Umsetzungsplan vor.
5. Der Nutzer gibt die Umsetzung ausdrücklich frei.
6. Claude setzt den vereinbarten Umfang um.
7. Claude prüft die Änderungen und berichtet das Ergebnis.
8. Der Nutzer kontrolliert und entscheidet über den nächsten Schritt.

Verbindliche Regeln:

- Keine Commits oder Pushes ohne ausdrückliche Zustimmung.
- Keine eigenmächtigen Änderungen der Roadmap.
- Keine unnötigen Refactorings.
- Keine ungefragten Zusatzfunktionen.
- Keine erfundenen fachlichen Angaben.
- Fehlende Informationen offen kennzeichnen.
- Bestehende Entscheidungen und Einschränkungen respektieren.
- Bei größeren offenen Fragen zuerst nachfragen.

Claude soll nicht versuchen, möglichst viele Funktionen möglichst schnell umzusetzen. Qualität, Nachvollziehbarkeit und fachliche Zuverlässigkeit sind wichtiger.

## 13. Offene Fragen und ausdrücklich nicht entschiedene Punkte

Die folgenden Punkte sind nicht automatisch als beschlossen zu betrachten:

- formale Prüfkriterien für künftige Freigaben neuer oder geänderter Lernseiten;
- endgültige Klärung der verwendeten Lehrplanversionen im Verhältnis zu den jeweiligen Abiturerlassen;
- Bewertungslogik über die bisherige automatische Prüfung (Zahlen, Zuordnungen) und Selbsteinschätzung hinaus;
- dauerhafte Speicherung handschriftlicher Eingaben (derzeit bewusst nicht gespeichert);
- genaue Gestaltung des Lernfortschritts (vom Nutzer festgelegt: erst nach Einführung von Benutzerkonten, da der Fortschritt an die Zugangsdaten gebunden sein soll);
- Reihenfolge der noch offenen Entwicklungsphasen;
- Zeitpunkt und Umfang einer Supabase-Integration;
- Integration der Content-Validierung in die CI-Pipeline.

Diese Punkte müssen gemeinsam mit dem Nutzer entschieden werden.

## 14. Grundsatz für die Weiterentwicklung

Die Plattform ist ein langfristiges Projekt.

Es geht nicht darum, möglichst schnell eine große Anzahl an Funktionen zu veröffentlichen. Es geht darum, eine fachlich zuverlässige, gut nutzbare und langfristig erweiterbare Lernplattform für das hessische Chemie-LK-Abitur aufzubauen.

Bei jeder neuen Funktion muss deshalb geprüft werden:

- Verbessert sie tatsächlich das Lernen?
- Passt sie in die bestehende Architektur?
- Ist sie fachlich sinnvoll?
- Ist sie mit vertretbarem Aufwand zuverlässig umsetzbar?
- Werden bestehende Funktionen und Inhalte dadurch beeinträchtigt?

Im Zweifel gilt: erst analysieren, dann gemeinsam entscheiden, anschließend gezielt umsetzen.
