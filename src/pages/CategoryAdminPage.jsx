import { useEffect, useState } from 'react'

function categoryName(category) {
  if (typeof category === 'string') return category.trim()
  return String(category?.nombreTipoCategoria || category?.tipoCategoriaNombre || category?.nombre || category?.name || '').trim()
}

export default function CategoryAdminPage({ session, navigate }) {
  const role = String(session?.rol || session?.role || '').toUpperCase()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', imagen: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const categoryApi = `${base}/api/tipos-categoria`

  useEffect(() => {
    const controller = new AbortController()
    fetch(categoryApi, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No se pudieron cargar los tipos de categoría.'); return response.json() })
      .then((result) => { setCategories(Array.isArray(result) ? result : []); setMessage('') })
      .catch((error) => { if (error.name !== 'AbortError') setMessage(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [categoryApi])

  if (role !== 'ADMIN') return <section className="admin-page"><p className="eyebrow">ACCESO RESTRINGIDO</p><h1>Solo un administrador puede gestionar categorías.</h1><button className="button button-dark" onClick={() => navigate('/admin')}>Volver a administración</button></section>

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', imagen: '' })
    setEditingId(null)
  }

  const changeForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const saveCategory = async (event) => {
    event.preventDefault()
    const trimmedName = form.nombre.trim()
    if (!trimmedName) return
    if (categories.some((category) => {
      const categoryId = category.id ?? category.idTipoCategoria
      return String(categoryId) !== String(editingId) && categoryName(category).toLocaleLowerCase() === trimmedName.toLocaleLowerCase()
    })) {
      setMessage('Ya existe un tipo de categoría con ese nombre.')
      return
    }

    const payload = { nombre: trimmedName, descripcion: form.descripcion.trim(), imagen: form.imagen.trim() }
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(editingId === null ? categoryApi : `${categoryApi}/${encodeURIComponent(editingId)}`, {
        method: editingId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error((await response.text()) || 'El backend no pudo guardar el tipo de categoría.')
      const savedCategory = await response.json().catch(() => null)
      const result = await fetch(categoryApi)
      if (result.ok) {
        const updatedCategories = await result.json()
        setCategories(Array.isArray(updatedCategories) ? updatedCategories : [])
      } else {
        setCategories((current) => editingId === null
          ? [...current, savedCategory || payload]
          : current.map((category) => String(category.id ?? category.idTipoCategoria) === String(editingId) ? savedCategory || { ...category, ...payload } : category))
      }
      const action = editingId === null ? 'creado' : 'actualizado'
      resetForm()
      setMessage(`Tipo de categoría ${action} correctamente.`)
    } catch (error) {
      setMessage(error.message || 'No se pudo guardar el tipo de categoría. Verifica la conexión con el backend.')
    } finally {
      setSaving(false)
    }
  }

  const editCategory = (category) => {
    const id = category.id ?? category.idTipoCategoria
    if (id === undefined || id === null) {
      setMessage('No se puede editar esta categoría porque no tiene un id.')
      return
    }
    setEditingId(id)
    setForm({ nombre: categoryName(category), descripcion: category.descripcion || '', imagen: category.imagen || '' })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteCategory = async (category) => {
    const id = category.id ?? category.idTipoCategoria
    if (id === undefined || id === null) {
      setMessage('No se puede eliminar esta categoría porque no tiene un id.')
      return
    }
    if (!window.confirm(`¿Eliminar la categoría "${categoryName(category)}"? Esta acción no se puede deshacer.`)) return

    setDeletingId(id)
    setMessage('')
    try {
      const response = await fetch(`${categoryApi}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error((await response.text()) || 'No se pudo eliminar el tipo de categoría.')
      setCategories((current) => current.filter((entry) => String(entry.id ?? entry.idTipoCategoria) !== String(id)))
      if (String(editingId) === String(id)) resetForm()
      setMessage('Tipo de categoría eliminado correctamente.')
    } catch (error) {
      setMessage(error.message || 'No se pudo eliminar el tipo de categoría.')
    } finally {
      setDeletingId(null)
    }
  }

  return <section className="page-shell admin-page">
    <p className="eyebrow">GESTIÓN DE TIENDA</p>
    <h1>Tipos de categoría</h1>
    <div className="admin-tabs">
      <button onClick={() => navigate('/admin/productos')}>Productos</button>
      <button className="active" aria-current="page">Categorías</button>
      <button onClick={() => navigate('/admin/usuarios')}>Usuarios</button>
    </div>
    <div className="admin-layout">
      <form className="product-form" onSubmit={saveCategory}>
        <h2>{editingId === null ? 'Crear tipo de categoría' : 'Editar tipo de categoría'}</h2>
        {editingId !== null && <label htmlFor="category-id">ID<input id="category-id" value={editingId} readOnly /></label>}
        <label htmlFor="category-name">Nombre</label>
        <input id="category-name" required maxLength="80" value={form.nombre} onChange={(event) => changeForm('nombre', event.target.value)} placeholder="Ej. Nike Running" />
        <label htmlFor="category-description">Descripción</label>
        <textarea id="category-description" rows="4" maxLength="500" value={form.descripcion} onChange={(event) => changeForm('descripcion', event.target.value)} />
        <label htmlFor="category-image">Imagen (URL)</label>
        <input id="category-image" type="url" maxLength="500" value={form.imagen} onChange={(event) => changeForm('imagen', event.target.value)} placeholder="https://..." />
        <button className="button button-red" type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId === null ? 'Crear categoría' : 'Guardar cambios'}</button>
        {editingId !== null && <button className="button button-dark" type="button" disabled={saving} onClick={resetForm}>Cancelar edición</button>}
        <p className="form-message" role="status">{message}</p>
      </form>
      <section className="products-panel" aria-labelledby="category-list-heading">
        <h2 id="category-list-heading">Categorías disponibles</h2>
        {loading && <p className="table-message">Cargando categorías...</p>}
        {!loading && categories.length === 0 && <p className="table-message">No hay tipos de categoría registrados.</p>}
        {!loading && categories.length > 0 && <div className="admin-product-list">{categories.map((category, index) => {
          const id = category.id ?? category.idTipoCategoria
          return <article className="admin-product-row category-admin-row" key={id ?? categorySlug(categoryName(category)) ?? index}>
            <div className="category-admin-image">{category.imagen ? <img src={category.imagen} alt={`Imagen de ${categoryName(category)}`} /> : <span aria-hidden="true">Sin imagen</span>}</div>
            <div><strong>{categoryName(category)}</strong><span>ID: {id ?? 'No disponible'}</span><span>{category.descripcion || 'Sin descripción'}</span>{category.imagen && <span className="category-image-url">{category.imagen}</span>}</div>
            <div className="admin-row-actions"><button type="button" aria-label={`Editar ${categoryName(category)}`} onClick={() => editCategory(category)}>Editar</button><button type="button" aria-label={`Eliminar ${categoryName(category)}`} disabled={String(deletingId) === String(id)} onClick={() => deleteCategory(category)}>{String(deletingId) === String(id) ? 'Eliminando...' : 'Eliminar'}</button></div>
          </article>
        })}</div>}
      </section>
    </div>
  </section>
}

function categorySlug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}