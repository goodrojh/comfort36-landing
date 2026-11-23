import { useId, useState, type FormEvent } from 'react'
import { contacts } from './media'
import { ArrowUpRight } from 'lucide-react'
import { saveLeadDraft, thanksUrl, type LeadDetails, type LeadSource } from './lead-draft'


const inputClass = 'w-full min-w-0 rounded-xl border border-ink/20 bg-linen px-3 py-2 min-h-11 text-base text-ink'
const labelClass = 'grid gap-1 text-xs font-semibold text-graphite'
export const leadButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-cream hover:bg-graphite'

export function LeadFields({ details, compact = false }: { details?: LeadDetails; compact?: boolean }) {
  const id = useId()
  return <div className="grid gap-2.5">
    <div className={`grid gap-2 ${compact ? 'min-[380px]:max-md:grid-cols-2 xl:grid-cols-2' : 'sm:grid-cols-2'}`}>
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
  const [storageError, setStorageError] = useState(false)

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (new FormData(form).get('consent') !== 'on') return
    const details = getLeadDetails(form)
    if (!details) return
    if (saveLeadDraft({ ...details, order, source, createdAt: Date.now() })) {
      location.assign(thanksUrl)
    } else {
      setStorageError(true)
    }
  }

  return <div className={compact ? (source === 'hero' ? '' : 'mt-3 border-t border-ink/10 pt-3') : 'rounded-[1.25rem] border border-ink/10 bg-linen p-5 md:p-7'}>
    <h2 className={compact ? 'text-sm font-bold' : 'text-xl font-bold'}>{source === 'cart' ? 'Оформить заказ' : 'Оставить заявку'}</h2>
    <form className="mt-2 grid gap-2.5" onSubmit={prepare}>
      <LeadFields compact={compact} />
      <div className="text-[11px] leading-snug text-graphite">
        <label className="flex items-start gap-2 cursor-pointer">
          <input className="mt-0.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="consent" required />
          Согласен на обработку персональных данных при отправке обращения в ВК
        </label>
        <a className="ml-6 mt-1 inline-block underline underline-offset-2" href={`${import.meta.env.BASE_URL}consent.html`} target="_blank" rel="noopener noreferrer">Текст согласия</a>
      </div>
      {storageError && <p role="alert" className="text-sm">Не удалось сохранить черновик. <a className="underline" href={contacts.vkWrite} target="_blank" rel="noreferrer">Напишите нам напрямую в ВК.</a></p>}
      <button className={leadButton} type="submit">Подготовить заявку <ArrowUpRight size={18} /></button>
    </form>
  </div>
}
