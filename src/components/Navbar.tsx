import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { contacts } from '../media'

const links = [
  { label: 'Ателье', href: '#offer' },
  { label: 'Изделия', href: '#products' },
  { label: 'Технология', href: '#process' },
  { label: 'Работы', href: '#works' },
  { label: 'Расчёт', href: '#calc' },
]

export default function Navbar() {
  return (
    // позиционирование — на обёртке: framer-motion перезаписывает transform у анимируемого узла
    <nav className="absolute top-0 left-0 right-0 z-30 flex justify-center px-3">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="bg-ink rounded-b-2xl md:rounded-b-3xl px-4 py-2.5 md:px-8 md:py-3 flex items-center gap-3 sm:gap-6 md:gap-10 lg:gap-12 shadow-[0_10px_40px_-15px_rgba(25,21,16,0.6)] max-w-full overflow-x-auto"
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[10px] sm:text-xs md:text-sm tracking-wide transition-colors duration-300 whitespace-nowrap"
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
  )
}
