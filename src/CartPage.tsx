import { ShoppingCart, Trash2 } from 'lucide-react'
import CheckoutFrame, { checkoutPanel } from './CheckoutFrame'
import CartControl from './components/CartControl'
import LeadForm, { leadButton } from './LeadForm'
import { catalogCover, money } from './catalog'
import type { useCart } from './cart'

export default function CartPage({ cart }: { cart: ReturnType<typeof useCart> }) {
  const order = cart.items.map(({ product, count }) =>
    `• ${product.title} (${product.kind}, ${product.color}) × ${count} — ${money(product.price * count)}`,
  ).concat(`Товары: ${money(cart.total)}. Доставку прошу рассчитать отдельно.`).join('\n')
  const empty = cart.count === 0

  return <CheckoutFrame count={cart.count} title="Корзина" icon={<ShoppingCart size={34} />}
    description={empty ? 'Подберите комплект для своей кабины.' : 'Проверьте комплект и оставьте контакты для согласования заказа.'}>
    {empty ? <div className={`${checkoutPanel} mt-4`}>
      <h2 className="text-xl font-extrabold">Корзина пока пуста</h2>
      <a href={import.meta.env.BASE_URL + '#products'} className={`${leadButton} mt-4`}>Перейти в каталог</a>
    </div> :
      <div className="mt-4 grid items-start gap-4 md:mt-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-5">
        <section aria-labelledby="cart-items">
          <h2 id="cart-items" className="sr-only">Товары в корзине</h2>
          <ul className="grid gap-3">{cart.items.map(({ product, count }) =>
            <li key={product.id} className="grid grid-cols-[minmax(5rem,0.75fr)_minmax(0,1.45fr)] items-start gap-3 rounded-[1.25rem] border border-ink/10 bg-linen p-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-5 sm:p-4">
              <img className="aspect-square w-full rounded-xl bg-sand object-contain sm:aspect-[4/3]" src={catalogCover(product.id)}
                alt={`${product.title}, ${product.color}`} width="480" height="360" decoding="async" />
              <div className="grid min-w-0 gap-1.5">
                <h3 className="break-words text-sm font-extrabold leading-snug sm:text-lg">{product.title}</h3>
                <p className="text-xs text-graphite sm:text-sm">{product.kind} · {product.color}</p>
                <strong className="text-base font-extrabold sm:text-xl">{money(product.price * count)}</strong>
                <div className="flex flex-wrap items-center gap-1.5">
                  <CartControl quantity={count} label={`${product.title}, ${product.color}`} onChange={delta => cart.change(product.id, delta)} />
                  <button type="button" aria-label={`Удалить: ${product.title}, ${product.color}`} onClick={() => cart.change(product.id, -count)}
                    className="grid h-11 w-11 place-items-center rounded-full text-graphite hover:bg-sand">
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>,
          )}</ul>
        </section>
        <aside className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-linen">
          <div className="bg-ink px-4 py-5 text-cream sm:px-6 lg:px-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h2 className="text-base font-bold">Сумма товаров</h2>
              <strong className="text-2xl font-extrabold text-primarysoft sm:text-3xl">{money(cart.total)}</strong>
            </div>
            <p className="mt-1 text-xs text-cream/80 sm:text-sm">Доставку рассчитаем при подтверждении.</p>
          </div>
          <LeadForm source="cart" order={order} />
        </aside>
      </div>}
  </CheckoutFrame>
}
