import { useState } from 'react'
import { getImage } from '../assets/images.js'

export function Notice({ notice, onDismiss }) {
  if (!notice) return null
  return <div className={`legacy-notice legacy-notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
    <span>{notice.text}</span><button aria-label="Cerrar aviso" onClick={onDismiss}>×</button>
  </div>
}

export function SiteHeader({ session, cartCount, navigate, logout, path = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const isAdmin = path.startsWith('/admin')
  const activePath = path.startsWith('/catalogo') || path === '/marcas' || path === '/producto' ? '/marcas'
    : path.startsWith('/blogs') || path === '/blog' ? '/blogs'
    : ['/acceso', '/login', '/registro'].includes(path) ? '/acceso'
    : path === '/carrito' ? '/carrito'
    : path === '/nosotros' ? '/nosotros'
    : path === '/contacto' ? '/contacto'
    : '/'
  const link = (destination, label) => <a href={destination} className={activePath === destination ? 'active' : ''} aria-current={activePath === destination ? 'page' : undefined} onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigate(destination) }}>{label}</a>

  return (
    <nav id="site-navbar" className="site-navbar">
      <div className="site-navbar-inner">
        <a className="site-navbar-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}><img src={getImage('logo/logoFinal.jpg')} alt="Facture Sneakers" /></a>
        <button className="site-navbar-toggle" type="button" aria-controls="site-navbar-menu" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <div id="site-navbar-menu" className={`site-navbar-menu ${menuOpen ? 'is-open' : ''}`}>
          {isAdmin ? <>
            {String(session?.rol || session?.role || '').toUpperCase() === 'ADMIN' && link('/admin/usuarios', 'Gestionar clientes')}
            {String(session?.rol || session?.role || '').toUpperCase() === 'ADMIN' && link('/admin/categorias', 'Gestionar categorías')}
            {link('/admin/productos', 'Gestionar productos')}
            <a href="/" onClick={(event) => { event.preventDefault(); logout() }}>Cerrar sesión</a>
          </> : <>
            {link('/', 'Inicio')}
            {link('/marcas', 'Productos')}
            {link('/nosotros', 'Nosotros')}
            {link('/blogs', 'Blogs')}
            {link('/contacto', 'Contacto')}
            {!session ? link('/acceso', 'Iniciar Sesión') : <div className={`site-navbar-account ${accountOpen ? 'is-open' : ''}`}>
              <button type="button" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>Mi Cuenta</button>
              <div className="site-navbar-account-menu"><a href="/admin" onClick={(event) => { event.preventDefault(); navigate('/admin') }}>Administración</a><a href="/" onClick={(event) => { event.preventDefault(); logout() }}>Cerrar Sesión</a></div>
            </div>}
            <a className="site-navbar-cart" href="/carrito" onClick={(event) => { event.preventDefault(); navigate('/carrito') }}>Carrito (<span>{cartCount}</span>)</a>
          </>}
        </div>
      </div>
    </nav>
  )
}

export function SiteFooter({ navigate }) {
  const go = (destination) => (event) => { event.preventDefault(); navigate(destination) }
  return (
    <footer className="footer-sneakers">
      <div className="footer-container">
        <div className="footer-col"><h3 className="footer-brand">FACTURE <span>SNEAKERS</span></h3><p className="footer-text">La tienda definitiva de cultura urbana, ediciones limitadas y el mejor estilo streetwear.</p><div className="social-links"><a href="#instagram" aria-label="Instagram">IG</a><a href="#tiktok" aria-label="TikTok">TK</a><a href="#x" aria-label="X (Twitter)">X</a><a href="#youtube" aria-label="YouTube">YT</a></div></div>
        <div className="footer-col"><h4 className="footer-title">NAVEGACIÓN</h4><ul className="footer-links"><li><a href="/" onClick={go('/')}>Inicio</a></li><li><a href="/marcas" onClick={go('/marcas')}>Marcas</a></li><li><a href="/blogs" onClick={go('/blogs')}>Blogs</a></li></ul></div>
        <div className="footer-col"><h4 className="footer-title">AYUDA</h4><ul className="footer-links"><li><a href="/contacto" onClick={go('/contacto')}>Contacto</a></li><li><a href="/nosotros" onClick={go('/nosotros')}>Nosotros</a></li></ul></div>
        <div className="footer-col"><h4 className="footer-title">ÚNETE AL CLUB</h4><p className="footer-text">Recibe alertas de drops exclusivos y descuentos.</p><form className="footer-newsletter" onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico" required /><button type="submit" aria-label="Suscribirse">→</button></form></div>
      </div>
      <div className="footer-bottom"><p>© 2026 FACTURE SNEAKERS. TODOS LOS DERECHOS RESERVADOS.</p></div>
    </footer>
  )
}
