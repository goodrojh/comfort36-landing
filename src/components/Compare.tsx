import { StyledHeading } from './StyledHeading'



const cols = ['COMFORT 36', 'Другие ателье', 'Маркетплейс'] as const

const rows: { label: string; values: string[] }[] = [
  { label: 'Цена комплекта 3D-ковров', values: ['от 7 990 ₽', 'от 15 990 ₽', 'от 12 990 ₽'] },
  { label: 'Срок изготовления', values: ['1 день', 'от 7 дней', 'Зависит от продавца'] },
]

export default function Compare() {
  return (
    <section className="bg-sand py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <StyledHeading
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Цена и сроки изготовления.' }]}
          />
        </div>

        <div>
          <div className="rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="text-left text-xs uppercase tracking-[0.12em] text-muted font-medium px-2 py-4 sm:px-5 md:px-7">
                      Параметр
                    </th>
                    {cols.map((c, i) => (
                      <th
                        key={c}
                        className={`px-1 py-4 sm:px-4 text-center text-[10px] sm:text-sm font-bold ${
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
                      <td className="px-2 py-4 sm:px-5 md:px-7 text-[11px] sm:text-sm text-graphite">
                        {r.label}
                      </td>
                      {r.values.map((v, i) => (
                        <td
                          key={i}
                          className={`px-1 py-4 sm:px-4 text-center ${i === 0 ? 'bg-primary/[0.07]' : ''}`}
                        >
                          <span className={`text-[11px] sm:text-sm font-semibold ${i === 0 ? 'text-ink' : 'text-muted'}`}>{v}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <p className="mt-6 text-center text-xs text-muted max-w-2xl mx-auto">
            Сравнение основано на публичных прайсах и условиях профильных ателье и карточек
            маркетплейсов на август 2026 года.
          </p>
        </div>
      </div>
    </section>
  )
}
