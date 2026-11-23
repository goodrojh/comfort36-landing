import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { ArrowUpRight, Minus, Plus, Trash2 } from 'lucide-react'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Offer from './components/Offer'
import Products from './components/Products'
import Process from './components/Process'
import Configurator from './components/Configurator'
import Compare from './components/Compare'
import Reviews from './components/Reviews'
import Faq from './components/Faq'
import MapSection from './components/MapSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContacts from './components/FloatingContacts'
import LeadForm from './LeadForm'
import VideoGallery from './VideoGallery'
import { useCart } from './cart'
import { money, productPhoto } from './catalog'
import { contacts } from './media'
import { getAttribution } from './attribution'

const home = import.meta.env.BASE_URL
const isCart = location.pathname.endsWith('/cart.html')
const isPrivacy = location.pathname.endsWith('/privacy.html')
const isConsent = location.pathname.endsWith('/consent.html')

function CartPage({ cart }: { cart: ReturnType<typeof useCart> }) {
  const order = cart.items.map(({ product, count }) =>
    `• ${product.title} (${product.kind}, ${product.color}) × ${count} — ${money(product.price * count)}`,
  ).concat(`Товары: ${money(cart.total)}. Доставку прошу рассчитать отдельно.`).join('\n')

  return <main className="min-h-[65vh] px-4 py-12 md:py-20">
    <div className="max-w-6xl mx-auto">
      <a href={home + '#products'} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">← Вернуться в каталог</a>
      <h1 className="my-5 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-ink [overflow-wrap:anywhere]">Корзина</h1>
      {!cart.items.length ? <div className="rounded-[1.25rem] border border-ink/10 bg-linen p-5 space-y-4"><p>Корзина пока пуста. Подберите комплект для своей кабины.</p>
        <a href={home + '#products'} className="inline-flex items-center rounded-full bg-ink text-cream px-5 min-h-11 font-semibold text-sm">Перейти в каталог</a></div> :
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <ul className="grid gap-3">{cart.items.map(({ product, count }) =>
              <li key={product.id} className="cart-item rounded-[1.25rem] border border-ink/10 bg-linen p-3 grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <img className="w-16 h-16 rounded-xl object-cover" src={productPhoto(product.id)} alt="" width="84" height="84" />
                <div className="space-y-1 text-sm min-w-0"><h2 className="font-bold">{product.title}</h2><p className="text-muted">{product.kind} · {product.color}</p><strong>{money(product.price * count)}</strong></div>
                <div className="cart-quantity flex flex-wrap items-center gap-1.5 col-start-2 sm:col-start-auto">
                  <button type="button" aria-label={`Уменьшить: ${product.title}`} onClick={() => cart.change(product.id, -1)}><Minus size={16} /></button>
                  <span aria-label="Количество">{count}</span>
                  <button type="button" aria-label={`Увеличить: ${product.title}`} disabled={count >= 99} onClick={() => cart.change(product.id, 1)}><Plus size={16} /></button>
                  <button type="button" aria-label={`Удалить: ${product.title}`} onClick={() => cart.change(product.id, -count)}><Trash2 size={16} /></button>
                </div>
              </li>,
            )}</ul>
            <div className="cart-total flex justify-between gap-2 pt-5 text-sm md:text-base"><span>Товары, без доставки</span><strong>{money(cart.total)}</strong></div>
          </div>
          <aside>
            <LeadForm source="cart" order={order} key={order} />
            <div className="mt-3 rounded-[1.25rem] border border-ink/10 bg-sand p-5 space-y-2"><h2 className="font-bold">Удобнее сразу написать?</h2>
              <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Написать в ВК <ArrowUpRight size={17} /></a>
            </div>
          </aside>
        </div>}
    </div>
  </main>
}

function Privacy() {
  return <main className="px-4 py-12 md:py-20"><div className="max-w-3xl mx-auto space-y-4 text-graphite leading-relaxed">
    <a href={home} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">← На главную</a>
    <h1 className="my-5 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-ink [overflow-wrap:anywhere]">Конфиденциальность</h1>
    <p>Формы на этом сайте подготавливают черновик обращения в браузере. Черновик не отправляется с сайта и не сохраняется на сервере. Сайт не запрашивает имя, телефон или адрес покупателя.</p>
    <p>Если вы отправите черновик в ВК, сообщение получит автоателье «Комфорт 36». Вопросы об обработке данных можно направить в сообщения сообщества.</p>
    <p>Сайт хранит корзину в браузере, а допустимые рекламные метки сохраняет до закрытия вкладки для добавления к черновику заявки. Открытие карты загружает виджет Яндекса.</p>
    <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

function Consent() {
  return <main className="px-4 py-12 md:py-20"><div className="max-w-3xl mx-auto space-y-4 text-graphite leading-relaxed">
    <a href={home} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">← На главную</a>
    <h1 className="my-5 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-ink [overflow-wrap:anywhere]">Согласие на обработку персональных данных</h1>
    <p>Я даю автоателье «Комфорт 36» согласие на обработку сведений, которые самостоятельно отправлю в сообщения его сообщества ВКонтакте. Ателье использует их для ответа на обращение, подбора комплекта и согласования заказа.</p>
    <p>Согласие охватывает данные из обращения и данные профиля, доступные ателье при переписке в ВК. Согласие действует до обработки обращения или до отзыва. Для отзыва я могу написать в это же сообщество.</p>
    <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

export default function App() {
  const cart = useCart()
  useEffect(() => { getAttribution() }, [])

  return <MotionConfig reducedMotion="user">
    {isCart ? <CartPage cart={cart} />
      : isPrivacy ? <Privacy />
      : isConsent ? <Consent />
      : <main>
        <Hero count={cart.count} />
        <Products onAdd={cart.change} />
        <Marquee />
        <Offer />
        <Process />
        <Configurator />
        <VideoGallery />
        <Compare />
        <Reviews />
        <Faq />
        <MapSection />
        <Contact />
      </main>}
    <Footer />
    {!isPrivacy && !isConsent && <FloatingContacts />}
  </MotionConfig>
}
