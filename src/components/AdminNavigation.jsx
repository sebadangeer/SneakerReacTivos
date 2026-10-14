const adminLinks = [
  { path: '/admin', label: 'Dashboard', adminOnly: false },
  { path: '/admin/ordenes', label: 'Órdenes', adminOnly: false },
  { path: '/admin/productos', label: 'Productos', adminOnly: false },
  { path: '/admin/categorias', label: 'Categorías', adminOnly: true },
  { path: '/admin/usuarios', label: 'Usuarios', adminOnly: true },
  { path: '/admin/reportes', label: 'Reportes', adminOnly: false },
  { path: '/admin/perfil', label: 'Perfil', adminOnly: false },
  { path: '/admin/tienda', label: 'Tienda', adminOnly: false },
]

export default function AdminNavigation({ activePath, role, navigate }) {
  const links = adminLinks.filter((link) => !link.adminOnly || role === 'ADMIN')
  return <nav className="admin-tabs" aria-label="Secciones administrativas">
    {links.map((link) => <button
      className={activePath === link.path ? 'active' : ''}
      aria-current={activePath === link.path ? 'page' : undefined}
      key={link.path}
      onClick={() => navigate(link.path)}
    >{link.label}</button>)}
  </nav>
}
