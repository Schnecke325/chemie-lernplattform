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
        <li>je bearbeiteter Aufgabe das letzte Ergebnis (richtig, teilweise oder falsch), ob es automatisch geprüft oder selbst eingeschätzt wurde, und der Zeitpunkt. Antworttexte und Handschrift werden nicht gespeichert;</li>
        <li>technische Anmeldedaten wie Sitzungen, Zeitpunkt der letzten Anmeldung und Protokolle der Anmeldeanfragen einschließlich IP-Adresse.</li>
      </ul>
      <p>Admins sehen Name, Benutzername, Rechte und Ablaufdatum aller Konten und können die Aufgabenergebnisse aller Konten einsehen, etwa für eine Übersicht zum Lernstand des Kurses. Deine eigenen Ergebnisse kannst du im Übungsbereich mit „Ergebnisse zurücksetzen“ jederzeit löschen.</p>
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
