import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { WordsPullUpMultiStyle } from './anim'
import { media, contacts } from '../media'

const items = [
  {
    title: '3D-ковры',
    price: 'от 5 990 ₽',
    img: media.workMats,
    text: 'Пять слоёв: экокожа, 3D-основа, гидробарьер, вспененный полиуретан, антискользящая подошва. Моются шлангом.',
    tag: 'Хит',
  },
  {
    title: 'Чехлы на сиденья',
    price: 'от 7 900 ₽',
    img: media.workSeats,
    text: 'Повторяют форму кресла до последнего шва: подголовник, боковая поддержка, подлокотник, механизмы регулировки.',
  },
  {
    title: 'Накидка на торпеду',
    price: 'от 3 490 ₽',
    img: media.workDash,
    text: 'Прячет выгоревший пластик и убирает блики в лобовое. Вырезы под датчики и дефлекторы — по скану.',
  },
  {
    title: 'Оплётка руля и шторы',
    price: 'от 2 490 ₽',
    img: media.stitchMacro,
    text: 'Тот же материал и та же строчка, что и в комплекте, — салон читается как одно целое.',
  },
]

export default function Products() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="products" className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Что мы шьём для вашей кабины.' }]}
          />
          <br />
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-muted"
            segments={[{ text: 'Отдельно или комплектом со скидкой 15%.' }]}
          />
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden bg-linen border border-ink/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-linen/85 via-transparent to-transparent" />
                {item.tag && (
                  <span className="absolute top-4 left-4 bg-ink text-cream text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="p-5 md:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-ink">{item.title}</h3>
                  <span className="text-sm md:text-base font-semibold text-primary whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-muted leading-relaxed">{item.text}</p>
                <a
                  href={contacts.vk}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink border-b border-ink/25 hover:border-ink pb-0.5 transition-colors"
                >
                  Смотреть примеры
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
