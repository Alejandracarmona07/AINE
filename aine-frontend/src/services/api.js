import { apiUrl } from '../config/api.js'

async function apiGet(path) {
  const res = await fetch(apiUrl(path))
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? `Error al consultar ${path}`)
  }
  return res.json()
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
  }
}

export function loginUsuario(credentials) {
  return apiPost('/api/auth/login', credentials)
}

export function registrarUsuario(payload) {
  return apiPost('/api/auth/registro', payload)
}
