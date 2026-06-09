import { buildWhatsAppUrl } from '../hooks/useCart.js'

export default function Carrito({
  items,
  abierto,
  onCerrar,
  total,
  onQuitar,
  onCambiarCantidad,
  onVaciar,
  whatsapp = '573112599598',
  stripeEnabled = false,
  stripeCargando = false,
  onPagarStripe,
}) {
  if (!abierto) return null

  return (
    <>
      <button type="button" className="carrito-overlay" onClick={onCerrar} aria-label="Cerrar carrito" />
      <aside className="carrito-panel" aria-label="Carrito de compras">
        <header className="carrito-header">
          <h2>Tu carrito</h2>
          <button type="button" className="carrito-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío</p>
            <button type="button" className="btn btn-sm" onClick={onCerrar}>
              Ver productos
            </button>
          </div>
        ) : (
          <>
            <ul className="carrito-lista">
              {items.map((item) => (
                <li key={`${item.tipo}-${item.id}`} className="carrito-item">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="carrito-item-info">
                    <strong>{item.nombre}</strong>
                    <span className="carrito-item-meta">
                      {item.tipo === 'curso' ? 'Curso' : item.categoria}
                    </span>
                    <span className="carrito-item-precio">
                      ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                    </span>
                    <div className="carrito-cantidad">
                      <button
                        type="button"
                        onClick={() => onCambiarCantidad(item.id, item.tipo, item.cantidad - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => onCambiarCantidad(item.id, item.tipo, item.cantidad + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="carrito-quitar"
                    onClick={() => onQuitar(item.id, item.tipo)}
                    aria-label={`Quitar ${item.nombre}`}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            <footer className="carrito-footer">
              <div className="carrito-total">
                <span>Total</span>
                <strong>${total.toLocaleString('es-CO')} COP</strong>
              </div>
              {stripeEnabled && (
                <button
                  type="button"
                  className="btn carrito-stripe"
                  onClick={onPagarStripe}
                  disabled={stripeCargando}
                >
                  {stripeCargando ? 'Redirigiendo a Stripe...' : '💳 Pagar con Stripe'}
                </button>
              )}
              <a
                className="btn carrito-wa"
                href={buildWhatsAppUrl(items, total, whatsapp)}
                target="_blank"
                rel="noreferrer"
              >
                Pedir por WhatsApp
              </a>
              <button type="button" className="btn btn-outline carrito-vaciar" onClick={onVaciar}>
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
