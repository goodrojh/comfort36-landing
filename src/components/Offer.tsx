import { WordsPullUpMultiStyle, FadeUp } from './anim'

const stats = [
  { value: '1 день', label: 'Срок пошива' },
  { value: 'На следующий день', label: 'Отправка по России' },
  { value: 'От 7 990 ₽', label: 'Цена без переплаты за бренд' },
]
export default function Offer() {
  return (
    <section id="offer" className="bg-cream py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-linen rounded-[1.5rem] md:rounded-[2.5rem] border border-ink/10 px-5 py-12 md:px-16 md:py-20 text-center shadow-[0_40px_120px_-60px_rgba(25,21,16,0.45)]">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-6 md:mb-9">
            Грузовое ателье
          </div>

          <WordsPullUpMultiStyle
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto leading-[1] sm:leading-[0.95] text-ink"
            segments={[
              { text: 'Точные лекала', className: 'font-bold' },
              {
                text: 'для вашей кабины.',
                className: 'italic font-serif font-normal text-primary',
              },

            ]}
          />

          <div className="mt-8 md:mt-12 max-w-2xl mx-auto">
            <FadeUp>
              <p className="text-graphite text-sm sm:text-base md:text-lg leading-relaxed">
                3D-ковры повторяют рельеф пола, легко чистятся и защищают кабину от грязи и влаги. Шьём по лекалам для конкретной модели. Подскажем, какой комплект подойдёт вашему грузовику.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-8 border-t border-ink/10 pt-8 md:pt-12">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] md:text-xs text-muted mt-1.5 uppercase tracking-[0.1em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
