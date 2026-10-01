import { useState } from 'react'

export default function PaymentPage() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [flipped, setFlipped] = useState(false)

  function formatNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <main className="checkout-wrapper">
      <div className="header-titles"><h1>FORMULARIO DE PAGO VISA</h1><p>Efecto de Tarjeta 3D en Tiempo Real</p></div>
      <div className="card-container">
        <div className="card-inner" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className="card-front">
            <div className="card-logo"><i>VISA</i></div>
            <img src="https://cdn-icons-png.flaticon.com/512/6404/6404100.png" alt="" className="chip-icon" />
            <div className="card-number">{number || '#### #### #### ####'}</div>
            <div className="card-details"><div className="card-name"><span>Titular de la tarjeta</span><div>{name.toUpperCase() || 'NOMBRE COMPLETO'}</div></div><div className="card-expires"><span>Expira</span><div>{month || 'MM'}/{year || 'YY'}</div></div></div>
          </div>
          <div className="card-back"><div className="magnetic-stripe" /><div className="signature-area"><span>AUTHORIZED SIGNATURE</span><div className="signature-box"><span>{cvv}</span></div></div><p className="cvv-info">Código de seguridad CVV de 3 dígitos al reverso de la tarjeta.</p></div>
        </div>
      </div>
      <form className="payment-form" onSubmit={(event) => event.preventDefault()}>
        <div className="input-group"><input type="text" inputMode="numeric" autoComplete="cc-number" value={number} onChange={(event) => setNumber(formatNumber(event.target.value))} placeholder="Número de tarjeta" aria-label="Número de tarjeta" maxLength="19" /></div>
        <div className="input-group"><input type="text" autoComplete="cc-name" value={name} onChange={(event) => setName(event.target.value.slice(0, 30))} placeholder="Nombre en la tarjeta" aria-label="Nombre en la tarjeta" maxLength="30" /></div>
        <div className="row-group">
          <div className="input-group select-group"><select value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Mes de expiración"><option value="">Mes</option>{Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((value) => <option key={value}>{value}</option>)}</select></div>
          <div className="input-group select-group"><select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Año de expiración"><option value="">Año</option>{Array.from({ length: 7 }, (_, index) => String(26 + index)).map((value) => <option key={value}>{value}</option>)}</select></div>
          <div className="input-group cvv-group"><input type="password" inputMode="numeric" autoComplete="cc-csc" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 3))} onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} placeholder="CVV" aria-label="CVV" maxLength="3" /></div>
        </div>
        <button type="button" className="btn-submit">Confirmar Pago</button>
      </form>
    </main>
  )
}
