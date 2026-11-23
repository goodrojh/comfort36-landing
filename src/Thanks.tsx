import { useState, type FormEvent } from 'react'
import { CircleCheck, ClipboardList, Pencil } from 'lucide-react'
import CheckoutFrame, { checkoutPanel, outlineButton } from './CheckoutFrame'
import { getLeadDetails, leadButton, LeadFields } from './LeadForm'
import { directLeads, emailPreview, useLeadRequest } from './lead-api'
import { readLeadDraft, saveLeadDraft } from './lead-draft'
import { contacts } from './media'
import ContactLinks from './components/ContactLinks'

export default function Thanks({ count }: { count: number }) {
  const [draft, setDraft] = useState(readLeadDraft)
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const { send, sending, error } = useLeadRequest()
  const canEdit = directLeads && Boolean(draft?.preview) === emailPreview
  async function edit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || !canEdit) return
    const details = getLeadDetails(event.currentTarget)
    if (!details) return
    const updated = { ...draft, ...details, createdAt: Date.now() }
    if (!await send({ ...details, source: draft.source, correctionOf: draft.receipt })) return
    saveLeadDraft(updated)
    setDraft(updated)
    setEditing(false)
    setNotice(draft.preview ? 'Тестовое исправление отправлено.' : 'Исправления отправлены.')
  }

  return <CheckoutFrame count={count} title={draft ? 'Спасибо за заявку!' : 'Ваша заявка'}
    description={draft
      ? (draft.preview ? 'Тестовая заявка отправлена. Проверьте почту.' : 'Менеджер скоро свяжется с вами по указанному номеру.')
      : 'Оставьте заявку на главной странице или в корзине.'}
    icon={draft ? <CircleCheck size={36} /> : <ClipboardList size={36} />}>
    {draft && <div className="mt-4 grid items-start gap-4 md:mt-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-5">
      <section className={checkoutPanel}>
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Ваши данные</h2>
        <p className="mt-1 text-sm text-graphite">Проверьте имя и номер телефона.</p>
        {editing ? <form className="mt-4 grid gap-3" onSubmit={edit}>
          <fieldset disabled={sending} className="min-w-0">
            <LeadFields details={draft} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="submit" className={leadButton}>{sending ? 'Отправляем…' : 'Отправить исправления'}</button>
              <button type="button" onClick={() => setEditing(false)} className={outlineButton}>Отмена</button>
            </div>
          </fieldset>
          {error && <p className="text-sm" role="alert">{error} <a className="underline" href={contacts.phoneHref}>Позвонить</a></p>}
        </form> : <>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="min-w-0 rounded-xl bg-sand p-3"><dt className="text-xs font-bold text-graphite">Имя</dt><dd className="mt-1 break-words font-semibold">{draft.name}</dd></div>
            <div className="min-w-0 rounded-xl bg-sand p-3"><dt className="text-xs font-bold text-graphite">Телефон</dt><dd className="mt-1 break-words font-semibold">{draft.phone}</dd></div>
            {draft.description && <div className="min-w-0 rounded-xl bg-sand p-3 sm:col-span-2"><dt className="text-xs font-bold text-graphite">Комментарий</dt><dd className="mt-1 whitespace-pre-wrap break-words">{draft.description}</dd></div>}
          </dl>
          {canEdit && <button className={`${outlineButton} mt-4`} type="button"
            onClick={() => { setNotice(''); setEditing(true) }}><Pencil size={16} /> Исправить данные</button>}
        </>}
        {draft.order && <section className="mt-5 border-t border-ink/10 pt-4">
          <h3 className="text-base font-extrabold">{draft.source === 'cart' ? 'Состав заявки' : 'Ваш комплект'}</h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-graphite">{draft.order}</p>
        </section>}
        {notice && <p role="status" className="mt-4 text-sm text-primary">{notice}</p>}
      </section>
      <aside className="rounded-[1.5rem] bg-ink p-5 text-cream sm:p-6 lg:p-7">
        <p className="text-sm font-bold text-primarysoft">Заявка № {draft.receipt.slice(0, 8).toUpperCase()}</p>
        <h2 className="mt-2 text-xl font-extrabold">Хотите связаться с нами сразу?</h2>
        <p className="mt-2 text-sm text-cream/85">Позвоните или напишите в удобном мессенджере.</p>
        <div className="mt-4"><ContactLinks /></div>
      </aside>
    </div>}
  </CheckoutFrame>
}
