import { useRef } from 'react'
import { Menu, Phone, ShoppingCart } from 'lucide-react'
import { asset, cartUrl } from '../catalog'
import { contacts } from '../media'

const links = [
  { label: 'Каталог', href: '#products' },
  { label: 'Подбор', href: '#calc' },
  { label: 'Работы', href: '#works' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#map' },
]

export default function Navbar({ count, subpage = false }: { count: number; subpage?: boolean }) {
  const home = subpage ? import.meta.env.BASE_URL : ''
  const menu = useRef<HTMLDetailsElement>(null)

  function closeMenu() {
    if (menu.current) menu.current.open = false
  }

  return <header className="relative z-30">
    <div className="flex min-w-0 items-center justify-between gap-1.5 rounded-full border border-white/10 bg-ink p-1.5 text-cream shadow-md sm:gap-3 sm:px-3">
      <a href={home || "#"} className="flex min-w-0 items-center gap-1.5 pl-1.5 text-[11px] font-extrabold leading-tight sm:gap-2 sm:px-2 sm:text-sm"
        aria-label="COMFORT 36, на главную">
        <img src={asset('brand.webp')} alt="" width="30" height="30" className="h-6 w-6 shrink-0 rounded-full sm:h-[30px] sm:w-[30px]" />
        <span className="hidden whitespace-nowrap min-[345px]:inline">COMFORT <span className="text-primarysoft">36</span></span>
      </a>
      <nav aria-label="Основное меню" className="hidden items-center gap-1 lg:flex xl:gap-2">
        {links.map(link => <a key={link.href} href={home + link.href}
          className="rounded-full px-3 py-2 text-sm font-semibold text-cream/90 hover:bg-white/10">
          {link.label}
        </a>)}
      </nav>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <a href={contacts.phoneHref} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-2 py-2 text-sm font-semibold text-primarysoft xl:flex">
          <Phone size={15} /> {contacts.phone}
        </a>
        <a href={cartUrl} aria-label={`Корзина, товаров: ${count}`}
          className="flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-linen px-2.5 text-xs font-bold text-ink hover:bg-sand sm:px-3 sm:text-sm">
          <ShoppingCart size={17} /> Корзина
          {count > 0 && <span className="rounded-full bg-sand px-1.5 text-xs tabular-nums">{count}</span>}
        </a>
        <details ref={menu} className="lg:hidden" onKeyDown={event => {
          if (event.key === 'Escape') {
            closeMenu()
            menu.current?.querySelector('summary')?.focus()
          }
        }}>
          <summary aria-label="Меню" className="grid h-11 w-10 cursor-pointer list-none place-items-center rounded-full bg-white/10 [&::-webkit-details-marker]:hidden sm:w-11">
            <Menu size={20} />
          </summary>
          <nav aria-label="Мобильное меню" className="absolute inset-x-0 top-full mt-2 grid rounded-2xl border border-ink/10 bg-linen p-2 text-ink shadow-lg">
            {links.map(link => <a key={link.href} href={home + link.href} onClick={closeMenu}
              className="rounded-xl px-4 py-2.5 font-semibold hover:bg-sand">{link.label}</a>)}
            <a href={contacts.phoneHref} className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold hover:bg-sand">
              <Phone size={16} /> {contacts.phone}
            </a>
          </nav>
        </details>
      </div>
    </div>
  </header>
}
