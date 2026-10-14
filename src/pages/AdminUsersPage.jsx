import { useEffect, useState } from 'react'
import AdminNavigation from '../components/AdminNavigation.jsx'

const emptyForm = { nombreCompleto: '', email: '', contrasena: '', numero: '', direccion: '', region: '', comuna: '' }

function PurchaseHistoryPanel({ user, onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const userId = user.id ?? user.idCliente
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${base}/api/clientes/${encodeURIComponent(userId)}/boletas`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar el historial de compras.'); return response.json() })
      .then((result) => setOrders(Array.isArray(result) ? result : Array.isArray(result?.boletas) ? result.boletas : []))
      .catch((error) => { if (error.name !== 'AbortError') setMessage(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [base, userId])

  return <section className="products-panel admin-data-panel" aria-labelledby="purchase-history-title">
    <div className="panel-heading"><h2 id="purchase-history-title">Compras de {user.nombreCompleto || user.pnombre || user.email}</h2><button type="button" onClick={onClose}>Cerrar historial</button></div>
    {loading && <p className="table-message">Cargando historial...</p>}
    {!loading && message && <p className="table-message error" role="status">{message}</p>}
    {!loading && !message && !orders.length && <p className="table-message">Este usuario todavía no tiene compras.</p>}
    {!loading && !message && orders.length > 0 && <div className="table-wrapper"><table><thead><tr><th>Boleta</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead><tbody>
      {orders.map((order, index) => <tr key={order.id ?? order.idBoleta ?? index}><td>#{order.id ?? order.idBoleta ?? index + 1}</td><td>{order.fecha || order.fechaCreacion || 'Sin fecha'}</td><td>{order.estado || order.status || 'Registrada'}</td><td>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(order.total ?? order.totalBoleta ?? order.montoTotal ?? 0))}</td></tr>)}
    </tbody></table></div>}
  </section>
}

export default function AdminUsersPage({ session, navigate, setNotice }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [historyUser, setHistoryUser] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const customerApi = `${base}/api/clientes`

  useEffect(() => {
    if (role !== 'ADMIN') return undefined
    const controller = new AbortController()
    fetch(customerApi, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar la lista de usuarios.'); return response.json() })
      .then((result) => { setUsers(Array.isArray(result) ? result : []); setMessage('') })
      .catch((error) => { if (error.name !== 'AbortError') setMessage(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [customerApi, role])

  if (role !== 'ADMIN') return <section className="page-shell admin-page"><p className="eyebrow">ACCESO RESTRINGIDO</p><h1>Solo un administrador puede gestionar usuarios.</h1><button className="button button-dark" onClick={() => navigate('/admin')}>Volver al panel</button></section>

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const resetForm = () => { setForm(emptyForm); setEditingId(null) }
  const editUser = (user) => {
    setEditingId(user.id ?? user.idCliente)
    setForm({ nombreCompleto: user.nombreCompleto || user.pnombre || '', email: user.email || '', contrasena: '', numero: user.numero || '', direccion: user.direccion || '', region: user.region || '', comuna: user.comuna || '' })
  }
  const saveUser = async (event) => {
    event.preventDefault()
    if (editingId === null && !form.contrasena) return
    setSaving(true)
    setMessage('')
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([key, value]) => key !== 'contrasena' || value))
      const response = await fetch(editingId === null ? customerApi : `${customerApi}/${encodeURIComponent(editingId)}`, {
        method: editingId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo guardar el usuario.')
      const result = await fetch(customerApi)
      if (result.ok) setUsers(await result.json())
      resetForm()
      setNotice({ type: 'success', text: 'Usuario guardado correctamente.' })
    } catch (error) { setMessage(error.message || 'No se pudo conectar con usuarios.') }
    finally { setSaving(false) }
  }
  const deleteUser = async (user) => {
    const id = user.id ?? user.idCliente
    if (!window.confirm(`¿Eliminar la cuenta de ${user.nombreCompleto || user.email}?`)) return
    try {
      const response = await fetch(`${customerApi}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo eliminar el usuario.')
      setUsers((items) => items.filter((entry) => String(entry.id ?? entry.idCliente) !== String(id)))
      setNotice({ type: 'success', text: 'Usuario eliminado correctamente.' })
    } catch (error) { setMessage(error.message || 'No se pudo eliminar el usuario.') }
  }

  return <section className="page-shell admin-page">
    <p className="eyebrow">GESTIÓN DE TIENDA</p><h1>Usuarios</h1>
    <AdminNavigation activePath="/admin/usuarios" role={role} navigate={navigate} />
    <div className="admin-layout">
      <form className="product-form" onSubmit={saveUser}>
        <h2>{editingId === null ? 'Nuevo usuario' : 'Editar usuario'}</h2>
        <label>Nombre completo<input required value={form.nombreCompleto} onChange={(event) => updateField('nombreCompleto', event.target.value)} /></label>
        <label>Correo<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
        <label>Contraseña<input type="password" maxLength="10" required={editingId === null} value={form.contrasena} onChange={(event) => updateField('contrasena', event.target.value)} /></label>
        <label>Teléfono<input value={form.numero} onChange={(event) => updateField('numero', event.target.value)} /></label>
        <label>Dirección<input value={form.direccion} onChange={(event) => updateField('direccion', event.target.value)} /></label>
        <label>Región<input required value={form.region} onChange={(event) => updateField('region', event.target.value)} /></label>
        <label>Comuna<input required value={form.comuna} onChange={(event) => updateField('comuna', event.target.value)} /></label>
        <button className="button button-red" disabled={saving}>{saving ? 'Guardando...' : editingId === null ? 'Crear usuario' : 'Guardar cambios'}</button>
        {editingId !== null && <button className="button button-dark" type="button" disabled={saving} onClick={resetForm}>Cancelar edición</button>}
        <p className="form-message" role="status">{message}</p>
      </form>
      <section className="products-panel" aria-labelledby="users-heading">
        <h2 id="users-heading">Usuarios ({users.length})</h2>
        {loading && <p className="table-message">Cargando usuarios...</p>}
        {!loading && !users.length && <p className="table-message">No hay usuarios registrados.</p>}
        <div className="admin-product-list">{users.map((user) => <article className="admin-product-row" key={user.id ?? user.idCliente}>
          <div className="user-initial">{(user.nombreCompleto || user.pnombre || user.email || 'U').slice(0, 1).toUpperCase()}</div>
          <div><strong>{user.nombreCompleto || user.pnombre || 'Sin nombre'}</strong><span>{user.email} · {user.region || 'Sin región'} / {user.comuna || 'Sin comuna'}</span></div>
          <div className="admin-row-actions"><button type="button" aria-label={`Ver compras de ${user.nombreCompleto || user.email}`} onClick={() => setHistoryUser(user)}>Compras</button><button type="button" aria-label={`Editar ${user.nombreCompleto || user.email}`} onClick={() => editUser(user)}>Editar</button><button type="button" aria-label={`Eliminar ${user.nombreCompleto || user.email}`} onClick={() => deleteUser(user)}>Eliminar</button></div>
        </article>)}</div>
      </section>
      {historyUser && <PurchaseHistoryPanel user={historyUser} onClose={() => setHistoryUser(null)} />}
    </div>
  </section>
}
