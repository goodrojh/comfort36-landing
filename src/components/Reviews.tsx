import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Maximize2, X } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'
import { asset } from '../catalog'

const reviewsUrl = 'https://vk.ru/reviews-216385176'

const reviews = [
  { id: 'nikita', name: 'Никита Гурьянов', date: '18 ноября', excerpt: 'Заказал ковры у ребят ,пришли установил все село идеально ,коврами доволен', height: 153, width: 600 },
  { id: 'gennady', name: 'Геннадий Волнухин', date: '15 ноября', excerpt: 'Заказывал ковры на камаз к5. Прислали сдэком даже раньше чем договаривались', height: 326, width: 600 },
  { id: 'yana', name: 'Яна Рожкова', date: '13 ноября', excerpt: 'Хорошие ковры! Заказали в 2 автомобиля, всё подошло, легли супер.', height: 308, width: 598 },
  { id: 'anton', name: 'Антон Бегунов', date: '12 ноября', excerpt: 'Ковры 🔥 на volvo fm 9 + коврик водителя отдельный , доволен как слон, спасибо ребятам', height: 293, width: 596 },
  { id: 'denis', name: 'Денис Михайлов', date: '11 ноября', excerpt: 'Хорошее качество и приятный ценник. Пришли быстро, устелил, все подошло.', height: 325, width: 598 },
  { id: 'ilya', name: 'Илья Толстов', date: '11 ноября', excerpt: 'Хорошее качество и сроки кайф!', height: 265, width: 598 },
]

export default function Reviews() {
  const [active, setActive] = useState<(typeof reviews)[number] | null>(null)
  const modal = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = modal.current
    if (!active || !dialog) return
    if (!dialog.open) dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [active])

  return <section id="reviews" className="bg-cream py-16 md:py-28 px-4 md:px-6">
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-7 md:mb-10">
        <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">Отзывы покупателей</div>
        <h2><WordsPullUpMultiStyle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
          segments={[{ text: 'Отзывы из рейса.' }]} /></h2>
        <a href={reviewsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-graphite underline underline-offset-4">
          4,7 из 5 · 79 отзывов во ВКонтакте <ArrowUpRight size={15} />
        </a>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {reviews.map((review, index) => <FadeUp key={review.id} delay={(index % 3) * 0.08} className="h-full">
          <article id={`review-${review.id}`} className="h-full flex flex-col rounded-[1.25rem] bg-linen border border-ink/10 p-4 md:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="font-bold text-ink">{review.name}</h3>
              <span className="text-xs text-muted">{review.date} · 5 из 5</span>
            </div>
            <blockquote className="mt-2 text-sm text-graphite leading-relaxed flex-1">«{review.excerpt}»</blockquote>
            <button type="button" aria-haspopup="dialog" aria-label={`Увеличить скриншот: ${review.name}`} onClick={() => setActive(review)}
              className="relative mt-4 w-full overflow-hidden rounded-xl border border-ink/10 bg-white text-left">
              <img src={asset(`reviews/${review.id}.webp`)} width={review.width} height={review.height} alt="" loading="lazy"
                className="block w-full h-auto" />
              <span className="flex w-full items-center justify-between gap-2 bg-linen px-3 min-h-11 text-xs font-semibold">
                Увеличить скриншот <Maximize2 size={15} />
              </span>
            </button>
          </article>
        </FadeUp>)}
      </div>
      <div className="mt-7 text-center">
        <a href={reviewsUrl} target="_blank" rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold">
          Все отзывы во ВКонтакте <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
    <dialog ref={modal} onClose={() => setActive(null)} aria-label={active ? `Отзыв: ${active.name}` : 'Скриншот отзыва'}
      onClick={event => { if (event.target === event.currentTarget) modal.current?.close() }}
      className="m-auto w-[calc(100%-1rem)] max-w-3xl max-h-[calc(100dvh-1rem)] rounded-2xl bg-linen backdrop:bg-ink/70">
      {active && <div className="p-3 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="font-bold">{active.name} · {active.date}</h3>
          <button type="button" autoFocus aria-label="Закрыть скриншот" onClick={() => modal.current?.close()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15"><X size={20} /></button>
        </div>
        <img src={asset(`reviews/${active.id}.webp`)} width={active.width} height={active.height}
          alt={`Скриншот отзыва ВКонтакте. ${active.excerpt}`} className="block w-full rounded-lg" />
        <a href={reviewsUrl} target="_blank" rel="noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
          Список отзывов в ВК <ArrowUpRight size={16} />
        </a>
      </div>}
    </dialog>
  </section>
}
