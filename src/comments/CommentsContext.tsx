import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface CommentsValue {
  enabled: boolean
  /** Anzahl sichtbarer Beiträge je Aufgabe */
  counts: Map<string, number>
  refreshCounts: () => void
}

const CommentsContext = createContext<CommentsValue | null>(null)

/** Zähler der Diskussionen; ohne Konto (userId null) gibt es keine Diskussion. */
export function CommentsProvider({ userId, children }: { userId: string | null; children: ReactNode }) {
  const [counts, setCounts] = useState<Map<string, number>>(new Map())
  const refreshCounts = useCallback(() => {
    if (!userId) return
    import('./remote').then((remote) => remote.fetchCommentCounts()).then(setCounts).catch(() => undefined)
  }, [userId])
  useEffect(() => { refreshCounts() }, [refreshCounts])
  const value = useMemo(() => ({ enabled: Boolean(userId), counts, refreshCounts }), [userId, counts, refreshCounts])
  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
}

export function useComments(): CommentsValue {
  const value = useContext(CommentsContext)
  if (!value) throw new Error('useComments außerhalb von CommentsProvider')
  return value
}
