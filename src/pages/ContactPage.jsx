import { getImage } from '../assets/images.js'

export default function ContactPage({ setNotice }) {
  function sendMessage(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subject = encodeURIComponent('Nuevo contacto desde Sneakers Store')
    const body = encodeURIComponent(`Nombre: ${form.get('name')}\nCorreo de contacto: ${form.get('email')}\n\nMensaje:\n${form.get('message')}`)
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=se.balladares@duocuc.cl&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer')
    setNotice({ type: 'success', text: 'Se abrió Gmail con tu mensaje preparado.' })
  }
  return <main className="main-wrapper">
    <div className="brand-header"><div className="brand-logo-box"><img src={getImage('logo/lgo.png')} alt="Logo Facture Sneakers" className="brand-logo-img" /></div><h1 className="brand-name">FACTURE SNEAKERS</h1></div>
    <section className="custom-card"><h2 className="form-title">FORMULARIO DE CONTACTOS</h2>
      <form id="form-contacto" onSubmit={sendMessage}>
        <div className="field-group"><label htmlFor="contact-name">NOMBRE COMPLETO</label><input name="name" id="contact-name" className="custom-input" placeholder="Tu nombre completo" required /></div>
        <div className="field-group"><label htmlFor="contact-email">CORREO</label><input name="email" id="contact-email" type="email" className="custom-input" placeholder="usuario@dominio.com" required /></div>
        <div className="field-group"><label htmlFor="contact-message">CONTENIDO</label><textarea name="message" id="contact-message" className="custom-textarea" placeholder="Escribe tu mensaje aquí..." required /></div>
        <div className="text-center mt-4"><button className="btn-red-submit" type="submit">ENVIAR MENSAJE</button></div>
      </form>
    </section>
  </main>
}
