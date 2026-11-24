import { useState, type ReactNode } from 'react'
import { StyledHeading } from './StyledHeading'
import LeadForm from '../LeadForm'
import { asset, money } from '../catalog'

const TRUCKS = ['Mercedes', 'DAF', 'Shacman', 'Volvo', 'FAW', 'MAN', 'Sitrak', 'Dongfeng', 'Другая модель']

const STITCHES = [
  { id: 'honey', label: 'Соты', price: 7990 },
  { id: 'smooth', label: 'Гладкие', price: 10990 },
] as const
const samples = {
  honey: ['Серый · светлая нить', 'Шоколадный · светлая нить', 'Бежевый · бежевая нить', 'Паприка · бежевая нить', 'Чёрный · синяя нить', 'Чёрный · красная нить', 'Чёрный · серая нить'],
  smooth: ['Чёрный', 'Синий', 'Шоколадный', 'Паприка', 'Серый', 'Бежевый'],
}
type StitchId = keyof typeof samples
const sampleImage = (type: StitchId, index: number) => asset(`samples/${type}-${index + 1}.webp`)

export default function Configurator() {
  const [truck, setTruck] = useState(TRUCKS[0])
  const [stitch, setStitch] = useState<StitchId>('honey')
  const [choices, setChoices] = useState({ honey: 6, smooth: 0 })
  const index = choices[stitch]
  const label = '№ ' + (index + 1) + ' · ' + samples[stitch][index]
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
                  <img src={sampleImage(stitch, index)} alt={label} className="h-full w-full object-cover" />
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
                        <img src={sampleImage(s.id, choices[s.id])} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="py-2 text-xs font-medium text-graphite">{s.label}</div>
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="03" title="Цвет экокожи" hint="Наличие оттенка уточнит мастер">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {samples[stitch].map((name, i) => <button type="button" key={name}
                    aria-pressed={index === i} onClick={() => setChoices({ ...choices, [stitch]: i })}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-semibold ${index === i ? 'border-primary bg-sand ring-1 ring-primary' : 'border-ink/15'}`}>
                    <img src={sampleImage(stitch, i)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span>№ {i + 1}<br />{name}</span>
                  </button>)}
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
