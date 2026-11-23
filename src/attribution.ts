const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
type Attribution = Partial<Record<typeof fields[number], string>>
const key = 'comfort36:attribution:v1'

export function getAttribution(): Attribution {
  const query = new URLSearchParams(location.search)
  const current: Attribution = {}
  for (const field of fields) {
    const value = query.get(field)?.trim()
    if (value && /^[\p{L}\p{N}_. -]{1,80}$/u.test(value) && !/\d{8}/.test(value)) current[field] = value
  }
  try {
    if (Object.keys(current).length) sessionStorage.setItem(key, JSON.stringify(current))
    else return JSON.parse(sessionStorage.getItem(key) ?? '{}')
  } catch { /* Ignore unavailable browser storage. */ }
  return current
}
