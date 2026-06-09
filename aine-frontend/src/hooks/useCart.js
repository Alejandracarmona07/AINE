import { useEffect, useState } from 'react'

const STORAGE_KEY = 'aine_carrito'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function itemKey(item) {
  return `${item.tipo}-${item.id}`
}

export function useCart() {
  const [items, setItems] = useState(readStorage)
  const [abierto, setAbierto] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    writeStorage(items)
  }, [items])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  function agregar(item) {
    setItems((prev) => {
      const key = itemKey(item)
      const existente = prev.find((i) => itemKey(i) === key)
      if (existente) {
        return prev.map((i) =>
          itemKey(i) === key ? { ...i, cantidad: i.cantidad + 1 } : i,
        )
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
    setToast(`${item.nombre} agregado al carrito`)
  }

  function quitar(id, tipo) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.tipo === tipo)))
  }

  function cambiarCantidad(id, tipo, cantidad) {
    if (cantidad < 1) {
      quitar(id, tipo)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.tipo === tipo ? { ...i, cantidad } : i)),
    )
  }

  function vaciar() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0)

  return {
    items,
    abierto,
    setAbierto,
    toast,
    agregar,
    quitar,
    cambiarCantidad,
    vaciar,
    total,
    cantidadTotal,
  }
}

export function buildWhatsAppUrl(items, total, whatsapp = '573112599598') {
  const lineas = items.map(
    (i) =>
      `• ${i.nombre} (${i.tipo === 'curso' ? 'Curso' : i.categoria}) x${i.cantidad} — $${(i.precio * i.cantidad).toLocaleString('es-CO')}`,
  )
  const mensaje = [
    '¡Hola AINÉ! Quiero realizar el siguiente pedido:',
    '',
    ...lineas,
    '',
    `*Total: $${total.toLocaleString('es-CO')} COP*`,
    '',
    '¿Cuál forma de pago prefieren?',
  ].join('\n')

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`
}
