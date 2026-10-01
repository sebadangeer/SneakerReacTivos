export default function AdminHomePage({ session, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  if (!['ADMIN', 'VENDEDOR'].includes(role)) {
    return <main className="admin-page admin-home"><header className="admin-header"><div><p className="eyebrow">Acceso restringido</p><h1>Inicia sesión para administrar.</h1></div><button className="back-link" onClick={() => navigate('/login')}>Iniciar sesión</button></header></main>
  }

  return <main className="admin-page admin-home">
    <header className="admin-header"><div><p className="eyebrow">Panel de control</p><h1>Administración</h1><p className="admin-intro">Selecciona un área para administrar la tienda.</p></div><button className="back-link" onClick={() => navigate('/marcas')}>Volver a la tienda</button></header>
    <section className="admin-options" aria-label="Áreas de administración">
      <button className="admin-option" onClick={() => navigate('/admin/productos')}><span className="admin-option-number">01</span><span className="eyebrow">Catálogo</span><strong>Gestionar productos</strong><span className="admin-option-description">Crea, edita y elimina las zapatillas del inventario.</span><span className="admin-option-arrow" aria-hidden="true">→</span></button>
      {role === 'ADMIN' && <button className="admin-option" onClick={() => navigate('/admin/categorias')}><span className="admin-option-number">02</span><span className="eyebrow">Catálogo</span><strong>Gestionar categorías</strong><span className="admin-option-description">Crea los tipos de categoría que aparecerán en la tienda.</span><span className="admin-option-arrow" aria-hidden="true">→</span></button>}
      {role === 'ADMIN' && <button className="admin-option" onClick={() => navigate('/admin/usuarios')}><span className="admin-option-number">03</span><span className="eyebrow">Clientes</span><strong>Gestionar usuarios</strong><span className="admin-option-description">Administra las cuentas registradas en la tienda.</span><span className="admin-option-arrow" aria-hidden="true">→</span></button>}
    </section>
  </main>
}
