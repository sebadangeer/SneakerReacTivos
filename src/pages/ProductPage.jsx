import { money, productName } from '../utils/catalog.js'
import { resolveProductImage } from '../assets/images.js'

export default function ProductPage({ product, navigate }) {
  if (!product) {
    return (
      <section className="product-hero">
        <div className="product-info"><h1 className="brand-name">Facture</h1><h2 className="product-title">Producto no disponible</h2><p className="description">Regresa a la colección para elegir otro par.</p><button className="btn-back" onClick={() => navigate('/marcas')}>Volver atrás</button></div>
      </section>
    )
  }

  return (
    <main className="product-hero">
      <div className="product-info">
        <h1 className="brand-name">{product.tipoCategoria || 'Sneakers'}</h1>
        <h2 className="product-title">{productName(product)}</h2>
        <p className="description">{product.descripcion || 'Diseño, comodidad y cultura en cada paso.'}</p>
        <div className="purchase-area"><span className="price">{money(product.precio)}</span><button className="btn-buy" onClick={() => navigate(`/compra?id=${encodeURIComponent(product.id)}`)}>Comprar Ahora</button><button className="btn-back" onClick={() => navigate('/marcas')}>volver atras</button></div>
      </div>
      <div className="product-display">
        <svg className="abstract-lines" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: '#FF3333', stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: '#ff9900', stopOpacity: 0 }} /></linearGradient></defs>
          <path d="M50,250 C150,50 350,50 450,250 C350,450 150,450 50,250 Z" stroke="url(#grad1)" strokeWidth="2" fill="none" /><path d="M70,250 C160,80 340,80 430,250 C340,420 160,420 70,250 Z" stroke="url(#grad1)" strokeWidth="1.5" fill="none" /><path d="M90,250 C170,110 330,110 410,250 C330,390 170,390 90,250 Z" stroke="url(#grad1)" strokeWidth="1.2" fill="none" opacity="0.8" /><path d="M110,250 C180,140 320,140 390,250 C320,360 180,360 110,250 Z" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0.6" /><path d="M130,250 C190,170 310,170 370,250 C310,330 190,330 130,250 Z" stroke="url(#grad1)" strokeWidth="0.8" fill="none" opacity="0.4" />
        </svg>
        <img src={resolveProductImage(product.linkImagen)} alt={productName(product)} className="main-shoe-img" />
      </div>
    </main>
  )
}
