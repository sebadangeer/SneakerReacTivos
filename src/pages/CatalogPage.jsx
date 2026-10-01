import ProductCard from '../components/ProductCard.jsx'
import WebglBackground from '../components/WebglBackground.jsx'
import { getImage } from '../assets/images.js'

const gallery = {
  jordan: ['re1.png', 're3.png', 're5.png', 're11.png', 're12.png', 're13.png', 're4.png', 'tra1.png'],
  'nike-urban': ['urban/90.png', 'urban/air.png', 'urban/blazer.png', 'urban/court.png', 'urban/b1.png', 'urban/b2.png', 'urban/b3.png', 'jo.png'],
  'nike-sports': ['nkrun.webp', 'nksports.png', 'imgsp/e1.png', 'imgsp/e2.png', 'imgsp/e3.png', 'imgsp/g1.png', 'imgsp/g2.png', 'imgsp/g3.png'],
}

export default function CatalogPage({ routeCategory, categoryProducts, navigate }) {
  const heading = routeCategory ? `${routeCategory.replaceAll('-', ' ')} Best seller` : 'Productos'
  const images = gallery[routeCategory] || gallery.jordan
  const duplicatedImages = [...images, ...images]

  return (
    <>
      <WebglBackground />
      <section className="titulo-tienda"><h1>SNEAKERS STORE</h1></section>
      <div className="infinite-carousel" aria-label={`Galería de ${heading}`}><div className="carousel-track">{duplicatedImages.map((image, index) => <img key={`${image}-${index}`} src={getImage(image)} alt="Zapatillas de la colección" loading="lazy" />)}</div></div>
      <section className="titulo-tienda mb-4"><h1>{heading}</h1></section>
      <div className="grid-container" id="productos-contenedor">{categoryProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} navigate={navigate} />)}</div>
      {categoryProducts.length === 0 && <p className="cart-status">No se pudieron cargar los productos. Verifica que el servidor esté encendido.</p>}
    </>
  )
}
