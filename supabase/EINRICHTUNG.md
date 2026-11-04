# Einrichtung der Benutzerkonten (Supabase)

Diese Schritte sind einmalig und werden von der Person erledigt, der das Supabase-Projekt gehört. Passwörter, das Datenbankpasswort und der geheime Schlüssel (`sb_secret_…`) gehören nie in dieses Repository, in den Chat oder in den Build.

Solange die GitHub-Variablen aus Schritt 7 fehlen, sind Konten auf der Website ausgeschaltet. Der Anmelden-Knopf erscheint dann nicht.

## 1. Projekt anlegen

1. Auf supabase.com ein Konto und ein neues Projekt anlegen.
2. Als Region **Central EU (Frankfurt)** wählen; die Datenschutzseite nennt Frankfurt als Speicherort.
3. Das Datenbankpasswort an einem sicheren Ort aufbewahren.

Hinweis: Ein Projekt im kostenlosen Tarif pausiert nach einer Woche ohne Nutzung. Im Dashboard lässt es sich wieder starten.

## 2. Anmeldung einstellen

Unter **Authentication → Sign In / Providers**:

- **Allow new users to sign up: aus.** Konten legen ausschließlich Admins über die Benutzerverwaltung an.
- Der Anbieter **Email** bleibt aktiviert. Die Anmeldung mit Benutzername und Zugangscode läuft intern über ihn. Die Adressen enden auf `@chemie-lernraum.invalid`, es werden nie E-Mails verschickt.
- Unter den Passwortanforderungen keine Pflicht für Kleinbuchstaben oder Sonderzeichen setzen. Zugangscodes bestehen aus 16 Großbuchstaben und Ziffern.

## 3. Datenbank einrichten

1. Im Dashboard **SQL Editor** öffnen.
2. Den Inhalt von `supabase/migrations/20261104120000_accounts.sql` einfügen und ausführen.
3. Meldet die Zeile `create extension if not exists pg_cron` einen Fehler: unter **Integrations → Cron** die Erweiterung aktivieren. Danach nur die beiden letzten Anweisungen der Datei erneut ausführen.

Die Datei legt die Tabelle `profiles` mit Zugriffsregeln (Row Level Security) an. Außerdem richtet sie einen täglichen Job ein, der abgelaufene Konten mit allen Daten löscht.

## 4. Löschfunktion prüfen

Im SQL Editor ausführen:

```sql
select public.delete_expired_accounts();
```

Erwartet wird die Zahl `0`. Kommt stattdessen eine Fehlermeldung zu fehlenden Rechten an `auth.users`, muss die automatische Löschung anders umgesetzt werden. In dem Fall bitte melden.

## 5. Edge Function hochladen

Die Funktion `admin-users` legt Konten an, erzeugt neue Zugangscodes und entfernt Konten. Ihren geheimen Schlüssel stellt Supabase ihr selbst bereit.

- **Im Dashboard:** **Edge Functions → Deploy a new function → Via Editor**, Name `admin-users`. Den Inhalt von `supabase/functions/admin-users/index.ts` einfügen und **Deploy** wählen. Die Einstellung „Verify JWT“ eingeschaltet lassen.
- **Alternativ mit der Kommandozeile:**

  ```bash
  npx supabase login
  ```

  ```bash
  npx supabase functions deploy admin-users --project-ref <projekt-ref>
  ```

## 6. Ersten Admin anlegen

Der erste Admin muss von Hand angelegt werden; alle weiteren Konten entstehen danach in der Benutzerverwaltung.

1. **Authentication → Users → Add user → Create new user**:
   - E-Mail: `<benutzername>@chemie-lernraum.invalid`. Der Benutzername darf nur Kleinbuchstaben, Ziffern, Punkt und Bindestrich enthalten, z. B. `rayan.a`.
   - Passwort: ein vorläufiges Passwort, mindestens 6 Zeichen. **Vorher aufschreiben**, nicht nur in die Zwischenablage kopieren.
   - **Auto Confirm User** anhaken.
2. Erst wenn der Benutzer in der Liste steht: im SQL Editor (neue, leere Abfrage) das Profil anlegen. Benutzername und Name dabei ersetzen:

   ```sql
   insert into public.profiles (id, username, display_name, is_admin, can_view_archive)
   select id, 'rayan.a', 'Vorname Nachname', true, true
   from auth.users where email = 'rayan.a@chemie-lernraum.invalid'
   returning username, is_admin;
   ```

   Das Ergebnis muss eine Zeile mit dem Benutzernamen und `true` zeigen. „No rows returned“ heißt, dass es keinen Benutzer mit genau dieser Adresse gibt.

3. Auf der Website mit dem Benutzernamen (ohne `@chemie-lernraum.invalid`) und dem vorläufigen Passwort anmelden.
4. In der Benutzerverwaltung beim eigenen Konto **Neuer Code** wählen. So wird der vorläufige durch einen zufälligen Code ersetzt.

