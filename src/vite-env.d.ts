/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase-Projekt-URL; fehlt sie, sind Konten ausgeschaltet. */
  readonly VITE_SUPABASE_URL?: string
  /** Öffentlicher Publishable Key (sb_publishable_…), niemals ein geheimer Schlüssel. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
