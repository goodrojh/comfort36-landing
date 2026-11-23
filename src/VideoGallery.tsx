import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { StyledHeading } from './components/StyledHeading'
import { asset } from './catalog'

const clips = [
  [1001, 'Ковры «Соты» в кабине'],
  [1004, 'Серая строчка на чёрном'],
  [1005, 'Оранжевые «Соты»'],
  [1007, 'Комплект в светлой кабине'],
  [1009, 'Гладкие ковры Dongfeng'],
  [1010, 'Посадка гладких ковров'],
  [1002, 'Ковры цвета паприки'],
  [1003, 'Комплект в кабине крупным планом'],
  [1006, 'Чёрные «Соты» у порога'],
  [1008, 'Ковры под водительским сиденьем'],
  [1011, 'Обзор комплекта в рейсе'],
] as const

export default function VideoGallery() {
  const [active, setActive] = useState<(typeof clips)[number] | null>(null)
  const [expanded, setExpanded] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (active && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [active])

  return <section className="bg-cream py-16 md:py-28 px-4 md:px-6" id="works">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-center mb-10 md:mb-16">
        <StyledHeading className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
          segments={[{ text: 'Кабины, из которых' }, { text: 'не хочется выходить.', className: 'italic font-serif font-normal text-primary' }]} />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {(expanded ? clips : clips.slice(0, 3)).map(clip => <div key={clip[0]}>
          <button className="group relative block text-left w-full aspect-[4/5] overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem] bg-sand" type="button" onClick={() => setActive(clip)}>
            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" src={asset(`portfolio/${clip[0]}.webp`)} alt="" loading="lazy" decoding="async" width="360" height="640" />
            <span className="absolute right-2 top-2 md:right-4 md:top-4 rounded-full bg-linen text-ink w-11 h-11 grid place-items-center"><Play size={19} fill="currentColor" /></span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/65 to-transparent pt-9 pb-3 px-3 md:p-6 text-cream font-bold text-sm md:text-lg">{clip[1]}</span>
          </button></div>,
        )}
      </div>
      <button type="button" className="mx-auto mt-8 block rounded-full min-h-11 px-5 border border-ink/20 font-semibold text-sm" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть видео' : 'Показать ещё 8 видео'}</button>
    </div>
    <dialog ref={dialog} className="video-dialog m-auto rounded-2xl bg-ink p-2 text-cream w-[min(28rem,calc(100%-1.5rem))] max-w-[calc(100%-1.5rem)] max-h-[calc(100%-1.5rem)] backdrop:bg-ink/90" aria-label={active?.[1] ?? 'Просмотр видео'}
      onClose={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {active && <div className="grid justify-items-center gap-2">
        <button className="justify-self-end px-3 min-h-11 font-semibold" type="button" onClick={() => dialog.current?.close()} autoFocus>Закрыть ×</button>
        <video className="max-w-full h-[min(68dvh,630px)] w-auto" key={active[0]} controls autoPlay playsInline preload="metadata"
          poster={asset(`portfolio/${active[0]}.webp`)} src={asset(`portfolio/${active[0]}.mp4`)} />
        <a className="min-h-9 text-sm underline" href={asset(`portfolio/${active[0]}.mp4`)} target="_blank" rel="noopener noreferrer">Открыть видео в новой вкладке</a>
      </div>}
    </dialog>
  </section>
}
