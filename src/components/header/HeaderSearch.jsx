import { useEffect, useRef, useState } from 'react'

// Impreza "modern" header search: the icon expands into an inline field.
export default function HeaderSearch() {
  const [active, setActive] = useState(false)
  const input = useRef(null)

  useEffect(() => {
    if (!active) return
    input.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setActive(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <div className={`w-search ush_search_1 elm_in_header us-field-style_1 layout_modern iconpos_right${active ? ' active' : ''}`}>
      <a
        className="w-search-open"
        role="button"
        aria-label="Search"
        aria-expanded={active}
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setActive(true)
        }}
      >
        <i className="fas fa-search" />
      </a>
      <div className="w-search-form">
        <form className="w-form-row for_text" role="search" action="https://cannabuddy.com/" method="get">
          <div className="w-form-row-field">
            <input ref={input} type="text" name="s" placeholder="Search" aria-label="Search" onBlur={(e) => !e.target.value && setActive(false)} />
          </div>
          <button aria-label="Close Search" className="w-search-close" type="button" onClick={() => setActive(false)} />
        </form>
      </div>
    </div>
  )
}
