import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ContactPage from '../ContactPage.jsx'

describe('ContactPage', () => {
  it('Muestra controles de entrada y botón de envío en el formulario de contacto', () => {
    render(<ContactPage setNotice={vi.fn()} />)

    expect(document.querySelector('form')).toBeInTheDocument()
    expect(screen.getByLabelText('NOMBRE COMPLETO')).toBeInTheDocument()
    expect(screen.getByLabelText('CORREO')).toBeInTheDocument()
    expect(screen.getByLabelText('CONTENIDO')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ENVIAR MENSAJE' })).toBeInTheDocument()
  })

  it('Simula el envío del mensaje y activa una notificación de éxito', () => {
    const mockSetNotice = vi.fn()
    vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<ContactPage setNotice={mockSetNotice} />)

    fireEvent.submit(document.querySelector('form'))

    expect(mockSetNotice).toHaveBeenCalledWith(expect.objectContaining({
      type: 'success',
      text: expect.stringContaining('Gmail'),
    }))
    expect(window.open).toHaveBeenCalledOnce()
  })
})
