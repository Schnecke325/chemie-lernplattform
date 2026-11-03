import { useState, type FormEvent } from 'react'
import { useAdminProfile } from '../account/AccountContext'
import { useComments } from '../comments/CommentsContext'
import type { Comment } from '../comments/remote'

const maxLength = 2000
const placeholders: Record<Exclude<Comment['state'], 'visible'>, string> = {
  deleted: 'Beitrag gelöscht',
  removed: 'Von einem Admin entfernt',
  'account-deleted': 'Beitrag eines gelöschten Kontos',
}
const dateTime = (iso: string) => new Date(iso).toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const loadRemote = () => import('../comments/remote')

/** Diskussion zu einer Aufgabe: Beiträge mit einer Antwortebene; erst beim Aufklappen geladen. */
export function Discussion({ exerciseId }: { exerciseId: string }) {
  const { enabled, counts, refreshCounts } = useComments()
  const admin = useAdminProfile()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  if (!enabled) return null
  const count = counts.get(exerciseId) ?? 0

  const load = async () => {
    try {
      setComments(await (await loadRemote()).fetchComments(exerciseId))
    } catch {
      setError('Die Diskussion konnte nicht geladen werden.')
    }
  }

  /** Führt eine Änderung aus und lädt danach Beiträge und Zähler neu. */
  const run = async (action: () => Promise<void>, failure: string) => {
    setError(null)
    try {
      await action()
      await load()
      refreshCounts()
      return true
    } catch {
      setError(failure)
      return false
    }
  }

  const add = (parentId: string | null, body: string) => run(async () => (await loadRemote()).addComment(exerciseId, parentId, body), 'Der Beitrag konnte nicht gespeichert werden.')
  const edit = (id: string, body: string) => run(async () => (await loadRemote()).editComment(id, body), 'Die Änderung konnte nicht gespeichert werden.')
  const remove = (comment: Comment) => {
    const question = comment.isOwn ? 'Deinen Beitrag löschen?' : `Beitrag von ${comment.author} als Admin entfernen?`
    if (!window.confirm(question)) return
    void run(async () => (await loadRemote()).deleteComment(comment.id), 'Der Beitrag konnte nicht gelöscht werden.')
  }

  const toggle = () => {
    setOpen(!open)
    if (!open) void load()
  }

  const topLevel = comments?.filter((comment) => !comment.parentId) ?? []
  const repliesOf = (id: string) => comments?.filter((comment) => comment.parentId === id) ?? []

  const renderComment = (comment: Comment, isReply: boolean) => <article key={comment.id} className={`discussion-comment${isReply ? ' is-reply' : ''}`}>
    {comment.state !== 'visible'
      ? <p className="discussion-placeholder">{placeholders[comment.state]}</p>
      : editing === comment.id
        ? <CommentForm initial={comment.body ?? ''} submitLabel="Speichern" onCancel={() => setEditing(null)}
          onSubmit={async (body) => { if (await edit(comment.id, body)) setEditing(null) }}/>
        : <>
          <header>
            <strong>{comment.author}</strong>
            <span>{dateTime(comment.createdAt)}{comment.editedAt && ' · bearbeitet'}</span>
          </header>
          <p className="discussion-body">{comment.body}</p>
          <div className="discussion-actions">
            {!isReply && <button type="button" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>Antworten</button>}
            {comment.isOwn && <button type="button" onClick={() => setEditing(comment.id)}>Bearbeiten</button>}
            {comment.isOwn && <button type="button" onClick={() => remove(comment)}>Löschen</button>}
            {!comment.isOwn && admin && <button type="button" className="is-danger" onClick={() => remove(comment)}>Entfernen</button>}
          </div>
        </>}
  </article>

  return <section className="discussion">
    <button type="button" className="shared-notes-toggle" aria-expanded={open} onClick={toggle}>
      {open ? 'Diskussion ausblenden' : count > 0 ? `Diskussion (${count})` : 'Diskussion starten'}
    </button>
    {open && <div className="discussion-panel">
      {error && <p className="practice-sync-note is-error" role="alert">{error}</p>}
      {!comments && !error && <p className="practice-sync-note">Diskussion wird geladen …</p>}
      {comments?.length === 0 && <p className="practice-sync-note">Noch keine Beiträge. Stell eine Frage oder gib einen Hinweis zu dieser Aufgabe.</p>}
      {topLevel.map((comment) => <div key={comment.id} className="discussion-thread">
        {renderComment(comment, false)}
        {repliesOf(comment.id).map((reply) => renderComment(reply, true))}
        {replyTo === comment.id && <div className="discussion-reply-form">
          <CommentForm submitLabel="Antwort senden" placeholder="Antwort schreiben …" onCancel={() => setReplyTo(null)}
            onSubmit={async (body) => { if (await add(comment.id, body)) setReplyTo(null) }}/>
        </div>}
      </div>)}
      {comments && <CommentForm submitLabel="Beitrag senden" placeholder="Frage oder Hinweis schreiben …" onSubmit={async (body) => { await add(null, body) }}/>}
      <p className="discussion-note">Beiträge sehen alle angemeldeten Konten mit deinem Namen.</p>
    </div>}
  </section>
}

function CommentForm({ initial = '', submitLabel, placeholder, onSubmit, onCancel }: {
  initial?: string
  submitLabel: string
  placeholder?: string
  onSubmit: (body: string) => Promise<void>
  onCancel?: () => void
}) {
  const [body, setBody] = useState(initial)
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!body.trim()) return
    setBusy(true)
    await onSubmit(body.trim())
    setBusy(false)
    if (!initial) setBody('')
  }
  return <form className="discussion-form" onSubmit={submit}>
    <textarea rows={3} value={body} maxLength={maxLength} placeholder={placeholder} onChange={(event) => setBody(event.target.value)}/>
    <div className="discussion-form-actions">
      <span>{body.length} / {maxLength}</span>
      {onCancel && <button type="button" onClick={onCancel}>Abbrechen</button>}
      <button type="submit" className="is-primary" disabled={busy || !body.trim()}>{busy ? 'Wird gesendet …' : submitLabel}</button>
    </div>
  </form>
}
