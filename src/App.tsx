import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Offer from './components/Offer'
import Products from './components/Products'
import Process from './components/Process'
import Configurator from './components/Configurator'
import Works from './components/Works'
import Compare from './components/Compare'
import Reviews from './components/Reviews'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContacts from './components/FloatingContacts'
import PromoModal from './components/PromoModal'

export default function App() {
  return (
    <main className="bg-cream overflow-x-hidden">
      <Hero />
      <Marquee />
      <Offer />
      <Products />
      <Process />
      <Configurator />
      <Works />
      <Compare />
      <Reviews />
      <Faq />
      <Contact />
      <Footer />
      <FloatingContacts />
      <PromoModal />
    </main>
  )
}
