# Aufgabenklassifikation nach AFB und Aufgabentyp

Stand: 02.11.2026. Dieses Dokument legt fest, nach welchen Regeln die Aufgaben in `src/content/exercises.json` die Felder `afb` und `taskType` erhalten, und dokumentiert jede Einstufung mit Begründung. Freigegeben wurde das Vorgehen am 02.11.2026 (Pilot zuerst, dann übrige Kapitel, Veröffentlichung erst nach vollständiger Klassifizierung).

Die Klassifizierung beschreibt die Aufgaben. Sie ist keine Bewertung ihrer Qualität und kein Beleg dafür, dass eine Aufgabe in dieser Form im Abitur vorkommt.

## Grundlagen

- Operatoren und ihre AFB: [Operatoren LA 2027](operatoren-afb.md).
- Allgemeine Beschreibung der Anforderungsbereiche (KMK-Bildungsstandards Chemie AHR 2020, siehe [Kompetenzen und Aufgabentypen](kompetenzen-und-aufgabentypen.md)): AFB I umfasst Wiedergabe und Anwendung bekannter Verfahren im gelernten Zusammenhang, AFB II selbstständiges Ordnen, Bearbeiten und Übertragen auf vergleichbare Zusammenhänge, AFB III Problemlösen, eigene Lösungswege in neuen Zusammenhängen und begründetes Beurteilen.

## Regeln für den AFB

1. **Maßgeblicher Operator.** Maßgeblich ist der Operator, den der Aufgabentext tatsächlich verlangt. Fragesätze werden einem Operator zugeordnet: „Welche/Was/Wozu …?“ entspricht angeben, „Warum …?“ begründen, „Ist …?“ mit Begründung entscheiden. Weichen die Operatoren in den Metadaten davon ab, wird das in der Tabelle mit ⚠ vermerkt; die Metadaten werden in diesem Schritt nicht verändert.
2. **Mehrere Operatoren.** Verlangt eine Aufgabe mehrere Operatoren, zählt der anspruchsvollste, der für die vollständige Lösung tatsächlich erforderlich ist.
3. **Ausgangswert.** Ausgangswert ist der Schwerpunkt-AFB des maßgeblichen Operators laut Operatorenblatt.
4. **Kontext.** Abweichungen vom Schwerpunkt sind nur innerhalb der im Operatorenblatt angegebenen Spanne zulässig und werden begründet: nach unten bei reiner Wiedergabe des auf der Lernseite Behandelten, nach oben bei Übertragung auf einen nicht behandelten Zusammenhang oder bei eigenem Lösungsweg.
5. **Operatoren ohne Eintrag.** Für Operatoren, die das Operatorenblatt nicht aufführt (unterscheiden, ausgleichen, vorhersagen, vorschlagen), wird der AFB nach der allgemeinen Beschreibung bestimmt und gekennzeichnet.
6. **Keine Ableitung aus der Schwierigkeit.** Die Stufe `basic/standard/transfer` beschreibt den Lernweg auf der Plattform und wird nicht zur AFB-Bestimmung herangezogen.

## Regeln für den Aufgabentyp

| Typ | Kriterium |
|---|---|
| `numeric` | Das geforderte Ergebnis besteht aus Zahlenwerten, gegebenenfalls mit Einheit, oder einer Anzahl, ohne zusätzlichen Erklärungsauftrag. |
| `matching` | Vorgegebene Elemente sollen vorgegebenen Kategorien zugeordnet werden; beide Seiten stehen in der Aufgabe. |
| `structured` | Die Aufgabe enthält ausdrücklich nummerierte Teilaufträge oder Fälle, die jeweils eine eigene Antwort verlangen und keine reine Zuordnung sind, oder sie verbindet einen Rechenauftrag mit einem Erklärungs-, Begründungs- oder Vergleichsauftrag. |
| `free-response` | Alle übrigen Aufgaben mit frei formulierter Antwort. |
| `single-choice`, `multiple-choice` | Werden nicht vergeben, solange das Datenmodell keine Antwortoptionen enthält. |

`supportedModes` und `sourceExamRefs` bleiben nach Entscheidung vom 02.11.2026 vorerst leer.

## Pilot: Experimentelle Chemie (45 Aufgaben)

Ergebnis: AFB I 11, AFB II 28, AFB III 6. Typen: frei 38, mehrteilig 4, numerisch 2, Zuordnung 1. Bei 8 Aufgaben wichen die Operatoren in den Metadaten vom Aufgabentext ab (⚠). Da es sich um neu erstellte Aufgaben handelt, wurden ihre Operator-Metadaten nach Freigabe am 02.11.2026 an den Aufgabentext angepasst; die Spalte „Operatoren (Metadaten)“ zeigt den Stand vor der Anpassung. Die Einstufungen sind in `exercises.json` eingetragen.

