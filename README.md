# Chemie Lernraum

Statische Lernplattform mit React, TypeScript und Vite für die Vorbereitung auf das hessische Chemie-Landesabitur im Leistungskurs.

Enthalten sind 47 Lernseiten in 12 Kapiteln und ein Übungsbereich mit 425 Aufgaben. Jede Aufgabe ist nach Anforderungsbereich (AFB) und Aufgabentyp eingestuft. Die Lernseiten sind seit 04.11.2026 freigegeben (Status „published“). Originalprüfungen sind nicht Teil des Repositorys oder der Website.

## Lokal starten

```bash
npm install
npm run dev
```

Inhalte prüfen: `npm run validate:content`. Für einen Produktionsbuild: `npm run build`. Die fertigen Dateien liegen anschließend in `dist/`.

## GitHub Pages

Die Site wird unter https://schnecke325.github.io/ veröffentlicht. Der Workflow unter `.github/workflows/deploy.yml` validiert die Inhalte, baut die Anwendung bei Pushes auf `main` und überträgt nur den Inhalt von `dist/` in das separate Repository `Schnecke325/Schnecke325.github.io`. Dafür braucht dieses Repository das Actions-Secret `PAGES_DEPLOY_KEY` (Deploy-Key mit Schreibrecht auf das Zielrepository). Details stehen in `PROJECT_CONTEXT.md`.

## Weitere Dokumentation

- `PROJECT_CONTEXT.md`: technischer Stand, Datenmodell, Deployment
- `PROJECT_VISION_AND_DECISIONS.md`: Ziele und Grundsatzentscheidungen
- `ROADMAP.md`: Projektstand und geplante Schritte
- `WORKFLOW.md`: Arbeitsablauf und Freigaberegeln
- `research/`: Lehrplan-, Prüfungs- und Klassifikationsunterlagen
