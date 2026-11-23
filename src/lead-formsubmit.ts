import { getAttribution } from './attribution'
import type { LeadDetails, LeadSource } from './lead-draft'

const formId = import.meta.env.VITE_FORMSUBMIT_FORM_ID?.trim() ?? ''
const publicRecipient = import.meta.env.VITE_FORMSUBMIT_PUBLIC_RECIPIENT?.trim() ?? ''
const destination = /^[a-z0-9_-]{16,128}$/i.test(formId)
  ? formId
  : /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(publicRecipient) ? publicRecipient : ''
const sources = {
  hero: 'Первый экран сайта',
  cart: 'Корзина',
  config: 'Подбор комплекта',
}
export const formsubmitEnabled = Boolean(destination)

type EmailLead = LeadDetails & {
  source: LeadSource
  order?: string
  correctionOf?: string
}

export async function sendFormEmail(id: string, lead: EmailLead) {
  if (!formsubmitEnabled) throw new Error('FormSubmit endpoint not set')

  const payload = new URLSearchParams({
    _captcha: 'false',
    _template: 'table',
    _subject: lead.correctionOf ? 'COMFORT 36 — исправление заявки' : 'COMFORT 36 — заявка с сайта',
    _url: location.origin + location.pathname,
    'Номер': id.slice(0, 8).toUpperCase(),
    'Источник': sources[lead.source],
    'Имя': lead.name,
    'Телефон': lead.phone,
    'Комментарий': lead.description,
  })
  if (lead.order) payload.set('Состав заявки', lead.order)
  if (lead.correctionOf) payload.set('Исходная заявка', lead.correctionOf.slice(0, 8).toUpperCase())
  for (const [field, value] of Object.entries(getAttribution())) {
    if (value) payload.set(field, value)
  }

  const response = await fetch(`https://formsubmit.co/ajax/${destination}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
    signal: AbortSignal.timeout(25000),
  })
  const result = await response.json()
  if (!response.ok || ![true, 'true'].includes(result.success) || /activat|confirm/i.test(result.message ?? '')) {
    throw new Error('FormSubmit did not acknowledge the request')
  }
}
