import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AdminPage from '../AdminPage.jsx'

const mockAdminSession = { id: 1, rol: 'ADMIN' }
const mockProducts = [{
  id: 1,
  nombreModelo: 'Air Max 90',
  tipoCategoria: 'Nike Urban',
  precio: 129990,
  tallasDisponibles: { 39: 2, 40: 3 },
}]

describe('AdminPage', () => {
  it('Despliega los productos cuando la sesión corresponde a un administrador', () => {
    render(
      <AdminPage
        session={mockAdminSession}
        products={mockProducts}
        setProducts={vi.fn()}
        setNotice={vi.fn()}
        navigate={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
    expect(screen.getByText('Air Max 90')).toBeInTheDocument()
  })

  it('Redirige a la página de inicio si una persona no autenticada intenta ingresar', async () => {
    const mockNavigate = vi.fn()
    render(
      <AdminPage
        session={null}
        products={[]}
        setProducts={vi.fn()}
        setNotice={vi.fn()}
        navigate={mockNavigate}
      />,
    )

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })
})
