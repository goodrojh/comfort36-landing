import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Copy } from 'lucide-react'
import { contacts } from './media'
import { getAttribution } from './attribution'

type Props = { order?: string; source: 'hero' | 'cart' | 'config'; compact?: boolean }

export default function LeadForm({ order, source, compact = false }: Props) {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    if (values.get('consent') !== 'on') return
    const model = String(values.get('model') ?? '').trim()
    if (source === 'hero' && !model) {
      const field = event.currentTarget.elements.namedItem('model')
      if (field instanceof HTMLInputElement) {
        field.setCustomValidity('Укажите марку и модель грузовика.')
        field.reportValidity()
      }
      return
    }
    const attribution = Object.entries(getAttribution()).map(([name, value]) => `${name}=${value}`).join(' · ')
    const lines = [
      source === 'cart' ? 'Здравствуйте! Хочу заказать в COMFORT 36:' : 'Здравствуйте! Подберите комплект COMFORT 36.',
      order,
      model && `Грузовик: ${model}`,
      !order && `Интересует: ${values.get('kind')}`,
      'Подтверждаю согласие на обработку данных для рассмотрения этой заявки.',
      '[comfort36:site:' + source + ']',
      attribution,
    ].filter(Boolean)
    const draft = lines.join('\n')
    setMessage(draft)
    void copy(draft)
  }

  return (
    <div className={compact ? "mt-3 border-t border-ink/10 pt-3" : "rounded-[1.25rem] border border-ink/10 bg-linen p-5 md:p-7"}>
      <h2 className={compact ? "text-sm font-bold" : "text-xl font-bold"}>{source === 'cart' ? 'Оформить заказ' : 'Проверить наличие'}</h2>
      {!compact && <p className="mt-2 text-sm text-muted">Мастер подтвердит наличие и доставку в сообщениях ВК.</p>}
      <form className="mt-2 grid gap-2.5" onSubmit={prepare}>
        {source !== 'config' && <label className="grid gap-1 text-xs font-semibold text-graphite"><span>Марка и модель {order && <span className="text-muted">(по желанию)</span>}</span>
          <input className="w-full min-w-0 min-h-11 rounded-xl border border-ink/20 bg-linen px-3 text-base text-ink" name="model" maxLength={80} onInput={event => event.currentTarget.setCustomValidity('')} required={!order} placeholder="Например, DAF 105" autoComplete="off" />
        </label>}
        {!order && <label className="grid gap-1 text-xs font-semibold text-graphite">Что вас интересует
          <select className="w-full min-w-0 min-h-11 rounded-xl border border-ink/20 bg-linen px-3 text-base text-ink" name="kind" defaultValue="3D-ковры «Соты»">
            <option>3D-ковры «Соты»</option><option>Гладкие 3D-ковры</option><option>Чехлы на сиденья</option>
          </select>
        </label>}
        <div className="text-[11px] leading-snug text-graphite">
          <label className="flex items-start gap-2 cursor-pointer"><input className="mt-0.5 h-4 w-4 shrink-0 accent-primary" type="checkbox" name="consent" required /> Согласен на обработку персональных данных при отправке обращения в ВК</label>
          <a className="ml-6 mt-1 inline-block underline underline-offset-2" href={`${import.meta.env.BASE_URL}consent.html`} target="_blank" rel="noopener noreferrer">Текст согласия</a>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream min-h-11 px-4 text-sm font-semibold hover:bg-graphite" type="submit">Подготовить заявку <ArrowUpRight size={18} /></button>
      </form>
      {message && <div className="mt-4 grid gap-2 border-t border-ink/10 pt-3">
        <p role="status" className="text-xs text-graphite">{copied ? 'Заявка скопирована. Откройте ВК, вставьте текст в чат и отправьте.' : 'Скопируйте текст, откройте ВК и отправьте его в чат.'}</p>
        <textarea className="w-full rounded-xl border border-ink/20 bg-linen p-2 text-sm" readOnly aria-label="Текст заявки для отправки в ВК" value={message} rows={4} onFocus={event => event.currentTarget.select()} />
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 min-h-11 px-4 text-sm font-semibold" type="button" onClick={() => { void copy(message) }}><Copy size={16} /> Копировать</button>
          <a className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream min-h-11 px-4 text-sm font-semibold hover:bg-graphite" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Открыть ВК <ArrowUpRight size={16} /></a>
        </div>
      </div>}
    </div>
  )
}
