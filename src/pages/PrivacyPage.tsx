import './PrivacyPage.css'

/**
 * Datenschutzhinweise. Beschreibt nur, was die Anwendung tatsächlich verarbeitet;
 * bei neuen Speicherfunktionen (z. B. Ergebnisse im Konto) muss dieser Text mitwachsen.
 */
export function PrivacyPage() {
  return <div className="privacy-page">
    <div className="eyebrow"><span className="eyebrow-line"/> RECHTLICHES</div>
    <h1>Datenschutz</h1>
    <p className="privacy-lead">Diese Lernplattform verarbeitet so wenige personenbezogene Daten wie möglich. Hier steht, welche Daten wo anfallen und wie lange sie gespeichert werden.</p>

    <section>
      <h2>Verantwortlich</h2>
      <p>Verantwortlich ist die Person, die diese Lernplattform betreibt und den Zugang für den Kurs vergibt. Bei Fragen zum Datenschutz wende dich direkt an sie oder an einen Admin.</p>
    </section>

    <section>
      <h2>Bereitstellung der Website</h2>
      <p>Die Seiten werden über GitHub Pages (GitHub, Inc.) ausgeliefert. Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie die IP-Adresse, um die Seite auszuliefern und den Dienst abzusichern. Näheres steht in der Datenschutzerklärung von GitHub. Die Plattform selbst bindet keine Analyse-, Werbe- oder Tracking-Dienste und keine externen Schriftarten ein.</p>
    </section>

    <section>
      <h2>Speicherung in deinem Browser</h2>
      <p>Wenn du angemeldet bist, liegen deine Anmeldesitzung und eine Kopie deiner Aufgabenergebnisse im lokalen Speicher deines Browsers. So musst du dich nicht bei jedem Besuch neu anmelden, und die Ergebnisse erscheinen sofort. Beim Abmelden wird beides von diesem Gerät entfernt.</p>
      <p>Ohne Konto gespeicherte Aufgabenergebnisse aus früheren Besuchen bleiben nur auf diesem Gerät, bis du sie nach der Anmeldung in dein Konto übernimmst oder verwirfst.</p>
      <p>Diese Speicherung ist für die von dir genutzten Funktionen unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).</p>
    </section>

    <section>
      <h2>Benutzerkonten</h2>
      <p>Konten werden nicht selbst angelegt, sondern von Admins vergeben. Zu einem Konto werden gespeichert:</p>
      <ul>
        <li>der Name, den der Admin beim Anlegen einträgt, und der daraus gebildete Benutzername;</li>
        <li>der Zugangscode, und zwar nur als Hash-Wert, aus dem er sich nicht zurückgewinnen lässt;</li>
        <li>die Rechte (Admin, Abiturarchiv), das Ablaufdatum und der Zeitpunkt der Erstellung;</li>
        <li>je bearbeiteter Aufgabe das letzte Ergebnis (richtig, teilweise oder falsch), ob es automatisch geprüft oder selbst eingeschätzt wurde, und der Zeitpunkt;</li>
        <li>deine Notizen zu Aufgaben: handschriftliche Antwort, handschriftlicher Rechenweg und getippte Antwort, jeweils mit dem Zeitpunkt der letzten Änderung;</li>
        <li>deine Beiträge in den Diskussionen zu Aufgaben mit Zeitpunkt und gegebenenfalls dem Zeitpunkt der letzten Bearbeitung;</li>
        <li>technische Anmeldedaten wie Sitzungen (je angemeldetem Gerät mit Browser-Kennung), Zeitpunkt der letzten Anmeldung und Protokolle der Anmeldeanfragen einschließlich IP-Adresse;</li>
        <li>der Zeitpunkt deiner letzten Aktivität: Solange die Seite geöffnet ist, meldet sie etwa einmal pro Minute, dass du aktiv bist;</li>
        <li>für jede neue Anmeldung eine Sitzungskennung mit Zeitpunkt, 30 Tage lang, damit Admins häufige Gerätewechsel erkennen können.</li>
      </ul>
      <p>Pro Konto sind höchstens drei Geräte gleichzeitig angemeldet; bei einer weiteren Anmeldung wird das älteste Gerät abgemeldet. Admins sehen, ob ein Konto gerade online ist, wann es zuletzt aktiv war, wie viele Geräte angemeldet sind (mit grober Gerätebeschreibung wie „Chrome auf Windows“) und wie oft es in den letzten sieben Tagen neu angemeldet wurde; IP-Adressen werden ihnen nicht angezeigt. Sie können alle Geräte eines Kontos abmelden.</p>
      <p>Admins sehen Name, Benutzername, Rechte und Ablaufdatum aller Konten und können die Aufgabenergebnisse aller Konten einsehen, etwa für eine Übersicht zum Lernstand des Kurses. Deine eigenen Ergebnisse kannst du im Übungsbereich mit „Ergebnisse zurücksetzen“ jederzeit löschen.</p>
      <p>Notizen sind zunächst privat: Nur du kannst sie lesen, auch Admins nicht. Stellst du eine Notiz auf „Geteilt“, sehen alle Konten deine Handschrift zu dieser Aufgabe zusammen mit deinem Namen; die getippte Antwort bleibt immer privat. Admins können geteilte Notizen entfernen, private nicht. Mit „Alles löschen“ auf der Schreibfläche und einer leeren Antwort löschst du eine Notiz.</p>
      <p>Beiträge in den Diskussionen sehen alle Konten mit deinem Namen. Eigene Beiträge kannst du bearbeiten und löschen; Admins können Beiträge entfernen. Hat ein gelöschter Beitrag Antworten, bleibt an seiner Stelle ein Hinweis ohne Text und ohne Namen stehen. Wird dein Konto gelöscht, werden deine Beiträge entfernt bzw. durch einen solchen Hinweis ersetzt.</p>
      <p>Die Konten werden bei Supabase (Supabase, Inc.) als Dienstleister gespeichert; die Datenbank liegt in einem Rechenzentrum in Frankfurt am Main (EU). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung des vergebenen Zugangs); für Sicherheitsprotokolle Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb).</p>
    </section>

    <section>
      <h2>Speicherdauer und Löschung</h2>
      <p>Ein Konto besteht bis zu seinem Ablaufdatum. Am Tag danach wird es automatisch mit allen zugehörigen Daten gelöscht. Admins können ein Konto jederzeit vorher entfernen. Technische Protokolle bewahrt Supabase nur begrenzte Zeit auf.</p>
    </section>

    <section>
      <h2>Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung sowie auf Widerspruch. Wende dich dafür an die verantwortliche Person oder einen Admin. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, in Hessen beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit.</p>
    </section>
  </div>
}