Vor der Klassifizierung der übrigen 380 Aufgaben wurde die Aufgabenbank bereinigt (siehe `PROJECT_CONTEXT.md`, Abschnitt Aufgabenbank), weil vorangestellte Satzbausteine wie „Bewerte die Reichweite der Aussage und …“ Operatoren vorgetäuscht und die AFB-Einstufung verfälscht hätten.

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| **chem.experimental.observation** |  |  |  |  |  |  |
| `exercise.basic-observation` | Beobachtung oder Deutung? | zuordnen, unterscheiden | zuordnen | **II** | Zuordnung | Gelerntes Kriterium auf neue Aussagen anwenden; Schwerpunkt II. |
| `exercise.basic-variables` | Variablen festlegen | nennen, planen | bestimmen (Variablen im gegebenen Versuch identifizieren) | **II** | frei | Die Variablen müssen im gegebenen Versuch erst bestimmt werden; Schwerpunkt von bestimmen. ⚠ Metadaten nennen „nennen, planen“; der Prompt verlangt weder reine Wiedergabe noch eigenes Planen. |
| `exercise.standard-blank` | Wozu eine Blindprobe? | erläutern, beschreiben | erläutern | **II** | frei | Schwerpunkt von erläutern. |
| `exercise.standard-errors` | Fehler einordnen | zuordnen, nennen | zuordnen | **II** | frei | Fehlertypen auf zwei neue Fälle übertragen; Schwerpunkt II. |
| `exercise.transfer-fructose` | Schlussfolgerung prüfen | beurteilen, begründen | beurteilen | **III** | frei | Begründete Einschätzung einer Schlussfolgerung; beurteilen ist nur AFB III. |
| `exercise.transfer-plan` | Experiment zur Kerzenflamme planen | planen, beschreiben | planen | **II** | frei | Planung eines im Unterricht üblichen Nachweises; kein neuer Problemkontext, daher Schwerpunkt II. |
| `selftest.positive-control` | Positivkontrolle | erläutern | angeben (Fragesatz „Welche …“) | **I** | frei | Wiedergabe einer gelernten Aussage. ⚠ Metadaten nennen „erläutern“ (AFB II); der Prompt verlangt nur Wiedergabe. |
| `selftest.negative-result` | Negatives Ergebnis | nennen | nennen | **I** | frei | Schwerpunkt von nennen. |
| `selftest.hypothesis` | Hypothese formulieren | formulieren | aufstellen von Hypothesen / formulieren | **II** | frei | Schwerpunkt II. |
| **chem.experimental.qualitative** |  |  |  |  |  |  |
| `exercise.basic-limewater` | Kalkwasser deuten | benennen, formulieren | formulieren | **II** | frei | Reaktionsgleichung formulieren hat Schwerpunkt und Spanne II. |
| `exercise.basic-water` | Wasser nachweisen | beschreiben, deuten | deuten | **II** | frei | Schwerpunkt von deuten. |
| `exercise.standard-carbonate` | Carbonat in Eierschalen | planen, formulieren | planen / formulieren | **II** | frei | Planung eines gelernten Nachweises mit Gleichungen; Schwerpunkt II. |
| `exercise.standard-ammonium` | Ammonium-Ionen im Dünger | erklären, formulieren | erklären / formulieren | **II** | frei | Erklärung eines auf der Lernseite behandelten Nachweises. |
| `exercise.transfer-halides` | Drei Halogenide unterscheiden | entwickeln, begründen | entwickeln / begründen | **II** | frei | Vorgehen kombiniert zwei auf der Lernseite behandelte Kriterien; kein neuer Lösungsweg nötig. |
| `exercise.transfer-organic-halide` | Kein Niederschlag bei Chlorethan | erklären, formulieren | erklären / formulieren | **III** | frei | Unerwartete Beobachtung muss durch Übertragung der nucleophilen Substitution aus einem anderen Kapitel erklärt werden. |
| `selftest.nitric-acid` | Warum Salpetersäure? | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |
| `selftest.indicator-gas` | Indikatorpapier für Gase | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |
| `selftest.copper-sulfate` | Kupfer(II)-sulfat | beurteilen | entscheiden mit Begründung | **II** | frei | Entscheidung mit kurzer Begründung; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt nur eine begründete Entscheidung. |
| **chem.experimental.organic-tests** |  |  |  |  |  |  |
| `exercise.basic-match` | Passenden Nachweis wählen | zuordnen, angeben | zuordnen / angeben | **I** | frei | Wiedergabe gelernter Zuordnungen von Nachweis und Strukturmerkmal; untere Grenze der Spanne von zuordnen. |
| `exercise.basic-fehling` | Fehling-Probe beschreiben | beschreiben | beschreiben | **I** | frei | Wiedergabe von Durchführung und Beobachtung; Schwerpunkt I. |
| `exercise.standard-disaccharides` | Maltose und Saccharose | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-protein` | Zwei Proteinnachweise auswerten | deuten | deuten | **II** | frei | Schwerpunkt von deuten. |
| `exercise.transfer-unknown` | Zwei Isomere mit der Formel C₃H₆O | entwickeln, formulieren, begründen | entwickeln / formulieren / begründen | **II** | frei | Unterscheidung von Aldehyd und Keton mit Fehling ist ein bekanntes Verfahren; Schwerpunkt II. |
| `exercise.transfer-formic-acid` | Silberspiegel mit Methansäure | erklären, formulieren | erklären / formulieren | **III** | frei | Aldehyd-Konzept muss auf eine Carbonsäure übertragen und eine nicht behandelte Gleichung entwickelt werden. |
| `selftest.saccharose` | Saccharose und Fehling | angeben, begründen | angeben / begründen | **II** | frei | Begründung verlangt; Schwerpunkt von begründen. |
| `selftest.starch` | Iod-Stärke beim Erwärmen | beschreiben, deuten | beschreiben / deuten | **II** | frei | Deutung verlangt; Schwerpunkt von deuten. |
| `selftest.biuret` | Biuret und Dipeptid | beurteilen | entscheiden mit Begründung | **II** | frei | Entscheidung mit kurzer Begründung; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt nur eine begründete Entscheidung. |
| **chem.experimental.separation** |  |  |  |  |  |  |
| `exercise.basic-setup` | Destillationsapparatur | nennen | nennen | **I** | frei | Schwerpunkt von nennen. |
| `exercise.basic-rf` | Rf-Wert berechnen | berechnen | berechnen | **I** | numerisch | Einschrittige Rechnung mit gegebener Formel; Schwerpunkt I. |
| `exercise.standard-boiling` | Siedetemperaturen erklären | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-melting` | Schmelzbereich beurteilen | beurteilen | beurteilen | **III** | frei | Begründete Einschätzung der Reinheit aus Daten; beurteilen ist nur AFB III. |
| `exercise.transfer-equilibrium` | Ester abdestillieren? | prüfen, begründen | prüfen | **III** | frei | Vorschlag muss mit zwei Konzepten (Le Chatelier, Siedetemperaturen) geprüft und ein Widerspruch aufgedeckt werden; obere Grenze der Spanne. |
| `exercise.transfer-tlc` | Aminosäuren per DC vergleichen | begründen, erläutern | begründen / erläutern | **II** | frei | Begründung von Arbeitsschritten; Schwerpunkt II. |
| `selftest.thermometer` | Thermometerposition | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |
| `selftest.fractions` | Erdölfraktionen | beurteilen | entscheiden | **I** | frei | Entscheidung auf Basis gelernten Wissens ohne verlangte Begründung; untere Grenze der Spanne. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt nur eine Entscheidung. |
| `selftest.rf-range` | Rf-Wert über 1? | überprüfen | überprüfen | **II** | frei | Widerspruch im Ergebnis aufdecken; Schwerpunkt II. |
| **chem.experimental.quantitative** |  |  |  |  |  |  |
| `exercise.basic-naoh` | Natronlauge titrieren | berechnen | berechnen | **I** | numerisch | Routinerechnung im Verhältnis 1 : 1; Schwerpunkt I. |
| `exercise.basic-indicator` | Indikator auswählen | begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.standard-sulfur-dioxide` | Schwefeldioxid im Wein | berechnen, erläutern | berechnen / erläutern | **II** | mehrteilig | Mehrschrittige Rechnung mit Umrechnung und Erläuterung; obere Grenze von berechnen, Schwerpunkt von erläutern. |
| `exercise.standard-permanganate` | Eisen(II)-Ionen mit Permanganat | berechnen, beschreiben | berechnen / beschreiben | **II** | mehrteilig | Rechnung erfordert das Stoffmengenverhältnis 1 : 5 aus der Redoxgleichung; obere Grenze von berechnen. |
| `exercise.transfer-iodine-value` | Zwei Öle vergleichen | berechnen, vergleichen | berechnen / vergleichen | **II** | mehrteilig | Rücktitration auswerten und zwei Öle vergleichen; Schwerpunkt von vergleichen. |
| `exercise.transfer-errors` | Auswirkung von Fehlern | beurteilen | beurteilen | **III** | mehrteilig | Auswirkung dreier Fehler begründet einschätzen; beurteilen ist nur AFB III. |
| `selftest.equivalence` | Äquivalenzpunkt und Endpunkt | unterscheiden | unterscheiden | **I** | frei | Wiedergabe zweier gelernter Begriffe. ⚠ unterscheiden steht nicht im Operatorenblatt; AFB nach allgemeiner Beschreibung bestimmt. |
| `selftest.starch` | Stärke als Indikator | erläutern | angeben (Fragesatz „Wozu …“) | **I** | frei | Wiedergabe der gelernten Funktion. ⚠ Metadaten nennen „erläutern“ (AFB II); der Prompt verlangt nur Wiedergabe. |
| `selftest.blank` | Blindwert | erläutern | angeben (Fragesatz „Welche …“) | **I** | frei | Wiedergabe einer gelernten Aussage. ⚠ Metadaten nennen „erläutern“ (AFB II); der Prompt verlangt nur Wiedergabe. |

## Übrige Lernseiten (380 Aufgaben)

Ergebnis: AFB I 193, AFB II 166, AFB III 21. Typen: frei 319, mehrteilig 21, numerisch 35, Zuordnung 5. Hinweise (⚠): 34.

Eingestuft am 02.11.2026 nach denselben Regeln auf dem bereinigten Aufgabenbestand. Die Spalte „Operatoren (Metadaten)“ zeigt die unveränderten Metadaten; Abweichungen zum Aufgabentext sind mit ⚠ markiert und wurden bei diesen älteren Aufgaben nicht korrigiert.

### chem.applications.evaluation

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Sach- oder Werturteil? | zuordnen | zuordnen | **II** | Zuordnung | Gelernte Unterscheidung auf neue Aussagen anwenden; Schwerpunkt II. |
| `exercise.2` | Relative Änderung berechnen | berechnen | berechnen | **I** | numerisch | Einschrittige Rechnung mit gegebener Formel. |
| `exercise.3` | Kriterien festlegen | nennen, angeben | nennen / angeben | **I** | frei | Schwerpunkt von nennen. |
| `exercise.4` | Gleiche Bezugsgröße | berechnen, begründen | berechnen / begründen | **II** | mehrteilig | Rechnung mit Begründung der Bezugsgröße; Schwerpunkt von begründen. |
| `exercise.5` | Platin- oder Eisenkatalysator | bewerten | bewerten | **III** | frei | bewerten ist nur AFB III. |
| `exercise.6` | Grenzwert und Messunsicherheit | beurteilen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Sachurteil und Werturteil | unterscheiden | unterscheiden | **I** | frei | Wiedergabe zweier gelernter Begriffe. ⚠ unterscheiden steht nicht im Operatorenblatt; AFB nach allgemeiner Beschreibung. |
| `selftest.2` | Gleiche Bezugsbasis | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |
| `selftest.3` | Zielkonflikt | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |

### chem.basics.data

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-axes` | Achsen prüfen | angeben, begründen | angeben / begründen | **II** | frei | Begründung verlangt; Schwerpunkt von begründen. |
| `exercise.basic-trend` | Grundlage selbst erklären | beschreiben | beschreiben | **I** | frei | Der Auftrag ist eine Beschreibung; Schwerpunkt von beschreiben. |
| `exercise.standard-rate` | Mittlere Abnahmegeschwindigkeit | berechnen, angeben | berechnen | **I** | numerisch | Einschrittige Rechnung mit gegebener Formel. |
| `exercise.standard-intervals` | Begründung ausarbeiten | berechnen, vergleichen, beschreiben | berechnen / vergleichen | **II** | mehrteilig | Zwei Raten berechnen und vergleichen; Schwerpunkt von vergleichen. |
| `exercise.transfer-equilibrium` | Hypothese mit Daten prüfen | beurteilen, begründen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `exercise.transfer-uncertainty` | Transfer und Beleggrenze | beurteilen, begründen | entscheiden mit Begründung | **II** | frei | Begründete Entscheidung aus Unsicherheitsbereichen; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine begründete Entscheidung. |
| `selftest.rate` | Mittlere Änderungsrate | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe der gelernten Formel. |
| `selftest.equilibrium` | Plateau und Gleichgewicht | angeben | entscheiden | **I** | frei | Entscheidung auf Basis der Lernseite ohne verlangte Begründung; untere Grenze der Spanne. |
| `selftest.uncertainty` | Kleine Messunterschiede | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer gelernten Regel. |

