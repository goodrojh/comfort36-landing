import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Copy } from 'lucide-react'
import { contacts } from './media'
import { getAttribution } from './attribution'

type Props = { order?: string; source: 'hero' | 'cart' }

export default function LeadForm({ order, source }: Props) {
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
      order ? 'Здравствуйте! Хочу заказать в COMFORT 36:' : 'Здравствуйте! Подберите комплект COMFORT 36.',
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
    <div className="lead">
      <h2>{order ? 'Оформить заказ' : 'Проверить наличие'}</h2>
      <p>{order ? 'Подготовим список для сообщения в ВК. Мастер подтвердит заказ и доставку.' : 'Укажите модель, чтобы мастер подобрал комплект для вашей кабины.'}</p>
      <form onSubmit={prepare}>
        <label className="field"><span className="field-caption">Марка и модель {order && <span>(по желанию)</span>}</span>
          <input name="model" maxLength={80} onInput={event => event.currentTarget.setCustomValidity('')} required={!order} placeholder="Например, DAF 105" autoComplete="off" />
        </label>
        {!order && <label className="field">Что вас интересует
          <select name="kind" defaultValue="3D-ковры «Соты»">
            <option>3D-ковры «Соты»</option><option>Гладкие 3D-ковры</option><option>Чехлы на сиденья</option>
          </select>
        </label>}
        <div className="consent">
          <label><input type="checkbox" name="consent" required /> Согласен на обработку персональных данных при отправке обращения в ВК</label>
          <a href={`${import.meta.env.BASE_URL}consent.html`} target="_blank" rel="noopener noreferrer">Текст согласия</a>
        </div>
        <button className="button primary" type="submit">Подготовить заявку <ArrowUpRight size={18} /></button>
      </form>
      {message && <div className="prepared">
        <p role="status">{copied ? 'Заявка скопирована. Откройте ВК, вставьте текст в чат и отправьте.' : 'Скопируйте текст, откройте ВК и отправьте его в чат.'}</p>
        <textarea readOnly aria-label="Текст заявки для отправки в ВК" value={message} rows={4} onFocus={event => event.currentTarget.select()} />
        <div className="actions">
          <button className="button outline" type="button" onClick={() => { void copy(message) }}><Copy size={16} /> Копировать</button>
          <a className="button primary" href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Открыть ВК <ArrowUpRight size={16} /></a>
        </div>
      </div>}
    </div>
  )
}
