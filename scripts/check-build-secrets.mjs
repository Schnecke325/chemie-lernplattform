// Bricht ab, wenn der Build einen geheimen Supabase-Schlüssel enthält.
// Erlaubt ist nur der öffentliche Publishable Key; geheime Schlüssel (sb_secret_…)
// und alte JWT-Schlüssel mit der Rolle service_role dürfen nie in dist/ landen.
import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] ?? 'dist'
const findings = []

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* files(full)
    else yield full
  }
}

for (const file of files(root)) {
  const text = fs.readFileSync(file, 'utf8')
  if (/sb_secret_[A-Za-z0-9_-]+/.test(text)) findings.push(`${file}: geheimer Schlüssel (sb_secret_)`)
  for (const [token] of text.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]+/g)) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
      if (payload.role === 'service_role') findings.push(`${file}: JWT mit Rolle service_role`)
    } catch {
      // kein gültiges JWT
    }
  }
}

if (findings.length > 0) {
  console.error('Geheime Schlüssel im Build gefunden:')
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}
console.log('Keine geheimen Schlüssel im Build.')
