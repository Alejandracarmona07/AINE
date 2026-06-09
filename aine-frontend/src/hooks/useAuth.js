import { useCallback, useEffect, useState } from 'react'
import { loginUsuario, registrarUsuario } from '../services/api.js'

const STORAGE_KEY = 'aine_usuario'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [usuario, setUsuario] = useState(readStoredUser)
  const [abierto, setAbierto] = useState(false)
  const [vista, setVista] = useState('login')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    if (usuario) localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
    else localStorage.removeItem(STORAGE_KEY)
  }, [usuario])

  const abrir = useCallback((modo = 'login') => {
    setVista(modo)
    setError(null)
    setMensaje(null)
    setAbierto(true)
  }, [])

  const cerrar = useCallback(() => {
    setAbierto(false)
    setError(null)
    setMensaje(null)
    setCargando(false)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setCargando(true)
    setError(null)
    setMensaje(null)
    try {
      const data = await loginUsuario({ email, password })
      setUsuario(data.usuario)
      setMensaje(`¡Bienvenida, ${data.usuario.nombre}!`)
      setTimeout(cerrar, 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [cerrar])

  const registro = useCallback(async ({ nombre, email, password, telefono }) => {
    setCargando(true)
    setError(null)
    setMensaje(null)
    try {
      const data = await registrarUsuario({ nombre, email, password, telefono })
      setUsuario(data.usuario)
      setMensaje('Cuenta creada correctamente')
      setTimeout(cerrar, 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [cerrar])

  const logout = useCallback(() => {
    setUsuario(null)
    setMensaje(null)
    setError(null)
  }, [])

  return {
    usuario,
    abierto,
    vista,
    cargando,
    error,
    mensaje,
    abrir,
    cerrar,
    setVista,
    login,
    registro,
    logout,
  }
}
