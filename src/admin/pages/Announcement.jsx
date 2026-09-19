import { useState } from 'react'
import { setState, useSiteState } from '../../store/siteStore'
import { Button, Card, PageHeader, TextArea, TextInput, Toggle, useSave } from '../components/ui'

export default function Announcement() {
  const current = useSiteState((s) => s.announcement)
  const save = useSave()
  const [draft, setDraft] = useState(current)
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const dirty = JSON.stringify(draft) !== JSON.stringify(current)

  return (
    <>
      <PageHeader title="Announcement bar" description="The promo strip at the very top of every page." />
      <Card title="Preview" padded={false}>
        <div className="adm-announce-preview">
          {draft.enabled && draft.text ? <span>{draft.text}</span> : <em>The bar is hidden</em>}
        </div>
      </Card>
      <Card title="Content">
        <Toggle checked={draft.enabled} onChange={(enabled) => set({ enabled })} label="Show the announcement bar" />
        <TextArea label="Message" rows={3} value={draft.text} onChange={(e) => set({ text: e.target.value })} hint="Emoji work too, e.g. 💙" />
        <TextInput label="Link" type="url" value={draft.href} onChange={(e) => set({ href: e.target.value })} hint="Where the message links to." />
        <div className="adm-formactions">
          <Button onClick={() => setDraft(current)} disabled={!dirty}>
            Discard changes
          </Button>
          <Button variant="primary" icon="check" disabled={!dirty} onClick={() => save(setState((s) => ({ ...s, announcement: draft })), 'Announcement updated')}>
            Save
          </Button>
        </div>
      </Card>
    </>
  )
}
