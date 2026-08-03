import { useMemo, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Sparkles, Timer } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'

type Item = { id: string; label: string; price: number }

const ITEMS: Item[] = [
  { id: 'mats', label: '3D-ковры', price: 5990 },
  { id: 'seats', label: 'Чехлы на сиденья', price: 7900 },
  { id: 'dash', label: 'Накидка на торпеду', price: 3490 },
  { id: 'wheel', label: 'Оплётка руля', price: 2490 },
  { id: 'curtains', label: 'Шторы в кабину', price: 3900 },
]

const TRUCKS = [
  { id: 'scania', label: 'Scania S / R', k: 1 },
  { id: 'volvo', label: 'Volvo FH / FM', k: 1 },
  { id: 'mb', label: 'Mercedes Actros', k: 1 },
  { id: 'daf', label: 'DAF XF / XG', k: 1 },
  { id: 'man', label: 'MAN TGX', k: 1 },
  { id: 'renault', label: 'Renault T', k: 1 },
  { id: 'sitrak', label: 'SITRAK / SHACMAN / FAW', k: 0.95 },
  { id: 'kamaz', label: 'КАМАЗ / МАЗ', k: 0.9 },
  { id: 'gazelle', label: 'ГАЗель NEXT', k: 0.8 },
  { id: 'other', label: 'Другая модель', k: 1 },
]

const STITCHES = [
  { id: 'rhomb', label: 'Ромб' },
  { id: 'honey', label: 'Соты' },
  { id: 'wave', label: 'Волна' },
] as const

const COLORS = [
  { id: 'ivory', label: 'Слоновая кость', hex: '#EFE7D6', thread: '#B07B3E' },
  { id: 'sand', label: 'Песок', hex: '#DCCDB0', thread: '#8A6430' },
  { id: 'cappuccino', label: 'Капучино', hex: '#C0A98C', thread: '#4A3A28' },
  { id: 'coffee', label: 'Кофе', hex: '#6B5340', thread: '#D9B27C' },
  { id: 'graphite', label: 'Графит', hex: '#4A4A4A', thread: '#C9C2B4' },
  { id: 'terra', label: 'Терракота', hex: '#A2543C', thread: '#EFE7D6' },
]

type StitchId = (typeof STITCHES)[number]['id']

function QuiltPreview({
  stitch,
  color,
  thread,
}: {
  stitch: StitchId
  color: string
  thread: string
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Предпросмотр стёжки"
    >
      <defs>
        <pattern id="p-rhomb" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M0 28 L28 0 L56 28 L28 56 Z" fill="none" stroke={thread} strokeWidth="1.6" />
        </pattern>
        <pattern id="p-honey" width="56" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M14 0 L42 0 L56 24 L42 48 L14 48 L0 24 Z"
            fill="none"
            stroke={thread}
            strokeWidth="1.6"
          />
        </pattern>
        <pattern id="p-wave" width="60" height="26" patternUnits="userSpaceOnUse">
          <path
            d="M0 13 Q15 0 30 13 T60 13"
            fill="none"
            stroke={thread}
            strokeWidth="1.6"
          />
        </pattern>
        <radialGradient id="sheen" cx="30%" cy="20%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={color} />
      <rect width="400" height="300" fill={`url(#p-${stitch})`} opacity="0.85" />
      <rect width="400" height="300" fill="url(#sheen)" />
    </svg>
  )
}

