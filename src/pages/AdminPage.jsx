import { useEffect, useState } from 'react'
import { categoryLabel, productName } from '../utils/catalog.js'
import { resolveProductImage } from '../assets/images.js'

export default function AdminPage({ path, session, products, setProducts, setNotice, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Nike Urban')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [sizes, setSizes] = useState([{ size: '', stock: '' }])
  const [editingProduct, setEditingProduct] = useState(null)
  const [users, setUsers] = useState([])
  const [userForm, setUserForm] = useState({ nombreCompleto: '', email: '', contrasena: '', numero: '', direccion: '', region: '', comuna: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [adminMessage, setAdminMessage] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const productApi = `${base}/api/productos`
  const customerApi = `${base}/api/clientes`

  useEffect(() => {
    if (path !== '/admin/usuarios' || role !== 'ADMIN') return undefined
    const controller = new AbortController()
    setLoadingUsers(true)
    fetch(customerApi, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudo cargar la lista de usuarios.'); return response.json() })
      .then((result) => { setUsers(Array.isArray(result) ? result : []); setAdminMessage('') })
      .catch((error) => { if (error.name !== 'AbortError') setAdminMessage(error.message) })
      .finally(() => setLoadingUsers(false))
    return () => controller.abort()
  }, [path, role])

  if (!['ADMIN', 'VENDEDOR'].includes(role)) return <section className="page-shell admin-page"><p className="eyebrow">ACCESO RESTRINGIDO</p><h1>Inicia sesión para administrar.</h1><button className="button button-dark" onClick={() => navigate('/login')}>Ir a iniciar sesión</button></section>
  const addSize = () => setSizes((entries) => [...entries, { size: '', stock: '' }])
  const resetProduct = () => { setName(''); setCategory('Nike Urban'); setPrice(''); setImage(''); setSizes([{ size: '', stock: '' }]); setEditingProduct(null) }
  const saveProduct = async (event) => {
    event.preventDefault()
    const filledSizes = sizes.filter((entry) => entry.size !== '')
    const inventory = Object.fromEntries(filledSizes.map((entry) => [entry.size, Number(entry.stock)]))
    const invalidInventory = !filledSizes.length || filledSizes.some((entry) => Number(entry.size) < 1 || Number(entry.size) > 60 || !Number.isInteger(Number(entry.stock)) || Number(entry.stock) < 0) || new Set(Object.keys(inventory)).size !== filledSizes.length
    if (invalidInventory) {
      setNotice({ type: 'error', text: 'Completa cada talla con stock entero desde cero y evita repetir tallas.' })
      return
    }
    const payload = { nombreModelo: name.trim(), tipoCategoria: category, precio: Number(price), linkImagen: image.trim(), tallasDisponibles: inventory }
    try {
      const response = await fetch(editingProduct ? `${productApi}/${editingProduct}` : productApi, { method: editingProduct ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo guardar el producto.')
      const result = await fetch(productApi)
      if (result.ok) setProducts(await result.json())
      setNotice({ type: 'success', text: `${name} se ${editingProduct ? 'actualizó' : 'agregó'} con inventario por talla.` })
      resetProduct()
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo conectar con el inventario.' }) }
  }
  const saveUser = async (event) => {
    event.preventDefault()
    if (!editingUser && !userForm.contrasena) { setNotice({ type: 'error', text: 'La contraseña es obligatoria para crear un usuario.' }); return }
    const payload = Object.fromEntries(Object.entries(userForm).filter(([key, value]) => key !== 'contrasena' || value))
    try {
      const response = await fetch(editingUser ? `${customerApi}/${editingUser}` : customerApi, { method: editingUser ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo guardar el usuario.')
      const result = await fetch(customerApi)
      if (result.ok) setUsers(await result.json())
      setUserForm({ nombreCompleto: '', email: '', contrasena: '', numero: '', direccion: '', region: '', comuna: '' })
      setEditingUser(null)
      setNotice({ type: 'success', text: 'Usuario guardado correctamente.' })
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo conectar con usuarios.' }) }
  }
  const editUser = (user) => {
    setEditingUser(user.id ?? user.idCliente)
    setUserForm({ nombreCompleto: user.nombreCompleto || user.pnombre || '', email: user.email || '', contrasena: '', numero: user.numero || '', direccion: user.direccion || '', region: user.region || '', comuna: user.comuna || '' })
  }
  const deleteUser = async (user) => {
    const id = user.id ?? user.idCliente
    if (!window.confirm(`¿Eliminar la cuenta de ${user.nombreCompleto || user.email}?`)) return
    try {
      const response = await fetch(`${customerApi}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo eliminar el usuario.')
      setUsers((items) => items.filter((entry) => String(entry.id ?? entry.idCliente) !== String(id)))
      setNotice({ type: 'success', text: 'Usuario eliminado correctamente.' })
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo eliminar el usuario.' }) }
  }
  const editProduct = (product) => {
    setEditingProduct(product.id)
    setName(productName(product)); setCategory(categoryLabel(product)); setPrice(String(product.precio || '')); setImage(product.linkImagen || '')
    setSizes(Object.entries(product.tallasDisponibles || {}).map(([size, stock]) => ({ size, stock: String(stock) })).concat(Object.keys(product.tallasDisponibles || {}).length ? [] : [{ size: '', stock: '' }]))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const deleteProduct = async (product) => {
    if (!window.confirm(`¿Eliminar ${productName(product)}? Esta acción no se puede deshacer.`)) return
    try {
      const response = await fetch(`${productApi}/${product.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo eliminar el producto.')
      setProducts((items) => items.filter((entry) => String(entry.id) !== String(product.id)))
      setNotice({ type: 'success', text: 'Producto eliminado del catálogo.' })
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo eliminar el producto.' }) }
  }
  const changeUser = (field, value) => setUserForm((current) => ({ ...current, [field]: value }))
  return <section className="page-shell admin-page"><p className="eyebrow">GESTIÓN DE TIENDA</p><h1>{path === '/admin/usuarios' ? 'Administración' : 'Productos'}</h1><div className="admin-tabs"><button className={path === '/admin/productos' ? 'active' : ''} onClick={() => navigate('/admin/productos')}>Productos</button>{role === 'ADMIN' && <button className={path === '/admin/usuarios' ? 'active' : ''} onClick={() => navigate('/admin/usuarios')}>Usuarios</button>}</div>{path === '/admin/usuarios' && role === 'ADMIN' ? <div className="admin-layout"><form className="product-form" onSubmit={saveUser}><h2>{editingUser ? 'Editar usuario' : 'Nuevo usuario'}</h2><label>Nombre completo<input required value={userForm.nombreCompleto} onChange={(event) => changeUser('nombreCompleto', event.target.value)} /></label><label>Correo<input required type="email" value={userForm.email} onChange={(event) => changeUser('email', event.target.value)} /></label><label>Contraseña<input type="password" maxLength="10" required={!editingUser} value={userForm.contrasena} onChange={(event) => changeUser('contrasena', event.target.value)} /></label><label>Teléfono<input value={userForm.numero} onChange={(event) => changeUser('numero', event.target.value)} /></label><label>Dirección<input value={userForm.direccion} onChange={(event) => changeUser('direccion', event.target.value)} /></label><label>Región<input required value={userForm.region} onChange={(event) => changeUser('region', event.target.value)} /></label><label>Comuna<input required value={userForm.comuna} onChange={(event) => changeUser('comuna', event.target.value)} /></label><button className="button button-red">{editingUser ? 'Actualizar usuario' : 'Guardar usuario'}</button>{editingUser && <button className="button button-dark" type="button" onClick={() => { setEditingUser(null); setUserForm({ nombreCompleto: '', email: '', contrasena: '', numero: '', direccion: '', region: '', comuna: '' }) }}>Cancelar edición</button>}</form><div className="products-panel"><h2>Usuarios ({users.length})</h2>{adminMessage && <p className="admin-message">{adminMessage}</p>}{loadingUsers && <p className="admin-message">Cargando usuarios…</p>}<div className="admin-product-list">{users.map((user) => <div className="admin-product-row" key={user.id ?? user.idCliente}><div className="user-initial">{(user.nombreCompleto || user.pnombre || user.email || 'U').slice(0, 1).toUpperCase()}</div><div><strong>{user.nombreCompleto || user.pnombre || 'Sin nombre'}</strong><span>{user.email} · {user.region || 'Sin región'} / {user.comuna || 'Sin comuna'}</span></div><div className="admin-row-actions"><button aria-label="Editar usuario" onClick={() => editUser(user)}>Editar</button><button aria-label="Eliminar usuario" onClick={() => deleteUser(user)}>Eliminar</button></div></div>)}</div></div></div> : <div className="admin-layout"><form className="product-form" onSubmit={saveProduct}><h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2><label>Nombre del modelo<input required value={name} onChange={(event) => setName(event.target.value)} /></label><label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Nike Urban</option><option>Nike Sports</option><option>Jordan</option></select></label><label>Precio<input required min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>URL de imagen<input value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://…" /></label><div className="inventory-editor"><div className="size-title"><strong>Stock por talla</strong><button type="button" onClick={addSize}>+ Agregar talla</button></div>{sizes.map((entry, index) => <div className="inventory-row" key={index}><input aria-label="Talla" type="number" step="0.5" min="1" placeholder="Talla" value={entry.size} onChange={(event) => setSizes((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, size: event.target.value } : row))} /><input aria-label="Unidades disponibles" type="number" min="0" step="1" placeholder="Unidades" value={entry.stock} onChange={(event) => setSizes((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, stock: event.target.value } : row))} /><button type="button" aria-label="Eliminar talla" onClick={() => setSizes((current) => current.filter((_, rowIndex) => rowIndex !== index))}>×</button></div>)}</div><button className="button button-red">{editingProduct ? 'Actualizar producto' : 'Guardar producto'}</button>{editingProduct && <button className="button button-dark" type="button" onClick={resetProduct}>Cancelar edición</button>}</form><div className="products-panel"><h2>Catálogo ({products.length})</h2><div className="admin-product-list">{products.map((product) => <div className="admin-product-row" key={product.id}><img src={resolveProductImage(product.linkImagen)} alt="" /><div><strong>{productName(product)}</strong><span>{categoryLabel(product)} · {Object.entries(product.tallasDisponibles || {}).map(([size, stock]) => `${size}: ${stock}`).join(' / ')}</span></div><div className="admin-row-actions"><button aria-label={`Editar ${productName(product)}`} onClick={() => editProduct(product)}>Editar</button><button aria-label={`Eliminar ${productName(product)}`} onClick={() => deleteProduct(product)}>Eliminar</button></div></div>)}</div></div></div>}</section>
}
