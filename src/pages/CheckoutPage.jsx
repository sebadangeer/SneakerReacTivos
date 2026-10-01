import { money } from '../utils/catalog.js'

export default function CheckoutPage({ cart, session, submitCheckout, busy }) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  return (
    <section className="page-shell checkout-page">
      <p className="eyebrow">ÚLTIMO PASO</p>
      <h1>Confirma tu compra.</h1>
      {cart.length ? <form className="checkout-form" onSubmit={submitCheckout}>
        <label>Dirección de envío<input name="address" required defaultValue={[session?.direccion, session?.comuna, session?.region].filter(Boolean).join(', ')} placeholder="Calle, comuna, región" /></label>
        <div className="summary-row summary-total"><strong>Total</strong><strong>{money(total)}</strong></div>
        <button className="button button-red" disabled={busy}>{busy ? 'Procesando…' : 'Confirmar pedido'} ↗</button>
        <p className="summary-note">El método de pago queda pendiente de integración con una pasarela.</p>
      </form> : <p>Tu carrito está vacío.</p>}
    </section>
  )
}
