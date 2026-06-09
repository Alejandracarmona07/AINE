import { useCallback, useEffect, useState } from 'react'
import { crearStripeCheckout, fetchPagosConfig } from '../services/api.js'

export function useStripeCheckout({ items, usuario, onError }) {
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    fetchPagosConfig()
      .then((cfg) => setStripeEnabled(Boolean(cfg.stripeEnabled)))
      .catch(() => setStripeEnabled(false))
  }, [])

  const iniciarPago = useCallback(async () => {
    if (!items.length) {
      onError?.('Agrega productos al carrito antes de pagar.')
      return
    }

    setCargando(true)
    try {
      const { url } = await crearStripeCheckout({
        items: items.map((item) => ({
          tipo: item.tipo,
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
        })),
        email: usuario?.email,
        usuarioId: usuario?.id,
      })
      if (url) window.location.href = url
      else onError?.('No se recibió la URL de pago.')
    } catch (err) {
      onError?.(err.message)
    } finally {
      setCargando(false)
    }
  }, [items, usuario, onError])

  return { stripeEnabled, cargando, iniciarPago }
}
