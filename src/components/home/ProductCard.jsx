import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { productClassName, resolveButton } from '../../store/siteStore'
import { productPath } from '../../lib/links'

function Amount({ value }) {
  return (
    <span className="woocommerce-Price-amount amount">
      <bdi>
        <span className="woocommerce-Price-currencySymbol">$</span>
        {value}
      </bdi>
    </span>
  )
}

function Price({ price }) {
  return (
    <span className="price">
      {price.prefix && `${price.prefix} `}
      {price.type === 'single' && <Amount value={price.amount} />}
      {price.type === 'range' && (
        <>
          <span aria-hidden="true">
            <Amount value={price.min} />
          </span>{' '}
          <span aria-hidden="true">–</span>{' '}
          <span aria-hidden="true">
            <Amount value={price.max} />
          </span>
          <span className="screen-reader-text">
            Price range: ${price.min} through ${price.max}
          </span>
        </>
      )}
      {price.type === 'sale' && (
        <>
          <del aria-hidden="true">
            <Amount value={price.regular} />
          </del>{' '}
          <span className="screen-reader-text">Original price was: ${price.regular}.</span>
          <ins aria-hidden="true">
            <Amount value={price.sale} />
          </ins>
          <span className="screen-reader-text">Current price is: ${price.sale}.</span>
        </>
      )}
      {price.subscribeDiscount && (
        <>
          <small className="wcsatt-sub-options">
            {' '}
            <span className="wcsatt-dash">—</span> Subscribe &amp; Save up to
          </small>{' '}
          <span className="wcsatt-sub-discount">{price.subscribeDiscount}</span>
        </>
      )}
    </span>
  )
}

function StarRating({ rating }) {
  return (
    <div className="star-rating" role="img" aria-label={`Rated ${rating.toFixed(2)} out of 5`}>
      <span style={{ width: `${(rating / 5) * 100}%` }}>
        Rated <strong className="rating">{rating.toFixed(2)}</strong> out of 5
      </span>
    </div>
  )
}

export default function ProductCard({ product, first, last, eager }) {
  const { addToCart } = useCart()
  const [state, setState] = useState('idle') // idle | loading | added
  const button = resolveButton(product)
  const path = productPath(product)

  const onAdd = (e) => {
    if (!button.ajax) return // variable/bundle products link through to the product page
    e.preventDefault()
    setState('loading')
    // brief spinner, as WooCommerce shows while its AJAX request runs
    setTimeout(() => {
      addToCart(product)
      setState('added')
    }, 400)
  }

  const cls = [productClassName(product), first && 'first', last && 'last'].filter(Boolean).join(' ')
  const btnCls = [button.className, state === 'loading' && 'loading', state === 'added' && 'added'].filter(Boolean).join(' ')

  return (
    <li className={cls}>
      <a href={path} className="woocommerce-LoopProduct-link woocommerce-loop-product__link">
        {product.onSale && <span className="onsale">Sale!</span>}
        <img
          src={product.image}
          alt={product.imageAlt}
          width="300"
          height="300"
          loading={eager ? 'eager' : 'lazy'}
          className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
        />
        <h2 className="woocommerce-loop-product__title">{product.name}</h2>
        {product.rating != null && <StarRating rating={Number(product.rating)} />}{' '}
        <Price price={product.price} />
      </a>
      <a
        href={button.ajax ? button.href : path}
        data-quantity="1"
        className={btnCls}
        data-product_id={product.id}
        aria-label={button.ariaLabel}
        rel={button.ajax ? 'nofollow' : undefined}
        role={button.ajax ? 'button' : undefined}
        onClick={onAdd}
      >
        <i className="g-preloader type_1" />
        <span className="w-btn-label">{button.label}</span>
      </a>
    </li>
  )
}
