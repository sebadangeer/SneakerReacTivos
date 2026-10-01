import { useState } from 'react'
import regions from '../data/regions.json'
import { getImage } from '../assets/images.js'

export function AccessPage({ navigate }) {
  return <div className="split-container">
    <section className="split-side left-side"><div className="content-card"><h2 className="side-title">¿YA TIENES CUENTA?</h2><p className="side-description">Ingresa a tu perfil para gestionar tus compras y revisar tus pedidos.</p><button className="btn-action btn-red-submit" onClick={() => navigate('/login')}>INICIAR SESIÓN</button></div></section>
    <section className="split-side right-side"><div className="content-card"><h2 className="side-title">¿ERES NUEVO?</h2><p className="side-description">Crea una cuenta para disfrutar de la mejor experiencia y lanzamientos exclusivos.</p><button className="btn-action btn-black" onClick={() => navigate('/registro')}>REGISTRARSE</button></div></section>
  </div>
}

export function LoginPage({ submitLogin, busy, navigate }) {
  return <main className="main-wrapper">
    <div className="brand-header"><div className="brand-logo-box"><img src={getImage('logo/lgo.png')} alt="Logo Facture Sneakers" className="brand-logo-img" /></div><h1 className="brand-name">Facture Sneakers</h1></div>
    <section className="custom-card"><h2 className="form-title">INICIO DE SESIÓN</h2>
      <form id="form-login" onSubmit={submitLogin}>
        <div className="field-group"><label htmlFor="correo">CORREO</label><input name="email" type="email" id="correo" className="custom-input" required /></div>
        <div className="field-group"><label htmlFor="password">CONTRASEÑA</label><input name="password" type="password" id="password" className="custom-input" required /></div>
        <div className="text-center mt-4"><button type="submit" className="btn-red-submit" disabled={busy}>{busy ? 'Ingresando…' : 'INICIAR SESIÓN'}</button><button type="button" className="btn-back" onClick={() => navigate('/acceso')}>← VOLVER ATRÁS</button></div>
      </form>
    </section>
  </main>
}

export function RegisterPage({ submitRegistration, busy, navigate }) {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedCommune, setSelectedCommune] = useState('')
  const [openMenu, setOpenMenu] = useState('')
  const communes = selectedRegion?.comunas || []

  return <main className="main-wrapper">
    <section className="custom-card"><h2 className="form-title">REGISTRO DE USUARIO</h2>
      <form id="form-registro" onSubmit={submitRegistration}>
        <div className="field-group"><label htmlFor="nombre">NOMBRE COMPLETO</label><input name="name" type="text" id="nombre" className="custom-input" placeholder="Ej. Juan Pérez" required /></div>
        <div className="field-group"><label htmlFor="correo">CORREO</label><input name="email" type="email" id="correo" className="custom-input" placeholder="usuario@dominio.com" required /></div>
        <div className="field-group"><label htmlFor="confirmar-correo">CONFIRMAR CORREO</label><input name="confirmEmail" type="email" id="confirmar-correo" className="custom-input" placeholder="Reingresa tu correo" required /></div>
        <div className="field-group"><label htmlFor="password">CONTRASEÑA</label><input name="password" type="password" id="password" className="custom-input" minLength="1" maxLength="10" placeholder="••••••••" required /></div>
        <div className="field-group"><label htmlFor="confirmar-password">CONFIRMAR CONTRASEÑA</label><input name="confirmPassword" type="password" id="confirmar-password" className="custom-input" maxLength="10" placeholder="••••••••" required /></div>
        <div className="field-group"><label htmlFor="telefono">TELÉFONO (opcional)</label><input name="phone" type="tel" id="telefono" className="custom-input" placeholder="9 1234 5678" pattern="[0-9]{8,9}" /></div>
        <div className="field-group"><label htmlFor="direccion">DIRECCIÓN</label><input name="address" type="text" id="direccion" className="custom-input" placeholder="Ej. Av. Siempre Viva 123" required /></div>
        <div className="row-selects">
          <div className="select-box custom-select-wrapper">
            <button type="button" className="btn-red-select" aria-expanded={openMenu === 'region'} onClick={() => setOpenMenu(openMenu === 'region' ? '' : 'region')}>{selectedRegion?.nombre || '-- Seleccione la región --'}</button>
            <div className={`custom-options-menu ${openMenu === 'region' ? 'show' : ''}`}>{regions.regiones.map((region) => <button type="button" className="custom-option" key={region.id} onClick={() => { setSelectedRegion(region); setSelectedCommune(''); setOpenMenu('') }}>{region.nombre}</button>)}</div>
            <input type="hidden" name="region" value={selectedRegion?.id || ''} required />
          </div>
          <div className="select-box custom-select-wrapper">
            <button type="button" className="btn-red-select" aria-expanded={openMenu === 'commune'} disabled={!selectedRegion} onClick={() => setOpenMenu(openMenu === 'commune' ? '' : 'commune')}>{selectedCommune || '-- Seleccione la comuna --'}</button>
            <div className={`custom-options-menu ${openMenu === 'commune' ? 'show' : ''}`}>{communes.map((commune) => <button type="button" className="custom-option" key={commune} onClick={() => { setSelectedCommune(commune); setOpenMenu('') }}>{commune}</button>)}</div>
            <input type="hidden" name="commune" value={selectedCommune.toLowerCase().replace(/\s+/g, '-')} required />
          </div>
        </div>
        <div className="text-center mt-4"><button type="submit" className="btn-red-submit" disabled={busy}>{busy ? 'REGISTRANDO…' : 'REGISTRAR'}</button><button type="button" className="btn-back" onClick={() => navigate('/acceso')}>← VOLVER ATRÁS</button></div>
      </form>
    </section>
  </main>
}
