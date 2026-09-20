import { useCart } from '../../context/CartContext'

export default function HeaderCart() {
  const { count, lastAdded } = useCart()

  return (
    <div className={`w-cart ush_cart_1 height_full hide_content${count ? '' : ' empty'}`}>
      <a className="w-cart-link" href="https://cannabuddyhub.com/cart/" aria-label="Cart">
        <span className="w-cart-icon">
          <i className="fas fa-shopping-cart" />
          <span className="w-cart-quantity" style={{ background: '#ef742a', color: '#ffffff' }}>
            {count || ''}
          </span>
        </span>
      </a>
      <div className={`w-cart-notification${lastAdded ? ' shown' : ''}`}>
        <div>
          <span className="product-name">{lastAdded || 'Product'}</span> has been added to your cart.
        </div>
      </div>
      <div className="w-cart-content" style={{ '--btn-size': '0.9rem' }} />
    </div>
  )
}
