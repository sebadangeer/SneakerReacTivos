import { useState } from 'react'
import { productName } from '../utils/catalog.js'

export default function PurchasePage({ product, addToCart, navigate }) {
  const sizes = Object.entries(product?.tallasDisponibles || {})
    .filter(([, stock]) => Number(stock) > 0)
    .sort(([first], [second]) => Number(first) - Number(second))
  const [selectedSize, setSelectedSize] = useState(() => sizes[0]?.[0] || '')
  const [quantity, setQuantity] = useState(1)

  function submit(event) {
    event.preventDefault()
    if (!product || !selectedSize) return
    addToCart(product, selectedSize, quantity)
  }

  if (!product) return <section className="checkout-container"><h2>Producto no seleccionado</h2><button className="btn-back" onClick={() => navigate('/marcas')}>Volver atrás</button></section>

  return (
    <section className="checkout-container">
      <h2>FINALIZAR PEDIDO</h2>
      <form className="order-form" onSubmit={submit}>
        <div className="form-group">
          <label className="section-title">SELECCIONA TU TALLA:</label>
          <div className="size-picker" aria-live="polite">
            {sizes.length ? sizes.map(([size, stock]) => <span key={size}>
              <input type="radio" name="size" id={`purchase-size-${size}`} value={size} checked={selectedSize === size} onChange={() => { setSelectedSize(size); setQuantity(1) }} />
              <label htmlFor={`purchase-size-${size}`}>{size} ({stock} disponibles)</label>
            </span>) : <p>No hay tallas disponibles para este producto.</p>}
          </div>
        </div>
        <div className="form-group"><label htmlFor="purchase-quantity">CANTIDAD:</label><input type="number" id="purchase-quantity" min="1" max={product.tallasDisponibles?.[selectedSize]} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required /></div>
        <p className="purchase-product-name">{productName(product)}</p>
        <button type="submit" className="btn-buy" disabled={!selectedSize}>AGREGAR AL CARRITO</button>
      </form>
      <div className="text-center mt-3"><button onClick={() => navigate('/marcas')} className="btn-back">← Volver atrás</button></div>
    </section>
  )
}
