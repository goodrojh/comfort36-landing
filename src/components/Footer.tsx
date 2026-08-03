import { contacts } from '../media'

export default function Footer() {
  return (
    <footer className="bg-cream px-4 md:px-6 py-10 md:py-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-ink/10 pt-8">
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            COMFORT&nbsp;36<span className="text-primary">*</span>
          </div>
          <p className="mt-2 text-xs text-muted max-w-sm leading-relaxed">
            * Грузовое ателье полного цикла. Индивидуальный пошив по 3D-лекалам. Воронеж, с 2019
            года. Отправляем по всему миру.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
          <a href={contacts.phoneHref} className="hover:text-ink transition-colors">
            {contacts.phone}
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
    </footer>
  )
}
