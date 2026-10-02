import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/core.css'
import './css/pages/home.css'
import './css/pages/product.css'
import './css/pages/cart.css'
import './css/pages/login.css'
import './css/pages/access.css'
import './css/pages/register.css'
import './css/pages/payment.css'
import './css/pages/blog.css'
import './css/pages/about.css'
import './css/pages/contact.css'
import './css/pages/admin.css'
import './css/pages/admin-react.css'
import './css/pages/site-react.css'
import { getImage } from './assets/images.js'
import { Notice, SiteFooter, SiteHeader } from './components/SiteChrome.jsx'
import { categoryLabel, categorySlug, productName, stockFor } from './utils/catalog.js'
import { AboutPage, BlogDetailPage, BrandsPage, HomePage, JournalPage } from './pages/MarketingPages.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import { AccessPage, LoginPage, RegisterPage } from './pages/AccountPages.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CategoryAdminPage from './pages/CategoryAdminPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import PurchasePage from './pages/PurchasePage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import AdminHomePage from './pages/AdminHomePage.jsx'

const initialProducts = [
  { id: 'air-max-90', nombreModelo: 'Air Max 90', tipoCategoria: 'Nike Urban', precio: 129990, linkImagen: getImage('urban/90.png'), tallasDisponibles: { 39: 2, 40: 4, 41: 3, 42: 1, 43: 2 }, descripcion: 'Una silueta icónica que combina comodidad diaria y actitud urbana.' },
  { id: 'air-force-1', nombreModelo: 'Air Force 1', tipoCategoria: 'Nike Urban', precio: 119990, linkImagen: getImage('urban/air.png'), tallasDisponibles: { 38: 2, 39: 3, 40: 5, 41: 2, 42: 1 }, descripcion: 'El clásico de cancha que se convirtió en un imprescindible de la calle.' },
  { id: 'nike-blazer', nombreModelo: 'Blazer Mid', tipoCategoria: 'Nike Urban', precio: 109990, linkImagen: getImage('urban/blazer.png'), tallasDisponibles: { 39: 1, 40: 2, 41: 2, 42: 3 }, descripcion: 'Perfil vintage, líneas limpias y una presencia que no pasa de moda.' },
  { id: 'court-vision', nombreModelo: 'Court Vision Low', tipoCategoria: 'Nike Urban', precio: 89990, linkImagen: getImage('urban/court.png'), tallasDisponibles: { 38: 3, 39: 3, 40: 1, 41: 4, 42: 2 }, descripcion: 'Inspiración retro para sumar estilo a cualquier combinación.' },
  { id: 'retro-3', nombreModelo: 'Air Jordan 3 Retro', tipoCategoria: 'Jordan', precio: 219990, linkImagen: getImage('jordan/retro3/r3.webp'), tallasDisponibles: { 39: 1, 40: 2, 41: 2, 42: 1 }, descripcion: 'Un clásico Jordan con detalles de legado y una comodidad contemporánea.' },
  { id: 'jordan-urban', nombreModelo: 'Jordan Street', tipoCategoria: 'Jordan', precio: 159990, linkImagen: getImage('jo.png'), tallasDisponibles: { 39: 2, 40: 1, 41: 3, 42: 1, 43: 1 }, descripcion: 'Diseño de alto impacto para moverse con personalidad.' },
  { id: 'nike-run', nombreModelo: 'Pegasus Run', tipoCategoria: 'Nike Sports', precio: 139990, linkImagen: getImage('nkrun.webp'), tallasDisponibles: { 38: 2, 39: 4, 40: 4, 41: 2, 42: 2 }, descripcion: 'Amortiguación ligera y respuesta suave para tus kilómetros diarios.' },
  { id: 'sport-flex', nombreModelo: 'Sports Flex', tipoCategoria: 'Nike Sports', precio: 99990, linkImagen: getImage('nksports.png'), tallasDisponibles: { 38: 1, 39: 2, 40: 3, 41: 3, 42: 2 }, descripcion: 'Un básico versátil para entrenar, caminar y seguir en movimiento.' },
]