### chem.basics.quantities

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-mole` | Stoffmenge berechnen | berechnen | berechnen | **I** | numerisch | Einschrittige Rechnung mit gegebener Formel. |
| `exercise.basic-concentration` | Grundlage selbst erklären | berechnen, angeben | berechnen | **I** | numerisch | Einschrittige Rechnung mit gegebener Formel. |
| `exercise.standard-limiting` | Limitierendes Edukt | ermitteln, berechnen | bestimmen (Fragesatz) | **II** | mehrteilig | Limitierenden Stoff bestimmen und Produktmenge berechnen; Schwerpunkt von bestimmen. |
| `exercise.standard-dilution` | Begründung ausarbeiten | berechnen | berechnen | **I** | numerisch | Rechnung mit bekannter Verdünnungsformel. |
| `exercise.transfer-gas` | Gasvolumen im Kontext | berechnen, angeben | berechnen | **I** | numerisch | Einsetzen in die gegebene Gasgleichung. |
| `exercise.transfer-dose` | Transfer und Beleggrenze | berechnen, beurteilen | berechnen / erklären | **II** | mehrteilig | Rechnung und Erklärung der Aussagegrenze; Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Rechnung und Erklärung. |
| `selftest.molar` | Stoffmenge aus der Masse | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe der gelernten Formel. |
| `selftest.concentration` | Stoffmengenkonzentration | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |
| `selftest.limiting` | Limitierender Stoff | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |

### chem.basics.representation

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-levels` | Drei Beschreibungsebenen | zuordnen, benennen | zuordnen / benennen | **II** | mehrteilig | Drei Aussagen den Beschreibungsebenen zuordnen; Schwerpunkt von zuordnen. |
| `exercise.basic-balance` | Grundlage selbst erklären | ausgleichen, überprüfen | ausgleichen / prüfen | **I** | frei | Routineverfahren an einer einfachen Gleichung. ⚠ ausgleichen steht nicht im Operatorenblatt; AFB nach allgemeiner Beschreibung. |
| `exercise.standard-zinc` | Beobachtung und Modell verknüpfen | beschreiben, formulieren, erläutern | beschreiben / formulieren / erklären | **II** | frei | Gleichung formulieren und erklären; Schwerpunkt von formulieren und erklären. |
| `exercise.standard-structure` | Begründung ausarbeiten | begründen, beurteilen | entscheiden / begründen / nennen | **II** | frei | Begründete Auswahl einer Darstellung; Schwerpunkt von begründen. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine begründete Entscheidung. |
| `exercise.transfer-model` | Modellgrenze beurteilen | beurteilen, begründen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `exercise.transfer-charge` | Transfer und Beleggrenze | entwickeln, überprüfen | entwickeln / erklären | **II** | frei | Gleichung entwickeln und Prüfung erklären; Schwerpunkt II. |
| `selftest.levels` | Beschreibungsebenen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe gelernter Begriffe. |
| `selftest.coefficient` | Gleichungen ausgleichen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer gelernten Regel. |
| `selftest.model` | Gleichung und Mechanismus | angeben | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q1.1.bonding

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-bond` | Bindungsmodell zuordnen | zuordnen, beschreiben | zuordnen | **I** | frei | Wiedergabe gelernter Standardbeispiele; untere Grenze der Spanne. |
| `exercise.basic-lewis` | Grundlage selbst erklären | zeichnen | zeichnen | **I** | frei | Schwerpunkt von zeichnen. |
| `exercise.standard-electronegativity` | Bindungspolarität erklären | einordnen, begründen | einordnen / einzeichnen | **II** | frei | Bindung anhand der EN-Differenz einordnen; Schwerpunkt von einordnen. |
| `exercise.standard-properties` | Begründung ausarbeiten | erläutern, vergleichen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-charge` | Ionenformel entwickeln | entwickeln, begründen | ableiten / erklären | **II** | frei | Schwerpunkt II. |
| `exercise.transfer-model` | Transfer und Beleggrenze | erläutern, beurteilen | erklären | **II** | frei | Erklärung von Leistung und Grenze eines behandelten Modells; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine Erklärung. |
| `selftest.models` | Bausteine im Ionengitter | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.metal` | Leitfähigkeit von Metallen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.polar` | Partialladungen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |

