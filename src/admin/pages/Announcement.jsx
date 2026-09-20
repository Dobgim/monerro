import { useState } from 'react'
import { setState, useSiteState } from '../../store/siteStore'
import { Button, FormRow, FormTable, PageHeader, useSave } from '../components/ui'

export default function Announcement() {
  const current = useSiteState((s) => s.announcement)
  const save = useSave()
  const [draft, setDraft] = useState(current)
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const dirty = JSON.stringify(draft) !== JSON.stringify(current)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save(setState((s) => ({ ...s, announcement: draft })), 'Announcement saved.')
      }}
    >
      <PageHeader title="Announcement" description="The thin strip at the very top of every page — good for offers and discount codes." />

      <div className="cb-announce-preview">{draft.enabled && draft.text ? <span>{draft.text}</span> : <em>The strip is hidden</em>}</div>

      <FormTable>
        <FormRow label="Show the strip">
          <label className="checkbox-label">
            <input type="checkbox" checked={draft.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
            Show the announcement at the top of the site
          </label>
        </FormRow>
        <FormRow label="Message" description="Emoji work too, for example 💙">
          <textarea rows={3} className="large-text" value={draft.text} onChange={(e) => set({ text: e.target.value })} />
        </FormRow>
        <FormRow label="Link" description="Where shoppers go when they click the message.">
          <input type="url" className="large-text" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
        </FormRow>
      </FormTable>

      <p className="submit">
        <Button variant="primary" type="submit" disabled={!dirty}>
          Save Changes
        </Button>
        <Button onClick={() => setDraft(current)} disabled={!dirty}>
          Discard
        </Button>
      </p>
    </form>
  )
}
