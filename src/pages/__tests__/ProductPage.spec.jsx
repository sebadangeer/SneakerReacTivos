import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProductPage from '../ProductPage.jsx'

const mockProduct = {
  id: 'air-max-90',
  nombreModelo: 'Air Max 90',
  tipoCategoria: 'Nike Urban',
  precio: 129990,
  descripcion: 'Amortiguación cómoda para todos los días.',
  linkImagen: 'urban/90.png',
}

describe('ProductPage', () => {
  it('Despliega la información detallada del producto', () => {
    render(<ProductPage product={mockProduct} navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Air Max 90' })).toBeInTheDocument()
    expect(screen.getByText(mockProduct.descripcion)).toBeInTheDocument()
  })

  it('Maneja el estado cuando no se proporciona un producto', () => {
    render(<ProductPage product={null} navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Producto no disponible' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver atrás' })).toBeInTheDocument()
  })
})