### chem.q1.1.hydrocarbons

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-series` | Stoffklasse erkennen | zuordnen, benennen | zuordnen / nennen | **I** | frei | Wiedergabe gelernter Stoffklassen-Merkmale; untere Grenze der Spanne. |
| `exercise.basic-isomer` | Grundlage selbst erklären | begründen | entscheiden mit Begründung | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.standard-naming` | Struktur benennen | benennen | benennen | **I** | frei | Schwerpunkt von benennen. |
| `exercise.standard-addition` | Begründung ausarbeiten | formulieren, begründen | formulieren / angeben | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.transfer-combustion` | Verbrennung stöchiometrisch formulieren | formulieren, erläutern | aufstellen / erklären | **II** | frei | Schwerpunkt II. |
| `exercise.transfer-reaction` | Transfer und Beleggrenze | deuten, formulieren | deuten / formulieren | **II** | frei | Schwerpunkt II. |
| `selftest.classes` | Kennzeichen eines Alkens | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.isomers` | Konstitutionsisomere | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |
| `selftest.addition` | Addition an C=C | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.1.inorganic-structures

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-types` | Strukturtypen zuordnen | zuordnen | zuordnen | **I** | frei | Wiedergabe gelernter Zuordnungen; untere Grenze der Spanne. |
| `exercise.basic-silica` | Grundlage selbst erklären | beschreiben, erläutern | angeben (Fragesatz) | **I** | frei | Wiedergabe der Bedeutung eines Fachbegriffs. ⚠ Metadaten nennen „beschreiben, erläutern“; der Prompt verlangt nur Wiedergabe. |
| `exercise.standard-properties` | Struktur und Eigenschaft verknüpfen | vergleichen, erläutern | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-structure` | Begründung ausarbeiten | erklären, vergleichen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-context` | Materialeigenschaft beurteilen | beurteilen, begründen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `exercise.transfer-model` | Transfer und Beleggrenze | beurteilen, erläutern | beurteilen (Fragesatz) | **III** | frei | Aussagekraft eines Modells begründet einschätzen. ⚠ Der Prompt ist als Frage formuliert; inhaltlich wird ein Urteil verlangt. |
| `selftest.network` | Formel eines Netzwerkstoffs | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.conductivity` | Bindungen im Quarz | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.silicon` | Ist Silicium ein Metall? | angeben | entscheiden | **I** | frei | Entscheidung ohne verlangte Begründung; untere Grenze der Spanne. |

### chem.q1.1.interactions

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-shape` | Molekülform bestimmen | bestimmen, darstellen | ableiten | **II** | frei | Schwerpunkt von ableiten. |
| `exercise.basic-force` | Grundlage selbst erklären | benennen, begründen | angeben / begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.standard-dipole` | Molekülpolarität vergleichen | erklären, vergleichen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-boiling` | Begründung ausarbeiten | begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-solubility` | Löslichkeit aus Struktur deuten | erläutern, beurteilen | erklären / nennen | **II** | frei | Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Erklärung und Nennung. |
| `exercise.transfer-hyaluronan` | Transfer und Beleggrenze | erläutern, begründen | formulieren einer Erklärung | **II** | frei | Bekannte Wechselwirkungen auf einen Materialkontext anwenden; Schwerpunkt II. |
| `selftest.geometry` | Elektronenbereiche im EPA-Modell | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.dipole` | Permanenter Dipol | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Bedingung. |
| `selftest.forces` | Allgegenwärtige Wechselwirkung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.1.mechanisms

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-classify` | Reaktionstyp unterscheiden | zuordnen, unterscheiden | zuordnen | **II** | mehrteilig | Reaktionstyp aus Edukten und Bedingungen erkennen; Schwerpunkt II. |
| `exercise.basic-radical` | Grundlage selbst erklären | benennen, zuordnen | nennen / zuordnen | **I** | frei | Wiedergabe der gelernten Phasen. |
| `exercise.standard-sn2` | Nukleophile Substitution formulieren | formulieren, benennen | formulieren / benennen | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.standard-elimination` | Begründung ausarbeiten | formulieren, erläutern | aufstellen / erklären | **II** | frei | Schwerpunkt II. |
| `exercise.transfer-conditions` | Reaktionswege anhand von Bedingungen beurteilen | beurteilen, begründen | begründen | **II** | frei | Schwerpunkt von begründen. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine Begründung. |
| `exercise.transfer-mechanism` | Transfer und Beleggrenze | auswerten, erläutern | einordnen / erklären | **II** | frei | Mechanismus aus Schema einordnen; Schwerpunkt II. |
| `selftest.radical` | Startschritt der Chlorierung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.nucleophile` | Rolle des Nucleophils | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.elimination` | Kennzeichen der Eliminierung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.2.alcohols

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-classify` | Alkanol einordnen | zuordnen | einordnen | **II** | Zuordnung | Strukturen anhand eines gelernten Kriteriums analysieren; Schwerpunkt II. |
| `exercise.basic-bond` | Grundlage selbst erklären | benennen, begründen | angeben / begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.standard-oxidation` | Oxidationsprodukt vorhersagen | angeben, begründen | angeben / nennen | **I** | frei | Wiedergabe gelernter Oxidationsprodukte. |
| `exercise.standard-secondary` | Begründung ausarbeiten | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.transfer-properties` | Siedepunkte begründen | begründen, vergleichen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-tertiary` | Transfer und Beleggrenze | beurteilen, begründen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.class` | Sekundäres Alkanol erkennen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe eines Kriteriums. |
| `selftest.primary` | Oxidation primärer Alkanole | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.tertiary` | Tertiäre Alkanole oxidieren | angeben | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q1.2.carbonyls

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-identify` | Aldehyd oder Keton? | zuordnen, beschreiben | einordnen / beschreiben | **I** | frei | Wiedergabe gelernter Strukturmerkmale an Standardbeispielen. |
| `exercise.basic-polar` | Grundlage selbst erklären | angeben, begründen | angeben / begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.standard-reduction` | Reduktion zuordnen | formulieren, zuordnen | angeben | **I** | frei | Wiedergabe eines gelernten Reaktionsprodukts. |
| `exercise.standard-test` | Begründung ausarbeiten | auswerten, beurteilen | ableiten / nennen | **II** | frei | Schlussfolgerung aus einem Befund mit Einschränkung; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Ableiten und Nennen. |
| `exercise.transfer-addition` | Nucleophile Addition erklären | erläutern, darstellen | beschreiben | **I** | frei | Wiedergabe des auf der Lernseite behandelten Mechanismus; Schwerpunkt I. |
| `exercise.transfer-oxidation` | Transfer und Beleggrenze | ableiten, begründen | ableiten / begründen | **II** | frei | Schwerpunkt II. |
| `selftest.aldehyde` | Lage der Aldehydgruppe | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.nucleophile` | Angriffspunkt für Nucleophile | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.reduction` | Reduktion eines Ketons | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.3.carboxylic-acids

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-group` | Carboxygruppe erkennen | beschriften, benennen | kennzeichnen / benennen | **I** | frei | Schwerpunkt I. |
| `exercise.basic-protolysis` | Grundlage selbst erklären | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.standard-acidity` | Säurestärke vergleichen | vergleichen, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-pka` | Begründung ausarbeiten | auswerten, begründen | entscheiden mit Begründung | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-polyacid` | Mehrprotonige Säure deuten | erläutern, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-isomerism` | Transfer und Beleggrenze | ableiten, begründen | ableiten (Fragesatz) | **II** | frei | Stereochemische Folgerung aus einem Strukturmerkmal ableiten; Schwerpunkt II. |
| `selftest.group` | Aufbau der Carboxygruppe | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.pka` | pKa und Säurestärke | angeben | entscheiden | **I** | frei | Entscheidung nach gelernter Regel; untere Grenze der Spanne. |
| `selftest.inductive` | Elektronenziehende Gruppen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.3.esters

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-name` | Estergruppe benennen | beschriften, benennen | kennzeichnen / benennen | **I** | frei | Schwerpunkt I. |
| `exercise.basic-reaction` | Grundlage selbst erklären | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `exercise.standard-equilibrium` | Gleichgewicht beeinflussen | angeben, begründen | nennen | **I** | frei | Schwerpunkt von nennen. |
| `exercise.standard-hydrolysis` | Begründung ausarbeiten | formulieren, benennen | formulieren / nennen | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.transfer-mechanism` | Mechanismus erklären | erläutern, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-process` | Transfer und Beleggrenze | entwickeln, beurteilen | nennen | **I** | frei | Schwerpunkt von nennen. ⚠ Metadaten nennen „entwickeln, beurteilen“; der Prompt verlangt nur Nennen. |
| `selftest.group` | Estergruppe | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.catalyst` | Katalysator und Estergleichgewicht | angeben | entscheiden | **I** | frei | Entscheidung nach gelernter Regel; untere Grenze der Spanne. |
| `selftest.saponification` | Produkt der Verseifung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.4.q4.3.surfactants

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Bau eines Seifen-Anions | beschreiben, zuordnen | beschreiben / zuordnen | **I** | frei | Schwerpunkt von beschreiben. |
| `exercise.2` | Kalkseife formulieren | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.3` | Fett von Textilien lösen | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.4` | Seife in saurer Lösung | erklären, formulieren | erklären / formulieren | **II** | frei | Schwerpunkt II. |
| `exercise.5` | Waschen in hartem Wasser | erläutern | erläutern | **II** | frei | Schwerpunkt von erläutern. |
| `exercise.6` | Die sinkende Büroklammer | erklären | erklären | **III** | frei | Oberflächenspannung wird auf der Lernseite nicht behandelt; Übertragung auf ein neues Phänomen. |
| `selftest.1` | Hydrophob | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Wasserhärte | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Inneres einer Mizelle | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q1.5.preservatives

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-groups` | Konservierungsstoff einordnen | zuordnen, benennen | angeben (Fragesatz) | **I** | frei | Wiedergabe von Stoffklasse und funktioneller Gruppe. |
| `exercise.basic-vitamin` | Grundlage selbst erklären | erläutern | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-titration` | Konzentration einer Säure bestimmen | berechnen | berechnen | **I** | numerisch | Routinerechnung im Verhältnis 1 : 1. |
| `exercise.standard-speciation` | Begründung ausarbeiten | erläutern | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-method` | Analytische Methode planen | planen, begründen | skizzieren / nennen | **II** | frei | Vorgehen einer Bestimmung selbst entwerfen; obere Grenze von skizzieren. |
| `exercise.transfer-health` | Transfer und Beleggrenze | beurteilen, bewerten | bestimmen (Fragesatz) | **II** | frei | Benötigte Kriterien für ein Urteil im Kontext ermitteln; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen, bewerten“ (AFB III); der Prompt verlangt kein Urteil, nur dessen Voraussetzungen. |
| `selftest.sorbic` | Säuregruppe der Sorbinsäure | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.ascorbic` | Schutzwirkung der Ascorbinsäure | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe der gelernten Wirkungsweise. |
| `selftest.evidence` | Analysenwert und Grenzwert | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q2.1.amino-acids-peptides

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-draw` | Ladungsbild von Alanin | zeichnen, angeben | zeichnen | **I** | frei | Schwerpunkt von zeichnen. |
| `exercise.basic-bonds` | Grundlage selbst erklären | bestimmen, begründen | bestimmen (Fragesatz) / begründen | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.standard-pi` | Isoelektrischen Punkt bestimmen | berechnen, begründen | berechnen / entscheiden | **II** | mehrteilig | Rechnung und daraus abgeleitete Ladungsaussage; Schwerpunkt II. |
| `exercise.standard-limiting` | Begründung ausarbeiten | berechnen, ermitteln | berechnen | **II** | numerisch | Limitierendes Edukt muss zuerst erkannt werden; obere Grenze von berechnen. |
| `exercise.transfer-migration` | Ladung und Wanderungsrichtung | vorhersagen, begründen, beurteilen | vorhersagen / begründen | **II** | frei | Gelernten pI-Zusammenhang auf zwei pH-Werte anwenden; Schwerpunkt II. ⚠ Metadaten nennen auch „beurteilen“ (AFB III); der Prompt verlangt Vorhersage und Begründung. vorhersagen steht nicht im Operatorenblatt. |
| `exercise.transfer-configuration` | Transfer und Beleggrenze | beurteilen, erläutern | beurteilen / erklären | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.zwitterion` | Zwitterion erkennen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.pi` | pI-Regel | angeben, erläutern | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Rechenregel. |
| `selftest.bonds` | Bindungszahl | bestimmen | angeben (Fragesatz „Wie viele …“) | **I** | numerisch | Anwendung der gelernten Regel n − 1 ohne weiteren Kontext. ⚠ Metadaten nennen „bestimmen“ (AFB II); der Prompt ist eine reine Abzählfrage. |
| `selftest.configuration` | D/L und optische Drehung | beurteilen | entscheiden | **I** | frei | Entscheidung nach gelernter Regel; untere Grenze der Spanne. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt nur eine Entscheidung. |
| `selftest.limiting` | Limitierendes Edukt | berechnen | berechnen (Fragesatz) | **I** | numerisch | Einfache Stoffmengenbetrachtung im Verhältnis 1 : 1. |

