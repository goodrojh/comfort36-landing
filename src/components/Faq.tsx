import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'

const faq = [
  {
    q: 'Моей модели нет в списке — что делать?',
    a: 'Напишите модель и год. Если лекала нет в базе, мы приедем с 3D-сканером или пришлём подробную инструкцию по замеру — это бесплатно. Новая модель после первого заказа остаётся в базе, и повторный заказ идёт уже без замеров.',
  },
  {
    q: 'Ковёр не будет мешать педалям?',
    a: 'Нет. Геометрия снимается сканером, у ковра есть антискользящая подошва и точные вырезы под площадку педалей. Он не смещается и не подворачивается — это как раз то, из-за чего универсальные коврики опасны.',
  },
  {
    q: 'Как ухаживать за экокожей?',
    a: 'Влажная тряпка и мыльный раствор. Ковры можно вынуть и промыть шлангом, чехлы протираются на месте. Материал автомобильного класса: 250 000 циклов на истирание, не боится мороза и ультрафиолета.',
  },
  {
    q: 'Сколько ждать и как оплатить?',
    a: 'Стандартный срок — 5 рабочих дней, срочный — 2 дня с наценкой 20%. Работаем по предоплате: она запускает раскрой. Остаток — при получении.',
  },
  {
    q: 'А если не сядет?',
    a: 'Перешьём за наш счёт. Мы шьём по цифровой модели, поэтому промах — это наша ошибка, а не ваш риск.',
  },
  {
    q: 'Вы отправляете в другие страны?',
    a: 'Да. Отправляем по России транспортными компаниями и Почтой, за рубеж — по согласованию. В Воронеже можно забрать самовывозом из ателье.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Что обычно спрашивают.' }]}
          />
        </div>

        <FadeUp>
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
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 md:px-8 md:pb-7 pr-12 text-sm text-muted leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
