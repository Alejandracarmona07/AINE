import { apiUrl } from '../config/api.js'

async function apiGet(path) {
  let res
  try {
    res = await fetch(apiUrl(path))
  } catch {
    throw new Error(
      'No se pudo conectar con el backend. Inicia el servidor: cd aine-backend && npm run dev',
    )
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message ?? `Error al consultar ${path}`)
  }
  return data
}

async function apiPost(path, body) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `Error al enviar ${path}`)
  return data
}

export async function fetchCatalogo() {
  const data = await apiGet('/api/catalogo')

  return {
    productos: data.productos ?? [],
    cursos: data.cursos ?? [],
    formasPago: data.formasPago ?? [],
    categorias: data.categorias ?? [],
    galeria: data.galeria ?? [],
    contenido: data.contenido ?? {},
    redes: data.redes ?? [],
  }
}

export function loginUsuario(credentials) {
  return apiPost('/api/auth/login', credentials)
}

export function registrarUsuario(payload) {
  return apiPost('/api/auth/registro', payload)
}

export async function fetchBlogTips() {
  const data = await apiGet('/api/blog/tips')
  return data.tips ?? []
}

export async function fetchBlogComentarios({ tipo, tipId, productoId } = {}) {
  const params = new URLSearchParams()
  if (tipo) params.set('tipo', tipo)
  if (tipId != null) params.set('tipId', String(tipId))
  if (productoId != null) params.set('productoId', String(productoId))
  const qs = params.toString()
  const data = await apiGet(`/api/blog/comentarios${qs ? `?${qs}` : ''}`)
  return data.comentarios ?? []
}

export async function crearComentarioBlog(payload) {
  const data = await apiPost('/api/blog/comentarios', payload)
  return data.comentario
}

export function fetchPagosConfig() {
  return apiGet('/api/pagos/config')
}

export function crearStripeCheckout(payload) {
  return apiPost('/api/pagos/checkout', payload)
}

export function fetchPagoEstado(sessionId) {
  return apiGet(`/api/pagos/estado/${encodeURIComponent(sessionId)}`)
}

export async function fetchFechasCurso(cursoId) {
  const data = await apiGet(`/api/cursos/${cursoId}/fechas`)
  return data.fechas ?? []
}

export function crearInscripcionCurso(payload) {
  return apiPost('/api/cursos/inscripciones', payload)
}
