import { useEffect, useRef, useState } from 'react'
import { getImage } from '../assets/images.js'
import { categorySlug } from '../utils/catalog.js'

function DragonScene() {
  const svgRef = useRef(null)

  useEffect(() => {
    const nodes = Array.from(svgRef.current.querySelectorAll('use'))
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const segments = nodes.map((node, index) => ({
      node,
      x: pointer.x,
      y: pointer.y,
      scale: 1 - (index / nodes.length) * 0.7,
      angle: 0,
    }))
    let frameId
    const movePointer = (event) => { pointer.x = event.clientX; pointer.y = event.clientY }
    const animate = () => {
      const head = segments[0]
      head.x += (pointer.x - head.x) * 0.15
      head.y += (pointer.y - head.y) * 0.15
      for (let index = 1; index < segments.length; index += 1) {
        const current = segments[index]
        const previous = segments[index - 1]
        const dx = previous.x - current.x
        const dy = previous.y - current.y
        const distance = Math.hypot(dx, dy)
        const spacing = 8 * current.scale
        if (distance > spacing) {
          current.x = previous.x - (dx / distance) * spacing
          current.y = previous.y - (dy / distance) * spacing
        }
        current.angle = Math.atan2(dy, dx) * (180 / Math.PI)
      }
      if (segments.length > 1) {
        head.angle = Math.atan2(segments[0].y - segments[1].y, segments[0].x - segments[1].x) * (180 / Math.PI)
      }
      segments.forEach((segment) => segment.node.setAttribute('transform', `translate(${segment.x}, ${segment.y}) rotate(${segment.angle}) scale(${segment.scale})`))
      frameId = window.requestAnimationFrame(animate)
    }
    window.addEventListener('pointermove', movePointer)
    frameId = window.requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('pointermove', movePointer)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return <div className="dragon-container" aria-hidden="true">
    <svg ref={svgRef} viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} preserveAspectRatio="none">
      <defs>
        <g id="head" transform="matrix(1, 0, 0, 1, 0, 0)"><path style={{ fill: '#111', stroke: '#FF0033', strokeWidth: '1px' }} d="M-13.4-9.5c0,0-5.8,5.4-5.8,9.5s5.8,9.5,5.8,9.5l8.7-3.1l6.1,3.1c0,0,4.2-6.5,4.2-9.5 s-4.2-9.5-4.2-9.5l-6.1,3.1L-13.4-9.5z" /><circle cx="-11" cy="-4" r="1.5" fill="#FF0033" /><circle cx="-11" cy="4" r="1.5" fill="#FF0033" /></g>
        <g id="aleta"><path style={{ fill: 'url(#linearGradient_1)' }} d="M0,0 c10,-15 30,-20 50,-10 c-15,-5 -35,-2 -50,10 Z" /><path style={{ fill: 'url(#linearGradient_1)' }} d="M0,0 c10,15 30,20 50,10 c-15,5 -35,2 -50,-10 Z" /></g>
        <linearGradient id="linearGradient_1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style={{ stopColor: '#FF0033', stopOpacity: 0.8 }} /><stop offset="1" style={{ stopColor: '#000000', stopOpacity: 0 }} /></linearGradient>
      </defs>
      <g id="scene">{Array.from({ length: 50 }, (_, index) => <use key={index} href={index === 0 ? '#head' : '#aleta'} />)}</g>
    </svg>
  </div>
}

export function HomePage({ navigate }) {
  return (
    <>
      <DragonScene />
      <main className="hero-overlay"><div className="hero-content">
        <h1 className="brand-title">FACTURE SNEAKERS</h1>
        <p className="brand-description">Tu tienda urbana de confianza. Descubre las zapatillas más exclusivas, lanzamientos limitados y el mejor estilo streetwear en un solo lugar.</p>
        <div className="button-group"><a href="/marcas" className="btn btn-red" onClick={(event) => { event.preventDefault(); navigate('/marcas') }}>Ver Productos</a><a href="/acceso" className="btn btn-red-outline" onClick={(event) => { event.preventDefault(); navigate('/acceso') }}>Iniciar Sesión</a></div>
      </div></main>
    </>
  )
}

function categoryName(category) {
  if (typeof category === 'string') return category.trim()
  return String(category?.nombreTipoCategoria || category?.tipoCategoriaNombre || category?.nombre || category?.name || '').trim()
}

function categoryCardAssets(name) {
  const category = name.toLowerCase()
  if (category.includes('jordan')) return { background: 'logo/njor.jpg', logo: 'logo/ljordan.jpg' }
  if (category.includes('sport') || category.includes('run')) return { background: 'logo/ney.jpg', logo: 'logo/descarga.jpg' }
  if (category.includes('urban')) return { background: 'logo/urb.jpg', logo: 'logo/logoFinal.jpg' }
  return { background: 'urban.avif', logo: 'logo/logoFinal.jpg' }
}

export function BrandsPage({ navigate, products }) {
  const [background, setBackground] = useState('')
  const productCategories = [...new Set(products.map((product) => categoryName(product.tipoCategoria || product.tipoCategoriaNombre)).filter(Boolean))]
  const [categories, setCategories] = useState(productCategories)

  useEffect(() => {
    const fallbackCategories = [...new Set(products.map((product) => categoryName(product.tipoCategoria || product.tipoCategoriaNombre)).filter(Boolean))]
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const controller = new AbortController()
    fetch(`${base}/api/tipos-categoria`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudieron cargar las categorías.'); return response.json() })
      .then((result) => {
        const names = Array.isArray(result) ? result.map(categoryName).filter(Boolean) : []
        if (names.length) setCategories([...new Map(names.map((name) => [categorySlug(name), name])).values()])
      })
      .catch((error) => { if (error.name !== 'AbortError') setCategories(fallbackCategories) })
    return () => controller.abort()
  }, [products])

  return (
    <>
      <div className="brands-page-background" style={{ backgroundImage: background ? `url('${background}')` : 'none' }} aria-hidden="true" />
      <section className="container my-5 text-center brands-page position-relative">
      <h2 className="titulo-banner-marcas">Selecciona <span className="text-bulls-red">Cual</span> de <span className="text-bulls-red">Nuestras</span> Marcas <span className="text-bulls-red">Quieres</span> Ver</h2>
      <div className="row g-4">{categories.map((name) => {
        const assets = categoryCardAssets(name)
        return <div className="col-md-4" key={categorySlug(name)}>
        <article className="card brand-card bg-bulls-dark text-white h-100 shadow" data-bg={getImage(assets.background)} onMouseEnter={() => setBackground(getImage(assets.background))} onMouseLeave={() => setBackground('')}>
          <div className="card-body text-center d-flex flex-column justify-content-between"><div><h3 className="card-title fw-bold text-bulls-red mb-3">{name.toUpperCase()}</h3><img src={getImage(assets.logo)} alt={`${name} logo`} className="img-fluid" /></div>
            <button className="btn btn-bulls mt-3" onClick={() => navigate(`/catalogo/${categorySlug(name)}`)}>Ver Colección</button>
          </div>
        </article>
      </div>
      })}</div>
      </section>
    </>
  )
}

export function AboutPage({ navigate }) {
  return <main className="main-wrapper">
    <div className="brand-header"><div className="brand-logo-box"><img src={getImage('logo/lgo.png')} alt="Logo Facture Sneakers" className="brand-logo-img" /></div><h1 className="brand-name">Facture Sneakers</h1></div>
    <section className="custom-card">
      <h2 className="form-title">SOBRE NOSOTROS</h2>
      <p className="about-text">Somos una tienda dedicada a ofrecer las mejores marcas, modelos exclusivos y tendencias urbanas, mundo Sports y mundo del apartado Jordan del mercado. Nuestra pasión por la calidad y el diseño nos mueve a brindar una experiencia única en cada compra.</p>
      <h3 className="subtitle-red">NUESTRA MISIÓN</h3><p className="about-text">Conectar a nuestros clientes con productos auténticos, garantizando un servicio de excelencia, rapidez en las entregas y atención personalizada en todo momento.</p>
      <h3 className="subtitle-red">NUESTRA VISIÓN</h3><p className="about-text">Ser referentes en el sector del calzado, reconocidos por nuestra innovación, variedad de catálogo y compromiso con la comunidad.</p>
      <button className="btn-back" onClick={() => navigate('/marcas')}>← VER PRODUCTOS</button>
    </section>
    <section className="custom-card"><h2 className="form-title">CONOCE A LOS CREADORES</h2><p className="about-text">Página creada por dos personas con la misión de abordar el mundo de las zapatillas más vendidas por categorías.</p><h3 className="subtitle-red">Sebastian Balladares</h3><p className="about-text">Desarrollador Backend</p><h3 className="subtitle-red">Benjamin Vidal</h3><p className="about-text">Desarrollador Front End</p><button className="btn-back" onClick={() => navigate('/marcas')}>← VER PRODUCTOS</button></section>
  </main>
}

export function JournalPage({ navigate }) {
  const [blogs, setBlogs] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const controller = new AbortController()
    fetch(`${base}/api/blogs`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar el contenido.'); return response.json() })
      .then((result) => { setBlogs(Array.isArray(result) ? result : []); setStatus('ready') })
      .catch((error) => { if (error.name !== 'AbortError') setStatus('error') })
    return () => controller.abort()
  }, [])

  return <>
    <header className="editorial-header"><h1>THE SNEAKER EDITORIAL</h1><p>Cultura, lanzamientos y la historia detrás de cada par.</p></header>
    <section className="editorial-container" id="blogs-container">
      {status === 'loading' && <div className="loading-box text-center"><div className="spinner-border text-bulls-red mb-3" role="status" /><h3>Cargando los últimos artículos...</h3></div>}
      {status === 'error' && <div className="error-box"><h3>Error de conexión</h3><p>No pudimos cargar los artículos. Verifica que el servidor esté activo.</p></div>}
      {status === 'ready' && blogs.length === 0 && <div className="empty-state"><h2>No hay artículos publicados</h2><p>El equipo editorial está preparando nuevo contenido.</p></div>}
      {blogs.map((blog) => <article className="news-card" key={blog.id_posteo}>
        <div className="news-image-wrapper"><img src={blog.link_imagen_post || 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'} alt={blog.nombre_post} loading="lazy" /><div className="news-category">LATEST DROP</div></div>
        <div className="news-content"><span className="news-meta">POST #{blog.id_posteo} · 5 MIN READ</span><h2 className="news-title">{blog.nombre_post}</h2><p className="news-excerpt">{blog.descripcion_post}</p><button className="news-btn" onClick={() => navigate(`/blog?id=${encodeURIComponent(blog.id_posteo)}`)}>LEER ARTÍCULO <span className="arrow">→</span></button></div>
      </article>)}
    </section>
  </>
}

export function BlogDetailPage({ blogId, navigate }) {
  const [blog, setBlog] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!blogId) { setStatus('missing'); return undefined }
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const controller = new AbortController()
    fetch(`${base}/api/blogs`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar el artículo.'); return response.json() })
      .then((items) => {
        const selected = items.find((item) => String(item.id_posteo) === String(blogId))
        setBlog(selected || null)
        setStatus(selected ? 'ready' : 'missing')
      })
      .catch((error) => { if (error.name !== 'AbortError') setStatus('error') })
    return () => controller.abort()
  }, [blogId])

  return <main className="blog-detail-page"><section className="blog-detail-card">
    {status === 'loading' && <div className="loading-box text-center"><div className="spinner-border text-bulls-red mb-3" role="status" /><h3>Cargando artículo...</h3></div>}
    {status === 'missing' && <div className="error-box"><h3>Artículo no encontrado</h3><p>El contenido solicitado no está disponible en este momento.</p></div>}
    {status === 'error' && <div className="error-box"><h3>Error al cargar el artículo</h3><p>Verifica que el backend de blogs esté activo y vuelve a intentarlo.</p></div>}
    {status === 'ready' && blog && <article className="blog-detail-article"><button className="blog-back-link" onClick={() => navigate('/blogs')}>← Volver a blogs</button><div className="blog-detail-hero"><img src={blog.link_imagen_post || 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80'} alt={blog.nombre_post} /></div><div className="blog-detail-body-copy"><span className="news-meta">POST #{blog.id_posteo} · 5 MIN READ</span><h1 className="blog-detail-title">{blog.nombre_post}</h1><p className="blog-detail-summary">{blog.descripcion_post}</p><div className="blog-detail-content">{String(blog.contenido_post || blog.descripcion_post || 'Contenido no disponible para este artículo.').split('\n').map((paragraph, index) => <p key={index}>{paragraph || '\u00a0'}</p>)}</div></div></article>}
  </section></main>
}
