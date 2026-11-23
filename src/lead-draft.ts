export type LeadSource = 'hero' | 'cart' | 'config'
export type LeadDetails = { name: string; phone: string; description: string }
export type LeadDraft = LeadDetails & { source: LeadSource; order?: string; createdAt: number; receipt: string; preview?: boolean }

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
        (typeof draft.receipt !== 'string' || !/^[0-9a-f-]{36}$/.test(draft.receipt)) ||
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
