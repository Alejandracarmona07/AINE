import { useCallback, useEffect, useState } from 'react'
import { crearComentarioBlog, fetchBlogComentarios, fetchBlogTips } from '../services/api.js'

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Estrellas({ valor }) {
  return (
    <span className="blog-estrellas" aria-label={`${valor} de 5 estrellas`}>
      {'★'.repeat(valor)}
      {'☆'.repeat(5 - valor)}
    </span>
  )
}

export default function BlogComunidad({ contenido, productos, usuario, onAbrirLogin }) {
  const [tab, setTab] = useState('tips')
  const [tips, setTips] = useState([])
  const [experiencias, setExperiencias] = useState([])
  const [comentariosPorTip, setComentariosPorTip] = useState({})
  const [tipAbierto, setTipAbierto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [mensajeOk, setMensajeOk] = useState(null)

  const [comentarioTip, setComentarioTip] = useState({})
  const [expForm, setExpForm] = useState({ productoId: '', calificacion: 5, contenido: '' })

  const cargarTips = useCallback(async () => {
    const data = await fetchBlogTips()
    setTips(data)
  }, [])

  const cargarExperiencias = useCallback(async () => {
    const data = await fetchBlogComentarios({ tipo: 'experiencia' })
    setExperiencias(data)
  }, [])

  const cargarComentariosTip = useCallback(async (tipId) => {
    const data = await fetchBlogComentarios({ tipo: 'tip', tipId })
    setComentariosPorTip((prev) => ({ ...prev, [tipId]: data }))
  }, [])

  useEffect(() => {
    Promise.all([cargarTips(), cargarExperiencias()])
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [cargarTips, cargarExperiencias])

  async function toggleTip(tipId) {
    if (tipAbierto === tipId) {
      setTipAbierto(null)
      return
    }
    setTipAbierto(tipId)
    if (!comentariosPorTip[tipId]) {
      try {
        await cargarComentariosTip(tipId)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  async function publicarComentarioTip(tipId) {
    if (!usuario) {
      onAbrirLogin()
      return
    }
    const contenidoTexto = comentarioTip[tipId]?.trim()
    if (!contenidoTexto || contenidoTexto.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres.')
      return
    }

    setEnviando(true)
    setError(null)
    setMensajeOk(null)
    try {
      const nuevo = await crearComentarioBlog({
        tipo: 'tip',
        tipId,
        usuarioId: usuario.id,
        contenido: contenidoTexto,
      })
      setComentariosPorTip((prev) => ({
        ...prev,
        [tipId]: [nuevo, ...(prev[tipId] ?? [])],
      }))
      setTips((prev) =>
        prev.map((t) => (t.id === tipId ? { ...t, comentariosCount: t.comentariosCount + 1 } : t)),
      )
      setComentarioTip((prev) => ({ ...prev, [tipId]: '' }))
      setMensajeOk('¡Comentario publicado!')
      setTimeout(() => setMensajeOk(null), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  async function publicarExperiencia(e) {
    e.preventDefault()
    if (!usuario) {
      onAbrirLogin()
      return
    }
    if (!expForm.productoId) {
      setError('Selecciona un producto.')
      return
    }

    setEnviando(true)
    setError(null)
    setMensajeOk(null)
    try {
      const nuevo = await crearComentarioBlog({
        tipo: 'experiencia',
        productoId: Number(expForm.productoId),
        usuarioId: usuario.id,
        contenido: expForm.contenido,
        calificacion: Number(expForm.calificacion),
      })
      setExperiencias((prev) => [nuevo, ...prev])
      setExpForm({ productoId: '', calificacion: 5, contenido: '' })
      setMensajeOk('¡Gracias por compartir tu experiencia!')
      setTimeout(() => setMensajeOk(null), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="blog" className="blog-section">
      <div className="section-head">
        <h2>{contenido.blog_titulo ?? 'Tips & Comunidad AINÉ'}</h2>
        {contenido.blog_subtitulo && <p className="blog-sub">{contenido.blog_subtitulo}</p>}
      </div>

      <div className="blog-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`blog-tab${tab === 'tips' ? ' activa' : ''}`}
          aria-selected={tab === 'tips'}
          onClick={() => setTab('tips')}
        >
          {contenido.blog_tips_tab ?? 'Tips gratis'}
        </button>
        <button
          type="button"
          role="tab"
          className={`blog-tab${tab === 'experiencias' ? ' activa' : ''}`}
          aria-selected={tab === 'experiencias'}
          onClick={() => setTab('experiencias')}
        >
          {contenido.blog_exp_tab ?? 'Experiencias'}
        </button>
      </div>

      {cargando && <p className="centrado">Cargando comunidad...</p>}
      {error && <p className="centrado error-msg">{error}</p>}
      {mensajeOk && <p className="centrado blog-ok">{mensajeOk}</p>}

      {!usuario && !cargando && (
        <p className="blog-login-hint">
          {contenido.blog_comentar_cta ?? 'Inicia sesión para comentar y compartir tu experiencia.'}{' '}
          <button type="button" className="blog-link-btn" onClick={onAbrirLogin}>
            Iniciar sesión
          </button>
        </p>
      )}

      {tab === 'tips' && !cargando && (
        <div className="blog-tips-grid">
          {tips.map((tip) => {
            const abierto = tipAbierto === tip.id
            const comentarios = comentariosPorTip[tip.id] ?? []
            return (
              <article key={tip.id} className={`blog-tip-card${abierto ? ' abierto' : ''}`}>
                <div className="blog-tip-media">
                  {tip.imagen && <img src={tip.imagen} alt="" loading="lazy" />}
                  {tip.etiqueta && <span className="blog-etiqueta">{tip.etiqueta}</span>}
                </div>
                <div className="blog-tip-body">
                  <h3>{tip.titulo}</h3>
                  <p className="blog-tip-resumen">{tip.resumen}</p>
                  {abierto && <p className="blog-tip-contenido">{tip.contenido}</p>}
                  <div className="blog-tip-actions">
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => toggleTip(tip.id)}>
                      {abierto ? 'Ocultar' : 'Leer tip'}
                    </button>
                    <span className="blog-comentarios-count">
                      {tip.comentariosCount} comentario{tip.comentariosCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {abierto && (
                    <div className="blog-comentarios">
                      <h4>Comentarios</h4>
                      {comentarios.length === 0 && (
                        <p className="blog-sin-comentarios">Sé la primera en comentar este tip.</p>
                      )}
                      <ul className="blog-comentarios-lista">
                        {comentarios.map((c) => (
                          <li key={c.id}>
                            <div className="blog-comentario-meta">
                              <strong>{c.autor}</strong>
                              <time dateTime={c.createdAt}>{formatearFecha(c.createdAt)}</time>
                            </div>
                            <p>{c.contenido}</p>
                          </li>
                        ))}
                      </ul>
                      <div className="blog-form-comentario">
                        <textarea
                          rows={3}
                          placeholder={
                            usuario
                              ? '¿Qué te pareció este tip? Cuéntanos...'
                              : 'Inicia sesión para comentar'
                          }
                          value={comentarioTip[tip.id] ?? ''}
                          onChange={(e) =>
                            setComentarioTip((prev) => ({ ...prev, [tip.id]: e.target.value }))
                          }
                          disabled={!usuario || enviando}
                        />
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => publicarComentarioTip(tip.id)}
                          disabled={!usuario || enviando}
                        >
                          {enviando ? 'Publicando...' : 'Comentar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {tab === 'experiencias' && !cargando && (
        <div className="blog-exp-layout">
          <form className="blog-exp-form" onSubmit={publicarExperiencia}>
            <h3>Comparte tu experiencia</h3>
            <label className="blog-field">
              Producto
              <select
                value={expForm.productoId}
                onChange={(e) => setExpForm((f) => ({ ...f, productoId: e.target.value }))}
                disabled={!usuario || enviando}
              >
                <option value="">Selecciona un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.categoria}
                  </option>
                ))}
              </select>
            </label>
            <label className="blog-field">
              Calificación
              <select
                value={expForm.calificacion}
                onChange={(e) => setExpForm((f) => ({ ...f, calificacion: e.target.value }))}
                disabled={!usuario || enviando}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} estrella{n !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="blog-field">
              Tu experiencia
              <textarea
                rows={4}
                placeholder="¿Cómo te fue con el producto? Textura, duración, tips de aplicación..."
                value={expForm.contenido}
                onChange={(e) => setExpForm((f) => ({ ...f, contenido: e.target.value }))}
                disabled={!usuario || enviando}
                required
                minLength={10}
              />
            </label>
            <button type="submit" className="btn" disabled={!usuario || enviando}>
              {enviando ? 'Publicando...' : 'Publicar experiencia'}
            </button>
          </form>

          <div className="blog-exp-lista">
            <h3>Lo que dice la comunidad</h3>
            {experiencias.length === 0 && (
              <p className="blog-sin-comentarios">Aún no hay experiencias. ¡Sé la primera en compartir!</p>
            )}
            {experiencias.map((exp) => (
              <article key={exp.id} className="blog-exp-card">
                <div className="blog-exp-header">
                  <div>
                    <strong>{exp.autor}</strong>
                    {exp.productoNombre && <span className="blog-exp-producto">{exp.productoNombre}</span>}
                  </div>
                  <Estrellas valor={exp.calificacion ?? 5} />
                </div>
                <p>{exp.contenido}</p>
                <time dateTime={exp.createdAt}>{formatearFecha(exp.createdAt)}</time>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
