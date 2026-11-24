export const consentKey = 'comfort36:analytics:v1'
type Choice = 'yes' | 'no'
let memory: Choice | null = null
export function analyticsChoice(): Choice | null {
  try {
    const value = localStorage.getItem(consentKey)
    return value === 'yes' || value === 'no' ? value : memory
  } catch { return memory }
}
export function rememberAnalytics(choice: Choice) {
  memory = choice
  try { localStorage.setItem(consentKey, choice) } catch { /* Current page only. */ }
}