### chem.q2.1.biopolymers

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Bausteine und Bindungen zuordnen | zuordnen | zuordnen | **I** | frei | Wiedergabe gelernter Bausteine und Bindungen; untere Grenze der Spanne. |
| `exercise.2` | Kondensation zählen | angeben, begründen | angeben / begründen | **II** | mehrteilig | Anzahl angeben und begründen; Schwerpunkt von begründen. |
| `exercise.3` | Reißfeste Cellulose | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.4` | Quellen ohne Lösen | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Seide und Baumwolle vergleichen | vergleichen, nennen | vergleichen / nennen | **II** | frei | Schwerpunkt von vergleichen. |
| `exercise.6` | Verdickungsmittel Guarkernmehl | erklären, beurteilen | erklären / beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Chitin einordnen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Struktur-Eigenschafts-Kette | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `selftest.3` | Abgespaltenes Molekül | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q2.1.carbohydrates

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Anomere unterscheiden | angeben | angeben | **I** | frei | Wiedergabe. |
| `exercise.2` | Glucose und Fructose | beschreiben, angeben | beschreiben / angeben | **I** | frei | Schwerpunkt von beschreiben. |
| `exercise.3` | Reduzierende Wirkung begründen | begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.4` | Zwei Nachweise auswerten | deuten | deuten | **II** | frei | Schwerpunkt von deuten. |
| `exercise.5` | Lactose vorhersagen | vorhersagen, begründen | vorhersagen / begründen | **II** | frei | Strukturkriterium auf ein neues Disaccharid anwenden; Schwerpunkt II. ⚠ vorhersagen steht nicht im Operatorenblatt; AFB über begründen bestimmt. |
| `exercise.6` | Saccharose nach Hydrolyse | erklären, begründen | erklären / begründen | **II** | frei | Schwerpunkt II. |
| `selftest.1` | Anomeres C-Atom | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Positiver Fehling-Befund | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Iod-Stärke-Befund | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q2.1.fats-oils

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Triacylglycerid aufbauen | nennen, angeben | nennen / angeben | **I** | frei | Wiedergabe. |
| `exercise.2` | Fettsäuren einordnen | zuordnen, begründen | zuordnen / begründen | **II** | frei | Zuordnung über die Summenformel begründen; Schwerpunkt II. |
| `exercise.3` | Verseifung formulieren | formulieren, benennen | formulieren / benennen | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.4` | Iodzahl berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in die Definition der Iodzahl. |
| `exercise.5` | Fetthärtung erklären | erklären, erläutern | erklären / erläutern | **II** | frei | Schwerpunkt II. |
| `exercise.6` | Öle über die Iodzahl vergleichen | vergleichen, beurteilen | vergleichen / beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Fettsäurereste zählen | angeben | angeben (Fragesatz) | **I** | numerisch | Wiedergabe. |
| `selftest.2` | Iodzahl | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |
| `selftest.3` | Flüssige Öle | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q2.1.proteins

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Strukturebenen ordnen | zuordnen | zuordnen | **I** | frei | Wiedergabe der gelernten Strukturebenen; untere Grenze der Spanne. |
| `exercise.2` | Denaturierung und Hydrolyse | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.3` | Disulfidbrücken deuten | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.4` | Biuret-Befund auswerten | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.5` | pH-Einfluss erklären | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.6` | Festigkeit von Keratin begründen | beurteilen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Grundbausteine | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Stabilisierende Wechselwirkungen | nennen | nennen | **I** | frei | Wiedergabe. |
| `selftest.3` | Hitzedenaturierung | entscheiden | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |

### chem.q2.2.polycondensation-polyaddition

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Reaktionstyp zuordnen | zuordnen | zuordnen | **II** | Zuordnung | Reaktionstyp aus der Beschreibung erschließen; Schwerpunkt II. |
| `exercise.2` | Funktionelle Gruppen der Monomere | angeben | angeben | **I** | frei | Wiedergabe. |
| `exercise.3` | Polyester formulieren | formulieren, angeben | formulieren / angeben | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.4` | Polyamid 6,6 | formulieren, erklären | formulieren / erklären | **II** | frei | Schwerpunkt II. |
| `exercise.5` | Glycerin statt Diol | ableiten | ableiten | **II** | frei | Schwerpunkt von ableiten. |
| `exercise.6` | Polyurethan und Feuchtigkeit | erklären, erläutern | erklären / erläutern | **II** | frei | Schwerpunkt II. |
| `selftest.1` | Kondensationsprodukt | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Polykondensation und Polyaddition | unterscheiden | unterscheiden | **I** | frei | Wiedergabe zweier gelernter Begriffe. ⚠ unterscheiden steht nicht im Operatorenblatt; AFB nach allgemeiner Beschreibung. |
| `selftest.3` | Mindestzahl funktioneller Gruppen | angeben | angeben (Fragesatz) | **I** | numerisch | Wiedergabe. |

