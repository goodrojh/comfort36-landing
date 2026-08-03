import { Check, Minus, X } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'

type Cell = 'yes' | 'no' | 'part' | string

const cols = ['COMFORT 36', 'Столичное ателье', 'Маркетплейс'] as const

const rows: { label: string; values: Cell[] }[] = [
  { label: 'Лекала по 3D-скану вашей модификации', values: ['yes', 'yes', 'no'] },
  { label: 'Цена комплекта 3D-ковров', values: ['от 5 990 ₽', 'от 12 990 ₽', 'от 2 500 ₽'] },
  { label: 'Срок изготовления', values: ['5 дней', '10–14 дней', '2–5 дней'] },
  { label: 'Свой цвет, стёжка и нить', values: ['yes', 'part', 'no'] },
  { label: 'Вырезы под салазки, ремни, люки', values: ['yes', 'yes', 'no'] },
  { label: 'Гарантия посадки — перешьём бесплатно', values: ['yes', 'no', 'no'] },
  { label: 'Можно приехать и потрогать материал', values: ['yes', 'part', 'no'] },
  { label: 'Отправка по всему миру', values: ['yes', 'part', 'part'] },
]

function Mark({ v, accent }: { v: Cell; accent: boolean }) {
  if (v === 'yes')
    return (
      <span
        className={`inline-grid place-items-center w-7 h-7 rounded-full ${
          accent ? 'bg-primary' : 'bg-ink/10'
        }`}
      >
        <Check className={`w-4 h-4 ${accent ? 'text-linen' : 'text-graphite'}`} />
      </span>
    )
  if (v === 'no')
    return (
      <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-ink/5">
        <X className="w-4 h-4 text-muted/70" />
      </span>
    )
  if (v === 'part')
    return (
      <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-ink/5">
        <Minus className="w-4 h-4 text-muted/70" />
      </span>
    )
  return (
    <span className={`text-xs sm:text-sm font-semibold ${accent ? 'text-ink' : 'text-muted'}`}>
      {v}
    </span>
  )
}

export default function Compare() {
  return (
    <section className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Честно, без звёздочек мелким шрифтом.' }]}
          />
        </div>

        <FadeUp>
          <div className="rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="text-left text-xs uppercase tracking-[0.12em] text-muted font-medium px-5 py-4 md:px-7">
                      Параметр
                    </th>
                    {cols.map((c, i) => (
                      <th
                        key={c}
                        className={`px-4 py-4 text-center text-xs sm:text-sm font-bold ${
                          i === 0 ? 'text-ink bg-primary/10' : 'text-muted'
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-b border-ink/[0.07] last:border-0">
                      <td className="px-5 py-4 md:px-7 text-[13px] sm:text-sm text-graphite">
                        {r.label}
                      </td>
                      {r.values.map((v, i) => (
                        <td
                          key={i}
                          className={`px-4 py-4 text-center ${i === 0 ? 'bg-primary/[0.07]' : ''}`}
                        >
                          <Mark v={v} accent={i === 0} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-6 text-center text-xs text-muted max-w-2xl mx-auto">
            Сравнение основано на публичных прайсах и условиях профильных ателье и карточек
            маркетплейсов на август 2026 года.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
