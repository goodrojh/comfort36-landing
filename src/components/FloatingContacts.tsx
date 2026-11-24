import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Phone, X } from 'lucide-react'
import { contacts } from '../media'
import { asset } from '../catalog'

const channels = [
  {
    id: 'call',
    label: 'Позвонить',
    href: contacts.phoneHref,
    image: null,
    bg: 'bg-ink',
    fg: 'text-cream',
  },
  {
    id: 'max',
    label: 'MAX',
    href: contacts.max,
    image: 'max',
    bg: 'bg-linen',
    fg: 'text-ink',
  },
  {
    id: 'vk',
    label: 'ВКонтакте',
    href: contacts.vkWrite,
    image: 'vk',
    bg: 'bg-linen',
    fg: 'text-ink',
  },
] as const

export default function FloatingContacts() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [overlapsForm, setOverlapsForm] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const form = document.getElementById('hero-lead')
    if (!form) return
    let frame = 0
    const measure = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const toggle = trigger.current?.getBoundingClientRect()
        const area = form.getBoundingClientRect()
        setOverlapsForm(Boolean(toggle?.width && toggle.left < area.right && toggle.right > area.left
          && toggle.top < area.bottom && toggle.bottom > area.top))
      })
    }
    const resize = new ResizeObserver(measure)
    resize.observe(form)
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // не мешаем первому экрану: показываем после прокрутки, но не позже 6 секунд —
  // чтобы кнопки нашлись и у тех, кто читает первый экран не прокручивая
  useEffect(() => {
    const show = () => setVisible(true)
    const onScroll = () => {
      if (window.scrollY <= 240) return
      show()
      window.removeEventListener('scroll', onScroll)
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
    <div className="floating-contacts fixed z-40 right-3 bottom-3 md:right-5 md:bottom-5 flex flex-col items-end gap-2.5">
      {/* ДЕСКТОП: столбик кнопок с подписью при наведении */}

        {visible && (
          <div

            className="hidden md:flex flex-col gap-2.5"
          >
            {channels.map((c) => {

              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={c.id === 'call' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={c.label}
                  className={`group flex items-center justify-end gap-0 h-12 rounded-full ${c.bg} ${c.fg} shadow-[0_12px_30px_-12px_rgba(25,21,16,0.8)] overflow-hidden transition-all duration-300 w-12 ml-auto hover:w-44 hover:gap-3 pr-0 hover:pr-1`}
                >
                  <span className="whitespace-nowrap text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-5">
                    {c.label}
                  </span>
                  <span className="w-12 h-12 shrink-0 grid place-items-center">
                    {c.image ? <img src={asset(`social/${c.image}.svg`)} alt="" width="22" height="22" /> : <Phone className="w-5 h-5" />}
                  </span>
                </a>
              )
            })}
          </div>
        )}

      {/* МОБИЛЬНЫЙ: одна кнопка, раскрывается в веер */}
      <div className="md:hidden flex flex-col items-end gap-2.5">

          {open &&
            channels.map(c => {

              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={c.id === 'call' ? undefined : '_blank'}
                  rel="noreferrer"
                  onClick={() => setOpen(false)}

                  className="flex items-center gap-2.5"
                >
                  <span className="bg-ink/90 text-cream text-xs font-semibold px-3 py-1.5 rounded-full">
                    {c.label}
                  </span>
                  <span
                    className={`w-12 h-12 rounded-full grid place-items-center ${c.bg} ${c.fg} shadow-[0_12px_30px_-12px_rgba(25,21,16,0.8)]`}
                  >
                    {c.image ? <img src={asset(`social/${c.image}.svg`)} alt="" width="22" height="22" /> : <Phone className="w-5 h-5" />}
                  </span>
                </a>
              )
            })}

        <button
          ref={trigger}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть контакты' : 'Связаться с нами'}
          aria-expanded={open}
          className={`w-14 h-14 rounded-full bg-primary text-linen grid place-items-center shadow-[0_14px_34px_-10px_rgba(29,112,77,0.76)] active:scale-95 transition-transform ${overlapsForm && !open ? 'invisible' : ''}`}
        >
          <span>
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </span>
        </button>
      </div>
    </div>
  )
}
