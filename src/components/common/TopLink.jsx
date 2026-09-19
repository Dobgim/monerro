import { useEffect, useState } from 'react'

// Floating "back to top" button, revealed once the page is scrolled
export default function TopLink() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      className={`w-toplink pos_left text_none icon_atleft${visible ? ' visible' : ''}`}
      href="#page-top"
      title="Back to top"
      aria-label="Back to top"
      role="button"
      tabIndex={visible ? 0 : -1}
      onClick={(e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <i className="far fa-angle-up" />
    </a>
  )
}
