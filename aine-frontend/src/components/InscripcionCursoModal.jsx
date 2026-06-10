import { useEffect, useState } from 'react'
import { crearInscripcionCurso, fetchFechasCurso } from '../services/api.js'

function extraerFechaLocal(fecha) {
  const texto = String(fecha ?? '')
  const soloDia = texto.includes('T') ? texto.split('T')[0] : texto.slice(0, 10)
  const [anio, mes, dia] = soloDia.split('-').map(Number)
  if (!anio || !mes || !dia) return null
  return new Date(anio, mes - 1, dia)
}

function formatearFecha(fecha, hora) {
  const d = extraerFechaLocal(fecha)
  if (!d || Number.isNaN(d.getTime())) {
    return `Fecha por confirmar · ${hora}`
  }
  const texto = d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${texto} · ${hora}`
}

export default function InscripcionCursoModal({ curso, abierto, onCerrar, usuario }) {
  const [nombreApellido, setNombreApellido] = useState(usuario?.nombre ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [whatsapp, setWhatsapp] = useState(usuario?.telefono ?? '')
  const [fechaId, setFechaId] = useState('')
  const [fechas, setFechas] = useState([])
  const [cargandoFechas, setCargandoFechas] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)

  useEffect(() => {
    if (!abierto || !curso) return undefined

    setNombreApellido(usuario?.nombre ?? '')
    setEmail(usuario?.email ?? '')
    setWhatsapp(usuario?.telefono ?? '')
    setFechaId('')
    setError(null)
    setExito(null)
    setCargandoFechas(true)

    fetchFechasCurso(curso.id)
      .then((data) => setFechas(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargandoFechas(false))

    return undefined
  }, [abierto, curso, usuario])

  if (!abierto || !curso) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    setExito(null)

    try {
      await crearInscripcionCurso({
        cursoId: curso.id,
        fechaId: Number(fechaId),
        nombreApellido,
        email,
        whatsapp,
      })
      setExito('¡Inscripción enviada! Te contactaremos pronto para confirmar tu cupo.')
      setTimeout(onCerrar, 2200)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <button type="button" className="auth-overlay" onClick={onCerrar} aria-label="Cerrar" />
      <dialog className="inscripcion-modal" open aria-labelledby="inscripcion-titulo">
        <header className="inscripcion-modal-header">
          <div>
            <p className="inscripcion-modal-eyebrow">Inscripción al curso</p>
            <h2 id="inscripcion-titulo">{curso.titulo}</h2>
          </div>
          <button type="button" className="auth-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </header>

        <form className="inscripcion-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Nombre y apellido
            <input
              type="text"
              value={nombreApellido}
              onChange={(e) => setNombreApellido(e.target.value)}
              placeholder="Ej. María López"
              required
              minLength={3}
              disabled={enviando}
            />
          </label>

          <label className="auth-field">
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              disabled={enviando}
            />
          </label>

          <label className="auth-field">
            WhatsApp
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="300 123 4567"
              required
              minLength={10}
              disabled={enviando}
            />
          </label>

          <fieldset className="inscripcion-fechas">
            <legend>Fechas y cupos disponibles</legend>
            {cargandoFechas && <p className="inscripcion-hint">Cargando fechas...</p>}
            {!cargandoFechas && fechas.length === 0 && (
              <p className="inscripcion-hint">No hay fechas abiertas por ahora. Escríbenos por WhatsApp.</p>
            )}
            {fechas.map((f) => (
              <label key={f.id} className={`inscripcion-fecha-opcion${fechaId === String(f.id) ? ' seleccionada' : ''}`}>
                <input
                  type="radio"
                  name="fechaCurso"
                  value={f.id}
                  checked={fechaId === String(f.id)}
                  onChange={() => setFechaId(String(f.id))}
                  disabled={enviando}
                  required={fechas.length > 0}
                />
                <span className="inscripcion-fecha-texto">{formatearFecha(f.fecha, f.hora)}</span>
                <span className="inscripcion-cupos">
                  {f.cuposDisponibles}{' '}
                  {f.cuposDisponibles === 1 ? 'cupo disponible' : 'cupos disponibles'}
                </span>
              </label>
            ))}
          </fieldset>

          {error && <p className="auth-error">{error}</p>}
          {exito && <p className="auth-success">{exito}</p>}

          <button
            type="submit"
            className="btn auth-submit"
            disabled={enviando || cargandoFechas || fechas.length === 0}
          >
            {enviando ? 'Enviando...' : 'Confirmar inscripción'}
          </button>
        </form>
      </dialog>
    </>
  )
}
