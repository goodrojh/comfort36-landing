import { useRef, useState } from 'react'
import { getAttribution } from './attribution'
import { formsubmitEnabled, sendFormEmail } from './lead-formsubmit'
import type { LeadDetails, LeadSource } from './lead-draft'

const endpoint = import.meta.env.VITE_LEAD_API_URL?.trim()
export const emailPreview = !endpoint && formsubmitEnabled
export const directLeads = Boolean(endpoint || emailPreview)

export function useLeadRequest() {
  const request = useRef<{ body: string; id: string }>()
  const busy = useRef(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function send(details: LeadDetails & { source: LeadSource; order?: string; correctionOf?: string }) {
    if (!directLeads || busy.current) return null
    busy.current = true
    setSending(true)
    setError('')

    try {
      const { source, name, phone, description, order, correctionOf } = details
      const data = { source, name, phone, description, order, correctionOf, consent: true, attribution: getAttribution() }
      const body = JSON.stringify(data)
      if (request.current?.body !== body) request.current = { body, id: crypto.randomUUID() }
      const { id } = request.current
      if (emailPreview) {
        await sendFormEmail(id, details)
        return id
      }
      if (!endpoint) return null
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id }),
        signal: AbortSignal.timeout(10000),
      })
      if (response.status === 429) {
        setError('Слишком много попыток. Попробуйте через несколько минут.')
        return null
      }
      if (response.status === 410) {
        setError('Срок исправления заявки истёк. Свяжитесь с ателье по телефону.')
        return null
      }
      if (response.status !== 202 || (await response.json()).id !== id) throw new Error('Invalid receipt')
      return id
    } catch {
      setError(emailPreview
        ? 'Сервис не подтвердил отправку. Проверьте тестовую почту перед повтором.'
        : 'Не удалось подтвердить приём заявки. Попробуйте ещё раз.')
      return null
    } finally {
      busy.current = false
      setSending(false)
    }
  }

  return { send, sending, error }
}
