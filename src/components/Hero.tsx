import { motion } from 'framer-motion'
import { ArrowRight, ScanLine } from 'lucide-react'
import Navbar from './Navbar'
import BgMedia from './BgMedia'
import { WordsPullUp, EASE } from './anim'
import { media } from '../media'

export default function Hero() {
  return (
    <section className="h-[100svh] w-full p-3 sm:p-4 md:p-6 bg-cream">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-sand">
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

        <Navbar />

        {/* левый верхний маркер */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="hidden md:block absolute top-8 left-8 z-20"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-graphite">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Грузовое ателье · Воронеж · с 2019
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
              3D-ковры по акции
            </div>
            <div className="text-xl md:text-3xl font-extrabold text-ink leading-none mt-1">
              5 990 ₽
            </div>
            <div className="text-[10px] md:text-[11px] text-muted mt-1">
              в столичных — <span className="line-through">от 12 990 ₽</span>
            </div>
          </div>
        </motion.div>

        {/* нижний блок */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-4 sm:px-5 sm:pb-6 md:px-10 md:pb-10">
          <div className="grid grid-cols-12 gap-3 md:gap-6 items-end">
            <div className="col-span-12 md:col-span-7 order-2 md:order-1">
              <h1
                className="text-[16.5vw] sm:text-[15vw] md:text-[13.5vw] lg:text-[13vw] font-extrabold leading-[0.84] tracking-[-0.05em] text-ink"
                aria-label="COMFORT 36"
              >
                <WordsPullUp text="COMFORT 36" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9 order-1 md:order-2 pb-1 md:pb-6">
              {/* матовая подложка: поверх видео обычный текст читался плохо */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                className="bg-linen/85 backdrop-blur-md border border-ink/10 rounded-2xl p-4 md:p-5 shadow-[0_24px_70px_-40px_rgba(25,21,16,0.7)]"
              >
                <p
                  className="text-ink text-[13px] sm:text-sm md:text-[15px] font-medium"
                  style={{ lineHeight: 1.45 }}
                >
                  Снимаем вашу кабину 3D-сканером и шьём комплект по лекалам именно вашего
                  тягача — 3D-ковры, чехлы, накидки, оплётка. Садится как заводское, служит годами.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <a
                    href="#calc"
                    className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-ink rounded-full pl-5 pr-1.5 py-1.5 text-cream font-semibold text-sm"
                  >
                    Рассчитать за 60 секунд
                    <span className="bg-primary rounded-full w-9 h-9 grid place-items-center transition-transform duration-300 group-hover:scale-110">
                      <ArrowRight className="w-4 h-4 text-linen" />
                    </span>
                  </a>
                  <a
                    href="#process"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-graphite hover:text-ink border-b border-ink/25 hover:border-ink pb-0.5 transition-colors"
                  >
                    <ScanLine className="w-4 h-4 text-primary" />
                    Как снимаем лекала
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-3 md:mt-5 pt-3 md:pt-4 border-t border-ink/15 flex flex-wrap gap-x-4 gap-y-1 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.12em] text-graphite/80"
          >
            <span>* лекала под 40+ моделей</span>
            <span>Пошив 5 дней</span>
            <span>Гарантия посадки</span>
            <span className="hidden sm:inline">Отправка по всему миру</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
