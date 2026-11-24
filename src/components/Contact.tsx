import { MapPin, Phone } from 'lucide-react'
import { StyledHeading } from './StyledHeading'
import { contacts, media } from '../media'
import { asset } from '../catalog'

export default function Contact() {
  return (
    <section id="contact" className="bg-cream px-4 md:px-6 pb-4 md:pb-6">
      <div className="relative max-w-[110rem] mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-ink">
        <img
          src={media.heroPoster}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/80 to-ink/95" />
        <div className="absolute inset-0 bg-quilt opacity-30 pointer-events-none" />

        <div className="relative px-5 py-14 md:px-16 md:py-24 text-center">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primarysoft mb-6">
            Подбор комплекта
          </div>

          <StyledHeading
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-cream max-w-3xl mx-auto leading-[1.02]"
            segments={[
              { text: 'Оставьте модель тягача —' },
              {
                text: 'остальное наша работа.',
                className: 'italic font-serif font-normal text-primarysoft',
              },
            ]}
          />

          <div>
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
                href={contacts.max}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 border border-cream/25 text-cream font-semibold text-sm sm:text-base hover:bg-cream/10 transition-colors"
              >
                <img src={asset('social/max.svg')} alt="" width="19" height="19" />
                Написать в MAX
              </a>
              <a
                href={contacts.vkWrite}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 border border-cream/25 text-cream font-semibold text-sm sm:text-base hover:bg-cream/10 transition-colors"
              >
                Написать ВКонтакте
                <img src={asset('social/vk.svg')} alt="" width="19" height="19" />
              </a>
            </div>
          </div>

          <div>
            <a
              href="#map"
              className="mt-10 md:mt-14 inline-flex items-center gap-2.5 text-cream/70 hover:text-cream text-xs sm:text-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-primarysoft" />
              {contacts.addressShort} — приезжайте посмотреть материал вживую
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
