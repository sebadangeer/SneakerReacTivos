import { useEffect, useState } from 'react'
import { productName, categoryLabel } from '../utils/catalog.js'
import AdminNavigation from '../components/AdminNavigation.jsx'

function AdminSection({ title, activePath, role, navigate, children }) {
  if (!['ADMIN', 'VENDEDOR'].includes(role)) return <section className="page-shell admin-page"><p className="eyebrow">ACCESO RESTRINGIDO</p><h1>Inicia sesión para administrar.</h1><button className="button button-dark" onClick={() => navigate('/login')}>Ir a iniciar sesión</button></section>
  return <section className="page-shell admin-page">
    <p className="eyebrow">GESTIÓN DE TIENDA</p><h1>{title}</h1>
    <AdminNavigation activePath={activePath} role={role} navigate={navigate} />
    {children}
  </section>
}

function orderList(data) {
  if (Array.isArray(data)) return data
  return data?.boletas || data?.content || data?.items || data?.data || []
}

function useAdminOrders(session, enabled) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    const loadOrders = async () => {
      try {
        let response = await fetch(`${base}/api/boletas`, { signal: controller.signal })
        if (!response.ok && /^\d+$/.test(String(session?.id))) {
          response = await fetch(`${base}/api/clientes/${session.id}/boletas`, { signal: controller.signal })
        }
        if (!response.ok) throw new Error('El backend no permite consultar las boletas desde esta cuenta.')
        const result = orderList(await response.json())
        if (!Array.isArray(result)) throw new Error('El backend respondió con un formato de boletas no reconocido.')
        setOrders(result)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError instanceof TypeError
            ? 'No se pudo conectar con el backend para consultar las boletas.'
            : requestError.message || 'No se pudieron cargar las órdenes.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadOrders()
    return () => controller.abort()
  }, [base, enabled, session?.id])

  return { orders, loading, error }
}

function useAdminOrderSummary(enabled) {
  const [summary, setSummary] = useState({ quantity: 0, sales: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    fetch(`${base}/api/boletas/resumen`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar el resumen de ventas.'); return response.json() })
      .then((result) => {
        const data = result?.resumen || result?.data || result
        setSummary({
          quantity: Number(data.cantidad ?? data.cantidadBoletas ?? data.totalBoletas ?? data.count ?? 0),
          sales: Number(data.totalVentas ?? data.ventasTotal ?? data.totalVenta ?? data.total ?? 0),
        })
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError instanceof TypeError ? 'No se pudo conectar con el backend para consultar el resumen.' : requestError.message)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [base, enabled])

  return { summary, loading, error }
}

function orderId(order, index) {
  return order.id ?? order.idBoleta ?? order.numeroBoleta ?? index + 1
}

function persistedOrderId(order) {
  return order.id ?? order.idBoleta ?? order.numeroBoleta
}

function orderAmount(order) {
  return Number(order.total ?? order.totalBoleta ?? order.montoTotal ?? order.importe ?? 0)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value)
}

function orderDate(order) {
  const rawDate = order.fecha ?? order.fechaCreacion ?? order.createdAt
  if (!rawDate) return 'Fecha no disponible'
  const date = new Date(rawDate)
  return Number.isNaN(date.getTime()) ? String(rawDate) : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date)
}

function orderCustomer(order) {
  return order.cliente?.nombreCompleto || order.cliente?.email || order.nombreCliente || order.emailCliente || 'Cliente'
}

function AdminOrderDetails({ id, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${base}/api/boletas/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar el detalle de la boleta.') ; return response.json() })
      .then((result) => setOrder(result?.boleta || result?.data || result))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError instanceof TypeError ? 'No se pudo conectar con el backend para consultar esta boleta.' : requestError.message)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [base, id])

  const items = order?.detalleBoletas || order?.detalles || order?.items || order?.productos || []
  return <section className="admin-order-detail" aria-labelledby="order-detail-title">
    <div className="panel-heading"><h2 id="order-detail-title">Boleta #{id}</h2><button type="button" onClick={onClose}>Cerrar detalle</button></div>
    {loading && <p className="table-message">Cargando detalle de boleta...</p>}
    {!loading && error && <p className="table-message error" role="status">{error}</p>}
    {!loading && !error && <>
      <p>{orderCustomer(order)} · {orderDate(order)}</p>
      {items.length ? <div className="table-wrapper"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id ?? item.idDetalle ?? index}><td>{item.nombreProducto || item.producto?.nombreModelo || item.nombre || 'Producto'}</td><td>{item.cantidad || 1}</td><td>{formatCurrency(Number(item.precioUnitario ?? item.precio ?? 0))}</td></tr>)}</tbody></table></div> : <p className="table-message">Esta boleta no tiene productos asociados.</p>}
      <strong>Total: {formatCurrency(orderAmount(order))}</strong>
    </>}
  </section>
}

