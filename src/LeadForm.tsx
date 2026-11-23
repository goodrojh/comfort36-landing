import { useId, useState, type FormEvent } from 'react'
import { contacts } from './media'
import ContactLinks from './components/ContactLinks'
import { ArrowUpRight } from 'lucide-react'
import { directLeads, emailPreview, useLeadRequest } from './lead-api'
import { saveLeadDraft, thanksUrl, type LeadDetails, type LeadSource } from './lead-draft'


const inputClass = 'w-full min-w-0 rounded-xl border border-ink/20 bg-linen px-3 py-2 min-h-11 text-base text-ink'
const labelClass = 'grid gap-1 text-xs font-semibold text-graphite'
export const leadButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-cream hover:bg-graphite disabled:opacity-60'

export function LeadFields({ details, compact = false, stacked = false }: { details?: LeadDetails; compact?: boolean; stacked?: boolean }) {
  const id = useId()
  return <div className="grid gap-2.5">
    <div className={`grid gap-2 ${stacked ? 'xl:grid-cols-2' : compact ? 'min-[380px]:max-md:grid-cols-2 xl:grid-cols-2' : 'sm:max-md:grid-cols-2 lg:grid-cols-2'}`}>
      <label className={labelClass}>Имя
        <input className={inputClass} name="name" maxLength={80} required defaultValue={details?.name}
          placeholder="Ваше имя" autoComplete="name" onInput={clearValidity} />
      </label>
      <label className={labelClass}>Телефон
        <input className={inputClass} name="phone" type="tel" inputMode="tel" maxLength={25} required defaultValue={details?.phone}
          placeholder="+7 900 000…" autoComplete="tel" onInput={clearValidity} />
      </label>
    </div>
    <label className={labelClass} htmlFor={id}>Комментарий (необязательно)
      <textarea className={`${inputClass} resize-y`} name="description" id={id} rows={compact ? 1 : 2}
        maxLength={500} defaultValue={details?.description} placeholder="Например, ковры для DAF 105" />
    </label>
  </div>
}

function clearValidity(event: FormEvent<HTMLInputElement>) {
  event.currentTarget.setCustomValidity('')
}

export function getLeadDetails(form: HTMLFormElement): LeadDetails | null {
  const values = new FormData(form)
  const name = String(values.get('name') ?? '').trim()
  const phone = String(values.get('phone') ?? '').trim()
  const description = String(values.get('description') ?? '').trim()
  const field = !name ? 'name' : !/^\+?[\d\s()-]+$/.test(phone) || !/^\d{10,15}$/.test(phone.replace(/\D/g, '')) ? 'phone' : null
  if (field) {
    const input = form.elements.namedItem(field)
    if (input instanceof HTMLInputElement) {
      input.setCustomValidity(field === 'name' ? 'Укажите имя.' : 'Введите номер телефона с 10–15 цифрами.')
      input.reportValidity()
    }
    return null
  }
  return { name, phone, description }
}

export default function LeadForm({ order, source, compact = false }: { order?: string; source: LeadSource; compact?: boolean }) {
  const [message, setMessage] = useState('')
  const [accepted, setAccepted] = useState(false)
  const { send, sending, error } = useLeadRequest()
  const hero = source === 'hero'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (accepted || new FormData(form).get('consent') !== 'on') return
    const details = getLeadDetails(form)
    if (!details) return

    const draft = { ...details, order, source, createdAt: Date.now() }
    setMessage('')
    const receipt = await send(draft)
    if (!receipt) return

    if (saveLeadDraft({ ...draft, receipt, preview: emailPreview || undefined })) {
      location.assign(thanksUrl)
    } else {
      setAccepted(true)
      setMessage(emailPreview ? 'Тестовая заявка отправлена. Проверьте почту.'
        : 'Спасибо за заявку! Менеджер скоро свяжется с вами по указанному номеру.')
    }
  }

  return <div id={hero ? 'hero-lead' : undefined} className={hero ? 'rounded-[1.5rem] border border-ink/10 bg-linen/95 p-4 shadow-[0_22px_50px_-32px_rgba(19,43,33,0.65)] sm:p-6 lg:p-8'
    : compact ? 'mt-3 border-t border-ink/10 pt-3' : 'p-4 sm:p-6 lg:p-7'}>
    <h2 className={compact ? 'text-sm font-bold' : 'text-2xl font-extrabold tracking-tight'}>
      {source === 'cart' ? 'Контакты для заказа' : 'Оставить заявку'}
    </h2>
    {!directLeads ? <div className="mt-3 space-y-3">
      <p className="text-sm text-graphite">Приём заявок через форму пока недоступен. Позвоните или напишите нам.</p>
      <ContactLinks />
    </div> : <form className={hero ? 'mt-4 grid gap-3.5' : 'mt-3 grid gap-3'} onSubmit={submit}>
      <fieldset className="grid min-w-0 gap-3" disabled={sending || accepted}>
        {emailPreview && <p className="rounded-xl bg-sand p-3 text-xs font-semibold text-ink">
          Тестовая форма. Для проверки укажите тестовые контакты.
        </p>}
        <LeadFields compact={compact} stacked={hero} />
        <div className="text-xs leading-snug text-graphite">
          <label className="flex items-start gap-2 cursor-pointer">
            <input className="mt-0.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="consent" required />
            Согласен на обработку персональных данных
          </label>
          <a className="ml-6 mt-1 inline-block underline underline-offset-2" href={`${import.meta.env.BASE_URL}consent.html`} target="_blank" rel="noopener noreferrer">Текст согласия</a>
        </div>
        <button className={`${leadButton} w-full`} type="submit">
          {accepted ? 'Заявка принята' : sending ? 'Отправляем…' : 'Оставить заявку'} <ArrowUpRight size={18} />
        </button>
      </fieldset>
      {(error || message) && <p role={accepted ? 'status' : 'alert'} className="text-sm text-graphite">
        {error || message} {!accepted && <a className="underline" href={contacts.phoneHref}>Позвонить в ателье</a>}
      </p>}
    </form>}
  </div>
}
