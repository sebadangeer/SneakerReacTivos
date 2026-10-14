import { useEffect, useState } from 'react'
import { categoryLabel, productName } from '../utils/catalog.js'
import { resolveProductImage } from '../assets/images.js'
import AdminNavigation from '../components/AdminNavigation.jsx'

function categoryName(category) {
  if (typeof category === 'string') return category.trim()
  return String(category?.nombreTipoCategoria || category?.tipoCategoriaNombre || category?.nombre || category?.name || '').trim()
}

export default function AdminPage({ session, products, setProducts, setNotice, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryMessage, setCategoryMessage] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [sizes, setSizes] = useState([{ size: '', stock: '' }])
  const [editingProduct, setEditingProduct] = useState(null)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const productApi = `${base}/api/productos`
  const categoryApi = `${base}/api/tipos-categoria`
  const categoryOptions = [...new Set(categories.map(categoryName).filter(Boolean))]

  useEffect(() => {
    if (!['ADMIN', 'VENDEDOR'].includes(role)) {
      navigate('/')
      return undefined
    }
    const controller = new AbortController()
    fetch(categoryApi, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudieron cargar los tipos de categoría.'); return response.json() })
      .then((result) => {
        const availableCategories = Array.isArray(result) ? result.filter((entry) => categoryName(entry)) : []
        setCategories(availableCategories)
        setCategoryMessage(availableCategories.length ? '' : 'No hay tipos de categoría disponibles.')
      })
      .catch((error) => { if (error.name !== 'AbortError') setCategoryMessage(error.message || 'No se pudieron cargar las categorías.') })
      .finally(() => { if (!controller.signal.aborted) setLoadingCategories(false) })
    return () => controller.abort()
  }, [categoryApi, navigate, role])

  if (!['ADMIN', 'VENDEDOR'].includes(role)) return null
  const addSize = () => setSizes((entries) => [...entries, { size: '', stock: '' }])
  const resetProduct = () => { setName(''); setDescription(''); setCategory(''); setPrice(''); setImage(''); setSizes([{ size: '', stock: '' }]); setEditingProduct(null) }
  const saveProduct = async (event) => {
    event.preventDefault()
    const selectedCategory = category || categoryOptions[0] || ''
    if (!selectedCategory) {
      setNotice({ type: 'error', text: 'No hay categorías disponibles para asignar al producto.' })
      return
    }
    const filledSizes = sizes.filter((entry) => entry.size !== '')
    const inventory = Object.fromEntries(filledSizes.map((entry) => [entry.size, Number(entry.stock)]))
    const invalidInventory = !filledSizes.length || filledSizes.some((entry) => Number(entry.size) < 1 || Number(entry.size) > 60 || !Number.isInteger(Number(entry.stock)) || Number(entry.stock) < 0) || new Set(Object.keys(inventory)).size !== filledSizes.length
    if (invalidInventory) {
      setNotice({ type: 'error', text: 'Completa cada talla con stock entero desde cero y evita repetir tallas.' })
      return
    }
    const payload = { nombreModelo: name.trim(), descripcion: description.trim(), tipoCategoria: selectedCategory, precio: Number(price), linkImagen: image.trim(), tallasDisponibles: inventory }
    try {
      const response = await fetch(editingProduct ? `${productApi}/${editingProduct}` : productApi, { method: editingProduct ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo guardar el producto.')
      const result = await fetch(productApi)
      if (result.ok) setProducts(await result.json())
      setNotice({ type: 'success', text: `${name} se ${editingProduct ? 'actualizó' : 'agregó'} con inventario por talla.` })
      resetProduct()
    } catch (error) { setNotice({ type: 'error', text: error.message || 'No se pudo conectar con el inventario.' }) }
  }
  const editProduct = (product) => {
    setEditingProduct(product.id)
    setName(productName(product)); setDescription(product.descripcion || ''); setCategory(categoryLabel(product)); setPrice(String(product.precio || '')); setImage(product.linkImagen || '')
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
  return (
    <section className="page-shell admin-page">
      <p className="eyebrow">GESTIÓN DE TIENDA</p>
      <h1>Productos</h1>
      <AdminNavigation activePath="/admin/productos" role={role} navigate={navigate} />
      <div className="admin-layout">
          <form className="product-form" onSubmit={saveProduct}>
            <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
            <label>Nombre del modelo<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label htmlFor="product-description">Descripción</label>
            <textarea id="product-description" rows="4" maxLength="600" value={description} onChange={(event) => setDescription(event.target.value)} />
            <label>Categoría<select required value={category || categoryOptions[0] || ''} onChange={(event) => setCategory(event.target.value)} disabled={loadingCategories || !categoryOptions.length}><option value="" disabled>{loadingCategories ? 'Cargando categorías…' : 'Selecciona una categoría'}</option>{categoryOptions.map((categoryOption) => <option key={categoryOption} value={categoryOption}>{categoryOption}</option>)}</select>{categoryMessage && <span className="form-message" role="status">{categoryMessage}</span>}</label>
            <label>Precio<input required min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
            <label>URL de imagen<input value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://…" /></label>
            <div className="inventory-editor">
              <div className="size-title"><strong>Stock por talla</strong><button type="button" onClick={addSize}>+ Agregar talla</button></div>
              {sizes.map((entry, index) => <div className="inventory-row" key={index}>
                <input aria-label="Talla" type="number" step="0.5" min="1" placeholder="Talla" value={entry.size} onChange={(event) => setSizes((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, size: event.target.value } : row))} />
                <input aria-label="Unidades disponibles" type="number" min="0" step="1" placeholder="Unidades" value={entry.stock} onChange={(event) => setSizes((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, stock: event.target.value } : row))} />
                <button type="button" aria-label="Eliminar talla" onClick={() => setSizes((current) => current.filter((_, rowIndex) => rowIndex !== index))}>×</button>
              </div>)}
            </div>
            <button className="button button-red">{editingProduct ? 'Actualizar producto' : 'Guardar producto'}</button>
            {editingProduct && <button className="button button-dark" type="button" onClick={resetProduct}>Cancelar edición</button>}
          </form>
          <div className="products-panel">
            <h2>Catálogo ({products.length})</h2>
            <div className="admin-product-list">
              {products.map((product) => <div className="admin-product-row" key={product.id}>
                <img src={resolveProductImage(product.linkImagen)} alt="" />
                <div><strong>{productName(product)}</strong><span>{categoryLabel(product)} · {Object.entries(product.tallasDisponibles || {}).map(([size, stock]) => `${size}: ${stock}`).join(' / ')}</span></div>
                <div className="admin-row-actions"><button aria-label={`Editar ${productName(product)}`} onClick={() => editProduct(product)}>Editar</button><button aria-label={`Eliminar ${productName(product)}`} onClick={() => deleteProduct(product)}>Eliminar</button></div>
              </div>)}
            </div>
          </div>
      </div>
    </section>
  )
}
