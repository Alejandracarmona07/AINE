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
  const [prodData, cursoData, pagoData, catData, galData] = await Promise.all([
    apiGet('/api/productos'),
    apiGet('/api/cursos'),
    apiGet('/api/formas-pago'),
    apiGet('/api/categorias'),
    apiGet('/api/galeria'),
  ])

  return {
    productos: prodData.productos ?? [],
    cursos: cursoData.cursos ?? [],
    formasPago: pagoData.formasPago ?? [],
    categorias: catData.categorias ?? [],
    galeria: galData.galeria ?? [],
  }
}

export function loginUsuario(credentials) {
  return apiPost('/api/auth/login', credentials)
}

export function registrarUsuario(payload) {
  return apiPost('/api/auth/registro', payload)
}
