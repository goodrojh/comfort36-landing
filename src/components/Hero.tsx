import { ArrowRight } from 'lucide-react'
import LeadForm from '../LeadForm'
import Navbar from './Navbar'
import BgMedia from './BgMedia'
import { media } from '../media'

export default function Hero({ count }: { count: number }) {
  return (
    <section className="w-full p-3 sm:p-4 md:p-6 bg-cream">
      <div className="relative isolate min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-2xl bg-sand md:min-h-[calc(100svh-3rem)] md:rounded-[2rem]">
        <BgMedia video={media.heroVideo} poster={media.heroPoster} alt="Салон тягача с 3D-коврами COMFORT 36" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/25 to-cream/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/55 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-1 pb-8 pt-3 sm:px-2 sm:pt-4 md:px-0">
          <Navbar count={count} />
          <div className="mt-8 grid items-start gap-6 md:mt-[clamp(3.5rem,10svh,6rem)] md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="max-w-3xl md:col-span-7">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-graphite">Грузовое ателье · Воронеж</p>
              <h1 className="max-w-[16ch] text-[clamp(2.2rem,5vw,5rem)] font-extrabold leading-[1.03] tracking-[-0.052em] text-ink">
                3D-ковры по лекалам вашего тягача
              </h1>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink">
                <span className="text-sm font-bold sm:text-base">Комплект «Соты»</span>
                <strong className="whitespace-nowrap text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">7 990 ₽</strong>
                <span className="text-sm font-semibold">Гладкие — <span className="whitespace-nowrap">10 990 ₽</span></span>
              </p>
              <p className="mt-2 max-w-[43ch] text-sm font-semibold text-graphite sm:text-base">
                Точная посадка под вашу кабину. Отправка на следующий день по России.
              </p>
              <a href="#products" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/25 bg-linen px-4 text-sm font-bold text-ink hover:bg-sand">
                Смотреть каталог <ArrowRight size={17} />
              </a>
            </div>
            <div className="min-w-0 md:col-span-5">
              <LeadForm source="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
