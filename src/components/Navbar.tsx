import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { contacts } from '../media'
import { useLockScroll } from '../hooks'

const links = [
  { label: 'Ателье', href: '#offer' },
  { label: 'Изделия', href: '#products' },
  { label: 'Технология', href: '#process' },
  { label: 'Работы', href: '#works' },
  { label: 'Расчёт', href: '#calc' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  useLockScroll(open)

  return (
    <>
      {/* ДЕСКТОП: подвесная плашка по центру */}
      <nav className="hidden md:flex absolute top-0 left-0 right-0 z-30 justify-center px-3">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="bg-ink rounded-b-3xl px-8 py-3 flex items-center gap-10 lg:gap-12 shadow-[0_10px_40px_-15px_rgba(25,21,16,0.6)]"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm tracking-wide transition-colors duration-300 whitespace-nowrap"
              style={{ color: 'rgba(246,242,233,0.72)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F6F2E9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(246,242,233,0.72)')}
            >
              {l.label}
            </a>
          ))}
          <a
            href={contacts.phoneHref}
            className="hidden lg:flex items-center gap-2 text-sm text-primarysoft hover:text-cream transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            {contacts.phone}
          </a>
        </motion.div>
      </nav>

      {/* МОБИЛЬНЫЙ: компактная строка — логотип и бургер */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-3 p-3">
        <motion.a
          href="#"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="bg-ink/90 backdrop-blur-sm rounded-full pl-4 pr-4 py-2 text-cream text-sm font-extrabold tracking-tight"
        >
          COMFORT<span className="text-primarysoft">&nbsp;36</span>
        </motion.a>

        <motion.button
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="bg-ink/90 backdrop-blur-sm rounded-full w-11 h-11 grid place-items-center text-cream active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Полноэкранное меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-50 bg-cream"
          >
            <div className="flex flex-col h-full p-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-ink tracking-tight">
                  COMFORT&nbsp;36<span className="text-primary">*</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть меню"
                  className="w-11 h-11 rounded-full bg-ink grid place-items-center text-cream active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center gap-1 -mt-6">
                {links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.06 + i * 0.05, ease: EASE }}
                    className="flex items-baseline gap-3 py-3 border-b border-ink/10 text-3xl font-bold text-ink"
                  >
                    <span className="text-xs font-normal text-primary">
                      0{i + 1}
                    </span>
                    {l.label}
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                className="space-y-3"
              >
                <a
                  href="#calc"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-between bg-ink rounded-full pl-6 pr-1.5 py-1.5 text-cream font-semibold"
                >
                  Рассчитать стоимость
                  <span className="bg-primary rounded-full w-10 h-10 grid place-items-center">
                    <ArrowRight className="w-4 h-4 text-linen" />
                  </span>
                </a>
                <a
                  href={contacts.phoneHref}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 border border-ink/20 text-ink font-semibold"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  {contacts.phone}
                </a>
                <p className="text-center text-xs text-muted pt-1">{contacts.address}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