export function AdminOrdersPage({ session, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const { orders, loading, error } = useAdminOrders(session, ['ADMIN', 'VENDEDOR'].includes(role))
  const [search, setSearch] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const filteredOrders = orders.filter((order, index) => `${orderId(order, index)} ${orderCustomer(order)} ${order.estado || order.status || ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

  return <AdminSection title="Órdenes" activePath="/admin/ordenes" role={role} navigate={navigate}>
    <section className="products-panel admin-data-panel">
      <div className="panel-heading"><h2>Boletas ({orders.length})</h2><label className="admin-search">Buscar<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Número o cliente" /></label></div>
      {loading && <p className="table-message">Cargando órdenes...</p>}
      {!loading && error && <p className="table-message error" role="status">{error}</p>}
      {!loading && !error && !orders.length && <p className="table-message">Todavía no hay órdenes registradas.</p>}
      {!loading && !error && orders.length > 0 && <div className="table-wrapper"><table>
        <thead><tr><th>Boleta</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead>
        <tbody>{filteredOrders.map((order, index) => <tr key={orderId(order, index)}>
          <td>#{orderId(order, index)}</td><td>{orderCustomer(order)}</td><td>{orderDate(order)}</td>
          <td>{order.estado || order.status || 'Registrada'}</td><td className="price">{formatCurrency(orderAmount(order))}</td>
          <td><button className="admin-inline-action" type="button" disabled={persistedOrderId(order) === undefined} onClick={() => setSelectedOrderId(persistedOrderId(order))}>Ver boleta</button></td>
        </tr>)}</tbody>
      </table>{filteredOrders.length === 0 && <p className="table-message">No hay órdenes que coincidan con la búsqueda.</p>}</div>}
      {selectedOrderId !== null && <AdminOrderDetails id={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
    </section>
  </AdminSection>
}

export function AdminReportsPage({ session, products = [], navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const { summary, loading, error } = useAdminOrderSummary(['ADMIN', 'VENDEDOR'].includes(role))
  const stockTotal = products.reduce((total, product) => total + Object.values(product.tallasDisponibles || {}).reduce((sum, amount) => sum + Number(amount || 0), 0), 0)
  const criticalProducts = products.filter((product) => Object.values(product.tallasDisponibles || {}).reduce((sum, amount) => sum + Number(amount || 0), 0) <= 3)

  return <AdminSection title="Reportes" activePath="/admin/reportes" role={role} navigate={navigate}>
    <div className="admin-report-metrics">
      <article><span>Productos</span><strong>{products.length}</strong><small>Referencias activas</small></article>
      <article><span>Unidades disponibles</span><strong>{stockTotal}</strong><small>Sumadas por talla</small></article>
      <article><span>Stock crítico</span><strong>{criticalProducts.length}</strong><small>Hasta 3 unidades por producto</small></article>
      <article><span>Boletas registradas</span><strong>{loading ? '...' : error ? 'No disponible' : summary.quantity}</strong><small>Órdenes procesadas</small></article>
      <article><span>Total de ventas</span><strong>{loading ? '...' : error ? 'No disponible' : formatCurrency(summary.sales)}</strong><small>Acumulado informado por el backend</small></article>
    </div>
    <section className="products-panel admin-data-panel">
      <div className="panel-heading"><h2>Productos con stock crítico</h2><span>{criticalProducts.length} productos</span></div>
      {criticalProducts.length === 0 ? <p className="table-message">No hay productos con stock crítico.</p> : <div className="admin-product-list">
        {criticalProducts.map((product) => {
          const stock = Object.values(product.tallasDisponibles || {}).reduce((sum, amount) => sum + Number(amount || 0), 0)
          return <article className="admin-product-row" key={product.id}>
            <div className="stock-level" aria-label={`${stock} unidades`}>{stock}</div>
            <div><strong>{productName(product)}</strong><span>{categoryLabel(product)} · {stock} unidades disponibles</span></div>
            <button type="button" onClick={() => navigate('/admin/productos')}>Ver producto</button>
          </article>
        })}
      </div>}
      {error && <p className="table-message" role="status">Resumen de ventas no disponible: {error}</p>}
    </section>
  </AdminSection>
}

export function AdminProfilePage({ session, onSessionUpdate, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const [form, setForm] = useState({
    nombreCompleto: session?.nombreCompleto || session?.pnombre || '',
    email: session?.email || '',
    numero: session?.numero || '',
    direccion: session?.direccion || '',
    region: session?.region || '',
    comuna: session?.comuna || '',
  })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const saveProfile = async (event) => {
    event.preventDefault()
    const updatedSession = { ...session, ...form, pnombre: form.nombreCompleto }
    setSaving(true)
    setMessage('')
    try {
      if (/^\d+$/.test(String(session?.id))) {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${base}/api/clientes/${session.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        })
        if (!response.ok) throw new Error((await response.text()) || 'No se pudo actualizar el perfil.')
      }
      onSessionUpdate(updatedSession)
      setMessage(/^\d+$/.test(String(session?.id)) ? 'Perfil actualizado correctamente.' : 'Cambios guardados en este dispositivo; esta cuenta no está conectada al backend.')
    } catch (error) { setMessage(error.message || 'No se pudo guardar el perfil.') }
    finally { setSaving(false) }
  }

  return <AdminSection title="Perfil" activePath="/admin/perfil" role={role} navigate={navigate}>
    <form className="product-form admin-profile-form" onSubmit={saveProfile}>
      <h2>Datos de la cuenta</h2>
      <label>Nombre completo<input required value={form.nombreCompleto} onChange={(event) => updateField('nombreCompleto', event.target.value)} /></label>
      <label>Correo<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
      <label>Teléfono<input value={form.numero} onChange={(event) => updateField('numero', event.target.value)} /></label>
      <label>Dirección<input value={form.direccion} onChange={(event) => updateField('direccion', event.target.value)} /></label>
      <div className="form-row"><label>Región<input value={form.region} onChange={(event) => updateField('region', event.target.value)} /></label><label>Comuna<input value={form.comuna} onChange={(event) => updateField('comuna', event.target.value)} /></label></div>
      <button className="button button-red" disabled={saving}>{saving ? 'Guardando...' : 'Guardar perfil'}</button>
      <p className="form-message" role="status">{message}</p>
    </form>
  </AdminSection>
}

export function AdminStorePage({ session, products = [], navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const stockTotal = products.reduce((total, product) => total + Object.values(product.tallasDisponibles || {}).reduce((sum, amount) => sum + Number(amount || 0), 0), 0)
  return <AdminSection title="Tienda" activePath="/admin/tienda" role={role} navigate={navigate}>
    <div className="admin-store-summary">
      <div><p className="eyebrow">ESCAPARATE PÚBLICO</p><h2>Facture Sneakers</h2><p>El catálogo visible se alimenta del inventario actual.</p><button className="button button-red" type="button" onClick={() => navigate('/marcas')}>Abrir tienda</button></div>
      <dl><div><dt>Modelos</dt><dd>{products.length}</dd></div><div><dt>Unidades disponibles</dt><dd>{stockTotal}</dd></div></dl>
    </div>
    <section className="products-panel admin-data-panel"><div className="panel-heading"><h2>Catálogo destacado</h2><button type="button" onClick={() => navigate('/admin/productos')}>Administrar productos</button></div>
      <div className="admin-store-products">{products.slice(0, 6).map((product) => <article key={product.id}><strong>{productName(product)}</strong><span>{categoryLabel(product)}</span></article>)}</div>
      {!products.length && <p className="table-message">No hay productos disponibles para mostrar.</p>}
    </section>
  </AdminSection>
}
