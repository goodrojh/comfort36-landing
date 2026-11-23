import { ArrowUpRight, Quote } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'

export default function Reviews() {
  return <section id="reviews" className="bg-cream py-16 md:py-28 px-4 md:px-6">
    <div className="max-w-7xl mx-auto text-center">
      <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">Отзывы покупателей</div>
      <WordsPullUpMultiStyle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
        segments={[{ text: 'Отзывы из рейса.' }]} />
      <FadeUp className="mt-8 md:mt-12 max-w-xl mx-auto">
        <div className="rounded-[1.25rem] bg-linen border border-ink/10 p-5 md:p-7">
          <Quote className="w-6 h-6 text-primary/60 mx-auto" />
          <p className="my-4 text-sm text-graphite">Отзывы о товарах и работе ателье собраны на странице продавца.</p>
          <a href="https://vk.ru/reviews-216385176" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline underline-offset-4">
            Все отзывы во ВКонтакте <ArrowUpRight size={16} />
          </a>
        </div>
      </FadeUp>
    </div>
  </section>
}
