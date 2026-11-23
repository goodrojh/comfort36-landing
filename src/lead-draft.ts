import { getAttribution } from './attribution'

export type LeadSource = 'hero' | 'cart' | 'config'
export type LeadDetails = { name: string; phone: string; description: string }
export type LeadDraft = LeadDetails & { source: LeadSource; order?: string; createdAt: number }

const key = 'comfort36:lead-draft:v1'
const lifetime = 30 * 60 * 1000
export const thanksUrl = `${import.meta.env.BASE_URL}thanks`

export function readLeadDraft(): LeadDraft | null {
  try {
    const draft = JSON.parse(sessionStorage.getItem(key) ?? 'null') as Partial<LeadDraft> | null
    if (!draft) return null
    if (typeof draft.createdAt !== 'number' || Date.now() - draft.createdAt >= lifetime ||
        typeof draft.name !== 'string' || typeof draft.phone !== 'string' ||
        typeof draft.description !== 'string' ||
        (draft.order !== undefined && typeof draft.order !== 'string') ||
        (draft.source !== 'cart' && draft.source !== 'hero' && draft.source !== 'config')) {
      sessionStorage.removeItem(key)
      return null
    }
    return draft as LeadDraft
  } catch {
    return null
  }
}

export function saveLeadDraft(draft: LeadDraft) {
  try {
    sessionStorage.setItem(key, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function forgetLeadDraft() {
  try { sessionStorage.removeItem(key) } catch { /* The browser may restrict storage. */ }
}

export function leadMessage(draft: LeadDraft) {
  const attribution = Object.entries(getAttribution()).map(([field, value]) => `${field}=${value}`).join(' · ')
  return [
    draft.source === 'cart' ? 'Здравствуйте! Хочу заказать в COMFORT 36:' : 'Здравствуйте! Подберите комплект COMFORT 36.',
    '[comfort36:site:' + draft.source + ']',
    attribution,
    draft.order,
    `Имя: ${draft.name}`,
    `Телефон: ${draft.phone}`,
    draft.description && `Комментарий: ${draft.description}`,
    'Подтверждаю согласие на обработку данных для рассмотрения этой заявки.',
  ].filter(Boolean).join('\n')
}
