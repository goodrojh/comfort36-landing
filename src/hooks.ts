import { useEffect, useState } from 'react'

type NetworkInfo = EventTarget & { saveData?: boolean; effectiveType?: string }

/**
 * Разрешаем фоновое видео только там, где оно действительно уместно:
 * широкий экран, быстрая сеть, нет режима экономии трафика и reduced-motion.
 * На телефонах вместо видео показывается постер — не грузим лишние мегабайты
 * и не ловим заглушку «play» от мобильных браузеров.
 */
export function useHeavyMedia() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mqWide = window.matchMedia('(min-width: 1024px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const net = (navigator as Navigator & { connection?: NetworkInfo }).connection

    const update = () => {
      const slow = !!net?.effectiveType && net.effectiveType !== '4g'
      setEnabled(mqWide.matches && !mqMotion.matches && !net?.saveData && !slow)
    }

    update()
    net?.addEventListener('change', update)
    mqWide.addEventListener('change', update)
    mqMotion.addEventListener('change', update)
    return () => {
      net?.removeEventListener('change', update)
      mqWide.removeEventListener('change', update)
      mqMotion.removeEventListener('change', update)
    }
  }, [])

  return enabled
}