const pageAliases = {
  '/index.html': '/', '/categoria.html': '/marcas', '/catjordan.html': '/catalogo/jordan',
  '/catnikesports.html': '/catalogo/nike-sports', '/catnikeurban.html': '/catalogo/nike-urban',
  '/detalle.html': '/producto', '/compra.html': '/compra', '/carrito.html': '/carrito',
  '/acceso.html': '/acceso', '/login.html': '/login', '/registro.html': '/registro',
  '/contacto.html': '/contacto', '/nosotros.html': '/nosotros', '/blogs.html': '/blogs',
  '/detalleblog.html': '/blog', '/admin.html': '/admin', '/adminproductos.html': '/admin/productos',
  '/adminusuarios.html': '/admin/usuarios', '/comprartarjeta.html': '/pago',
}

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function App() {
  const [path, setPath] = useState(window.location.pathname.toLowerCase())
  const [query, setQuery] = useState(window.location.search)
  const [products, setProducts] = useState(initialProducts)
  const [cart, setCart] = useState(() => readStorage('sneakersCart', []))
  const [session, setSession] = useState(() => readStorage('usuarioSesion', null))
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)

  const navigate = (destination, { replace = false } = {}) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', destination)
    setPath(window.location.pathname.toLowerCase())
    setQuery(window.location.search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const syncRoute = () => { setPath(window.location.pathname.toLowerCase()); setQuery(window.location.search) }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    localStorage.setItem('sneakersCart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const controller = new AbortController()
    fetch(`${base}/api/productos`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No fue posible consultar el catálogo.'); return response.json() })
      .then((result) => { if (Array.isArray(result) && result.length) setProducts(result) })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!/^\d+$/.test(String(session?.id))) return undefined
    const controller = new AbortController()
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${base}/api/clientes/${session.id}/carrito`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo sincronizar tu carrito.'); return response.json() })
      .then((result) => {
        const items = (result.items || []).map((item) => {
          const productId = item.productoId ?? item.producto?.id ?? item.product?.id
          const product = item.producto || item.product || products.find((candidate) => String(candidate.id) === String(productId)) || {}
          return {
            productoId: productId,
            talla: String(item.talla ?? item.size ?? ''),
            cantidad: Number(item.cantidad || 0),
            nombre: item.nombreProducto || productName(product),
            precio: Number(item.precioUnitario ?? item.precio ?? product.precio ?? 0),
            imagen: item.imagen || item.linkImagen || product.linkImagen || '',
            categoria: product.tipoCategoria || '',
          }
        }).filter((item) => item.cantidad > 0)
        setCart(items)
      })
      .catch((error) => { if (error.name !== 'AbortError') setNotice({ type: 'error', text: error.message }) })
    return () => controller.abort()
  }, [session?.id, products])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 5200)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!sessionStorage.getItem('storeWelcomeShown')) {
      setNotice({ type: 'success', text: session?.pnombre ? `¡Qué bueno verte, ${session.pnombre}!` : '¡Bienvenido a Facture Sneakers! Explora tu próximo par favorito.' })
      sessionStorage.setItem('storeWelcomeShown', 'true')
    }
  }, [session])

  const normalizedPath = pageAliases[path] || path
  const productId = new URLSearchParams(query).get('id')
  const selectedProduct = products.find((product) => String(product.id) === String(productId))
  const routeCategory = normalizedPath.split('/')[2]
  const categoryProducts = products.filter((product) => {
    return !routeCategory || categorySlug(categoryLabel(product)) === categorySlug(routeCategory)
  })
  const cartCount = cart.reduce((sum, item) => sum + Number(item.cantidad), 0)

  async function addToCart(product, size, amount) {
    if (!session?.id) {
      setNotice({ type: 'error', text: 'Inicia sesión para agregar productos al carrito.' })
      navigate('/login?redirect=/carrito')
      return
    }
    const available = stockFor(product, size)
    const existing = cart.find((item) => String(item.productoId) === String(product.id) && String(item.talla) === String(size))
    const nextAmount = Number(amount) + Number(existing?.cantidad || 0)
    if (!size || !Number.isInteger(Number(amount)) || Number(amount) < 1 || nextAmount > available) {
      setNotice({ type: 'error', text: `La talla ${size || 'seleccionada'} tiene ${available} unidades disponibles.` })
      return
    }
    if (/^\d+$/.test(String(session.id)) && /^\d+$/.test(String(product.id))) {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/${session.id}/carrito/items`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productoId: Number(product.id), talla: String(size), cantidad: Number(amount) }),
        })
        if (!response.ok) throw new Error((await response.text()) || 'No se pudo agregar el producto al carrito.')
      } catch (error) {
        setNotice({ type: 'error', text: error.message || 'No se pudo conectar con el carrito.' })
        return
      }
    }
    const newItem = { productoId: product.id, talla: String(size), cantidad: Number(amount), nombre: productName(product), precio: Number(product.precio), imagen: product.linkImagen, categoria: product.tipoCategoria }
    setCart((items) => existing
      ? items.map((item) => item === existing ? { ...item, cantidad: nextAmount } : item)
      : [...items, newItem])
    setNotice({ type: 'success', text: `${productName(product)} · talla ${size} agregado al carrito.` })
    navigate('/carrito')
  }

  async function submitLogin(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))
    setBusy(true)
    let user
    if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin') user = { id: 'admin', email, pnombre: 'Administrador', rol: 'ADMIN' }
    if (email.toLowerCase() === 'vendedor@gmail.com' && password === 'vendedor') user = { id: 'seller', email, pnombre: 'Vendedor', rol: 'VENDEDOR' }
    try {
      if (!user) {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, contrasena: password }) })
        if (!response.ok) throw new Error((await response.text()) || 'Correo o contraseña incorrectos.')
        user = await response.json()
      }
      localStorage.setItem('usuarioSesion', JSON.stringify(user))
      setCart([])
      setSession(user)
      setNotice({ type: 'success', text: `¡Bienvenido/a, ${user.pnombre || user.nombreCompleto || email}!` })
      const role = String(user.rol || user.role || '').toUpperCase()
      const requestedDestination = new URLSearchParams(query).get('redirect')
      let customerDestination = '/marcas'
      if (requestedDestination?.startsWith('/')) {
        const redirectUrl = new URL(requestedDestination, window.location.origin)
        if (redirectUrl.origin === window.location.origin) {
          customerDestination = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
        }
      }
      navigate(role === 'ADMIN' ? '/admin' : role === 'VENDEDOR' ? '/admin/productos' : customerDestination)
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'No se pudo conectar con el servidor.' })
    } finally { setBusy(false) }
  }

  function logout() {
    localStorage.removeItem('usuarioSesion')
    setCart([])
    setSession(null)
    setNotice({ type: 'success', text: 'Sesión cerrada correctamente.' })
    navigate('/')
  }

  async function updateCart(index, nextAmount) {
    const item = cart[index]
    const product = products.find((candidate) => String(candidate.id) === String(item.productoId))
    const available = stockFor(product, item.talla)
    if (nextAmount < 1) return
    if (nextAmount > available) {
      setNotice({ type: 'error', text: `Solo quedan ${available} unidades para la talla ${item.talla}.` })
      return
    }
    if (/^\d+$/.test(String(session?.id)) && /^\d+$/.test(String(item.productoId))) {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/${session.id}/carrito/items/${item.productoId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ talla: item.talla, cantidad: nextAmount }),
        })
        if (!response.ok) throw new Error((await response.text()) || 'No se pudo actualizar el carrito.')
      } catch (error) {
        setNotice({ type: 'error', text: error.message || 'No se pudo actualizar el carrito.' })
        return
      }
    }
    setCart((items) => items.map((entry, current) => current === index ? { ...entry, cantidad: nextAmount } : entry))
  }

  async function removeCartItem(index) {
    const item = cart[index]
    if (/^\d+$/.test(String(session?.id)) && /^\d+$/.test(String(item.productoId))) {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/${session.id}/carrito/items/${item.productoId}?talla=${encodeURIComponent(item.talla)}`, { method: 'DELETE' })
        if (!response.ok) throw new Error((await response.text()) || 'No se pudo eliminar el producto.')
      } catch (error) {
        setNotice({ type: 'error', text: error.message || 'No se pudo eliminar el producto.' })
        return
      }
    }
    setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))
  }

  async function clearCart() {
    if (/^\d+$/.test(String(session?.id))) {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/${session.id}/carrito`, { method: 'DELETE' })
        if (!response.ok) throw new Error((await response.text()) || 'No se pudo vaciar el carrito.')
      } catch (error) {
        setNotice({ type: 'error', text: error.message || 'No se pudo vaciar el carrito.' })
        return
      }
    }
    setCart([])
  }

  async function submitCartOrder() {
    if (!session?.id) {
      setNotice({ type: 'error', text: 'Debes iniciar sesión para realizar la compra.' })
      navigate('/login')
      return
    }
    setBusy(true)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const address = [session.direccion, session.region, session.comuna].filter(Boolean).join(', ') || 'Por confirmar'
      const response = await fetch(`${base}/api/clientes/${session.id}/boletas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodoPago: 'Pendiente', direccion: address }),
      })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo crear la boleta.')
      const clearResponse = await fetch(`${base}/api/clientes/${session.id}/carrito`, { method: 'DELETE' })
      if (!clearResponse.ok) throw new Error((await clearResponse.text()) || 'La compra se creó, pero no se pudo vaciar el carrito.')
      setCart([])
      setNotice({ type: 'success', text: 'Compra realizada con éxito.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'No se pudo completar la compra.' })
    } finally {
      setBusy(false)
    }
  }

  async function submitCheckout(event) {
    event.preventDefault()
    if (!cart.length) return
    setBusy(true)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${base}/api/clientes/${session.id}/boletas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ metodoPago: 'Pendiente', direccion: new FormData(event.currentTarget).get('address') }) })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo confirmar la compra.')
      setCart([])
      setNotice({ type: 'success', text: 'Compra confirmada. Gracias por elegir Facture Sneakers.' })
      navigate('/')
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo completar la compra.' }) }
    finally { setBusy(false) }
  }

  async function submitRegistration(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim()
    const confirmEmail = String(form.get('confirmEmail')).trim()
    if (!form.get('region') || !form.get('commune')) {
      setNotice({ type: 'error', text: 'Selecciona una región y una comuna.' })
      return
    }
    const allowedDomain = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|profesorduoc\.cl)$/i
    if (!allowedDomain.test(email)) {
      setNotice({ type: 'error', text: 'El correo debe pertenecer a @gmail.com, @duocuc.cl o @profesorduoc.cl.' })
      return
    }
    if (email !== confirmEmail) {
      setNotice({ type: 'error', text: 'Los correos electrónicos no coinciden.' })
      return
    }
    if (form.get('password') !== form.get('confirmPassword')) {
      setNotice({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }
    if (String(form.get('password')).length > 10) {
      setNotice({ type: 'error', text: 'La contraseña no puede exceder los 10 caracteres.' })
      return
    }
    setBusy(true)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${base}/api/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCompleto: form.get('name'), email, contrasena: form.get('password'), numero: form.get('phone'), direccion: form.get('address'), region: form.get('region'), comuna: form.get('commune') }),
      })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo crear la cuenta.')
      setNotice({ type: 'success', text: 'Cuenta creada. Ya puedes iniciar sesión.' })
      navigate('/login')
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'No fue posible registrar tu cuenta.' })
    } finally {
      setBusy(false)
    }
  }

  function renderContent() {
    if (normalizedPath === '/' || normalizedPath === '/inicio') return <HomePage navigate={navigate} />
    if (normalizedPath === '/marcas') return <BrandsPage navigate={navigate} products={products} />
    if (normalizedPath.startsWith('/catalogo')) return <CatalogPage routeCategory={routeCategory} categoryProducts={categoryProducts} navigate={navigate} />
    if (normalizedPath === '/producto') return <ProductPage product={selectedProduct} navigate={navigate} />
    if (normalizedPath === '/compra') return <PurchasePage key={selectedProduct?.id} product={selectedProduct} addToCart={addToCart} navigate={navigate} />
    if (normalizedPath === '/pago') return <PaymentPage />
    if (normalizedPath === '/carrito') return <CartPage cart={cart} session={session} navigate={navigate} updateCart={updateCart} removeCartItem={removeCartItem} clearCart={clearCart} submitOrder={submitCartOrder} busy={busy} />
    if (normalizedPath === '/acceso') return <AccessPage navigate={navigate} />
    if (normalizedPath === '/login') return <LoginPage submitLogin={submitLogin} busy={busy} navigate={navigate} />
    if (normalizedPath === '/registro') return <RegisterPage submitRegistration={submitRegistration} busy={busy} navigate={navigate} />
    if (normalizedPath === '/checkout') return <CheckoutPage cart={cart} session={session} submitCheckout={submitCheckout} busy={busy} />
    if (normalizedPath === '/nosotros') return <AboutPage navigate={navigate} />
    if (normalizedPath === '/contacto') return <ContactPage setNotice={setNotice} />
    if (normalizedPath === '/blogs') return <JournalPage navigate={navigate} />
    if (normalizedPath === '/blog') return <BlogDetailPage blogId={productId} navigate={navigate} />
    if (normalizedPath === '/admin') return <AdminHomePage session={session} navigate={navigate} />
    if (normalizedPath === '/admin/categorias') return <CategoryAdminPage session={session} navigate={navigate} />
    if (normalizedPath.startsWith('/admin')) return <AdminPage path={normalizedPath} session={session} products={products} setProducts={setProducts} setNotice={setNotice} navigate={navigate} />
    return <HomePage navigate={navigate} />
  }

  const pageTheme = normalizedPath === '/' || normalizedPath === '/inicio' ? 'home'
    : normalizedPath === '/acceso' ? 'access'
    : normalizedPath === '/registro' ? 'register'
    : normalizedPath === '/login' ? 'login'
    : normalizedPath === '/producto' ? 'product'
    : normalizedPath === '/carrito' ? 'cart'
    : normalizedPath === '/pago' ? 'payment'
    : normalizedPath === '/compra' ? 'purchase'
    : normalizedPath === '/nosotros' ? 'about'
    : normalizedPath === '/contacto' ? 'contact'
    : normalizedPath.startsWith('/admin') ? 'admin'
    : normalizedPath.startsWith('/blogs') || normalizedPath === '/blog' ? 'blog'
    : 'catalog'

  return (
    <div className={`app-shell legacy-root legacy-page-${pageTheme}`}>
      <Notice notice={notice} onDismiss={() => setNotice(null)} />
      <SiteHeader key={normalizedPath} session={session} cartCount={cartCount} navigate={navigate} logout={logout} path={normalizedPath} />
      <main>{renderContent()}</main>
      {!['product', 'login', 'register', 'payment', 'purchase', 'admin'].includes(pageTheme) && normalizedPath !== '/blog' && <SiteFooter navigate={navigate} />}
    </div>
  )
}


export default App
