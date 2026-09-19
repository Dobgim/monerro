import { useEffect, useRef, useState } from 'react'

const NOTICE_STYLE = {
  backgroundColor: '#ffffff33',
  borderRadius: '100px',
  boxShadow: 'var(--wp--preset--shadow--small-dark)',
}

// WooCommerce "Featured Products" carousel used inside the mega menus.
export default function ProductCollection({ collection, style }) {
  const listRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const el = listRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }

  useEffect(() => {
    update()
    const ro = new ResizeObserver(update)
    if (listRef.current) ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [])

  const scroll = (dir) => {
    const el = listRef.current
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  if (!collection) return null

  return (
    <div className="wp-block-woocommerce-product-collection is-layout-flow wp-block-woocommerce-product-collection-is-layout-flow" style={style}>
      <ul className={collection.listClassName} ref={listRef} onScroll={update}>
        {collection.products.map((p) => (
          <li key={p.id} className={`wc-block-product post-${p.id} product type-product status-publish has-post-thumbnail`}>
            <div
              className="wc-block-components-product-image wc-block-grid__product-image wc-block-components-product-image--aspect-ratio-auto wp-block-woocommerce-product-image"
              style={{ borderRadius: '8px' }}
            >
              <a href={p.href}>
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  width="680"
                  height="680"
                  loading="lazy"
                  className="attachment-large size-large"
                  style={{ width: '150px', objectFit: 'cover' }}
                />
                <div className="wc-block-components-product-image__inner-container">
                  {p.onSale && (
                    <div className="wp-block-woocommerce-product-sale-badge">
                      <div className="wc-block-components-product-sale-badge alignright wc-block-components-product-sale-badge--align-right">
                        <span className="wc-block-components-product-sale-badge__text" aria-hidden="true">
                          Sale
                        </span>
                        <span className="screen-reader-text">Product on sale</span>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            </div>
            <h2
              className={collection.titleClassName}
              style={{ lineHeight: 1.4, padding: 0, margin: '0 0 0.75rem 0' }}
            >
              <a href={p.href} target="_self">
                {p.name}
              </a>
            </h2>
          </li>
        ))}
      </ul>
      <div className="wc-block-next-previous-buttons is-nowrap is-layout-flex wp-container-woocommerce-product-gallery-large-image-next-previous-is-layout-0070d38d wp-block-woocommerce-product-gallery-large-image-next-previous-is-layout-flex">
        <button
          aria-disabled={atStart}
          aria-label="Previous products"
          className="wc-block-next-previous-buttons__button has-background has-text-color has-accent-2-color"
          style={NOTICE_STYLE}
          onClick={() => !atStart && scroll(-1)}
        >
          <svg className="wc-block-next-previous-buttons__icon wc-block-next-previous-buttons__icon--left" fill="none" height="12" width="8" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M6.445 12.005.986 6 6.445-.005l1.11 1.01L3.014 6l4.54 4.995-1.109 1.01Z" fill="currentColor" fillRule="evenodd" />
          </svg>
        </button>
        <button
          aria-disabled={atEnd}
          aria-label="Next products"
          className="wc-block-next-previous-buttons__button has-background has-text-color has-accent-2-color"
          style={NOTICE_STYLE}
          onClick={() => !atEnd && scroll(1)}
        >
          <svg className="wc-block-next-previous-buttons__icon wc-block-next-previous-buttons__icon--right" fill="none" height="12" width="8" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M1.555-.004 7.014 6l-5.459 6.005-1.11-1.01L4.986 6 .446 1.005l1.109-1.01Z" fill="currentColor" fillRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
