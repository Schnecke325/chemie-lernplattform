# Chemie Lernraum

React-, TypeScript- und Vite-Grundgerüst für die Vorbereitung auf das hessische Chemie-Landesabitur.

## Lokal starten

```bash
npm install
npm run dev
```

Für einen Produktionsbuild: `npm run build`. Die fertigen Dateien liegen anschließend in `dist/`.

## GitHub Pages

Die Site wird unter https://schnecke325.github.io/ veröffentlicht. Der Workflow unter `.github/workflows/deploy.yml` validiert die Inhalte, baut die Anwendung bei Pushes auf `main` und überträgt nur den Inhalt von `dist/` in das separate Repository `Schnecke325/Schnecke325.github.io`. Dafür braucht dieses Repository das Actions-Secret `PAGES_DEPLOY_KEY` (Deploy-Key mit Schreibrecht auf das Zielrepository). Details stehen in `PROJECT_CONTEXT.md`.

Alle derzeit sichtbaren Lern- und Prüfungsdaten sind ausdrücklich Platzhalter und keine fachlich geprüften Inhalte.
