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
      })
      .catch(() => setError('No se pudo cargar el catálogo. Verifica que el backend esté activo.'))
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
      />

      <main>
        <section className="banner" id="comprar">
          <div className="banner-content">
            <p className="banner-tag">Belleza · Maquillaje · Cursos</p>
            <h2 className="banner-title">Consiente tu piel con AINÉ</h2>
            <a href="#productos" className="btn banner-btn">
              Ver catálogo
            </a>
          </div>
        </section>

        <section>
          <h2>¿Quiénes somos?</h2>
          <p className="text-base intro-text">
            En nuestra tienda virtual contamos con variedad, precios especiales, productos nacionales e
            internacionales. Tenemos maquillaje para todos los gustos y necesidades. ¡Consiéntete!
          </p>
        </section>

        <section className="galeria-section">
          <h2>Inspiración & looks</h2>
          <p className="centrado galeria-sub">Descubre combinaciones y tendencias de nuestra comunidad AINÉ</p>
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
            <h2>Aprende Maquillaje con AINÉ</h2>
            <p>Descubre técnicas, tendencias y tips para resaltar tu belleza como toda una diosa</p>
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
          <h2>Formas de pago</h2>
          <p className="centrado pagos-sub">Elige la opción que más te convenga. Pagos seguros y confirmación rápida.</p>
          <div className="pagos-grid">
            {formasPago.map((fp) => (
              <article key={fp.id} className="pago-card">
                <img src={fp.icono} alt={fp.nombre} className="pago-icono" />
                <h3>{fp.nombre}</h3>
                <p>{fp.descripcion}</p>
              </article>
            ))}
          </div>
          <p className="pagos-nota">
            ¿Dudas con tu pago? Escríbenos por{' '}
            <a href="https://wa.me/573112599598" target="_blank" rel="noreferrer">
              WhatsApp
            </a>{' '}
            y te ayudamos al instante.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <h3 className="font-semibold">Contáctanos</h3>
        <span className="contactanos">
          WhatsApp:{' '}
          <a className="underline" href="https://wa.me/573112599598" target="_blank" rel="noreferrer">
            311 259 9598
          </a>
        </span>
        <p className="footer-copy">© AINÉ — Maquillaje, belleza y cursos</p>
      </footer>

      <aside className="social-float" aria-label="Redes sociales">
        <a
          href="https://www.instagram.com/aleja.duque18?igsh=ZjV3M3oxZnA1aHp3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src="/images/social/instagram.png" alt="" />
        </a>
        <a
          href="https://www.facebook.com/share/16FZK6FQax/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <img src="/images/social/facebook.png" alt="" />
        </a>
        <a
          href="https://wa.me/573112599598"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <img src="/images/social/whatsapp.png" alt="" />
        </a>
      </aside>

      <PWABadge />
    </div>
  )
}

export default App
