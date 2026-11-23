import { useState, type FormEvent } from 'react'
import { ArrowUpRight, CircleCheck, ClipboardList, Copy, Pencil } from 'lucide-react'
import CheckoutFrame, { checkoutPanel, outlineButton } from './CheckoutFrame'
import { getLeadDetails, leadButton, LeadFields } from './LeadForm'
import { directLeads, useLeadRequest } from './lead-api'
import { forgetLeadDraft, leadMessage, readLeadDraft, saveLeadDraft } from './lead-draft'
import { contacts } from './media'

export default function Thanks({ count }: { count: number }) {
  const [draft, setDraft] = useState(readLeadDraft)
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const [copyError, setCopyError] = useState(false)
  const { send, sending, error } = useLeadRequest()
  const accepted = Boolean(draft?.receipt)

  async function copy() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(leadMessage(draft))
      setNotice('Заявка скопирована. Вставьте её в чат ВК и отправьте.')
      setCopyError(false)
    } catch {
      setNotice('Скопируйте текст вручную из поля ниже.')
      setCopyError(true)
    }
  }

  async function edit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    const details = getLeadDetails(event.currentTarget)
    if (!details) return
    const updated = { ...draft, ...details, createdAt: Date.now() }
    if (draft.receipt && !await send({ ...details, source: draft.source, correctionOf: draft.receipt })) return
    const saved = saveLeadDraft(updated)
    setDraft(updated)
    setEditing(false)
    setCopyError(false)
    setNotice(accepted ? 'Исправления приняты.' : saved ? 'Данные обновлены.' : 'Исправления доступны до закрытия страницы.')
  }

  const title = accepted ? 'Спасибо за заявку!' : draft ? 'Заявка подготовлена' : 'Ваша заявка'
  const description = accepted
    ? 'Свяжемся с вами по указанному номеру, чтобы уточнить детали.'
    : draft
      ? 'Проверьте контакты и отправьте сообщение автоателье в ВК.'
      : 'Заполните форму на главной или в корзине, чтобы оставить заявку.'

  return <CheckoutFrame count={count} title={title} description={description}
    icon={accepted ? <CircleCheck size={36} /> : <ClipboardList size={36} />}>
    {draft && <div className="mt-4 grid items-start gap-4 md:mt-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-5">
      <section className={checkoutPanel}>
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Ваши данные</h2>
        {editing ? <form className="mt-4 grid gap-3" onSubmit={edit}>
          <fieldset disabled={sending} className="min-w-0">
            <LeadFields details={draft} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="submit" className={leadButton}>{sending ? 'Отправляем…' : accepted ? 'Отправить исправления' : 'Сохранить изменения'}</button>
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
          {(!accepted || directLeads) && <button className={`${outlineButton} mt-4`} type="button"
            onClick={() => { setNotice(''); setEditing(true) }}><Pencil size={16} /> Исправить данные</button>}
        </>}
        {draft.order && <section className="mt-5 border-t border-ink/10 pt-4">
          <h3 className="text-base font-extrabold">{draft.source === 'cart' ? 'Состав заявки' : 'Ваш комплект'}</h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-graphite">{draft.order}</p>
        </section>}
        {notice && <p role="status" className="mt-4 text-sm text-primary">{notice}</p>}
      </section>
      {accepted ? <aside className="rounded-[1.5rem] bg-ink p-5 text-cream sm:p-6 lg:p-7">
        <p className="text-sm font-bold text-primarysoft">Заявка № {draft.receipt?.slice(0, 8).toUpperCase()}</p>
        <h2 className="mt-2 text-xl font-extrabold">Есть вопрос по заявке?</h2>
        <a className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-linen px-4 text-sm font-bold text-ink hover:bg-sand" href={contacts.phoneHref}>Позвонить в ателье <ArrowUpRight size={17} /></a>
      </aside> : !editing && <aside className={checkoutPanel}>
        <h2 className="text-xl font-extrabold">Отправка в ВК</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={outlineButton} type="button" onClick={() => void copy()}><Copy size={16} /> Скопировать заявку</button>
          <a className={leadButton} href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Открыть ВК <ArrowUpRight size={17} /></a>
        </div>
        <details className="mt-4" open={copyError || undefined}>
          <summary className="cursor-pointer text-sm font-semibold">Показать текст заявки</summary>
          <textarea className="mt-2 w-full rounded-xl border border-ink/20 bg-linen p-3 text-sm" rows={6}
            aria-label="Текст заявки для ВК" value={leadMessage(draft)} readOnly onFocus={event => event.currentTarget.select()} />
        </details>
        <button type="button" className="mt-4 min-h-11 text-xs underline underline-offset-4"
          onClick={() => { forgetLeadDraft(); setDraft(null) }}>Удалить черновик</button>
      </aside>}
    </div>}
  </CheckoutFrame>
}
