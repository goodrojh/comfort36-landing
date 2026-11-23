import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
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
import CartPage from './CartPage'
import Thanks from './Thanks'
import VideoGallery from './VideoGallery'
import { useCart } from './cart'
import { contacts } from './media'
import { getAttribution } from './attribution'
import { directLeads, googleLeads } from './lead-api'

const home = import.meta.env.BASE_URL
const isCart = location.pathname.endsWith('/cart.html')
const isPrivacy = location.pathname.endsWith('/privacy.html')
const isThanks = /\/thanks\/?$/.test(location.pathname)
type PrivacySettings = {
  operatorName?: string
  operatorDetails?: string
  operatorEmail?: string
  googleContacts?: boolean
  telegramContacts?: boolean
}

const privacySettings = (window as Window & { comfort36Privacy?: PrivacySettings }).comfort36Privacy
const externalContactDestinations = [
  privacySettings?.googleContacts === true ? 'рабочую Google Таблицу' : '',
  privacySettings?.telegramContacts === true ? 'закрытый рабочий чат в Telegram' : '',
].filter(Boolean).join(' и ')
const operatorDetails = [privacySettings?.operatorName, privacySettings?.operatorDetails, privacySettings?.operatorEmail]
  .filter(Boolean).join(' · ')
const isConsent = location.pathname.endsWith('/consent.html')

function Privacy() {
  return <main className="px-4 py-12 md:py-20"><div className="max-w-3xl mx-auto space-y-4 text-graphite leading-relaxed">
    <a href={home} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">← На главную</a>
    <h1 className="my-5 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-ink [overflow-wrap:anywhere]">Конфиденциальность</h1>
    {operatorDetails && <p>Оператор персональных данных — {operatorDetails}.</p>}
    {googleLeads ? <p>Автоателье получает имя, телефон, комментарий и состав заявки для подбора комплекта и связи с вами. Данные сохраняются в Google Таблицах и передаются сотрудникам по электронной почте и через Telegram. Для отзыва согласия напишите в сообщество ателье.</p> : directLeads ? <>
      <p>При отправке формы сервер приёма заявок в России получает ваше имя, номер телефона, комментарий и состав заявки. Ателье использует эти сведения, чтобы ответить, подобрать комплект и согласовать заказ. Сведения получают сотрудники автоателье через рабочий канал связи.</p>
      <p>Отправленные сообщения удаляются из очереди. На сервере запись заявки хранится до семи дней, чтобы повторить доставку при сбое и принять исправления. Копия заявки временно доступна в текущей вкладке для проверки контактов. Вопросы об обработке можно направить в сообщения сообщества.</p>
      {externalContactDestinations && <p>Имя, телефон, комментарий и состав заявки передаются в {externalContactDestinations} для ведения заявок.</p>}
    </> : <p>Связаться с ателье можно по телефону или через мессенджеры.</p>}
    <p>Сайт хранит корзину в браузере, а допустимые рекламные метки сохраняет до закрытия вкладки для учёта источника заявки. Открытие карты загружает виджет Яндекса.</p>
    <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

function Consent() {
  return <main className="px-4 py-12 md:py-20"><div className="max-w-3xl mx-auto space-y-4 text-graphite leading-relaxed">
    <a href={home} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">← На главную</a>
    <h1 className="my-5 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-ink [overflow-wrap:anywhere]">Согласие на обработку персональных данных</h1>
    {operatorDetails && <p>Оператор персональных данных — {operatorDetails}.</p>}
    {googleLeads ? <p>Автоателье получает имя, телефон, комментарий и состав заявки для подбора комплекта и связи с вами. Данные сохраняются в Google Таблицах и передаются сотрудникам по электронной почте и через Telegram. Для отзыва согласия напишите в сообщество ателье.</p> : directLeads ? <>
      <p>Я даю автоателье «Комфорт 36» согласие на получение, хранение и обработку имени, телефона, комментария и состава заявки, которые я отправляю через форму сайта. Сведения используются для связи со мной, подбора комплекта и согласования заказа. Ателье получает заявку через свой рабочий канал связи.</p>
      {externalContactDestinations && <p>Я также соглашаюсь на передачу сведений из заявки в {externalContactDestinations} автоателье для ведения заявок.</p>}
      <p>Согласие действует до обработки обращения или до отзыва. Для отзыва я могу написать в сообщество автоателье.</p>
    </> : <>
    <p>Я даю автоателье «Комфорт 36» согласие на обработку сведений, которые самостоятельно отправлю в сообщения его сообщества ВКонтакте. Ателье использует их для ответа на обращение, подбора комплекта и согласования заказа.</p>
    <p>Согласие охватывает данные из обращения и данные профиля, доступные ателье при переписке в ВК. Согласие действует до обработки обращения или до отзыва. Для отзыва я могу написать в это же сообщество.</p>
    </>}
    <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Связаться с ателье в ВК <ArrowUpRight size={17} /></a>
  </div></main>
}

export default function App() {
  const cart = useCart()
  useEffect(() => { getAttribution() }, [])

  return <>
    {isThanks ? <Thanks count={cart.count} />
      : isCart ? <CartPage cart={cart} />
      : isPrivacy ? <Privacy />
      : isConsent ? <Consent />
      : <main>
        <Hero count={cart.count} />
        <Products cart={cart} />
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
    {!isCart && !isThanks && !isPrivacy && !isConsent && <FloatingContacts />}
  </>
}