Admin-Konten am besten unbefristet lassen und mindestens zwei Admins anlegen, damit einer dem anderen einen neuen Code erzeugen kann. Ist kein gültiges Admin-Konto mehr vorhanden, lässt sich wieder nur über Schritt 6 ein Admin anlegen.

### Passwort des einzigen Admins vergessen

Im SQL Editor ein neues vorläufiges Passwort setzen. Danach anmelden und sofort „Neuer Code“ wählen, weil das Passwort im SQL-Verlauf steht:

```sql
update auth.users
set encrypted_password = extensions.crypt('NEUES-PASSWORT', extensions.gen_salt('bf'))
where email = 'rayan.a@chemie-lernraum.invalid'
returning email;
```

Löschen und neu anlegen geht beim einzigen Admin nicht: Die Datenbank lässt das letzte gültige Admin-Konto nicht entfernen.

### Konten prüfen

```sql
select u.email, u.email_confirmed_at is not null as bestaetigt, p.username, p.is_admin, p.valid_until
from auth.users u left join public.profiles p on p.id = u.id;
```

## 7. Website verbinden

Im Quellrepository `Schnecke325/chemie-lernplattform` unter **Settings → Secrets and variables → Actions**, Reiter **Variables** (nicht Secrets), zwei Repository-Variablen anlegen. Ins Feld **Value** gehört nur der Wert selbst, also ohne Namen, Pfeil, Anführungszeichen oder Leerzeichen; Teile in spitzen Klammern sind durch die eigenen Angaben zu ersetzen:

| Name | Wert | Fundort in Supabase |
|---|---|---|
| `SUPABASE_URL` | `https://<projekt-ref>.supabase.co` | Project Settings → Data API |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Project Settings → API Keys |

Beide Werte sind öffentlich und landen im Build. Der geheime Schlüssel `sb_secret_…` darf hier **nicht** eingetragen werden. Die Build-Prüfung im Deployment bricht ab, wenn er im Build auftaucht.

Danach unter **Actions → Deploy to Schnecke325.github.io → Run workflow** neu veröffentlichen.

## Aktualisierungen

Neue Funktionen bringen eigene SQL-Dateien mit. Sie werden im SQL Editor (neue, leere Abfrage) einmal vollständig ausgeführt, in der Reihenfolge ihres Datums im Dateinamen.

| Datei | Inhalt |
|---|---|
| `20261104120000_accounts.sql` | Konten und Rechte (Paket K1, Schritt 3 oben) |
| `20261104130000_practice_records.sql` | Aufgabenergebnisse im Konto (Paket K2) |
| `20261104140000_admin_progress.sql` | Lernstand-Übersicht für Admins (Paket K3) |
| `20261104150000_exam_archive.sql` | Privater Speicher für das Abiturarchiv |
| `20261104160000_notes.sql` | Notizen zu Aufgaben (privat oder geteilt) |
| `20261104170000_comments.sql` | Diskussion zu Aufgaben |
| `20261104180000_devices_activity.sql` | Geräte-Limit (3 je Konto, Admins ausgenommen) und Aktivitätsstatus |

Ob K2 eingerichtet ist, zeigt diese Abfrage; sie muss ohne Fehler laufen:

```sql
select count(*) from public.practice_records;
```

Ob K3 eingerichtet ist, zeigt diese Abfrage; im SQL Editor liefert sie keine Zeilen (dort ist kein Admin angemeldet), darf aber keinen Fehler melden:

```sql
select * from public.admin_practice_summary();
```

## Abiturarchiv: PDFs hochladen

1. Die SQL-Datei `20261104150000_exam_archive.sql` ausführen (siehe oben).
2. Im Dashboard unter **Storage** den Bereich **abitur-archiv** öffnen. Er muss als privat gekennzeichnet sein, also nicht als „Public“.
3. Alle **131 Prüfungs-PDFs** aus `local-material/` hineinziehen, direkt in die oberste Ebene und mit **unveränderten Dateinamen**. Die Excel-Datei und das Operatoren-PDF (`la27-operatoren-…pdf`) nicht hochladen.
4. Auf der Website im Abiturarchiv kontrollieren: Admins mit dem Recht „Abiturarchiv“ sehen oben, ob alle 131 PDFs vorhanden sind.

Das Recht „Abiturarchiv“ nur an Konten vergeben, die die Originale sehen dürfen.

### Geräte-Limit prüfen

Das Geräte-Limit liest und löscht Anmeldesitzungen in `auth.sessions`. Diese Abfrage muss im SQL Editor ohne Fehler eine Zahl liefern:

```sql
select count(*) from auth.sessions;
```

Meldet sie fehlende Rechte, bitte die Fehlermeldung weitergeben; dann muss das Limit anders umgesetzt werden.

## Lokale Entwicklung (optional)

Für `npm run dev` mit Konten eine Datei `.env.local` mit denselben beiden Werten anlegen. `*.local` ist von Git ausgeschlossen.

```
VITE_SUPABASE_URL=https://<projekt-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
```
