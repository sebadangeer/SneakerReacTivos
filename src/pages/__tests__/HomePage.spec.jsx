import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from '../MarketingPages.jsx'

describe('HomePage', () => {
  it('Renderiza el título principal de la tienda', () => {
    render(<HomePage navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'FACTURE SNEAKERS' })).toBeInTheDocument()
  })

  it('Navega a la vista de marcas al hacer clic en el botón de exploración', () => {
    const mockNavigate = vi.fn()
    render(<HomePage navigate={mockNavigate} />)

    fireEvent.click(screen.getByRole('link', { name: 'Ver Productos' }))

    expect(mockNavigate).toHaveBeenCalledWith('/marcas')
  })
})
