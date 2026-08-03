import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { WordsPullUpMultiStyle } from './anim'
import { media } from '../media'

const works = [
  {
    img: media.workSeats,
    title: 'Volvo FH · комплект «Ромб»',
    meta: 'Чехлы + ковры + торпедо · слоновая кость / кофейная нить',
  },
  {
    img: media.workMats,
    title: 'Scania S · 3D-ковры',
    meta: 'Пятислойные, борта 60 мм · песок / карамель',
  },
  {
    img: media.workDash,
    title: 'DAF XF · торпедо и руль',
    meta: 'Накидка + оплётка ручного пошива · капучино',
  },
]

export default function Works() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="works" className="bg-cream py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[
              { text: 'Кабины, из которых' },
              { text: 'не хочется выходить.', className: 'italic font-serif font-normal text-primary' },
            ]}
          />
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {works.map((w, i) => (
            <motion.figure
              key={w.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden bg-sand"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={w.img}
                  alt={w.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-90" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-base md:text-lg font-bold text-cream">{w.title}</div>
                <div className="text-[11px] md:text-xs text-cream/70 mt-1">{w.meta}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
