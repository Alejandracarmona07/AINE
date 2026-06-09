import { useState } from 'react'

export default function AuthModal({
  abierto,
  vista,
  cargando,
  error,
  mensaje,
  onCerrar,
  onCambiarVista,
  onLogin,
  onRegistro,
}) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')

  if (!abierto) return null

  function limpiarCampos() {
    setNombre('')
    setEmail('')
    setTelefono('')
    setPassword('')
  }

  function cambiarVista(nuevaVista) {
    limpiarCampos()
    onCambiarVista(nuevaVista)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (vista === 'login') {
      onLogin({ email, password })
      return
    }
    onRegistro({ nombre, email, password, telefono })
  }

  return (
    <>
      <button type="button" className="auth-overlay" onClick={onCerrar} aria-label="Cerrar" />
      <dialog className="auth-modal" open aria-labelledby="auth-modal-title">
        <header className="auth-modal-header">
          <h2 id="auth-modal-title">{vista === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
          <button type="button" className="auth-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </header>

        <div className="auth-tabs">
          <button
            type="button"
            className={vista === 'login' ? 'auth-tab activa' : 'auth-tab'}
            onClick={() => cambiarVista('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={vista === 'registro' ? 'auth-tab activa' : 'auth-tab'}
            onClick={() => cambiarVista('registro')}
          >
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {vista === 'registro' && (
            <label className="auth-field">
              <span>Nombre</span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          {vista === 'registro' && (
            <label className="auth-field">
              <span>Teléfono (opcional)</span>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                autoComplete="tel"
              />
            </label>
          )}

          <label className="auth-field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={vista === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {mensaje && <p className="auth-success">{mensaje}</p>}

          <button type="submit" className="btn auth-submit" disabled={cargando}>
            {cargando ? 'Procesando...' : vista === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </dialog>
    </>
  )
}
