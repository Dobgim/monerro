import './styles/original.css'
import './styles/app.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

export default function Storefront() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  )
}
