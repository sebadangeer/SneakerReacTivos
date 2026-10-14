import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage, RegisterPage } from '../AccountPages.jsx'

describe('AccountPages', () => {
  it('(Login) Dispara submitLogin al procesar las credenciales del usuario', () => {
    const mockSubmitLogin = vi.fn((event) => event.preventDefault())
    render(<LoginPage submitLogin={mockSubmitLogin} busy={false} navigate={vi.fn()} />)

    fireEvent.submit(document.querySelector('form'))

    expect(mockSubmitLogin).toHaveBeenCalledOnce()
  })

  it('(Registro) Renderiza los campos de entrada requeridos en el formulario', () => {
    render(<RegisterPage submitRegistration={vi.fn()} busy={false} navigate={vi.fn()} />)

    expect(document.querySelector('form')).toBeInTheDocument()
    expect(document.querySelectorAll('input').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'REGISTRAR' })).toBeInTheDocument()
  })
})
