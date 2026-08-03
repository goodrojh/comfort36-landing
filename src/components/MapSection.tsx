import { ArrowUpRight, Box, MapPin, Package, Truck } from 'lucide-react'
import { FadeUp, WordsPullUpMultiStyle } from './anim'
import { contacts } from '../media'

const delivery = [
  {
    icon: Box,
    title: 'Самовывоз из ателье',
    text: 'Заберите готовое изделие прямо у нас — заодно посмотрите материалы и стёжку вживую.',
  },
  {
    icon: Package,
    title: 'Пункт выдачи ТК',
    text: 'СДЭК и другие транспортные компании: выбираете удобный пункт и забираете когда удобно.',
  },
  {
    icon: Truck,
    title: 'Почта России',
    text: 'Доставим в ближайшее почтовое отделение — работает по всей стране и за рубеж.',
  },
]

export default function MapSection() {
  return (
    <section id="map" className="bg-cream py-16 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-primary mb-4">
            Где нас найти
          </div>
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-ink max-w-3xl mx-auto"
            segments={[
              { text: 'Приезжайте в ателье —' },
              {
                text: 'материал лучше один раз потрогать.',
                className: 'italic font-serif font-normal text-primary',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          {/* карта */}
          <FadeUp className="lg:col-span-8">
            <div className="relative rounded-[1.25rem] md:rounded-[1.75rem] overflow-hidden border border-ink/10 bg-sand h-[340px] sm:h-[420px] lg:h-full lg:min-h-[460px]">
              <iframe
                src={contacts.mapEmbed}
                title="Ателье COMFORT 36 на карте"
                loading="lazy"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </FadeUp>

          {/* адрес и доставка */}
          <FadeUp delay={0.1} className="lg:col-span-4">
            <div className="h-full rounded-[1.25rem] md:rounded-[1.75rem] border border-ink/10 bg-linen p-5 md:p-7 flex flex-col">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-muted">Ателье</div>
                  <div className="mt-1 text-sm md:text-base font-bold text-ink leading-snug">
                    {contacts.address}
                  </div>
                </div>
              </div>

              <a
                href={contacts.mapHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink border-b border-ink/25 hover:border-ink pb-0.5 transition-colors self-start"
              >
                Открыть в Яндекс.Картах
                <ArrowUpRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="mt-7 pt-6 border-t border-ink/10 space-y-5 flex-1">
                <div className="text-xs uppercase tracking-[0.14em] text-muted">Доставка</div>
                {delivery.map((d) => {
                  const Icon = d.icon
                  return (
                    <div key={d.title} className="flex gap-3">
                      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-ink">{d.title}</div>
                        <p className="mt-1 text-xs text-muted leading-relaxed">{d.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <a
                href={contacts.phoneHref}
                className="mt-7 w-full text-center rounded-full border border-ink/20 py-3 text-sm font-semibold text-ink hover:bg-ink hover:text-cream transition-colors"
              >
                {contacts.phone}
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