### chem.q2.2.polymerization

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Wiederholungseinheit ableiten | angeben | angeben | **I** | frei | Anwendung des gelernten Vorgehens auf einfache Monomere; Schwerpunkt I. |
| `exercise.2` | Monomer erschließen | angeben | angeben | **I** | frei | Anwendung des gelernten Vorgehens in umgekehrter Richtung; Schwerpunkt I. |
| `exercise.3` | Radikalische Polymerisation formulieren | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.4` | Molare Masse einer Kette | berechnen, begründen | berechnen / begründen | **II** | mehrteilig | Rechnung mit Begründung; Schwerpunkt von begründen. |
| `exercise.5` | Polystyrol und Polyethen | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.6` | Mehr Initiator, kürzere Ketten | ableiten | ableiten | **II** | frei | Schwerpunkt von ableiten. |
| `selftest.1` | Nebenprodukt? | entscheiden | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |
| `selftest.2` | Voraussetzung im Monomer | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Rolle des Initiators | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q2.2.properties

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Kunststoffklassen zuordnen | zuordnen | zuordnen | **I** | Zuordnung | Wiedergabe gelernter Alltagsbeispiele; untere Grenze der Spanne. |
| `exercise.2` | Verhalten beim Erwärmen | beschreiben | beschreiben | **I** | frei | Schwerpunkt von beschreiben. |
| `exercise.3` | Thermoplaste umformen | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.4` | PE-HD und PE-LD | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Copolymer oder Blend? | zuordnen, begründen | zuordnen / begründen | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.6` | Werkstoff für einen Pfannengriff | beurteilen | beurteilen / nennen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Wiederholt schmelzbar | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Weitmaschige Vernetzung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Duroplast erhitzen | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q2.2.sustainability

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Verwertungswege zuordnen | zuordnen | zuordnen | **II** | Zuordnung | Verfahren aus der Beschreibung erschließen; Schwerpunkt II. |
| `exercise.2` | Rezyklatanteil berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in die gegebene Formel. |
| `exercise.3` | Grenzen des werkstofflichen Recyclings | erläutern | erläutern | **II** | frei | Schwerpunkt von erläutern. |
| `exercise.4` | Bio-PE | begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.5` | Zwei Getränkeverpackungen vergleichen | berechnen, beurteilen | berechnen / beurteilen | **III** | mehrteilig | Rechnung und Beurteilung der Vergleichbarkeit; beurteilen ist nur AFB III. |
| `exercise.6` | PET chemisch recyceln | bewerten | bewerten | **III** | frei | bewerten ist nur AFB III. |
| `selftest.1` | Energetische Verwertung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Systemgrenze | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |
| `selftest.3` | Biobasiert und abbaubar | entscheiden | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |

### chem.q2.3.aromatics

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-ring` | Aromaten erkennen | beschreiben, erläutern | angeben (Fragesatz) | **I** | frei | Wiedergabe des Mesomerie- bzw. Delokalisationsmodells. ⚠ Metadaten nennen „beschreiben, erläutern“; der Prompt verlangt nur die Angabe des Modells. |
| `exercise.basic-reaction` | Grundlage selbst erklären | zuordnen, begründen | einordnen / begründen | **II** | frei | Schwerpunkt II. |
| `exercise.standard-nitration` | Nitrierung formulieren | formulieren, benennen | formulieren / nennen | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.standard-mechanism` | Begründung ausarbeiten | ordnen, erläutern | ordnen | **I** | frei | Wiedergabe der gelernten Schrittfolge. ⚠ Die Aufgabe nennt die Schritte bereits in der richtigen Reihenfolge; inhaltliche Überarbeitung empfohlen. |
| `exercise.transfer-substituent` | Substituenteneffekt kontextbezogen prüfen | prüfen, begründen | bestimmen (Fragesatz) | **II** | frei | Benötigte Informationen für eine Begründung ermitteln; Schwerpunkt II. ⚠ Metadaten nennen „prüfen, begründen“; der Prompt fragt nach den Voraussetzungen einer Begründung. |
| `exercise.transfer-addition` | Transfer und Beleggrenze | beurteilen, begründen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.pi` | π-Elektronen im Benzol | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.reaction` | Typische Reaktion des Benzols | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.sigma` | Nach dem σ-Komplex | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q2.4.organic-materials

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | PLA einordnen | angeben, nennen | angeben / nennen | **I** | frei | Wiedergabe. |
| `exercise.2` | Vulkanisation | nennen, beschreiben | nennen / beschreiben | **I** | frei | Schwerpunkt I. |
| `exercise.3` | PLA-Bildung formulieren | formulieren, erklären | formulieren / erklären | **II** | frei | Schwerpunkt II. |
| `exercise.4` | Weich- und Hartgummi | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Viskose und Baumwolle | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.6` | Kompostierbarer PLA-Becher | beurteilen, nennen | beurteilen / nennen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Stoffklasse von PLA | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Vernetzung im Gummi | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Ausgangsstoff der Viskose | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.1.applications

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-haber` | Ammoniaksynthese formulieren | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.basic-exothermic` | Wärme in der Reaktionsgleichung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `exercise.standard-conditions` | Prozessbedingungen erklären | erläutern, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.standard-ester` | Esterausbeute begründen | begründen | nennen / begründen | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.transfer-evaluate` | Bedingungen vergleichen | vergleichen, bewerten | bestimmen (Fragesatz) | **II** | frei | Weitere Bewertungskriterien im Kontext ermitteln; Schwerpunkt II. ⚠ Metadaten nennen „vergleichen, bewerten“ (AFB III); der Prompt verlangt nur die Kriterien, kein Urteil. |
| `exercise.transfer-mw` | Produktentfernung beim Haber-Bosch-Verfahren | ableiten, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `selftest.haber` | Druck und Ammoniaksynthese | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.catalyst` | Katalysator und Ausbeute | angeben | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |
| `selftest.ester` | Estermenge erhöhen | angeben | nennen | **I** | frei | Wiedergabe. |

