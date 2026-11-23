import { useEffect, useRef, useState } from 'react'
import { catalog } from './catalog'

const storageKey = 'comfort36:cart:v2'
const validIds = new Set(catalog.map(product => product.id))
type Cart = Record<number, number>

function readCart(): Cart {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    if (!saved || typeof saved !== 'object') return {}
    return Object.fromEntries(Object.entries(saved).flatMap(([key, count]) =>
      validIds.has(Number(key)) && Number.isInteger(count) && count > 0 && count <= 99
        ? [[key, count]]
        : [],
    ))
  } catch {
    return {}
  }
}

export function useCart() {
  const [cart, setCart] = useState(readCart)

  const current = useRef(cart)

  useEffect(() => {
    const refresh = () => {
      current.current = readCart()
      setCart(current.current)
    }
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) refresh()
    }
    window.addEventListener('storage', sync)
    window.addEventListener('pageshow', refresh)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('pageshow', refresh)
    }
  }, [])

  function change(id: number, delta: number) {
    if (!validIds.has(id)) return
    const next = { ...current.current }
    const count = Math.min(99, (next[id] || 0) + delta)
    if (count > 0) next[id] = count
    else delete next[id]
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* Cart remains available in this tab. */ }
    current.current = next
    setCart(next)
  }

  const items = catalog.flatMap(product => cart[product.id] ? [{ product, count: cart[product.id] }] : [])
  return {
    items, change, quantities: cart,
    count: items.reduce((sum, item) => sum + item.count, 0),
    total: items.reduce((sum, item) => sum + item.count * item.product.price, 0),
  }
}
