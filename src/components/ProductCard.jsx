import { categoryLabel, money, productName } from '../utils/catalog.js'
import { resolveProductImage } from '../assets/images.js'

export default function ProductCard({ product, index, navigate }) {
  const suffix = String(product.id).replace(/[^a-zA-Z0-9_-]/g, '-')
  const detailPath = `/producto?id=${encodeURIComponent(product.id)}`
  const purchasePath = `/compra?id=${encodeURIComponent(product.id)}`
  const image = resolveProductImage(product.linkImagen)

  return (
    <article className="card" data-index={index}>
      {[1, 2, 3].map((slide) => <input key={slide} type="radio" name={`sneaker-${suffix}`} id={`sneaker-${suffix}-${slide}`} className={`r-${slide}`} defaultChecked={slide === 1} />)}
      <div className="slider" role="group" aria-label={`Imágenes de ${productName(product)}`}>
        {[1, 2, 3].map((slide) => <button key={slide} type="button" className={`slide img-${slide}`} aria-label={`Ver imagen ${slide} de ${productName(product)}`} onClick={() => navigate(detailPath)}><img src={image} alt={productName(product)} loading="lazy" /></button>)}
        <div className="nav nav-left">{[3, 2, 1].map((slide) => <label key={slide} htmlFor={`sneaker-${suffix}-${slide}`} className={`to-${slide}`} aria-label="Imagen anterior">←</label>)}</div>
        <div className="nav nav-right">{[3, 2, 1].map((slide) => <label key={slide} htmlFor={`sneaker-${suffix}-${slide}`} className={`to-${slide}`} aria-label="Imagen siguiente">→</label>)}</div>
      </div>
      <button className="info text-decoration-none" onClick={() => navigate(detailPath)}>
        <span className="code">{categoryLabel(product)}</span>
        <h2>{productName(product)}</h2>
        <p className="price">{money(product.precio)}</p>
      </button>
      <button className="btn-buy mb-2" onClick={() => navigate(purchasePath)}>Agregar al Carrito</button>
      <button className="btn-buy" onClick={() => navigate(detailPath)}>Ver Detalles</button>
    </article>
  )
}
