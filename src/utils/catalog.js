export function money(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value) || 0)
}

export function productName(product) {
  return product?.nombreModelo || product?.name || 'Zapatilla'
}

export function categoryLabel(product) {
  const value = product?.tipoCategoria || product?.tipoCategoriaNombre
  const name = typeof value === 'object' && value !== null
    ? value.nombreTipoCategoria || value.tipoCategoriaNombre || value.nombre || value.name
    : value
  const category = String(name || '').toLowerCase()
  if (category.includes('jordan')) return 'Jordan'
  if (category.includes('sport')) return 'Nike Sports'
  if (category.includes('urban')) return 'Nike Urban'
  return String(name || 'Sneakers').trim()
}

export function categorySlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function stockFor(product, size) {
  return Number(product?.tallasDisponibles?.[String(size)] || 0)
}
