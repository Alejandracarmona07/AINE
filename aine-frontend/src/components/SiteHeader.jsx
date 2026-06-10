import { Link } from 'react-router-dom'

export default function SiteHeader({ auth, cart }) {
  return (
    <header className="site-header">
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        <h1 className="text-xl font-semibold" style={{ margin: 0, flexShrink: 0 }}>
          <Link to="/" className="site-logo-link">
            Tienda Virtual <strong>AINÉ</strong>
          </Link>
        </h1>

        <nav className="flex items-center gap-1">
          <Link className="nav-link" to="/#productos">
            Productos
          </Link>
          <Link className="nav-link" to="/cursos">
            Cursos
          </Link>
          <Link className="nav-link" to="/#blog">
            Tips
          </Link>
          <Link className="nav-link" to="/#pagos">
            Pagos
          </Link>
        </nav>

        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {auth.usuario ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#7a1a3a' }}>
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
          {auth.usuario && (
            <button
              type="button"
              className="carrito-btn"
              onClick={() => cart.setAbierto(true)}
              aria-label={`Carrito, ${cart.cantidadTotal} artículos`}
            >
              🛒
              {cart.cantidadTotal > 0 && <span className="carrito-badge">{cart.cantidadTotal}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
