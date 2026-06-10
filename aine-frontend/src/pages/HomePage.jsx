import { Link } from 'react-router-dom'
import BlogComunidad from '../components/BlogComunidad.jsx'
import CarruselHorizontal from '../components/CarruselHorizontal.jsx'

const QUIENES_SOMOS_TEXTO =
  'En nuestra tienda virtual contamos con variedad, precios especiales, productos nacionales e internacionales y también contamos con tips gratis y cursos para que aprendas a usar nuestros productos y a verte radiante. Tenemos maquillaje para todos los gustos y tonos. ¡Consiéntete!'

function textoQuienesSomos(contenido) {
  const api = contenido.quienes_somos_texto?.trim()
  if (api?.includes('tips gratis')) return api
  return QUIENES_SOMOS_TEXTO
}

export default function HomePage({
  contenido,
  galeria,
  productos,
  categorias,
  cursos,
  cargando,
  error,
  auth,
  cart,
  stripe,
  pagosStripe,
  pagosManuales,
  onAgregarProducto,
  onVerDetalles,
  onAbrirLogin,
  onPagoMensaje,
}) {
  return (
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

      {(contenido.quienes_somos_texto || QUIENES_SOMOS_TEXTO) && (
        <section className="quienes-section" aria-labelledby="quienes-titulo">
          <div className="quienes-card">
            <div className="quienes-intro">
              <span className="quienes-eyebrow">Nuestra esencia</span>
              <h2 id="quienes-titulo">{contenido.quienes_somos_titulo ?? '¿Quiénes somos?'}</h2>
              <p className="quienes-texto">{textoQuienesSomos(contenido)}</p>
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
                <span className="quienes-icon" aria-hidden="true">📚</span>
                <div>
                  <strong>Tips y cursos</strong>
                  <span>Aprende gratis y luce radiante</span>
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
        onAbrirLogin={onAbrirLogin}
      />

      <section className="cursos-cta-section">
        <div className="cursos-cta-card">
          <span className="cursos-cta-badge">Cursos de maquillaje</span>
          <h2>{contenido.cursos_titulo ?? 'Aprende Maquillaje con AINÉ'}</h2>
          <p>
            {contenido.cursos_subtitulo ??
              'Descubre técnicas, tendencias y tips para resaltar tu belleza como toda una diosa.'}
          </p>
          {!cargando && cursos.length > 0 && (
            <p className="cursos-cta-count">{cursos.length} cursos disponibles</p>
          )}
          <Link to="/cursos" className="btn cursos-cta-btn">
            Ver todos los cursos
          </Link>
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
                <CarruselHorizontal id={`categoria-${cat.nombre}`} ariaLabel={`Catálogo ${cat.nombre}`}>
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
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => onAgregarProducto(p)}
                          type="button"
                        >
                          Agregar
                        </button>
                        <button className="btn btn-sm" onClick={() => onVerDetalles(p)} type="button">
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
            <h3 className="pagos-bloque-titulo">{contenido.pagos_stripe_titulo ?? 'Pago en línea seguro'}</h3>
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
                          onPagoMensaje('Agrega productos al carrito y vuelve aquí para pagar.')
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
            <h3 className="pagos-bloque-titulo">{contenido.pagos_manual_titulo ?? 'Otros medios de pago'}</h3>
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
  )
}
