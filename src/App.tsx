import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, Menu, MessageCircle, Minus, Phone, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { asset, catalog, money, productPhoto, type Product } from './catalog'
import { contacts } from './media'
import { useCart } from './cart'
import { getAttribution } from './attribution'
import LeadForm from './LeadForm'
import VideoGallery from './VideoGallery'

const base = import.meta.env.BASE_URL
const home = base
const cartHref = `${base}cart.html`
const privacyHref = `${base}privacy.html`
const market = 'https://vk.ru/market-216385176'
const reviews = 'https://vk.ru/reviews-216385176'
const isCart = location.pathname.endsWith('/cart.html')
const isConsent = location.pathname.endsWith('/consent.html')
const isPrivacy = location.pathname.endsWith('/privacy.html')
const sections = [['#catalog', 'Каталог'], ['#works', 'Видео работ'], ['#reviews', 'Отзывы'], ['#map', 'Контакты']]

function SocialLinks() {
  const channels = [
    ['vk', 'ВКонтакте', contacts.vkWrite],
    ['max', 'MAX', contacts.max],
    ['whatsapp', 'WhatsApp', contacts.whatsapp],
    ['telegram', 'Telegram', contacts.telegram],
  ]
  return <div className="socials">{channels.map(([icon, title, href]) =>
    <a key={icon} href={href} aria-label={`Написать в ${title}`} title={title} target="_blank" rel="noopener noreferrer">
      <img src={asset(`social/${icon}.svg`)} alt="" width="22" height="22" decoding="async" />
    </a>,
  )}</div>
}

function Header({ count }: { count: number }) {
  const menu = useRef<HTMLDetailsElement>(null)
  return <header className="site-header">
    <div className="wrap header">
      <a className="brand" href={home}><img src={asset('brand.webp')} width="46" height="46" alt="" />
        <span>КОМФОРТ 36<small>Грузовое ателье</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Основное меню">{sections.map(([hash, title]) =>
        <a key={hash} href={home + hash}>{title}</a>,
      )}</nav>
      <div className="header-actions">
        <a className="header-phone" href={contacts.phoneHref}><Phone size={16} />{contacts.phone}</a>
        <a className="cart-link" href={cartHref} aria-label={`Корзина, товаров: ${count}`} aria-current={isCart ? 'page' : undefined}>
          <ShoppingBag size={19} /><span className="cart-name">Корзина</span><span>{count}</span>
        </a>
        <details className="mobile-nav" ref={menu}>
          <summary aria-label="Меню"><Menu size={22} /></summary>
          <nav aria-label="Мобильное меню">{sections.map(([hash, title]) =>
            <a key={hash} href={home + hash} onClick={() => { if (menu.current) menu.current.open = false }}>{title}</a>,
          )}<a href={contacts.phoneHref}>{contacts.phone}</a></nav>
        </details>
      </div>
    </div>
  </header>
}

function Hero() {
  return <section className="hero" id="top">
    <div className="wrap hero-grid">
      <div className="hero-content">
        <span className="eyebrow">Для грузовых автомобилей</span>
        <h1>Премиальные 3D-ковры <span>за 7 990 ₽</span></h1>
        <p className="hero-intro">Комплект «Соты» по лекалам вашей модели. Без посредников и переплаты за бренд.</p>
        <ul className="hero-points">
          <li><Check size={17} /> Точная посадка без складок и зазоров</li>
          <li><Check size={17} /> Легко чистятся, защищают пол от грязи и влаги</li>
          <li><Check size={17} /> Отгрузка на следующий день, доставка по России</li>
        </ul>
        <div className="hero-actions"><a href="#catalog" className="button light-outline">Каталог <ArrowDown size={17} /></a>
          <a href="#works" className="button light-outline mobile-video">Видео работ <ArrowUpRight size={17} /></a></div>
      </div>
      <div className="hero-photo">
        <img src={asset('catalog/13070080.webp')} alt="Установленные ковры «Соты» в кабине Sitrak MAX" width="480" height="580" fetchPriority="high" />
        <a href="#works">Видео из кабин <ArrowUpRight size={17} /></a>
      </div>
      <LeadForm source="hero" />
    </div>
  </section>
}

const filters = ['Все', 'Соты', 'Гладкие', 'Чехлы'] as const

