import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { WordsPullUpMultiStyle } from './anim'
import BgMedia from './BgMedia'
import { media, contacts } from '../media'

type Card = {
  num: string
  title: string
  icon: string
  points: string[]
}

const cards: Card[] = [
  {
    num: '01',
    title: '3D-скан кабины',
    icon: media.iconScan,
    points: [
      'Ручной сканер снимает пол и кресла с точностью до миллиметра',
      'Цифровая модель вашей модификации сохраняется в базе навсегда',
      'Нет вашей модели — приедем и отсканируем бесплатно',
      'Повторный заказ — уже без замеров',
    ],
  },
  {
    num: '02',
    title: 'Раскрой по лекалам',
    icon: media.iconCut,
    points: [
      'Панели режутся по цифровой модели, а не «по месту»',
      'Вырезы под салазки, ремни, педали и люки — заранее',
      'Экокожа автомобильного класса, 250 000 циклов на истирание',
    ],
  },
  {
    num: '03',
    title: 'Пошив и отправка',
    icon: media.iconSew,
    points: [
      'Ромб, соты или волна — стёжку и цвет нити выбираете вы',
      'Готово за 5 рабочих дней, срочно — за 2',
      'СДЭК, Почта России, самовывоз в Воронеже, отправка по миру',
    ],
  },
]

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="process" className="relative min-h-screen bg-cream py-16 md:py-28 px-4 md:px-6">
      <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Заводская точность в частном ателье.' }]}
          />
          <br />
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-muted"
            segments={[{ text: 'Три шага от скана до готового салона.' }]}
          />
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-2 lg:h-[520px]"
        >
          {/* карточка-видео */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.25rem] overflow-hidden bg-sand min-h-[320px] lg:min-h-0"
          >
            <BgMedia
              video={media.stitchVideo}
              poster={media.stitchMacro}
              alt="Макросъёмка стёжки по экокоже"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <div className="text-[10px] uppercase tracking-[0.18em] text-cream/70 mb-1.5">
                Материал
              </div>
              <div className="text-lg md:text-xl font-bold text-cream leading-tight">
                Строчка, которую видно
                <br />с водительского места.
              </div>
            </div>
          </motion.div>

          {cards.map((card, i) => (
            <motion.div
              key={card.num}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: (i + 1) * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.25rem] bg-linen border border-ink/10 p-5 md:p-6 flex flex-col"
            >
              <img
                src={card.icon}
                alt=""
                loading="lazy"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
              />

              <h3 className="mt-4 text-base sm:text-lg font-bold text-ink leading-snug">
                {card.title}
                <span className="text-primary font-normal"> ({card.num})</span>
              </h3>

              <ul className="mt-4 space-y-2.5 flex-1">
                {card.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-[13px] text-muted leading-snug">{p}</span>
                  </li>
                ))}
              </ul>

              <a
                href={contacts.vk}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink"
              >
                Подробнее
                <ArrowRight className="w-4 h-4 -rotate-45 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
