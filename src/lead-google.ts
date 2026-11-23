import { getAttribution } from './attribution'
import type { LeadDetails, LeadSource } from './lead-draft'

const endpoint = 'https://script.google.com/macros/s/AKfycbylNh4uQmMw90oXfKQq9jDqmJyXcPjGmP6DqDJnZ7ZWeVijUhmS4lg1a5bh47TGs5QF/exec'
const sources = {
  hero: 'Первый экран сайта',
  cart: 'Корзина',
  config: 'Подбор комплекта',
}
type EmailLead = LeadDetails & {
  source: LeadSource
  order?: string
  correctionOf?: string
}

export async function sendGoogleLead(id: string, lead: EmailLead) {
  const fields = {
    ...getAttribution(),
    'ID заявки': id,
    'ID исходной заявки': lead.correctionOf,
    'Источник': sources[lead.source],
    'Имя': lead.name,
    'Телефон': lead.phone,
    'Комментарий': lead.description,
    'Состав заявки': lead.order,
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ form_data: fields }),
    credentials: 'omit',
    signal: AbortSignal.timeout(45000),
  })
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Missing receipt')
  // The scheduled worker covers a closed tab or an interrupted notification request.
  void fetch(endpoint, { method: 'POST', credentials: 'omit', keepalive: true,
    body: JSON.stringify({ notify: id }) }).catch(() => {})
}