function Catalog({ onAdd }: { onAdd: (id: number, delta: number) => void }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Все')
  const [status, setStatus] = useState('')
  const [added, setAdded] = useState<number | null>(null)
  const items = catalog.filter(item => filter === 'Все' || item.kind === filter)

  function add(product: Product) {
    onAdd(product.id, 1)
    setAdded(product.id)
    setStatus(`${product.title} — добавлено в корзину.`)
  }

  return <section className="section" id="catalog">
    <div className="wrap">
      <header className="section-head"><div><span className="eyebrow">Каталог</span><h2>Подберите комплект</h2></div>
        <p>«Соты» — 7 990 ₽. Гладкие ковры — 10 990 ₽. Готовые комплекты в наличии. Мастер подскажет, какой подойдёт вашей кабине.</p>
      </header>
      <div className="filters" role="group" aria-label="Вид изделия">{filters.map(label =>
        <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>,
      )}
      <a className="text-link catalog-vk" href={market} target="_blank" rel="noopener noreferrer">Весь ВК Маркет <ArrowUpRight size={16} /></a></div>
      <p className="sr-only" role="status">{status}</p>
      <div className="product-grid">{items.map(product =>
        <article className="product" key={product.id}>
          <a className="product-image" href={product.url} target="_blank" rel="noopener noreferrer" aria-label={`Открыть в ВК Маркете: ${product.title}, ${product.color}`}>
            <img src={productPhoto(product.id)} alt={`${product.title}, ${product.color}`} loading="lazy" decoding="async" width="480" height="576" />
          </a>
          <div className="product-info">
            <span className="product-kind">{product.kind}</span>
            <h3>{product.title}</h3><p>{product.color}</p>
            <div className="product-buy"><strong>{money(product.price)}</strong>
              <button className="add" type="button" aria-label={`В корзину: ${product.title}, ${product.color}`} onClick={() => add(product)}>{added === product.id ? <Check size={18} /> : <Plus size={18} />}</button></div>
            {added === product.id
              ? <a className="text-link" href={cartHref}>Перейти в корзину <ArrowUpRight size={15} /></a>
              : <a className="text-link" href={product.url} target="_blank" rel="noopener noreferrer">Карточка в ВК <ArrowUpRight size={15} /></a>}
          </div>
        </article>,
      )}</div>
    </div>
  </section>
}

function Benefits() {
  return <section className="benefits" aria-label="Преимущества">
    <div className="wrap benefits-grid">
      <div><Truck size={23} /><strong>Отправка на следующий день</strong><span>Доставка по всей России</span></div>
      <div><strong>1 день</strong><span>Срок пошива</span></div>
      <div><strong>От 7 990 ₽</strong><span>Цена без переплаты за бренд</span></div>
    </div>
  </section>
}

function Compare() {
  return <section className="section comparison">
    <div className="wrap">
      <header className="section-head"><div><span className="eyebrow">Сравнение</span><h2>Цена и сроки</h2></div><p>Ориентиры для 3D-ковров. Итоговая цена и срок зависят от модели и продавца.</p></header>
      <div className="compare-grid">
        <article><h3>COMFORT 36</h3><strong>от 7 990 ₽</strong><p>Пошив за 1 день</p></article>
        <article><h3>Другие ателье</h3><strong>от 15 990 ₽</strong><p>Пошив за 1 день</p></article>
        <article><h3>Маркетплейсы</h3><strong>от 12 990 ₽</strong><p>Срок зависит от продавца</p></article>
      </div>
    </div>
  </section>
}

function Contacts() {
  const [showMap, setShowMap] = useState(false)
  return <section className="section contacts" id="map">
    <div className="wrap contact-grid">
      <div><span className="eyebrow">Контакты</span><h2>Как нас найти</h2>
        <p>{contacts.address}</p>
        <a className="text-link" href={contacts.phoneHref}>{contacts.phone}</a>
        <SocialLinks />
        <a className="text-link" href={contacts.mapHref} target="_blank" rel="noopener noreferrer">Маршрут в Яндекс Картах <ArrowUpRight size={17} /></a>
      </div>
      <div className="map">
        {showMap
          ? <iframe src={contacts.mapEmbed} title="Ателье COMFORT 36 на карте" allowFullScreen referrerPolicy="no-referrer" />
          : <button className="button primary" type="button" onClick={() => setShowMap(true)}>Показать карту</button>}
      </div>
    </div>
  </section>
}

function Landing({ change }: { change: (id: number, delta: number) => void }) {
  return <main>
    <Hero />
    <Benefits />
    <div className="brands"><div className="wrap"><span>Под модели</span> Mercedes · DAF · Shacman · Volvo · FAW · MAN · Sitrak</div></div>
    <Catalog onAdd={change} />
    <VideoGallery />
    <Compare />
    <section className="reviews" id="reviews"><div className="wrap review-line">
      <div><span className="eyebrow">Отзывы покупателей</span><h2>Что пишут в ВК</h2></div>
      <a className="button primary" href={reviews} target="_blank" rel="noopener noreferrer">Читать отзывы в ВК <ArrowUpRight size={17} /></a>
    </div></section>
    <section className="section faq" id="faq"><div className="wrap">
      <h2>Частые вопросы</h2>
      <details><summary>Что нужно для подбора ковров?</summary><p>Укажите марку, модель и год выпуска. Если у грузовика разные варианты кабины, мастер уточнит модификацию перед заказом.</p></details>
      <details><summary>Как чистить 3D-ковры?</summary><p>Удалите песок и грязь мягкой щёткой. Затем протрите ковры влажной тряпкой и дайте им высохнуть.</p></details>
      <details><summary>Как получить заказ?</summary><p>Отправляем транспортными компаниями по России. Стоимость доставки мастер рассчитает для вашего города. Можно договориться о самовывозе из ателье.</p></details>
    </div></section>
    <Contacts />
  </main>
}

