import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Gift, X } from 'lucide-react'
import { contacts, media, waWithText } from '../media'
import { useLockScroll } from '../hooks'

const STORAGE_KEY = 'comfort36:promo-seen'
const SNOOZE_MS = 24 * 60 * 60 * 1000

/** Ближайшее воскресенье, 23:59:59 по местному времени. */
function endOfWeek() {
  const d = new Date()
  const daysLeft = (7 - d.getDay()) % 7
  d.setDate(d.getDate() + daysLeft)
  d.setHours(23, 59, 59, 999)
  return d
}

function useCountdown() {
  const target = useMemo(() => endOfWeek().getTime(), [])
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()))

  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])

  const s = Math.floor(left / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function PromoModal() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [truck, setTruck] = useState('')
  const [consent, setConsent] = useState(false)
  const shown = useRef(false)
  const { d, h, m, s } = useCountdown()
  useLockScroll(open)

  useEffect(() => {
    const seen = Number(localStorage.getItem(STORAGE_KEY) || 0)
    if (Date.now() - seen < SNOOZE_MS) return

    const show = () => {
      if (shown.current) return
      shown.current = true
      setOpen(true)
    }

    const timer = setTimeout(show, 18000)
    const onScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
      if (p > 0.45) show()
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const close = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setOpen(false)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!consent) return
    const text = [
      'Заявка по акции недели (сайт COMFORT 36)',
      `Имя: ${name || '—'}`,
      `Телефон: ${phone || '—'}`,
      `Тягач: ${truck || '—'}`,
      'Прошу зафиксировать −20% на комплект.',
    ].join('\n')
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setSent(true)
    window.open(waWithText(text), '_blank', 'noopener')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-5 bg-ink/55 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Акция недели"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-linen rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden shadow-[0_50px_120px_-40px_rgba(25,21,16,0.7)] max-h-[92svh] overflow-y-auto"
          >
            <button
              onClick={close}
              aria-label="Закрыть"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-linen/80 backdrop-blur-sm border border-ink/10 grid place-items-center text-graphite hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid sm:grid-cols-2">
              {/* визуал */}
              <div className="relative hidden sm:block">
                <img
                  src={media.workSeats}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                  <Gift className="w-6 h-6 text-primarysoft" />
                  <div className="mt-3 text-2xl font-extrabold leading-tight">
                    −20% на комплект
                    <br />
                    до конца недели
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs text-cream/80">
                    {['Замер и лекала — бесплатно', 'Пошив за 5 дней', 'Гарантия посадки'].map(
                      (t) => (
                        <li key={t} className="flex gap-2">
                          <Check className="w-3.5 h-3.5 text-primarysoft shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* форма */}
              <div className="p-5 sm:p-7">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  Акция недели
                </div>
                <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                  <span className="sm:hidden">−20% на комплект. </span>
                  Оставьте номер — зафиксируем цену
                </h2>

                {/* таймер */}
                <div className="mt-4 flex gap-1.5">
                  {[
                    { v: d, l: 'дн' },
                    { v: h, l: 'ч' },
                    { v: m, l: 'мин' },
                    { v: s, l: 'сек' },
                  ].map((t) => (
                    <div
                      key={t.l}
                      className="flex-1 bg-sand rounded-xl py-2 text-center border border-ink/[0.07]"
                    >
                      <div className="text-lg sm:text-xl font-extrabold text-ink tabular-nums leading-none">
                        {pad(t.v)}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.1em] text-muted mt-1">
                        {t.l}
                      </div>
                    </div>
                  ))}
                </div>

                {sent ? (
                  <div className="mt-6 rounded-2xl bg-sand border border-ink/[0.07] p-5 text-center">
                    <span className="inline-grid place-items-center w-11 h-11 rounded-full bg-primary mb-3">
                      <Check className="w-5 h-5 text-linen" />
                    </span>
                    <div className="font-bold text-ink">Заявка собрана</div>
                    <p className="mt-1.5 text-xs text-muted">
                      Мы открыли WhatsApp с готовым текстом — отправьте сообщение, и мастер
                      ответит в течение рабочего дня. Если окно не открылось, позвоните:{' '}
                      <a href={contacts.phoneHref} className="text-ink font-semibold underline">
                        {contacts.phone}
                      </a>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-5 space-y-2.5">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Как к вам обращаться"
                      className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-ink transition-colors"
                    />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Телефон *"
                      className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-ink transition-colors"
                    />
                    <input
                      value={truck}
                      onChange={(e) => setTruck(e.target.value)}
                      placeholder="Модель тягача (например, Volvo FH)"
                      className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-ink transition-colors"
                    />
                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                      <span className="relative shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          required
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden
                          className="block w-5 h-5 rounded-md border border-ink/25 bg-cream peer-checked:bg-ink peer-checked:border-ink peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 transition-colors"
                        />
                        <Check
                          aria-hidden
                          className="absolute inset-0 m-auto w-3.5 h-3.5 text-cream opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        />
                      </span>
                      <span className="text-[11px] text-muted leading-relaxed">
                        Согласен на обработку персональных данных в соответствии с политикой
                        конфиденциальности
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={!consent}
                      className="w-full rounded-full bg-ink text-cream font-semibold py-3.5 text-sm hover:bg-graphite transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
                    >
                      Забрать −20%
                    </button>
                    <p className="text-[10px] text-muted text-center leading-relaxed">
                      Заявка уходит мастеру в WhatsApp.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