### chem.q3.1.mwg

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-dynamic` | Dynamisches Gleichgewicht beschreiben | begründen | entscheiden / begründen | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.basic-expression` | MWG-Ausdruck aufstellen | formulieren | aufstellen | **II** | frei | Schwerpunkt von aufstellen. |
| `exercise.standard-kc` | Gleichgewichtskonstante berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in den gegebenen Ausdruck. |
| `exercise.standard-ice` | Gleichgewichtskonzentration berechnen | berechnen | berechnen | **II** | numerisch | Stöchiometrische Umrechnung über die Gleichgewichtstabelle; obere Grenze von berechnen. |
| `exercise.transfer-data` | Messkurve interpretieren | interpretieren, beurteilen | erklären | **II** | frei | Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine Erklärung mit Grenze. |
| `exercise.transfer-equilibrium` | Reaktionsrichtung aus Qc und Kc ableiten | ableiten, begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `selftest.dynamic` | Dynamisches Gleichgewicht | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.kc` | Aufbau des MWG | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.qc` | Qc kleiner als Kc | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.1.shifts

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-concentration` | Konzentration ändern | ableiten | beschreiben | **II** | frei | Prinzip von Le Chatelier auf zwei Fälle anwenden; obere Grenze von beschreiben. |
| `exercise.basic-catalyst` | Katalysatorwirkung beschreiben | erläutern | nennen | **I** | frei | Wiedergabe. |
| `exercise.standard-pressure` | Druckeinfluss bestimmen | bestimmen, begründen | bestimmen / begründen | **II** | frei | Schwerpunkt II. |
| `exercise.standard-temperature` | Temperaturwirkung begründen | ableiten, begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-kc` | Änderung von Q und K unterscheiden | begründen, unterscheiden | entscheiden / begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-solids` | Einfluss eines Feststoffs beurteilen | beurteilen, begründen | entscheiden / begründen | **II** | frei | Schwerpunkt von begründen. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine begründete Entscheidung. |
| `selftest.pressure` | Druckerhöhung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.temperature` | Temperaturerhöhung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.catalyst` | Katalysator und Kc | angeben | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |

### chem.q3.2.ph

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-ph` | pH einer starken Säure | berechnen | berechnen | **I** | numerisch | Einsetzen in die pH-Definition. |
| `exercise.basic-poh` | Grundlage selbst erklären | berechnen | berechnen | **I** | numerisch | Einsetzen in gelernte Beziehungen. |
| `exercise.standard-weak` | Schwache Säure berechnen | berechnen, überprüfen | berechnen / prüfen | **II** | mehrteilig | Näherungsrechnung mit Überprüfung der Näherung; Schwerpunkt von prüfen. |
| `exercise.standard-pka` | Begründung ausarbeiten | vergleichen, berechnen | bestimmen (Fragesatz) | **II** | mehrteilig | Stärkere Säure bestimmen und Faktor berechnen; Schwerpunkt von bestimmen. |
| `exercise.transfer-polyacid` | Mehrprotonige Säure modellieren | begründen | begründen | **II** | frei | Schwerpunkt von begründen. |
| `exercise.transfer-model` | Transfer und Beleggrenze | beurteilen, erläutern | nennen / erklären | **II** | frei | Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Nennen und Erklären. |
| `selftest.strong` | Stärkere Säure am pKs | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.poh` | pH und pOH | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.approx` | Näherung für schwache Säuren | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Bedingung. |

### chem.q3.2.protolysis

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-role` | Säure und Base markieren | zuordnen | kennzeichnen | **I** | frei | Schwerpunkt von kennzeichnen. |
| `exercise.basic-pairs` | Grundlage selbst erklären | bestimmen | bestimmen | **II** | frei | Schwerpunkt von bestimmen. |
| `exercise.standard-ampholyte` | Ampholyt erklären | formulieren, erläutern | zeigen | **II** | frei | Schwerpunkt von zeigen. |
| `exercise.standard-strength` | Begründung ausarbeiten | erläutern, vergleichen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.transfer-polyprotic` | Mehrstufige Protolyse darstellen | formulieren, darstellen | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.transfer-net` | Transfer und Beleggrenze | überprüfen, begründen | prüfen / begründen | **II** | frei | Schwerpunkt II. |
| `selftest.acid` | Brønsted-Säure | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.pairs` | Korrespondierende Paare | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.ampholyte` | Ampholyt | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |

### chem.q3.2.titration

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-terms` | Titrationsbegriffe zuordnen | zuordnen | angeben (Fragesatz) | **I** | frei | Wiedergabe gelernter Begriffe. |
| `exercise.basic-equivalence` | Grundlage selbst erklären | erläutern | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. ⚠ Metadaten nennen „erläutern“ (AFB II); der Prompt verlangt nur Wiedergabe. |
| `exercise.standard-calc` | Säurekonzentration berechnen | berechnen | berechnen | **I** | numerisch | Routinerechnung im Verhältnis 1 : 1. |
| `exercise.standard-indicator` | Begründung ausarbeiten | begründen | angeben (Fragesatz) | **I** | frei | Wiedergabe des gelernten Auswahlkriteriums. ⚠ Metadaten nennen „begründen“; der Prompt verlangt nur die Angabe des Kriteriums. |
| `exercise.transfer-curve` | Titrationskurve auswerten | auswerten, ableiten | erklären / ableiten | **II** | frei | Schwerpunkt II. |
| `exercise.transfer-uncertainty` | Transfer und Beleggrenze | beurteilen, vorschlagen | nennen | **I** | frei | Schwerpunkt von nennen. ⚠ Metadaten nennen „beurteilen, vorschlagen“; der Prompt verlangt nur Nennen. |
| `selftest.equivalence` | Äquivalenzpunkt | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.indicator` | Umschlagsbereich | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.calculation` | Angaben für die Auswertung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.3.advanced

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `ex.basic-charge` | Ladungsmenge bestimmen | berechnen | berechnen | **I** | numerisch | Einsetzen in Q = I · t. |
| `ex.basic-electrons` | Grundlage selbst erklären | berechnen | berechnen (Fragesatz) | **I** | numerisch | Einsetzen in n = Q / F. |
| `ex.standard-product` | Produktstoffmenge | bestimmen, berechnen | bestimmen | **II** | numerisch | Schwerpunkt von bestimmen. |
| `ex.standard-nernst` | Begründung ausarbeiten | berechnen, deuten | berechnen (Fragesatz) | **II** | numerisch | Anwendung der Nernst-Gleichung mit Logarithmus; obere Grenze von berechnen. |
| `ex.transfer-efficiency` | Stromausbeute berücksichtigen | berechnen, erläutern | berechnen / nennen | **I** | mehrteilig | Einfache Verhältnisrechnung und Nennung einer Ursache. |
| `ex.transfer-scope` | Kupfer-Konzentrationszelle | berechnen, angeben | berechnen / angeben | **II** | mehrteilig | Nernst-Gleichung auf eine Konzentrationszelle anwenden; obere Grenze von berechnen. |
| `st.1` | Ladung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `st.2` | Elektronenbilanz | erläutern | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `st.3` | Konzentration und Potenzial | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer gelernten Beziehung. |

### chem.q3.3.electrolysis-corrosion

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-electrolysis` | Elektrolyse einordnen | erläutern | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |
| `exercise.basic-corrosion` | Grundlage selbst erklären | nennen | nennen | **I** | frei | Wiedergabe. |
| `exercise.standard-lead` | Bleiakkumulator beim Entladen | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.standard-protection` | Begründung ausarbeiten | vergleichen | vergleichen | **II** | frei | Schwerpunkt von vergleichen. |
| `exercise.transfer-electrolysis` | Elektrodenreaktion vorhersagen | formulieren, begründen | formulieren / einordnen | **II** | frei | Schwerpunkt II. |
| `exercise.transfer-battery` | Transfer und Beleggrenze | erläutern, beurteilen | erklären / nennen | **II** | frei | Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Erklärung und Nennung. |
| `selftest.electrolysis` | Antrieb der Elektrolyse | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.battery` | Akku laden | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.sacrificial` | Opferanode | angeben | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q3.3.galvanic-cells

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-electrodes` | Anode und Kathode zuordnen | zuordnen | zuordnen | **I** | frei | Gelernte Definition von Anode und Kathode anwenden; untere Grenze der Spanne. |
| `exercise.basic-flow` | Grundlage selbst erklären | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `exercise.standard-voltage` | Zellspannung berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in die gelernte Formel. |
| `exercise.standard-notation` | Begründung ausarbeiten | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.transfer-spontaneous` | Spontane Reaktion beurteilen | beurteilen, ableiten | ableiten (Fragesatz) | **II** | frei | Folgerung aus dem Vorzeichen ableiten; Schwerpunkt II. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Ableiten. |
| `exercise.transfer-bridge` | Transfer und Beleggrenze | erläutern, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `selftest.anode` | Ort der Oxidation | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.flow` | Elektronenfluss im Daniell-Element | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.voltage` | Zellspannung berechnen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.3.redox

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-numbers` | Oxidationszahlen bestimmen | bestimmen | bestimmen | **II** | frei | Schwerpunkt von bestimmen. |
| `exercise.basic-agent` | Grundlage selbst erklären | zuordnen, begründen | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `exercise.standard-half` | Teilgleichungen kombinieren | formulieren, ausgleichen | aufstellen | **II** | frei | Schwerpunkt von aufstellen. |
| `exercise.standard-acidic` | Begründung ausarbeiten | ausgleichen, überprüfen | ausgleichen | **II** | frei | Mehrschrittiges Ausgleichen über Teilgleichungen. ⚠ ausgleichen steht nicht im Operatorenblatt; AFB wie bei aufstellen. |
| `exercise.transfer-basic` | Medium und Ladung prüfen | beschreiben, überprüfen | angeben (Fragesatz) | **I** | frei | Wiedergabe eines Verfahrensschritts. |
| `exercise.transfer-evidence` | Transfer und Beleggrenze | auswerten, begründen | erklären | **II** | frei | Schwerpunkt von erklären. |
| `selftest.oxidation` | Oxidation | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.agent` | Oxidationsmittel | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |
| `selftest.balance` | Ausgeglichene Redoxgleichung | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.4.buffers

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.basic-pair` | Pufferpaar erkennen | zuordnen, begründen | entscheiden / begründen | **II** | frei | Begründung verlangt; Schwerpunkt II. |
| `exercise.basic-addition` | Grundlage selbst erklären | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.standard-hh` | Puffer-pH berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in die Henderson-Hasselbalch-Gleichung. |
| `exercise.standard-capacity` | Begründung ausarbeiten | vergleichen, begründen | entscheiden (Fragesatz) | **II** | frei | Konzept der Pufferkapazität auf gegebene Daten anwenden; Schwerpunkt II. |
| `exercise.transfer-carbonate` | Hydrogencarbonatpuffer deuten | erläutern, beurteilen | erklären / nennen | **II** | frei | Schwerpunkt von erklären. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt Erklärung und Nennung. |
| `exercise.transfer-scope` | Transfer und Beleggrenze | beurteilen, begründen | entscheiden / begründen | **II** | frei | Schwerpunkt von begründen. ⚠ Metadaten nennen „beurteilen“ (AFB III); der Prompt verlangt eine begründete Entscheidung. |
| `selftest.components` | Bestandteile eines Säurepuffers | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.acid` | Säurezugabe zum Acetatpuffer | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.capacity` | Pufferkapazität | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |

