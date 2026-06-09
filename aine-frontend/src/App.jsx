import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal.jsx'
import Carrito from './components/Carrito.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useCart } from './hooks/useCart.js'
import PWABadge from './PWABadge.jsx'
import { fetchCatalogo } from './services/api.js'

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

  const cart = useCart()
  const auth = useAuth()

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
        <h1 className="text-xl font-semibold">
          Tienda Virtual <strong>AINÉ</strong>
        </h1>
        <nav className="flex flex-wrap gap-2 items-center">
          <a className="nav-link" href="#productos">
            Productos
          </a>
          <a className="nav-link" href="#cursos">
            Cursos
          </a>
          <a className="nav-link" href="#pagos">
            Pagos
          </a>
          {auth.usuario ? (
            <div className="auth-header-user">
              <span>Hola, {auth.usuario.nombre}</span>
              <button type="button" className="btn btn-sm btn-secondary" onClick={auth.logout}>
                Salir
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="nav-link nav-link-btn" onClick={() => auth.abrir('login')}>
                Iniciar sesión
              </button>
              <button type="button" className="nav-link nav-link-btn" onClick={() => auth.abrir('registro')}>
                Registrarse
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
        </nav>
      </header>

      {cart.toast && <div className="cart-toast">{cart.toast}</div>}

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
          <section>
            <h2>{contenido.quienes_somos_titulo ?? '¿Quiénes somos?'}</h2>
            <p className="text-base intro-text">{contenido.quienes_somos_texto}</p>
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

        <section className="auth-section">
          <div className="auth-card">
            <h2>Únete a AINÉ</h2>
            {auth.usuario ? (
              <p>
                Ya estás conectada como <strong>{auth.usuario.nombre}</strong>. Explora el catálogo y arma tu pedido.
              </p>
            ) : (
              <p>Crea tu cuenta para guardar favoritos y recibir ofertas exclusivas.</p>
            )}
            <div className="auth-actions">
              {auth.usuario ? (
                <button type="button" className="btn btn-outline" onClick={auth.logout}>
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <button type="button" className="btn" onClick={() => auth.abrir('registro')}>
                    Registrarse
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => auth.abrir('login')}>
                    Iniciar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <div id="productos">
          {cargando && <p className="centrado">Cargando productos...</p>}
          {error && <p className="centrado error-msg">{error}</p>}

          {categorias.map((cat) => {
            const items = productos.filter((p) => p.categoria === cat.nombre)
            if (!items.length && !cargando) return null
            return (
              <article key={cat.id} className="categoria-section">
                <h2>{cat.nombre}</h2>
                {cat.descripcion && <p className="centrado">{cat.descripcion}</p>}
                <div className="categoria" id={`categoria-${cat.nombre}`}>
                  {items.map((p) => (
                    <div key={p.id} className="producto">
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
                </div>
              </article>
            )
          })}
        </div>

        <section id="pagos" className="pagos-section">
          <h2>{contenido.pagos_titulo ?? 'Formas de pago'}</h2>
          {contenido.pagos_subtitulo && <p className="centrado pagos-sub">{contenido.pagos_subtitulo}</p>}
          <div className="pagos-grid">
            {formasPago.map((fp) => (
              <article key={fp.id} className="pago-card">
                <img src={fp.icono} alt={fp.nombre} className="pago-icono" />
                <h3>{fp.nombre}</h3>
                <p>{fp.descripcion}</p>
              </article>
            ))}
          </div>
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
