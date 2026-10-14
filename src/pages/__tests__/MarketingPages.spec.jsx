import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AboutPage, JournalPage } from '../MarketingPages.jsx'

describe('MarketingPages', () => {
  it('(Nosotros) Renderiza contenido sobre la historia y los valores corporativos', () => {
    render(<AboutPage navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'SOBRE NOSOTROS' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'NUESTRA MISIÓN' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'NUESTRA VISIÓN' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Facture Sneakers' })).toBeInTheDocument()
  })

  it('(Blogs) Muestra el encabezado y las entradas disponibles del diario', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{
        id_posteo: 12,
        nombre_post: 'Lanzamiento Air Max',
        descripcion_post: 'La historia detrás del nuevo lanzamiento.',
        link_imagen_post: '',
      }],
    })
    render(<JournalPage navigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'THE SNEAKER EDITORIAL' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Lanzamiento Air Max' })).toBeInTheDocument()
    expect(screen.getByText('La historia detrás del nuevo lanzamiento.')).toBeInTheDocument()
  })
})