### chem.q3.5.kinetics

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Mittlere Bildungsgeschwindigkeit | berechnen | berechnen | **I** | numerisch | Einsetzen in die Definition. |
| `exercise.2` | Einflussfaktoren | nennen, angeben | nennen / angeben | **I** | frei | Wiedergabe. |
| `exercise.3` | Stöchiometrisch normieren | berechnen | berechnen | **II** | numerisch | Stöchiometrische Normierung erforderlich; obere Grenze von berechnen. |
| `exercise.4` | Temperatur und Stoßtheorie | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Katalysator und Ausbeute | beurteilen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `exercise.6` | Messreihe auswerten | berechnen, deuten | berechnen / deuten | **II** | mehrteilig | Drei Intervalle berechnen und Verlauf deuten; Schwerpunkt von deuten. |
| `selftest.1` | Wirkung des Katalysators | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Momentane Geschwindigkeit | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Katalysator und Gleichgewicht | entscheiden | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |

### chem.q4.1.enthalpy

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Exotherm oder endotherm? | zuordnen, angeben | zuordnen / angeben | **II** | mehrteilig | Beobachtungen deuten und Vorzeichen ableiten; Schwerpunkt von zuordnen. |
| `exercise.2` | Wärmemenge berechnen | berechnen | berechnen | **I** | numerisch | Einsetzen in q = m · c · ΔT. |
| `exercise.3` | Neutralisationsenthalpie bestimmen | berechnen | berechnen | **II** | numerisch | Mehrschrittige Rechnung mit Vorzeichenwechsel; obere Grenze von berechnen. |
| `exercise.4` | Vorzeichenfehler erklären | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Abweichung vom Literaturwert | erklären, vorschlagen | erklären / vorschlagen | **II** | frei | Schwerpunkt von erklären. ⚠ vorschlagen steht nicht im Operatorenblatt. |
| `exercise.6` | Lösungsenthalpie von Ammoniumchlorid | berechnen, deuten | berechnen / deuten | **II** | mehrteilig | Mehrschrittige Rechnung und Deutung des Vorzeichens; Schwerpunkt von deuten. |
| `selftest.1` | Vorzeichen bei exothermen Reaktionen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Kalorimetrie-Formel | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Molare Größe | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

### chem.q4.1.entropy-gibbs

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Vorzeichen von ΔS abschätzen | angeben, begründen | angeben / begründen | **II** | mehrteilig | Drei Vorgänge mit Begründung; Schwerpunkt von begründen. |
| `exercise.2` | ΔG der Ammoniaksynthese | berechnen | berechnen | **I** | numerisch | Einsetzen in die Gibbs-Helmholtz-Gleichung. |
| `exercise.3` | Kalkbrennen | berechnen, begründen | berechnen / begründen | **II** | mehrteilig | Grenztemperatur herleiten und begründen; Schwerpunkt von begründen. |
| `exercise.4` | Endotherm und trotzdem freiwillig | erklären | erklären | **II** | frei | Schwerpunkt von erklären. |
| `exercise.5` | Ammoniaksynthese bei 450 °C | ableiten, erläutern | ableiten / erläutern | **II** | frei | Schwerpunkt II. |
| `exercise.6` | Diamant und Graphit | beurteilen | beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Temperatureinheit | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Bedeutung von ΔG < 0 | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Freiwillig gleich schnell? | entscheiden | entscheiden | **I** | frei | Entscheidung nach gelernter Aussage; untere Grenze der Spanne. |

### chem.q4.1.hess

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Gleichung umkehren und verdoppeln | angeben | angeben | **I** | numerisch | Anwendung zweier gelernter Rechenregeln. |
| `exercise.2` | Teilreaktionen addieren | berechnen | berechnen | **I** | numerisch | Einfache Addition. |
| `exercise.3` | Verbrennungsenthalpie aus Bildungsenthalpien | berechnen | berechnen | **I** | numerisch | Einsetzen in die gegebene Formel. |
| `exercise.4` | Bildungsenthalpie von Kohlenstoffmonooxid | bestimmen | bestimmen | **II** | numerisch | Gleichungen müssen selbst kombiniert werden; Schwerpunkt von bestimmen. |
| `exercise.5` | Hydrierung von Ethen | berechnen, begründen | berechnen / begründen | **II** | mehrteilig | Kreisprozess mit Verbrennungsenthalpien begründen; Schwerpunkt von begründen. |
| `exercise.6` | Warum indirekt messen? | erläutern | erläutern | **II** | frei | Schwerpunkt von erläutern. |
| `selftest.1` | Gleichung umkehren | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Gleichung vervielfachen | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Zustandsgröße | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe einer Definition. |

### chem.q4.2.energy-sustainability

| Aufgabe | Titel | Operatoren (Metadaten) | Maßgeblicher Operator | AFB | Typ | Begründung / Hinweis |
|---|---|---|---|---|---|---|
| `exercise.1` | Wirkungsgrad einer Brennstoffzelle | berechnen | berechnen | **I** | numerisch | Einsetzen in die Formel des Wirkungsgrads. |
| `exercise.2` | Teilreaktionen der Brennstoffzelle | formulieren | formulieren | **II** | frei | Schwerpunkt von formulieren. |
| `exercise.3` | Wirkungsgrad einer Energiekette | berechnen, erläutern | berechnen / erläutern | **II** | mehrteilig | Rechnung und Erläuterung; Schwerpunkt von erläutern. |
| `exercise.4` | Ist Bioethanol CO₂-neutral? | erläutern | erläutern | **II** | frei | Schwerpunkt von erläutern. |
| `exercise.5` | Batterie oder Wasserstoff im Pkw | bewerten | bewerten | **III** | frei | bewerten ist nur AFB III. |
| `exercise.6` | Biodiesel herstellen | formulieren, beurteilen | formulieren / beurteilen | **III** | frei | beurteilen ist nur AFB III. |
| `selftest.1` | Wirkungsgrad | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.2` | Produkt der Brennstoffzelle | angeben | angeben (Fragesatz) | **I** | frei | Wiedergabe. |
| `selftest.3` | Fairer Vergleich | begründen | begründen (Fragesatz „Warum …“) | **II** | frei | Schwerpunkt von begründen. |

