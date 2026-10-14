import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CartPage from '../CartPage.jsx'
import { money } from '../../utils/catalog.js'

const mockCart = [
  { productoId: 1, talla: '39', cantidad: 2, nombre: 'Air Max 90', precio: 129990, imagen: 'urban/90.png' },
]

function renderCart(submitOrder = vi.fn()) {
  return render(
    <CartPage
      cart={mockCart}
      session={{ id: 1, direccion: 'Av. Central', comuna: 'Santiago', region: 'Metropolitana' }}
      navigate={vi.fn()}
      updateCart={vi.fn()}
      removeCartItem={vi.fn()}
      clearCart={vi.fn()}
      submitOrder={submitOrder}
      busy={false}
    />,
  )
}

describe('CartPage', () => {
  it('Renderiza los productos del carrito y calcula el monto total', () => {
    renderCart()

    expect(screen.getByText('Air Max 90')).toBeInTheDocument()
    expect(document.querySelector('.summary-total')).toHaveTextContent(money(259980))
  })

  it('Ejecuta submitOrder al presionar el botón de pago', () => {
    const mockSubmitOrder = vi.fn()
    renderCart(mockSubmitOrder)

    fireEvent.click(screen.getByRole('button', { name: 'Pagar y enviar boleta' }))

    expect(mockSubmitOrder).toHaveBeenCalledOnce()
  })
})
