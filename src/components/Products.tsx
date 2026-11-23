import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Plus } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'
import { catalog, money, productPhoto, type Product } from '../catalog'

const filters = ['Все', 'Соты', 'Гладкие', 'Чехлы'] as const
const cartHref = `${import.meta.env.BASE_URL}cart.html`

export default function Products({ onAdd }: { onAdd: (id: number, delta: number) => void }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Все')
  const [added, setAdded] = useState<number | null>(null)
  const items = catalog.filter(item => filter === 'Все' || item.kind === filter)

  useEffect(() => {
    if (added === null) return
    const timeout = window.setTimeout(() => setAdded(null), 2500)
    return () => clearTimeout(timeout)
  }, [added])

  function add(product: Product) {
    onAdd(product.id, 1)
    setAdded(product.id)
  }

  return (
    <section id="products" className="bg-sand py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-8 md:mb-12">
          <WordsPullUpMultiStyle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Что мы шьём для вашей кабины.' }]} />
          <span className="block mt-2 text-sm md:text-base text-graphite">«Соты» — 7 990 ₽. Гладкие ковры — 10 990 ₽.</span>
        </h2>
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Вид изделия">
          {filters.map(label => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}
            className={`min-h-11 rounded-full border border-ink/15 px-4 text-sm font-semibold ${filter === label ? 'bg-ink text-cream' : 'bg-linen text-ink'}`}>{label}</button>)}
        </div>
        <div className="sr-only" role="status">{added !== null && 'Товар добавлен в корзину.'}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((product, index) => <FadeUp key={product.id} delay={Math.min(index, 2) * 0.08} className="h-full">
            <article className="group h-full flex flex-col rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden bg-linen border border-ink/10">
              <a href={product.url} target="_blank" rel="noreferrer" className="relative block aspect-[4/3] overflow-hidden">
                <img src={productPhoto(product.id)} alt={`${product.title}, ${product.color}`} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-linen/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 bg-ink text-cream text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full">{product.kind}</span>
              </a>
              <div className="p-5 md:p-6 flex flex-col flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg md:text-xl font-bold text-ink">{product.title}</h3>
                  <span className="font-semibold text-primary whitespace-nowrap">{money(product.price)}</span>
                </div>
                <p className="mt-2 text-sm text-muted flex-1">{product.color}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button type="button" onClick={() => add(product)} aria-label={`В корзину: ${product.title}, ${product.color}`}
                    className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 min-h-11 text-sm font-semibold">
                    {added === product.id ? <Check size={16} /> : <Plus size={16} />} В корзину
                  </button>
                  {added === product.id
                    ? <a href={cartHref} className="text-sm font-semibold underline underline-offset-4">Перейти в корзину</a>
                    : <a href={product.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">Карточка в ВК <ArrowUpRight size={15} /></a>}
                </div>
              </div>
            </article>
          </FadeUp>)}
        </div>
      </div>
    </section>
  )
}
