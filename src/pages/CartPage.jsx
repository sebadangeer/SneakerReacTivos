import { money } from '../utils/catalog.js'
import { resolveProductImage } from '../assets/images.js'

export default function CartPage({ cart, session, navigate, updateCart, removeCartItem, clearCart, submitOrder, busy }) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const address = [session?.direccion, session?.region, session?.comuna].filter(Boolean).join(', ') || 'Por confirmar'

  if (!session?.id) return <main className="cart-page"><p className="cart-status">Debes iniciar sesión para ver tu carrito.</p><button className="pay-cart" onClick={() => navigate('/login')}>Iniciar sesión</button></main>

  return (
    <main className="cart-page">
      <header className="cart-header"><div><p className="eyebrow">SNEAKERS STORE</p><h1>Tu carrito</h1></div><button className="continue-shopping" onClick={() => navigate('/marcas')}>Seguir comprando</button></header>
      <section id="cart-content" aria-live="polite">
        {cart.length === 0 ? <p className="empty-message">Tu carrito está vacío.</p> : <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, index) => <article className="cart-item" key={`${item.productoId}-${item.talla}`}>
              <img className="cart-item-image" src={resolveProductImage(item.imagen)} alt={item.nombre} />
              <div className="cart-item-info"><h2>{item.nombre}</h2><p>Talla: {item.talla}</p><p className="cart-item-price">Precio unitario: {money(item.precio)}</p><div className="quantity-control"><button type="button" aria-label="Disminuir cantidad" onClick={() => updateCart(index, item.cantidad - 1)}>−</button><span className="quantity-value">{item.cantidad}</span><button type="button" aria-label="Aumentar cantidad" onClick={() => updateCart(index, item.cantidad + 1)}>+</button></div></div>
              <div className="cart-item-total"><strong>{money(item.precio * item.cantidad)}</strong><button type="button" className="remove-item" onClick={() => removeCartItem(index)}>Eliminar</button></div>
            </article>)}
          </div>
          <aside className="cart-summary"><h2>Resumen</h2><div className="summary-row"><span>Dirección de envío</span><strong className="summary-address">{address}</strong></div><div className="summary-row"><span>Total general</span><strong className="summary-total">{money(total)}</strong></div><button type="button" className="pay-cart" disabled={busy} onClick={submitOrder}>{busy ? 'Procesando...' : 'Pagar y enviar boleta'}</button><button type="button" className="empty-cart" onClick={clearCart}>Vaciar carrito</button></aside>
        </div>}
      </section>
    </main>
  )
}
