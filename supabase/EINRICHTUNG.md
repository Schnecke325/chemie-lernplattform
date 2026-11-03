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
   - Passwort: ein vorläufiger Code aus 16 Zeichen, nur Großbuchstaben A–Z und Ziffern 2–9.
   - **Auto Confirm User** anhaken.
2. Im SQL Editor das Profil anlegen. Benutzername und Name dabei ersetzen:

   ```sql
   insert into public.profiles (id, username, display_name, is_admin, can_view_archive)
   select id, 'rayan.a', 'Vorname Nachname', true, true
   from auth.users where email = 'rayan.a@chemie-lernraum.invalid';
   ```

3. Auf der Website mit Benutzername und vorläufigem Code anmelden.
4. In der Benutzerverwaltung beim eigenen Konto **Neuer Code** wählen. So wird der vorläufige durch einen zufälligen Code ersetzt.

Admin-Konten am besten unbefristet lassen. Ist kein gültiges Admin-Konto mehr vorhanden, lässt sich wieder nur über Schritt 6 ein Admin anlegen.

## 7. Website verbinden

Im Quellrepository `Schnecke325/chemie-lernplattform` unter **Settings → Secrets and variables → Actions**, Reiter **Variables** (nicht Secrets), zwei Repository-Variablen anlegen:

| Name | Wert | Fundort in Supabase |
|---|---|---|
| `SUPABASE_URL` | `https://<projekt-ref>.supabase.co` | Project Settings → Data API |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Project Settings → API Keys |

Beide Werte sind öffentlich und landen im Build. Der geheime Schlüssel `sb_secret_…` darf hier **nicht** eingetragen werden. Die Build-Prüfung im Deployment bricht ab, wenn er im Build auftaucht.

Danach unter **Actions → Deploy to Schnecke325.github.io → Run workflow** neu veröffentlichen.

## Lokale Entwicklung (optional)

Für `npm run dev` mit Konten eine Datei `.env.local` mit denselben beiden Werten anlegen. `*.local` ist von Git ausgeschlossen.

```
VITE_SUPABASE_URL=https://<projekt-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
```
