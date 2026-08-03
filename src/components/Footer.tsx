import { ArrowUpRight } from 'lucide-react'
import { contacts } from '../media'

export default function Footer() {
  return (
    <footer className="bg-cream px-4 md:px-6 py-10 md:py-14 pb-28 md:pb-14">
      <div className="max-w-7xl mx-auto border-t border-ink/10 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              COMFORT&nbsp;36
            </div>
            <p className="mt-2 text-xs text-muted max-w-sm leading-relaxed">
              Грузовое ателье полного цикла. Индивидуальный пошив по 3D-лекалам. Воронеж, с 2019
              года. Отправляем по всему миру.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
            <a href={contacts.phoneHref} className="hover:text-ink transition-colors">
              {contacts.phone}
            </a>
            <a
              href={contacts.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              Telegram
            </a>
            <a
              href={contacts.vk}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              ВКонтакте
            </a>
            <span>© 2026 COMFORT 36</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <a
            href="https://lendingsfera.ru"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-xs text-muted hover:text-ink transition-colors"
          >
            Сайт разработан студией
            <span className="font-bold text-ink border-b border-primary/60 group-hover:border-primary transition-colors">
              ЛендингСфера
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <span className="text-[11px] text-muted/70">Политика конфиденциальности</span>
        </div>
      </div>
    </footer>
  )
}
