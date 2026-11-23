import { useId, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { StyledHeading } from './StyledHeading'
import LeadForm from '../LeadForm'
import { money } from '../catalog'

const TRUCKS = ['Mercedes', 'DAF', 'Shacman', 'Volvo', 'FAW', 'MAN', 'Sitrak', 'Dongfeng', 'Другая модель']

const STITCHES = [
  { id: 'honey', label: 'Соты', price: 7990 },
  { id: 'smooth', label: 'Гладкие', price: 10990 },
] as const
const COLORS = [
  { id: 'black', label: 'Чёрный', hex: '#282627', thread: '#ADA8AA' },
  { id: 'sand', label: 'Бежевый', hex: '#DCCDB0', thread: '#8A6430' },
  { id: 'chocolate', label: 'Шоколадный', hex: '#6B5340', thread: '#D9B27C' },
  { id: 'paprika', label: 'Паприка', hex: '#A2543C', thread: '#EFE7D6' },
  { id: 'orange', label: 'Оранжевый', hex: '#CA622C', thread: '#F1C793' },
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
  const patternId = useId()
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Предпросмотр стёжки"
    >
      <defs>
        {/* One line per edge. The halves on the tile borders join in adjacent tiles. */}
        <pattern id={patternId + '-honey'} width="36" height="62.3538" patternUnits="userSpaceOnUse">
          <path d="M0 10.3923 18 0 36 10.3923 M0 31.1769 18 41.5692 36 31.1769 M0 10.3923V31.1769 M36 10.3923V31.1769 M18 41.5692V62.3538"
            fill="none" stroke={thread} strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" />
        </pattern>
        <radialGradient id={patternId + "-sheen"} cx="30%" cy="20%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={color} />
      {stitch === 'honey' && <rect width="400" height="300" fill={`url(#${patternId}-honey)`} opacity="0.85" />}
      <rect width="400" height="300" fill={`url(#${patternId}-sheen)`} />
    </svg>
  )
}

export default function Configurator() {
  const [truck, setTruck] = useState(TRUCKS[0])
  const [stitch, setStitch] = useState<StitchId>('honey')
  const [color, setColor] = useState(COLORS[0].id)

  const activeColor = COLORS.find((option) => option.id === color)!
  const activeStitch = STITCHES.find((option) => option.id === stitch)!
  const total = activeStitch.price
  const selection = [
    `Грузовик: ${truck}`,
    `3D-ковры: ${activeStitch.label}, цвет ${activeColor.label.toLowerCase()}`,
    `Цена комплекта: ${money(total)}`,
  ].join('\n')
  return (
    <section id="calc" className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">
            Конфигуратор кабины
          </div>
          <StyledHeading
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink max-w-3xl mx-auto leading-tight"
            segments={[
              { text: 'Соберите свой салон и увидите цену' },
              { text: 'сразу.', className: 'italic font-serif font-normal text-primary' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          {/* ЛЕВО: превью */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border border-ink/10 bg-linen">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0">
                  <QuiltPreview stitch={stitch} color={activeColor.hex} thread={activeColor.thread} />
                </div>
                <div className="absolute bottom-3 left-3 bg-linen/95 rounded-xl px-3 py-2">
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
                  <div




                    className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight"
                  >
                    {total.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted">Мастер сверит модель кабины и наличие выбранного цвета.</p>
                <LeadForm key={selection} source="config" order={selection} compact />
              </div>
            </div>
          </div>

          {/* ПРАВО: настройки */}
          <div className="lg:col-span-7">
            <div className="rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen p-5 md:p-8 space-y-8">
              <Block step="01" title="Ваш тягач" hint="Выберите марку">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRUCKS.map((t) => (
                    <button
                      key={t}
                      aria-pressed={truck === t} onClick={() => setTruck(t)}
                      className={`rounded-xl px-3 py-3 text-xs sm:text-[13px] font-medium border text-left transition-all duration-300 ${
                        truck === t
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-transparent text-graphite border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="02" title="Исполнение" hint="Выберите фактуру ковра">
                <div className="grid grid-cols-2 gap-2">
                  {STITCHES.map((s) => (
                    <button
                      key={s.id}
                      aria-label={s.label} aria-pressed={stitch === s.id} onClick={() => setStitch(s.id)}
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

              <Block step="03" title="Цвет экокожи" hint="Наличие оттенка уточнит мастер">
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      aria-pressed={color === c.id} onClick={() => setColor(c.id)}
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


            </div>
          </div>
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
