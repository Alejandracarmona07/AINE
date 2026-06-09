import { useRef } from 'react'

export default function CarruselHorizontal({ id, ariaLabel, children }) {
  const trackRef = useRef(null)

  function desplazar(direccion) {
    const track = trackRef.current
    if (!track) return
    const tarjeta = track.querySelector('.producto-carrusel')
    const paso = tarjeta ? tarjeta.offsetWidth + 16 : 256
    track.scrollBy({ left: direccion * paso, behavior: 'smooth' })
  }

  return (
    <div className="carrusel-wrap">
      <button
        type="button"
        className="carrusel-btn carrusel-btn-izq"
        onClick={() => desplazar(-1)}
        aria-label="Ver productos anteriores"
      >
        ‹
      </button>

      <div
        ref={trackRef}
        className="categoria-carrusel"
        id={id}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>

      <button
        type="button"
        className="carrusel-btn carrusel-btn-der"
        onClick={() => desplazar(1)}
        aria-label="Ver más productos"
      >
        ›
      </button>
    </div>
  )
}