function CartPage({ cart }: { cart: ReturnType<typeof useCart> }) {
  const order = cart.items.map(({ product, count }) =>
    `• ${product.title} (${product.kind}, ${product.color}) × ${count} — ${money(product.price * count)}`,
  ).concat(`Товары: ${money(cart.total)}. Доставку прошу рассчитать отдельно.`).join('\n')

  return <main className="section cart-page">
    <div className="wrap">
      <a href={home + '#catalog'} className="text-link">← Вернуться в каталог</a>
      <h1>Корзина</h1>
      {!cart.items.length ? <div className="empty"><p>Корзина пока пуста. Подберите комплект для своей кабины.</p>
        <a href={home + '#catalog'} className="button primary">Перейти в каталог</a></div> :
        <div className="cart-grid">
          <div>
            <ul className="cart-items">{cart.items.map(({ product, count }) =>
              <li key={product.id}>
                <img src={productPhoto(product.id)} alt="" width="84" height="84" />
                <div className="item-text"><h2>{product.title}</h2><p>{product.kind} · {product.color}</p><strong>{money(product.price * count)}</strong></div>
                <div className="quantity">
                  <button type="button" aria-label={`Уменьшить: ${product.title}`} onClick={() => cart.change(product.id, -1)}><Minus size={16} /></button>
                  <span aria-label="Количество">{count}</span>
                  <button type="button" aria-label={`Увеличить: ${product.title}`} disabled={count >= 99} onClick={() => cart.change(product.id, 1)}><Plus size={16} /></button>
                  <button type="button" aria-label={`Удалить: ${product.title}`} onClick={() => cart.change(product.id, -count)}><Trash2 size={16} /></button>
                </div>
              </li>,
            )}</ul>
            <div className="cart-total"><span>Товары, без доставки</span><strong>{money(cart.total)}</strong></div>
          </div>
          <aside>
            <LeadForm source="cart" order={order} key={order} />
            <div className="direct"><h2>Удобнее сразу написать?</h2>
              <a className="text-link" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Написать в ВК <ArrowUpRight size={17} /></a>
            </div>
          </aside>
        </div>}
    </div>
  </main>
}

function Privacy() {
  return <main className="section"><div className="wrap legal">
    <a href={home} className="text-link">← На главную</a>
    <h1>Конфиденциальность</h1>
    <p>Формы на этом сайте подготавливают черновик обращения в браузере. Черновик не отправляется с сайта и не сохраняется на сервере. Сайт не запрашивает имя, телефон или адрес покупателя.</p>
    <p>Если вы отправите черновик в ВК, сообщение получит автоателье «Комфорт 36». Вопросы об обработке данных можно направить в сообщения сообщества.</p>
    <p>Сайт хранит корзину в браузере, а допустимые рекламные метки сохраняет до закрытия вкладки для добавления к черновику заявки. Открытие карты загружает виджет Яндекса.</p>
    <a className="text-link" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

function Consent() {
  return <main className="section"><div className="wrap legal">
    <a href={home} className="text-link">← На главную</a>
    <h1>Согласие на обработку персональных данных</h1>
    <p>Я даю автоателье «Комфорт 36» согласие на обработку сведений, которые самостоятельно отправлю в сообщения его сообщества ВКонтакте. Ателье использует их для ответа на обращение, подбора комплекта и согласования заказа.</p>
    <p>Согласие охватывает данные из обращения и данные профиля, доступные ателье при переписке в ВК. Согласие действует до обработки обращения или до отзыва. Для отзыва я могу написать в это же сообщество.</p>
    <a className="text-link" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

function Footer() {
  return <footer className="footer"><div className="wrap footer-row">
    <strong>КОМФОРТ 36</strong><a href={privacyHref}>Конфиденциальность</a>
    <a href={contacts.vk} target="_blank" rel="noopener noreferrer">Сообщество ВК</a>
    <a href="https://lendingsfera.ru/" target="_blank" rel="noopener noreferrer">Сайт разработала студия ЛендингСфера</a>
  </div></footer>
}

export default function App() {
  const cart = useCart()
  useEffect(() => { getAttribution() }, [])

  return <>
    <Header count={cart.count} />
    {isCart ? <CartPage cart={cart} /> : isConsent ? <Consent /> : isPrivacy ? <Privacy /> : <Landing change={cart.change} />}
    <Footer />
    {!isPrivacy && !isConsent && <aside className="quick" aria-label="Быстрая связь">
      <div className="quick-desktop">
        <a className="quick-phone" href={contacts.phoneHref} aria-label="Позвонить"><Phone size={20} /></a>
        <SocialLinks />
      </div>
      <details className="quick-mobile">
        <summary aria-label="Связаться с ателье"><MessageCircle size={22} /></summary>
        <div className="quick-panel"><a className="quick-phone" href={contacts.phoneHref} aria-label="Позвонить"><Phone size={20} /></a><SocialLinks /></div>
      </details>
    </aside>}
  </>
}
