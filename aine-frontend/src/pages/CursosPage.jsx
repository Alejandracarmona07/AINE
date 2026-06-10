import { useState } from 'react'
import { Link } from 'react-router-dom'
import InscripcionCursoModal from '../components/InscripcionCursoModal.jsx'

export default function CursosPage({ cursos, contenido, cargando, usuario }) {
  const [cursoInscripcion, setCursoInscripcion] = useState(null)

  return (
    <main className="cursos-page">
      <div className="cursos-page-head">
        <Link to="/" className="cursos-volver">
          ← Volver a la tienda
        </Link>
        <div className="section-head">
          <h1>{contenido.cursos_titulo ?? 'Aprende Maquillaje con AINÉ'}</h1>
          {contenido.cursos_subtitulo && <p>{contenido.cursos_subtitulo}</p>}
        </div>
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
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => setCursoInscripcion(c)}
                  >
                    Inscribirme
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <InscripcionCursoModal
        curso={cursoInscripcion}
        abierto={Boolean(cursoInscripcion)}
        onCerrar={() => setCursoInscripcion(null)}
        usuario={usuario}
      />
    </main>
  )
}
