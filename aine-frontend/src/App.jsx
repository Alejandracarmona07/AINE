import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import AuthModal from './components/AuthModal.jsx'
import Carrito from './components/Carrito.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useCart } from './hooks/useCart.js'
import { useStripeCheckout } from './hooks/useStripeCheckout.js'
import CursosPage from './pages/CursosPage.jsx'
import HomePage from './pages/HomePage.jsx'
import PWABadge from './PWABadge.jsx'
import { fetchCatalogo, fetchPagoEstado } from './services/api.js'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname === '/' && hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

function App() {
  const [productos, setProductos] = useState([])
  const [cursos, setCursos] = useState([])
  const [formasPago, setFormasPago] = useState([])
  const [categorias, setCategorias] = useState([])
  const [galeria, setGaleria] = useState([])
  const [contenido, setContenido] = useState({})
  const [redes, setRedes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [pagoMensaje, setPagoMensaje] = useState(null)

  const cart = useCart()
  const auth = useAuth()
  const stripe = useStripeCheckout({
    items: cart.items,
    usuario: auth.usuario,
    onError: setPagoMensaje,
  })

  const pagosStripe = formasPago.filter((fp) => fp.esStripe)
  const pagosManuales = formasPago.filter((fp) => !fp.esStripe)

  useEffect(() => {
    fetchCatalogo()
      .then((data) => {
        setProductos(data.productos)
        setCursos(data.cursos)
        setFormasPago(data.formasPago)
        setCategorias(data.categorias)
        setGaleria(data.galeria)
        setContenido(data.contenido)
        setRedes(data.redes)
      })
      .catch((err) =>
        setError(
          err?.message
            ? `No se pudo cargar el catálogo: ${err.message}`
            : 'No se pudo cargar el catálogo. Verifica que el backend esté activo.',
        ),
      )
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pago = params.get('pago')
    const sessionId = params.get('session_id')

    if (pago === 'cancelado') {
      setPagoMensaje('Pago cancelado. Tu carrito sigue disponible.')
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    if (pago === 'exitoso' && sessionId) {
      fetchPagoEstado(sessionId)
        .then((data) => {
          setPagoMensaje(
            `¡Pago confirmado! Total: $${Number(data.pago.total).toLocaleString('es-CO')} COP. Gracias por tu compra en AINÉ.`,
          )
          cart.vaciar()
        })
        .catch(() => {
          setPagoMensaje('Pago recibido. Te contactaremos para confirmar tu pedido.')
          cart.vaciar()
        })
        .finally(() => {
          window.history.replaceState({}, '', window.location.pathname)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function agregarProducto(p) {
    cart.agregar({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      categoria: p.categoria,
      tipo: 'producto',
    })
  }

  function verDetalles(p) {
    alert(
      `Producto: ${p.nombre}\nCategoría: ${p.categoria}\nDescripción: ${p.descripcion}\nPrecio: $${p.precio.toLocaleString('es-CO')} COP`,
    )
  }

  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="min-h-full">
        <SiteHeader auth={auth} cart={cart} />

        {cart.toast && <div className="cart-toast">{cart.toast}</div>}
        {pagoMensaje && (
          <div className={`pago-toast${pagoMensaje.includes('confirmado') ? ' pago-toast-ok' : ''}`}>
            {pagoMensaje}
            <button type="button" className="pago-toast-cerrar" onClick={() => setPagoMensaje(null)}>
              ✕
            </button>
          </div>
        )}

        <AuthModal
          abierto={auth.abierto}
          vista={auth.vista}
          cargando={auth.cargando}
          error={auth.error}
          mensaje={auth.mensaje}
          onCerrar={auth.cerrar}
          onCambiarVista={auth.setVista}
          onLogin={auth.login}
          onRegistro={auth.registro}
        />

        <Carrito
          items={cart.items}
          abierto={cart.abierto}
          onCerrar={() => cart.setAbierto(false)}
          total={cart.total}
          onQuitar={cart.quitar}
          onCambiarCantidad={cart.cambiarCantidad}
          onVaciar={cart.vaciar}
          whatsapp={contenido.contacto_whatsapp}
          stripeEnabled={stripe.stripeEnabled}
          stripeCargando={stripe.cargando}
          onPagarStripe={stripe.iniciarPago}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                contenido={contenido}
                galeria={galeria}
                productos={productos}
                categorias={categorias}
                cursos={cursos}
                cargando={cargando}
                error={error}
                auth={auth}
                cart={cart}
                stripe={stripe}
                pagosStripe={pagosStripe}
                pagosManuales={pagosManuales}
                onAgregarProducto={agregarProducto}
                onVerDetalles={verDetalles}
                onAbrirLogin={() => auth.abrir('login')}
                onPagoMensaje={setPagoMensaje}
              />
            }
          />
          <Route
            path="/cursos"
            element={
              <CursosPage
                cursos={cursos}
                contenido={contenido}
                cargando={cargando}
                usuario={auth.usuario}
              />
            }
          />
        </Routes>

        <footer className="site-footer">
          <h3 className="font-semibold">{contenido.footer_titulo ?? 'Contáctanos'}</h3>
          {contenido.footer_whatsapp_url && (
            <span className="contactanos">
              WhatsApp:{' '}
              <a className="underline" href={contenido.footer_whatsapp_url} target="_blank" rel="noreferrer">
                {contenido.footer_whatsapp_texto ?? contenido.contacto_whatsapp}
              </a>
            </span>
          )}
          {contenido.footer_copy && <p className="footer-copy">{contenido.footer_copy}</p>}
        </footer>

        <aside className="social-float" aria-label="Redes sociales">
          {redes.map((red) => (
            <a key={red.id} href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}>
              <img src={red.icono} alt="" />
            </a>
          ))}
        </aside>

        <PWABadge />
      </div>
    </BrowserRouter>
  )
}

export default App
