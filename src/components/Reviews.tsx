import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { WordsPullUpMultiStyle } from './anim'
import { contacts } from '../media'

const reviews = [
  {
    name: 'Александр',
    city: 'Москва',
    product: 'Оплётка на руль',
    text: 'Сделали быстро и качественно! Оплётка идеально села, руки не скользят. Теперь в дороге гораздо комфортнее.',
  },
  {
    name: 'Иван',
    city: 'Новосибирск',
    product: '3D-ковёр',
    text: 'Ковры шикарные! Повторяют форму кабины, легко моются и реально защищают пол от грязи. Очень доволен.',
  },
  {
    name: 'Мария',
    city: 'Санкт-Петербург',
    product: 'Чехлы на сиденья',
    text: 'Заказывала чехлы для своего грузовика. Материал качественный, пошив аккуратный. Сиденья выглядят как новые!',
  },
  {
    name: 'Дмитрий',
    city: 'Екатеринбург',
    product: 'Комплект в кабину',
    text: 'Очень доволен работой Comfort 36. Качество на высоте, установка прошла без проблем. Рекомендую всем!',
  },
]

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-cream py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">
            1 423 водителя уже переоделись
          </div>
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Отзывы из рейса.' }]}
          />
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.25rem] bg-linen border border-ink/10 p-5 md:p-6 flex flex-col"
            >
              <Quote className="w-6 h-6 text-primary/40" />
              <p className="mt-4 text-sm text-graphite leading-relaxed flex-1">«{r.text}»</p>
              <div className="mt-5 pt-4 border-t border-ink/10">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="text-sm font-bold text-ink">
                  {r.name}, {r.city}
                </div>
                <div className="text-xs text-muted mt-0.5">{r.product}</div>
              </div>
            </motion.blockquote>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <a
            href={contacts.vk}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink border-b border-ink/25 hover:border-ink pb-0.5 transition-colors"
          >
            Все отзывы во ВКонтакте
          </a>
        </div>
      </div>
    </section>
  )
}
