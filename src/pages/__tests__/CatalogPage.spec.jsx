import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CatalogPage from '../CatalogPage.jsx'

const mockProducts = [{
  id: 'air-max-90',
  nombreModelo: 'Air Max 90',
  tipoCategoria: 'Nike Urban',
  precio: 129990,
  linkImagen: 'urban/90.png',
}]

describe('CatalogPage', () => {
  it('Renderiza correctamente el catálogo de productos', () => {
    render(<CatalogPage routeCategory="nike-urban" categoryProducts={mockProducts} navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'nike urban Best seller' })).toBeInTheDocument()
    expect(screen.getByText('Air Max 90')).toBeInTheDocument()
  })

  it('Despliega información de los productos en pantalla', () => {
    render(<CatalogPage routeCategory="nike-urban" categoryProducts={mockProducts} navigate={vi.fn()} />)

    expect(screen.getAllByText('Nike Urbano').length).toBeGreaterThan(0)
    expect(document.body.textContent.trim().length).toBeGreaterThan(0)
  })
})
