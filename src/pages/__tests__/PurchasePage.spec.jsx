import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PurchasePage from '../PurchasePage.jsx'

const mockProduct = {
  id: 'air-max-90',
  nombreModelo: 'Air Max 90',
  tallasDisponibles: { 39: 2, 40: 3 },
}

describe('PurchasePage', () => {
  it('Permite seleccionar una talla de calzado disponible', () => {
    render(<PurchasePage product={mockProduct} addToCart={vi.fn()} navigate={vi.fn()} />)
    const size = screen.getByRole('radio', { name: '40 (3 disponibles)' })

    fireEvent.click(size)

    expect(size).toBeChecked()
  })

  it('Invoca addToCart al enviar el formulario para agregar al carrito', () => {
    const mockAddToCart = vi.fn()
    render(<PurchasePage product={mockProduct} addToCart={mockAddToCart} navigate={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'AGREGAR AL CARRITO' }))

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, '39', 1)
  })
})
