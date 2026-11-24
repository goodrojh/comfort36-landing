import { useId, useState, type ReactNode } from 'react'
import { StyledHeading } from './StyledHeading'
import LeadForm from '../LeadForm'
import { money } from '../catalog'

const TRUCKS = ['Mercedes', 'DAF', 'Shacman', 'Volvo', 'FAW', 'MAN', 'Sitrak', 'Dongfeng', 'Другая модель']

const STITCHES = [
  { id: 'honey', label: 'Соты', price: 7990 },
  { id: 'smooth', label: 'Гладкие', price: 10990 },
] as const
const samples = {
  honey: [
    { name: 'Серый · светлая нить', color: '#586063', thread: '#C5C7BD' },
    { name: 'Шоколадный · светлая нить', color: '#392F30', thread: '#D0C6BE' },
    { name: 'Бежевый · бежевая нить', color: '#DFD6BA', thread: '#AC9D7A' },
    { name: 'Паприка · бежевая нить', color: '#945D4A', thread: '#D6B898' },
    { name: 'Чёрный · синяя нить', color: '#20242A', thread: '#526BA2' },
    { name: 'Чёрный · красная нить', color: '#20242A', thread: '#B46166' },
    { name: 'Чёрный · серая нить', color: '#20242A', thread: '#B9BEC2' },
  ],
  smooth: [
    { name: 'Чёрный', color: '#22262B', thread: '' },
    { name: 'Синий', color: '#305FA2', thread: '' },
    { name: 'Шоколадный', color: '#574C4C', thread: '' },
    { name: 'Паприка', color: '#A46E58', thread: '' },
    { name: 'Серый', color: '#626C73', thread: '' },
    { name: 'Бежевый', color: '#D9D3BD', thread: '' },
  ],
}
type StitchId = keyof typeof samples

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
  const [choices, setChoices] = useState({ honey: 6, smooth: 0 })
  const index = choices[stitch]
  const active = samples[stitch][index]
  const label = '№ ' + (index + 1) + ' · ' + active.name
  const activeStitch = STITCHES.find((option) => option.id === stitch)!
  const total = activeStitch.price
  const selection = [
    `Грузовик: ${truck}`,
    `3D-ковры: ${activeStitch.label}, образец ${label}`,
    `Цена комплекта: ${money(total)}`,
  ].join('\n')
  return (
    <section id="calc" className="bg-sand py-12 md:py-20 px-4 md:px-6">
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
                  <QuiltPreview stitch={stitch} {...active} />
                </div>
                <div className="absolute bottom-3 left-3 bg-linen/95 rounded-xl px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {STITCHES.find((s) => s.id === stitch)!.label} · {label}
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
                <LeadForm source="config" order={selection} compact />
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
                        <QuiltPreview stitch={s.id} {...samples[s.id][choices[s.id]]} />
                      </div>
                      <div className="py-2 text-xs font-medium text-graphite">{s.label}</div>
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="03" title="Цвет экокожи" hint="Наличие оттенка уточнит мастер">
                <div className="flex flex-wrap gap-3">
                  {samples[stitch].map((sample, i) => <button type="button" key={sample.name}
                    aria-label={`№ ${i + 1} · ${sample.name}`} title={sample.name}
                    aria-pressed={index === i} onClick={() => setChoices({ ...choices, [stitch]: i })}
                    className={`grid h-11 w-11 place-items-center rounded-full border border-ink/20 ${index === i ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    style={{ backgroundColor: sample.color }}>
                    {stitch === 'honey' && <svg aria-hidden="true" viewBox="0 0 28 28" width="28" height="28">
                      <path d="m14 2 10.4 6v12L14 26 3.6 20V8Z" fill="none" stroke={sample.thread} strokeWidth="2" />
                    </svg>}
                  </button>)}
                </div>
                <p className="mt-3 text-sm text-graphite" aria-live="polite">{label}</p>
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