export default function Configurator() {
  const [selected, setSelected] = useState<string[]>(['mats'])
  const [truck, setTruck] = useState(TRUCKS[0].id)
  const [stitch, setStitch] = useState<StitchId>('rhomb')
  const [color, setColor] = useState(COLORS[0].id)
  const [rush, setRush] = useState(false)

  const activeColor = COLORS.find((c) => c.id === color)!
  const activeTruck = TRUCKS.find((t) => t.id === truck)!

  const { base, discount, rushFee, total } = useMemo(() => {
    const base = ITEMS.filter((i) => selected.includes(i.id)).reduce(
      (sum, i) => sum + i.price * activeTruck.k,
      0,
    )
    const discount = selected.length >= 3 ? base * 0.15 : 0
    const afterDiscount = base - discount
    const rushFee = rush ? afterDiscount * 0.2 : 0
    return { base, discount, rushFee, total: Math.round(afterDiscount + rushFee) }
  }, [selected, activeTruck, rush])

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const summary = [
    `Заявка с сайта COMFORT 36`,
    `Изделия: ${ITEMS.filter((i) => selected.includes(i.id)).map((i) => i.label).join(', ') || '—'}`,
    `Тягач: ${activeTruck.label}`,
    `Стёжка: ${STITCHES.find((s) => s.id === stitch)!.label}`,
    `Цвет: ${activeColor.label}`,
    `Срок: ${rush ? 'срочно, 2 дня' : 'стандарт, 5 дней'}`,
    `Предварительно: ${total.toLocaleString('ru-RU')} ₽`,
  ].join('\n')

  const waLink = `https://wa.me/79066770713?text=${encodeURIComponent(summary)}`

  return (
    <section id="calc" className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">
            Конфигуратор кабины
          </div>
          <WordsPullUpMultiStyle
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink max-w-3xl mx-auto leading-tight"
            segments={[
              { text: 'Соберите свой салон и увидите цену' },
              { text: 'сразу.', className: 'italic font-serif font-normal text-primary' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          {/* ЛЕВО: превью */}
          <FadeUp className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border border-ink/10 bg-linen">
              <div className="relative aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${stitch}-${color}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <QuiltPreview
                      stitch={stitch}
                      color={activeColor.hex}
                      thread={activeColor.thread}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-3 left-3 bg-linen/90 backdrop-blur-sm rounded-xl px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {STITCHES.find((s) => s.id === stitch)!.label} · {activeColor.label}
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-7 border-t border-ink/10">
                <div className="text-xs uppercase tracking-[0.14em] text-muted">
                  Предварительная стоимость
                </div>
                <div className="mt-2 flex items-end gap-3">
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight"
                  >
                    {total.toLocaleString('ru-RU')} ₽
                  </motion.div>
                  {discount > 0 && (
                    <span className="mb-2 text-xs font-semibold text-primary">
                      −{Math.round(discount).toLocaleString('ru-RU')} ₽ за комплект
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-1.5 text-xs text-muted">
                  <li className="flex justify-between">
                    <span>Изделия ({selected.length})</span>
                    <span>{Math.round(base).toLocaleString('ru-RU')} ₽</span>
                  </li>
                  {discount > 0 && (
                    <li className="flex justify-between text-primary">
                      <span>Скидка за комплект 15%</span>
                      <span>−{Math.round(discount).toLocaleString('ru-RU')} ₽</span>
                    </li>
                  )}
                  {rushFee > 0 && (
                    <li className="flex justify-between">
                      <span>Срочный пошив 2 дня</span>
                      <span>+{Math.round(rushFee).toLocaleString('ru-RU')} ₽</span>
                    </li>
                  )}
                </ul>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-6 w-full inline-flex items-center justify-between gap-2 bg-ink rounded-full pl-6 pr-1.5 py-1.5 text-cream font-semibold text-sm sm:text-base"
                >
                  Отправить расчёт мастеру
                  <span className="bg-primary rounded-full w-10 h-10 grid place-items-center transition-transform duration-300 group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 text-linen" />
                  </span>
                </a>
                <p className="mt-3 text-[11px] text-muted text-center">
                  Точную цену подтвердит мастер после сверки модификации. Замер и консультация — бесплатно.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* ПРАВО: настройки */}
          <FadeUp delay={0.1} className="lg:col-span-7">
            <div className="rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen p-5 md:p-8 space-y-8">
              <Block step="01" title="Что шьём" hint="Три позиции и больше — скидка 15%">
                <div className="flex flex-wrap gap-2">
                  {ITEMS.map((item) => {
                    const on = selected.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border transition-all duration-300 ${
                          on
                            ? 'bg-ink text-cream border-ink'
                            : 'bg-transparent text-graphite border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        {on && <Check className="w-3.5 h-3.5 text-primarysoft" />}
                        {item.label}
                        <span className={on ? 'text-primarysoft' : 'text-muted'}>
                          {item.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Block>

              <Block step="02" title="Ваш тягач" hint="Лекала уже есть в базе — замер не нужен">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRUCKS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTruck(t.id)}
                      className={`rounded-xl px-3 py-3 text-xs sm:text-[13px] font-medium border text-left transition-all duration-300 ${
                        truck === t.id
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-transparent text-graphite border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="03" title="Стёжка" hint="Рисунок, по которому вас запомнят на стоянке">
                <div className="grid grid-cols-3 gap-2">
                  {STITCHES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStitch(s.id)}
                      className={`group rounded-xl overflow-hidden border transition-all duration-300 ${
                        stitch === s.id ? 'border-ink ring-2 ring-ink/15' : 'border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      <div className="h-16 sm:h-20">
                        <QuiltPreview
                          stitch={s.id}
                          color={activeColor.hex}
                          thread={activeColor.thread}
                        />
                      </div>
                      <div className="py-2 text-xs font-medium text-graphite">{s.label}</div>
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="04" title="Цвет экокожи" hint="Подберём и нестандартный оттенок под ваш салон">
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColor(c.id)}
                      title={c.label}
                      aria-label={c.label}
                      className={`relative w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                        color === c.id
                          ? 'border-ink scale-110'
                          : 'border-ink/10 hover:border-ink/40'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.id && (
                        <Check
                          className="w-4 h-4 absolute inset-0 m-auto"
                          style={{ color: c.thread }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="05" title="Срок" hint="">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRush(false)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border transition-all duration-300 ${
                      !rush ? 'bg-ink text-cream border-ink' : 'text-graphite border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <Timer className="w-4 h-4" /> Стандарт · 5 дней
                  </button>
                  <button
                    onClick={() => setRush(true)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border transition-all duration-300 ${
                      rush ? 'bg-ink text-cream border-ink' : 'text-graphite border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> Срочно · 2 дня (+20%)
                  </button>
                </div>
              </Block>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

function Block({
  step,
  title,
  hint,
  children,
}: {
  step: string
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-semibold text-primary">{step}</span>
        <h3 className="text-base md:text-lg font-bold text-ink">{title}</h3>
        {hint && <span className="hidden sm:block text-xs text-muted ml-auto">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
