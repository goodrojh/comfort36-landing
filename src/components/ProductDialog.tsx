import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { catalogImage, cartUrl, money, type Product } from '../catalog'
import { catalogPhotoCount } from '../catalog-photos'
import CartControl from './CartControl'

type Props = {
  product: Product
  quantity: number
  onChange: (delta: number) => void
  onClose: () => void
}

export default function ProductDialog({ product, quantity, onChange, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)
  const count = catalogPhotoCount[product.id] ?? 1

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (!element.open) element.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  function step(delta: number) {
    setCurrent(index => (index + delta + count) % count)
  }

  return <dialog ref={dialog} onClose={onClose} aria-labelledby="catalog-dialog-title"
    onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}
    onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      step(event.key === 'ArrowLeft' ? -1 : 1)
    }}
    className="m-auto w-[calc(100%-1rem)] max-w-4xl max-h-[calc(100dvh-1rem)] rounded-[1.25rem] border border-ink/10 bg-linen text-ink backdrop:bg-ink/70 sm:max-h-[calc(100dvh-3rem)]">
    <div className="p-3 sm:p-5 md:p-6">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 id="catalog-dialog-title" className="text-lg font-extrabold leading-tight sm:text-2xl">{product.title}</h2>
          <p className="mt-1 text-sm text-graphite">{product.kind} · {product.color}</p>
        </div>
        <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Закрыть карточку"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 hover:bg-sand">
          <X size={21} />
        </button>
      </div>
      <div className="relative rounded-xl bg-sand overflow-hidden">
        <img key={current} src={catalogImage(product.id, current)}
          alt={`${product.title}, фото ${current + 1} из ${count}`}
          className="block h-[min(46dvh,460px)] w-full object-contain sm:h-[min(51dvh,460px)]" />
        {count > 1 && <>
          <button type="button" onClick={() => step(-1)} aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 grid -translate-y-1/2 place-items-center h-11 w-11 rounded-full bg-linen shadow-md">
            <ChevronLeft size={23} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Следующее фото"
            className="absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center h-11 w-11 rounded-full bg-linen shadow-md">
            <ChevronRight size={23} />
          </button>
          <span className="absolute bottom-2 right-2 rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold text-linen"
            aria-live="polite">{current + 1} / {count}</span>
        </>}
      </div>
      {count > 1 && <div className="mt-2 flex gap-2 overflow-x-auto p-1" role="group" aria-label="Фотографии товара">
        {Array.from({ length: count }, (_, i) =>
          <button type="button" key={i} onClick={() => setCurrent(i)} aria-pressed={current === i} aria-label={`Фото ${i + 1}`}
            className={`h-12 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-sand sm:h-14 sm:w-20 ${current === i ? 'border-ink' : 'border-transparent'}`}>
            <img src={catalogImage(product.id, i, true)} alt="" className="h-full w-full object-contain" />
          </button>,
        )}
      </div>}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <strong className="text-lg font-extrabold whitespace-nowrap sm:text-xl">{money(product.price)}</strong>
        <CartControl quantity={quantity} label={`${product.title}, ${product.color}`} onChange={onChange} />
        {quantity > 0 && <a href={cartUrl} className="text-sm font-semibold underline underline-offset-4">Перейти в корзину</a>}
        <a href={product.url} target="_blank" rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline underline-offset-4">
          Карточка в ВК <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  </dialog>
}
