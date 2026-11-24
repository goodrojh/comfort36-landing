import { useEffect, useState } from 'react'
import { analyticsChoice, consentKey, rememberAnalytics } from '../cookie-choice'
import { getAttribution } from '../attribution'

const id = 114650214
type Counter = Window & { ym?: (...args: unknown[]) => void }
let tag: HTMLScriptElement | undefined
let ready = false
let running = false
function syncAnalytics() {
  const w = window as Counter
  if (analyticsChoice() !== 'yes') {
    if (running) w.ym?.(id, 'destruct')
    running = false
    try { sessionStorage.removeItem('comfort36:attribution:v1') } catch { /* Storage unavailable. */ }
    for (const key of ['_ym_uid', '_ym_d', '_ym_isad', '_ym_visorc']) {
      for (const domain of ['', ';domain=' + location.hostname, ';domain=comfort-36.ru']) {
        document.cookie = key + '=;max-age=0;path=/' + domain
      }
    }
    return
  }
  getAttribution()
  if (running) return
  if (!ready) {
    if (tag) return
    if (!w.ym) {
      const queue = Object.assign((...args: unknown[]) => queue.a.push(args), {
        a: [] as unknown[][], l: Date.now(),
      })
      w.ym = queue
    }
    tag = document.createElement('script')
    tag.async = true
    tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id
    tag.onload = () => { ready = true; syncAnalytics() }
    tag.onerror = () => { tag?.remove(); tag = undefined }
    document.head.append(tag)
    return
  }
  running = true
  w.ym?.(id, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer',
    referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true })
}

export default function CookieSettings() {
  const [open, setOpen] = useState(() => !analyticsChoice())
  useEffect(() => {
    syncAnalytics()
    function sync(event: StorageEvent) {
      if (event.key === consentKey || event.key === null) {
        if (event.newValue === 'no' || event.newValue === 'yes') rememberAnalytics(event.newValue)
        syncAnalytics()
        setOpen(!analyticsChoice())
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  function choose(choice: 'yes' | 'no') {
    rememberAnalytics(choice)
    syncAnalytics()
    setOpen(false)
  }
  return <>
    <button type="button" onClick={() => setOpen(true)} className="text-xs underline underline-offset-4">Настройки cookies</button>
    {open && <section aria-label="Настройки cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-ink/20 bg-linen p-4 text-left text-ink shadow-xl sm:p-5">
      <h2 className="font-bold">Разрешить аналитику сайта?</h2>
      <p className="mt-1 text-sm">Корзина и формы работают при любом выборе. С вашего согласия Яндекс.Метрика использует cookies и Вебвизор, чтобы мы видели, как посетители пользуются сайтом. <a className="underline" href={import.meta.env.BASE_URL + 'privacy.html#cookies'}>Подробнее</a></p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose('no')} className="min-h-11 rounded-full border border-ink/30 font-semibold">Отклонить</button>
        <button type="button" onClick={() => choose('yes')} className="min-h-11 rounded-full bg-ink text-cream font-semibold">Принять</button>
      </div>
    </section>}
  </>
}
