import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, Copy, Pencil } from 'lucide-react'
import { getLeadDetails, leadButton, LeadFields } from './LeadForm'
import { forgetLeadDraft, leadMessage, readLeadDraft, saveLeadDraft } from './lead-draft'
import { contacts } from './media'

const outline = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/20 px-4 text-sm font-semibold hover:bg-sand'

export default function Thanks() {
  const [draft, setDraft] = useState(readLeadDraft)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const home = import.meta.env.BASE_URL

  async function copy() {
    if (!draft) return
    try { await navigator.clipboard.writeText(leadMessage(draft)); setCopied(true); setCopyError(false) }
    catch { setCopied(false); setCopyError(true) }
  }

  function edit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    const details = getLeadDetails(event.currentTarget)
    if (!details) return
    const updated = { ...draft, ...details, createdAt: Date.now() }
    const saved = saveLeadDraft(updated)
    setDraft(updated)
    setEditing(false)
    setCopied(false)
    setCopyError(false)
    setStorageError(!saved)
  }

  return <main className="min-h-[68vh] px-4 py-12 md:py-24">
    <div className="max-w-2xl mx-auto rounded-[1.5rem] border border-ink/10 bg-linen p-5 md:p-10">
      <a href={home} className="text-sm font-semibold underline underline-offset-4">← На главную</a>
      {draft ? <>
        <div className="mt-6 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"><Check size={24} /></div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">Спасибо!</h1>
        <p className="mt-3 text-graphite">Заявка подготовлена. Проверьте данные, затем скопируйте сообщение и отправьте его в ВК.</p>
        {draft.order && <section className="mt-5 rounded-xl bg-sand p-4">
          <h2 className="font-bold">{draft.source === 'cart' ? 'Ваш заказ' : 'Ваш комплект'}</h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-graphite">{draft.order}</p>
        </section>}
        <section className="mt-5 space-y-3">
          <h2 className="font-bold">Ваши данные</h2>
          {editing ? <form className="grid gap-3" onSubmit={edit}>
            <LeadFields details={draft} />
            <div className="flex flex-wrap gap-2">
              <button type="submit" className={leadButton}>Сохранить изменения</button>
              <button type="button" onClick={() => setEditing(false)} className={outline}>Отмена</button>
            </div>
          </form> : <>
            <dl className="space-y-2 text-sm">
              <div className="break-words"><dt className="font-bold">Имя</dt><dd>{draft.name}</dd></div>
              <div className="break-words"><dt className="font-bold">Телефон</dt><dd>{draft.phone}</dd></div>
              {draft.description && <div className="break-words"><dt className="font-bold">Комментарий</dt><dd className="whitespace-pre-wrap">{draft.description}</dd></div>}
            </dl>
            <button className={outline} type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Исправить данные</button>
          </>}
        </section>
        {!editing && <section className="mt-6 grid gap-3 border-t border-ink/10 pt-5">
          <details open={copyError || undefined}>
            <summary className="cursor-pointer text-sm font-semibold">Показать текст заявки</summary>
            <textarea className="mt-2 w-full rounded-xl border border-ink/20 bg-linen p-3 text-sm" rows={6}
              aria-label="Текст заявки для ВК" value={leadMessage(draft)} readOnly onFocus={event => event.currentTarget.select()} />
          </details>
          {storageError && <p role="status" className="text-sm">Исправления доступны на этой странице. Скопируйте заявку перед выходом.</p>}
          {copyError && <p role="status" className="text-sm">Скопируйте текст вручную из поля выше.</p>}
          {copied && <p role="status" className="text-sm text-primary">Заявка скопирована. Вставьте её в чат ВК и отправьте.</p>}
          <div className="flex flex-wrap gap-2">
            <button className={outline} type="button" onClick={() => void copy()}><Copy size={16} /> Скопировать заявку</button>
            <a className={leadButton} href={contacts.vkWrite} target="_blank" rel="noopener noreferrer">Открыть ВК <ArrowUpRight size={17} /></a>
          </div>
          <button type="button" className="justify-self-start text-xs underline underline-offset-4"
            onClick={() => { forgetLeadDraft(); setDraft(null) }}>Удалить черновик</button>
        </section>}
      </> : <>
        <h1 className="mt-5 text-3xl font-extrabold">Черновик заявки</h1>
        <p className="mt-3 text-graphite">В этой вкладке нет сохранённой заявки. Заполните форму на главной странице или в корзине.</p>
        <a className={`${leadButton} mt-5`} href={home}>Вернуться на главную</a>
      </>}
    </div>
  </main>
}
