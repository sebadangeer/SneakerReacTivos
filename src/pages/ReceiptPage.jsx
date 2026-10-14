import { money } from '../utils/catalog.js'

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Fecha no disponible'
    : new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export default function ReceiptPage({ receipt, navigate }) {
  if (!receipt) {
    return (
      <section className="receipt-empty">
        <p className="receipt-eyebrow">FACTURE SNEAKERS</p>
        <h1>No encontramos una boleta reciente.</h1>
        <p>Cuando completes una compra, podrás consultar e imprimir aquí el comprobante.</p>
        <button type="button" className="receipt-secondary-action" onClick={() => navigate('/marcas')}>Volver a la tienda</button>
      </section>
    )
  }

  return (
    <section className="receipt-page">
      <div className="receipt-actions">
        <button type="button" className="receipt-secondary-action" onClick={() => navigate('/marcas')}>← Seguir comprando</button>
        <button type="button" className="receipt-print-action" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
      </div>

      <article className="receipt-card">
        <header className="receipt-brand">
          <div>
            <p className="receipt-eyebrow">FACTURE SNEAKERS</p>
            <p className="receipt-tagline">Estilo que deja huella.</p>
          </div>
          <span className="receipt-status"><span aria-hidden="true">✓</span> PEDIDO CONFIRMADO</span>
        </header>

        <div className="receipt-heading">
          <div>
            <p className="receipt-overline">COMPROBANTE DE COMPRA</p>
            <h1>¡Gracias por tu compra!</h1>
            <p className="receipt-intro">Tu pedido fue registrado. Guarda este comprobante para consultar los detalles.</p>
          </div>
          <div className="receipt-order">
            <span>NÚMERO DE BOLETA</span>
            <strong>{receipt.id ?? 'Por confirmar'}</strong>
            <span>{formatDate(receipt.date)}</span>
          </div>
        </div>

        <div className="receipt-info">
          <section>
            <h2>DATOS DEL CLIENTE</h2>
            <p>{receipt.customerName || 'Cliente'}</p>
            <p>{receipt.email || '—'}</p>
          </section>
          <section>
            <h2>DIRECCIÓN DE ENTREGA</h2>
            <p>{receipt.address || 'Por confirmar'}</p>
          </section>
          <section>
            <h2>MÉTODO DE PAGO</h2>
            <p>{receipt.paymentMethod || 'Pendiente de confirmación'}</p>
          </section>
        </div>

        <div className="receipt-table-wrap">
          <table className="receipt-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>TALLA</th>
                <th>PRECIO</th>
                <th>CANT.</th>
                <th className="receipt-align-right">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={`${item.name}-${item.size}-${index}`}>
                  <td>{item.name}</td>
                  <td>{item.size || '—'}</td>
                  <td>{money(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td className="receipt-align-right">{money(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="receipt-total">
          <span>TOTAL DEL PEDIDO</span>
          <strong>{money(receipt.total)}</strong>
        </footer>

        <p className="receipt-thanks">Gracias por elegir Facture Sneakers. Nos vemos en tu próximo par.</p>
      </article>
    </section>
  )
}
