import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Phone, Send, X } from 'lucide-react'
import { contacts } from '../media'

/** Логотипной иконки MAX в lucide нет — рисуем монограмму. */
function MaxIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 18V6.6c0-.5.6-.7.9-.3L12 15l7.1-8.7c.3-.4.9-.2.9.3V18"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const channels = [
  {
    id: 'call',
    label: 'Позвонить',
    href: contacts.phoneHref,
    icon: Phone,
    bg: 'bg-ink',
    fg: 'text-cream',
  },
  {
    id: 'max',
    label: 'MAX',
    href: contacts.max,
    icon: MaxIcon,
    bg: 'bg-[#7B5BF2]',
    fg: 'text-white',
  },
  {
    id: 'wa',
    label: 'WhatsApp',
    href: contacts.whatsapp,
    icon: MessageCircle,
    bg: 'bg-[#25D366]',
    fg: 'text-white',
  },
  {
    id: 'tg',
    label: 'Telegram',
    href: contacts.telegram,
    icon: Send,
    bg: 'bg-[#29A9EB]',
    fg: 'text-white',
  },
] as const

export default function FloatingContacts() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // не мешаем первому экрану: показываем после прокрутки, но не позже 6 секунд —
  // чтобы кнопки нашлись и у тех, кто читает первый экран не прокручивая
  useEffect(() => {
    const show = () => setVisible(true)
    const onScroll = () => {
      if (window.scrollY > 240) show()
    }
    onScroll()
    const timer = setTimeout(show, 6000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="fixed z-40 right-3 bottom-3 md:right-5 md:bottom-5 flex flex-col items-end gap-2.5">
      {/* ДЕСКТОП: столбик кнопок с подписью при наведении */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col gap-2.5"
          >
            {channels.map((c) => {
              const Icon = c.icon
              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={c.id === 'call' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={c.label}
                  className={`group flex items-center justify-end gap-0 h-12 rounded-full ${c.bg} ${c.fg} shadow-[0_12px_30px_-12px_rgba(25,21,16,0.8)] overflow-hidden transition-all duration-300 w-12 hover:w-44 hover:gap-3 pr-0 hover:pr-1`}
                >
                  <span className="whitespace-nowrap text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-5">
                    {c.label}
                  </span>
                  <span className="w-12 h-12 shrink-0 grid place-items-center">
                    <Icon className="w-5 h-5" />
                  </span>
                </a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* МОБИЛЬНЫЙ: одна кнопка, раскрывается в веер */}
      <div className="md:hidden flex flex-col items-end gap-2.5">
        <AnimatePresence>
          {open &&
            channels.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.a
                  key={c.id}
                  href={c.href}
                  target={c.id === 'call' ? undefined : '_blank'}
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.8 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="bg-ink/90 text-cream text-xs font-semibold px-3 py-1.5 rounded-full">
                    {c.label}
                  </span>
                  <span
                    className={`w-12 h-12 rounded-full grid place-items-center ${c.bg} ${c.fg} shadow-[0_12px_30px_-12px_rgba(25,21,16,0.8)]`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                </motion.a>
              )
            })}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть контакты' : 'Связаться с нами'}
          aria-expanded={open}
          className="w-14 h-14 rounded-full bg-primary text-linen grid place-items-center shadow-[0_14px_34px_-10px_rgba(176,123,62,0.9)] active:scale-95 transition-transform"
        >
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.25 }}>
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.span>
        </button>
      </div>
    </div>
  )
}
