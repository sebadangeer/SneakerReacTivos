import AdminNavigation from '../components/AdminNavigation.jsx'

const sections = [
  { path: '/admin/ordenes', label: 'Órdenes', category: 'Ventas', description: 'Consulta las boletas y el estado de cada compra.' },
  { path: '/admin/productos', label: 'Productos', category: 'Catálogo', description: 'Administra modelos, precios y stock por talla.' },
  { path: '/admin/categorias', label: 'Categorías', category: 'Catálogo', adminOnly: true, description: 'Organiza las colecciones visibles en la tienda.' },
  { path: '/admin/usuarios', label: 'Usuarios', category: 'Clientes', adminOnly: true, description: 'Gestiona las cuentas registradas.' },
  { path: '/admin/reportes', label: 'Reportes', category: 'Análisis', description: 'Revisa ventas e inventario crítico.' },
  { path: '/admin/perfil', label: 'Perfil', category: 'Cuenta', description: 'Actualiza tus datos de acceso y contacto.' },
  { path: '/admin/tienda', label: 'Tienda', category: 'Canal de venta', description: 'Consulta el escaparate público.' },
]

export default function AdminHomePage({ session, products = [], navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  if (!['ADMIN', 'VENDEDOR'].includes(role)) {
    return <main className="admin-page admin-home"><header className="admin-header"><div><p className="eyebrow">Acceso restringido</p><h1>Inicia sesión para administrar.</h1></div><button className="back-link" onClick={() => navigate('/login')}>Iniciar sesión</button></header></main>
  }

  const inventory = products.reduce((sum, product) => sum + Object.values(product.tallasDisponibles || {}).reduce((stock, amount) => stock + Number(amount || 0), 0), 0)
  const criticalProducts = products.filter((product) => Object.values(product.tallasDisponibles || {}).reduce((sum, amount) => sum + Number(amount || 0), 0) <= 3).length
  const availableSections = sections.filter((section) => !section.adminOnly || role === 'ADMIN')

  return <main className="admin-page admin-home">
    <header className="admin-header"><div><p className="eyebrow">Panel de control</p><h1>Administración</h1><p className="admin-intro">Resumen de las actividades de la tienda.</p></div><button className="back-link" onClick={() => navigate('/marcas')}>Volver a la tienda</button></header>
    <AdminNavigation activePath="/admin" role={role} navigate={navigate} />
    <section className="admin-metrics" aria-label="Resumen de inventario">
      <article><span>Productos</span><strong>{products.length}</strong><small>Modelos en catálogo</small></article>
      <article><span>Unidades</span><strong>{inventory}</strong><small>Stock disponible por talla</small></article>
      <article><span>Stock crítico</span><strong>{criticalProducts}</strong><small>Productos con 3 unidades o menos</small></article>
    </section>
    <section className="admin-options" aria-label="Áreas de administración">
      {availableSections.map((section, index) => <button className="admin-option" key={section.path} onClick={() => navigate(section.path)}>
        <span className="admin-option-number">{String(index + 1).padStart(2, '0')}</span><span className="eyebrow">{section.category}</span>
        <strong>{section.label}</strong><span className="admin-option-description">{section.description}</span><span className="admin-option-arrow" aria-hidden="true">→</span>
      </button>)}
    </section>
  </main>
}
