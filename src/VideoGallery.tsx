import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
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

  return <section className="section video-section" id="works">
    <div className="wrap">
      <header className="section-head">
        <div><span className="eyebrow">Видео из кабин</span><h2>Как сидят наши ковры</h2></div>
        <p>Посмотрите на посадку у порогов, вокруг тоннеля и под сиденьями.</p>
      </header>
      <div className="video-grid">
        {(expanded ? clips : clips.slice(0, 6)).map(clip =>
          <button className="video-card" key={clip[0]} type="button" onClick={() => setActive(clip)}>
            <img src={asset(`portfolio/${clip[0]}.webp`)} alt="" loading="lazy" decoding="async" width="360" height="640" />
            <span className="play"><Play size={19} fill="currentColor" /></span>
            <span className="video-label">{clip[1]}</span>
          </button>,
        )}
      </div>
      <button type="button" className="button light-outline more" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть видео' : 'Показать ещё 5 видео'}</button>
    </div>
    <dialog ref={dialog} className="video-dialog" aria-label={active?.[1] ?? 'Просмотр видео'}
      onClose={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {active && <div className="video-inner">
        <button className="close-video" type="button" onClick={() => dialog.current?.close()} autoFocus>Закрыть ×</button>
        <video key={active[0]} controls autoPlay playsInline preload="metadata"
          poster={asset(`portfolio/${active[0]}.webp`)} src={asset(`portfolio/${active[0]}.mp4`)} />
        <a href={asset(`portfolio/${active[0]}.mp4`)} target="_blank" rel="noopener noreferrer">Открыть видео в новой вкладке</a>
      </div>}
    </dialog>
  </section>
}
