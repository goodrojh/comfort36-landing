import { useState } from 'react'
import { Plus } from 'lucide-react'
import { StyledHeading } from './StyledHeading'

const faq = [
  {
    q: 'Моей модели нет в списке — что делать?',
    a: 'Напишите марку, модель и год выпуска. Мастер проверит, есть ли лекало или готовый комплект для вашей кабины.',
  },
  {
    q: 'Ковёр не будет мешать педалям?',
    a: 'Нет. Геометрия снимается сканером, у ковра есть антискользящая подошва и точные вырезы под площадку педалей. Он не смещается и не подворачивается — это как раз то, из-за чего универсальные коврики опасны.',
  },
  {
    q: 'Как ухаживать за экокожей?',
    a: 'Протрите экокожу влажной тряпкой. При необходимости используйте мягкий мыльный раствор.',
  },
  {
    q: 'Сколько ждать и как оплатить?',
    a: 'Пошив занимает один день. Готовые комплекты отправляем на следующий день. Условия оплаты и доставки уточнит мастер.',
  },
  {
    q: 'А если не сядет?',
    a: 'Сообщите мастеру, что не подошло. Он сверит модель кабины и предложит решение.',
  },
  {
    q: 'Куда доставляете?',
    a: 'Доставляем транспортными компаниями. Самовывоз можно согласовать с ателье.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-sand py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <StyledHeading
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Что обычно спрашивают.' }]}
          />
        </div>

        <div>
          <div className="rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen overflow-hidden">
            {faq.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} className="border-b border-ink/[0.08] last:border-0">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start gap-4 text-left px-5 py-5 md:px-8 md:py-6 group"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 text-sm md:text-base font-semibold text-ink">
                      {item.q}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 text-primary transition-transform duration-500 ${
                        isOpen ? 'rotate-45' : 'group-hover:rotate-90'
                      }`}
                    />
                  </button>
                  {isOpen && <p className="px-5 pb-6 md:px-8 md:pb-7 pr-12 text-sm text-muted leading-relaxed">
                    {item.a}
                  </p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
