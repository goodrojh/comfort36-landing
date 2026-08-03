import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'
import { contacts, media } from '../media'

export default function Contact() {
  return (
    <section id="contact" className="bg-cream px-4 md:px-6 pb-4 md:pb-6">
      <div className="relative max-w-[110rem] mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-ink">
        <img
          src={media.heroPoster}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/80 to-ink/95" />
        <div className="absolute inset-0 bg-quilt opacity-30 pointer-events-none" />

        <div className="relative px-5 py-14 md:px-16 md:py-24 text-center">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primarysoft mb-6">
            Бесплатный замер и консультация
          </div>

          <WordsPullUpMultiStyle
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-cream max-w-3xl mx-auto leading-[1.02]"
            segments={[
              { text: 'Оставьте модель тягача —' },
              {
                text: 'остальное наша работа.',
                className: 'italic font-serif font-normal text-primarysoft',
              },
            ]}
          />

          <FadeUp delay={0.15}>
            <div className="mt-9 md:mt-12 flex flex-wrap justify-center gap-3">
              <a
                href={contacts.phoneHref}
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-cream rounded-full pl-6 pr-1.5 py-1.5 text-ink font-bold text-base sm:text-lg"
              >
                {contacts.phone}
                <span className="bg-ink rounded-full w-10 h-10 sm:w-11 sm:h-11 grid place-items-center transition-transform duration-300 group-hover:scale-110">
                  <Phone className="w-4 h-4 text-cream" />
                </span>
              </a>
              <a
                href="https://wa.me/79066770713"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 border border-cream/25 text-cream font-semibold text-sm sm:text-base hover:bg-cream/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Написать в WhatsApp
              </a>
              <a
                href={contacts.vk}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 border border-cream/25 text-cream font-semibold text-sm sm:text-base hover:bg-cream/10 transition-colors"
              >
                Группа ВКонтакте
                <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <a
              href="#map"
              className="mt-10 md:mt-14 inline-flex items-center gap-2.5 text-cream/70 hover:text-cream text-xs sm:text-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-primarysoft" />
              {contacts.addressShort} — приезжайте посмотреть материал вживую
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
