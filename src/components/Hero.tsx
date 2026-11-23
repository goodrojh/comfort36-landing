import { motion } from 'framer-motion'
import LeadForm from '../LeadForm'
import Navbar from './Navbar'
import BgMedia from './BgMedia'
import { WordsPullUp, EASE } from './anim'
import { media } from '../media'

export default function Hero({ count }: { count: number }) {
  return (
    <section className="w-full p-3 sm:p-4 md:p-6 bg-cream">
      <div className="relative w-full min-h-[calc(100svh-1.5rem)] md:min-h-[calc(100svh-3rem)] flex flex-col justify-end rounded-2xl md:rounded-[2rem] overflow-hidden bg-sand">
        <BgMedia
          video={media.heroVideo}
          poster={media.heroPoster}
          alt="Салон тягача с 3D-коврами и чехлами COMFORT 36"
        />

        {/* фактура плёнки */}
        <div className="absolute inset-0 noise-overlay opacity-[0.3] mix-blend-soft-light pointer-events-none" />
        {/* световая вуаль под тёмный текст */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/45 via-transparent to-cream/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/70 via-transparent to-transparent pointer-events-none" />

        <Navbar count={count} />

        {/* левый верхний маркер */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="hidden xl:block absolute top-20 left-8 z-20"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-graphite">

            <img src={`${import.meta.env.BASE_URL}media/brand.webp`} alt="" width="30" height="30" className="rounded-full" />
            Грузовое ателье · Воронеж
          </div>
        </motion.div>

        {/* плашка оффера */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className="absolute top-20 right-3 md:top-24 md:right-8 z-20"
        >
          <div className="bg-linen/90 backdrop-blur-sm border border-ink/10 rounded-2xl px-3.5 py-2.5 md:px-5 md:py-4 text-right shadow-[0_20px_60px_-30px_rgba(25,21,16,0.6)]">
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.16em] text-muted">
              3D-ковры «Соты»
            </div>
            <div className="text-xl md:text-3xl font-extrabold text-ink leading-none mt-1">
              7 990 ₽
            </div>
            <div className="text-[10px] md:text-[11px] text-muted mt-1">
              Гладкие · 10 990 ₽
            </div>
          </div>
        </motion.div>

        {/* нижний блок */}
        <div className="relative z-20 px-3 pt-44 pb-4 sm:px-5 sm:pb-6 md:px-10 md:pt-48 md:pb-10">
          <div className="grid grid-cols-12 gap-3 md:gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <h1
                className="text-[16.5vw] sm:text-[15vw] md:text-[10.7vw] lg:text-[12.4vw] xl:text-[13vw] font-extrabold leading-[0.84] tracking-[-0.05em] text-ink"
                aria-label="COMFORT 36"
              >
                <WordsPullUp text="COMFORT 36" />
              </h1>
            </div>

            <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-9 pb-1 md:pb-6">
              {/* матовая подложка: поверх видео обычный текст читался плохо */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                className="bg-linen/85 backdrop-blur-md border border-ink/10 rounded-2xl p-4 md:p-5 shadow-[0_24px_70px_-40px_rgba(25,21,16,0.7)]"
              >
                <p className="text-ink text-[13px] sm:text-sm md:text-[15px] font-semibold leading-relaxed">
                  Премиальные 3D-ковры для грузовиков за <span className="whitespace-nowrap">7 990 ₽</span>. Шьём по точным лекалам под вашу модель, без посредников и переплаты за бренд.
                </p>
                <p className="mt-2 text-xs sm:text-sm text-graphite">
                  Легко чистятся и защищают пол от грязи, снега и влаги. Готовые комплекты в наличии, отправка на следующий день по России.
                </p>
                <LeadForm source="hero" compact />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-3 md:mt-5 pt-3 md:pt-4 border-t border-ink/15 flex flex-wrap gap-x-4 gap-y-1 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.12em] text-graphite/80"
          >
            <span>Точные лекала под модель</span>
            <span>Пошив за 1 день</span>
            <span>Посадка без складок и зазоров</span>
            <span className="hidden sm:inline">Доставка по России</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
