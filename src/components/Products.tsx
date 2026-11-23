import { useState } from 'react'
import { Camera } from 'lucide-react'
import { StyledHeading } from './StyledHeading'
import { catalog, catalogCover, money, type Product } from '../catalog'
import { catalogPhotoCount } from '../catalog-photos'
import ProductDialog from './ProductDialog'
import CartControl from './CartControl'
import type { useCart } from '../cart'

const filters = ['Все', 'Соты', 'Гладкие', 'Чехлы'] as const

export default function Products({ cart }: { cart: ReturnType<typeof useCart> }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Все')
  const [selected, setSelected] = useState<Product | null>(null)
  const items = catalog.filter(item => filter === 'Все' || item.kind === filter)

  return (
    <section id="products" className="bg-sand py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center mb-5 md:mb-7">
          <StyledHeading className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink"
            segments={[{ text: 'Что мы шьём для вашей кабины.' }]} />
          <span className="block mt-2 text-sm md:text-base text-graphite">«Соты» — 7 990 ₽. Гладкие ковры — 10 990 ₽.</span>
        </h2>
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Вид изделия">
          {filters.map(label => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}
            className={`min-h-11 rounded-full border border-ink/15 px-4 text-sm font-semibold ${filter === label ? 'bg-ink text-cream' : 'bg-linen text-ink'}`}>{label}</button>)}
        </div>
        <div className="grid grid-cols-1 min-[540px]:grid-cols-2 min-[820px]:grid-cols-3 gap-3 md:gap-4">
          {items.map(product => <div key={product.id} className="h-full">
            <article className="h-full flex flex-col rounded-[1.25rem] overflow-hidden bg-linen border border-ink/10">
              <button type="button" onClick={() => setSelected(product)} aria-haspopup="dialog"
                aria-label={`Открыть карточку: ${product.title}`}
                className="relative block w-full aspect-[4/3] min-[820px]:aspect-[16/10] overflow-hidden bg-sand">
                <img src={catalogCover(product.id)} alt={`${product.title}, ${product.color}`} loading="lazy" decoding="async"
                  className="block w-full h-full object-contain" />

                <span className="absolute top-2.5 left-2.5 bg-ink text-cream text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full">{product.kind}</span>
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-linen/95 px-2 py-1 text-[11px] font-semibold"><Camera size={13} /> {catalogPhotoCount[product.id] ?? 1}</span>
              </button>
              <div className="p-3.5 md:p-4 flex flex-col flex-1 min-w-0">
                <div className="grid gap-1.5">
                  <h3 className="text-sm md:text-base leading-tight font-bold text-ink">
                    <button type="button" aria-haspopup="dialog" onClick={() => setSelected(product)} className="text-left hover:underline underline-offset-4">{product.title}</button>
                  </h3>
                  <span className="text-sm font-bold text-ink whitespace-nowrap">{money(product.price)}</span>
                </div>
                <p className="mt-1.5 text-xs text-graphite flex-1">{product.color}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <CartControl quantity={cart.quantities[product.id] ?? 0} label={`${product.title}, ${product.color}`}
                    onChange={delta => cart.change(product.id, delta)} />
                  <button type="button" aria-haspopup="dialog" onClick={() => setSelected(product)}
                    className="min-h-11 text-xs font-semibold underline underline-offset-4">Подробнее</button>
                </div>
              </div>
            </article>
          </div>)}
        </div>
      </div>
      {selected && <ProductDialog key={selected.id} product={selected} quantity={cart.quantities[selected.id] ?? 0}
        onChange={delta => cart.change(selected.id, delta)} onClose={() => setSelected(null)} />}
    </section>
  )
}
