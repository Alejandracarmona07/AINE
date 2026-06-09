import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal.jsx'
import BlogComunidad from './components/BlogComunidad.jsx'
import CarruselHorizontal from './components/CarruselHorizontal.jsx'
import Carrito from './components/Carrito.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useCart } from './hooks/useCart.js'
import { useStripeCheckout } from './hooks/useStripeCheckout.js'
import PWABadge from './PWABadge.jsx'
import { fetchCatalogo, fetchPagoEstado } from './services/api.js'

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
    // Solo al volver de Stripe (query ?pago=)
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

  function agregarCurso(c) {
    cart.agregar({
      id: c.id,
      nombre: c.titulo,
      precio: c.precio,
      imagen: c.imagen,
      categoria: 'Curso',
      tipo: 'curso',
    })
  }

  function verDetalles(p) {
    alert(
      `Producto: ${p.nombre}\nCategoría: ${p.categoria}\nDescripción: ${p.descripcion}\nPrecio: $${p.precio.toLocaleString('es-CO')} COP`,
    )
  }

  return (
    <div className="min-h-full">
      <header className="site-header">
  <div style={{maxWidth:'var(--max-width)', margin:'0 auto', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', height:'64px'}}>

    {/* Logo — izquierda */}
    <h1 className="text-xl font-semibold" style={{margin:0, flexShrink:0}}>
      Tienda Virtual <strong>AINÉ</strong>
    </h1>

    {/* Nav — centro */}
    <nav className="flex items-center gap-1">
      <a className="nav-link" href="#productos">Productos</a>
      <a className="nav-link" href="#cursos">Cursos</a>
      <a className="nav-link" href="#blog">Tips</a>
      <a className="nav-link" href="#pagos">Pagos</a>
    </nav>

    {/* Auth + carrito — derecha */}
    <div className="flex items-center gap-2" style={{flexShrink:0}}>
      {auth.usuario ? (
        <>
          <span style={{fontSize:'0.85rem', color:'#7a1a3a'}}>
            Hola, <strong>{auth.usuario.nombre}</strong>
          </span>
          <button type="button" className="btn btn-sm btn-secondary" onClick={auth.logout}>
            Salir
          </button>
        </>
      ) : (
        <>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => auth.abrir('login')}>
            Iniciar sesión
          </button>
          <button type="button" className="btn btn-sm" onClick={() => auth.abrir('registro')}>
            ✨ Registrarse
          </button>
        </>
      )}
      <button
        type="button"
        className="carrito-btn"
        onClick={() => cart.setAbierto(true)}
        aria-label={`Carrito, ${cart.cantidadTotal} artículos`}
      >
        🛒
        {cart.cantidadTotal > 0 && <span className="carrito-badge">{cart.cantidadTotal}</span>}
      </button>
    </div>

  </div>
</header>

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

      <main>
        <section className="banner" id="comprar">
          <div className="banner-content">
            {contenido.banner_tag && <p className="banner-tag">{contenido.banner_tag}</p>}
            {contenido.banner_titulo && <h2 className="banner-title">{contenido.banner_titulo}</h2>}
            <a href="#productos" className="btn banner-btn">
              {contenido.banner_btn ?? 'Ver catálogo'}
            </a>
          </div>
        </section>

        {contenido.quienes_somos_texto && (
          <section className="quienes-section" aria-labelledby="quienes-titulo">
            <div className="quienes-card">
              <div className="quienes-intro">
                <span className="quienes-eyebrow">Nuestra esencia</span>
                <h2 id="quienes-titulo">{contenido.quienes_somos_titulo ?? '¿Quiénes somos?'}</h2>
                <p className="quienes-texto">{contenido.quienes_somos_texto}</p>
              </div>

              <ul className="quienes-highlights">
                <li>
                  <span className="quienes-icon" aria-hidden="true">✨</span>
                  <div>
                    <strong>Variedad</strong>
                    <span>Productos para cada estilo y ocasión</span>
                  </div>
                </li>
                <li>
                  <span className="quienes-icon" aria-hidden="true">💗</span>
                  <div>
                    <strong>Precios especiales</strong>
                    <span>Belleza accesible sin renunciar a calidad</span>
                  </div>
                </li>
                <li>
                  <span className="quienes-icon" aria-hidden="true">🌎</span>
                  <div>
                    <strong>Nacional e internacional</strong>
                    <span>Marcas que amas, en un solo lugar</span>
                  </div>
                </li>
                <li>
                  <span className="quienes-icon" aria-hidden="true">💄</span>
                  <div>
                    <strong>Para ti</strong>
                    <span>Maquillaje pensado para todos los gustos</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        )}

        <section className="galeria-section">
          <h2>{contenido.galeria_titulo ?? 'Inspiración & looks'}</h2>
          {contenido.galeria_subtitulo && <p className="centrado galeria-sub">{contenido.galeria_subtitulo}</p>}
          <div className="galeria-grid">
            {galeria.map((item) => (
              <figure key={item.id} className="galeria-item">
                <img src={item.imagen} alt={item.titulo} loading="lazy" />
                <figcaption>{item.titulo}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <BlogComunidad
          contenido={contenido}
          productos={productos}
          usuario={auth.usuario}
          onAbrirLogin={() => auth.abrir('login')}
        />

        <section id="cursos" className="cursos-section">
          <div className="section-head">
            <h2>{contenido.cursos_titulo ?? 'Cursos'}</h2>
            {contenido.cursos_subtitulo && <p>{contenido.cursos_subtitulo}</p>}
          </div>
          {cargando && <p className="centrado">Cargando cursos...</p>}
          <div className="cursos-grid">
            {cursos.map((c) => (
              <article key={c.id} className="curso-card">
                <div className="curso-img-wrap">
                  <img src={c.imagen} alt={c.titulo} loading="lazy" />
                  <span className="curso-badge">Curso</span>
                </div>
                <div className="curso-body">
                  <h3>{c.titulo}</h3>
                  <p>{c.descripcion}</p>
                  <div className="curso-footer">
                    <span className="curso-precio">${c.precio.toLocaleString('es-CO')}</span>
                    <div className="producto-actions">
                      <button className="btn btn-sm btn-secondary" type="button" onClick={() => agregarCurso(c)}>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        

        <div id="productos" className="productos-catalogo">
          {cargando && <p className="centrado">Cargando productos...</p>}
          {error && <p className="centrado error-msg">{error}</p>}

          {[...categorias]
            .sort((a, b) => {
              const orden = ['Bases', 'Labiales', 'Pestañinas', 'Rubores']
              return orden.indexOf(a.nombre) - orden.indexOf(b.nombre)
            })
            .map((cat) => {
            const items = productos.filter((p) => p.categoria === cat.nombre)
            if (!items.length && !cargando) return null
            return (
              <article key={cat.id} className="categoria-section">
                <div className="categoria-head">
                  <div>
                    <h2>{cat.nombre}</h2>
                    {cat.descripcion && <p className="categoria-desc">{cat.descripcion}</p>}
                  </div>
                </div>
                <CarruselHorizontal
                  id={`categoria-${cat.nombre}`}
                  ariaLabel={`Catálogo ${cat.nombre}`}
                >
                  {items.map((p) => (
                    <div key={p.id} className="producto producto-carrusel">
                      <div className="producto-img-wrap">
                        <img src={p.imagen} alt={p.nombre} loading="lazy" />
                        <span className="producto-cat">{p.categoria}</span>
                      </div>
                      <h4>{p.nombre}</h4>
                      <p className="producto-desc">{p.descripcion}</p>
                      <p className="producto-precio">${p.precio.toLocaleString('es-CO')}</p>
                      <div className="producto-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => agregarProducto(p)} type="button">
                          Agregar
                        </button>
                        <button className="btn btn-sm" onClick={() => verDetalles(p)} type="button">
                          Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </CarruselHorizontal>
              </article>
            )
          })}
        </div>

        <section id="pagos" className="pagos-section">
          <h2>{contenido.pagos_titulo ?? 'Formas de pago'}</h2>
          {contenido.pagos_subtitulo && <p className="centrado pagos-sub">{contenido.pagos_subtitulo}</p>}

          {pagosStripe.length > 0 && (
            <div className="pagos-bloque">
              <h3 className="pagos-bloque-titulo">
                {contenido.pagos_stripe_titulo ?? 'Pago en línea seguro'}
              </h3>
              {contenido.pagos_stripe_subtitulo && (
                <p className="pagos-bloque-sub">{contenido.pagos_stripe_subtitulo}</p>
              )}
              <div className="pagos-grid pagos-grid-stripe">
                {pagosStripe.map((fp) => (
                  <article key={fp.id} className="pago-card pago-card-stripe">
                    <img src={fp.icono} alt={fp.nombre} className="pago-icono" />
                    <h3>{fp.nombre}</h3>
                    <p>{fp.descripcion}</p>
                    <span className="pago-stripe-badge">Stripe</span>
                    {stripe.stripeEnabled ? (
                      <button
                        type="button"
                        className="btn btn-sm pago-stripe-btn"
                        onClick={() => {
                          if (!cart.items.length) {
                            setPagoMensaje('Agrega productos al carrito y vuelve aquí para pagar.')
                            cart.setAbierto(true)
                            return
                          }
                          stripe.iniciarPago()
                        }}
                        disabled={stripe.cargando}
                      >
                        {stripe.cargando ? 'Abriendo...' : 'Pagar ahora'}
                      </button>
                    ) : (
                      <p className="pago-stripe-pendiente">Configura Stripe en el backend</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {pagosManuales.length > 0 && (
            <div className="pagos-bloque">
              <h3 className="pagos-bloque-titulo">
                {contenido.pagos_manual_titulo ?? 'Otros medios de pago'}
              </h3>
              {contenido.pagos_manual_subtitulo && (
                <p className="pagos-bloque-sub">{contenido.pagos_manual_subtitulo}</p>
              )}
              <div className="pagos-grid">
                {pagosManuales.map((fp) => (
                  <article key={fp.id} className="pago-card">
                    <img src={fp.icono} alt={fp.nombre} className="pago-icono" />
                    <h3>{fp.nombre}</h3>
                    <p>{fp.descripcion}</p>
                    {contenido.footer_whatsapp_url && (
                      <a
                        className="btn btn-sm btn-secondary pago-wa-btn"
                        href={contenido.footer_whatsapp_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Coordinar por WhatsApp
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
          {contenido.pagos_nota && (
            <p className="pagos-nota">
              {contenido.pagos_nota.includes('WhatsApp') ? (
                <>
                  {contenido.pagos_nota.split('WhatsApp')[0]}
                  {contenido.footer_whatsapp_url ? (
                    <a href={contenido.footer_whatsapp_url} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  ) : (
                    'WhatsApp'
                  )}
                  {contenido.pagos_nota.split('WhatsApp')[1]}
                </>
              ) : (
                contenido.pagos_nota
              )}
            </p>
          )}
        </section>
      </main>

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
          <a
            key={red.id}
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={red.nombre}
          >
            <img src={red.icono} alt="" />
          </a>
        ))}
      </aside>

      <PWABadge />
    </div>
  )
}

export default App
