type SmartCaptcha = {
  render: (container: HTMLElement, options: { sitekey: string; hl: string; callback: (token: string) => void }) => number
  destroy: (id: number) => void
}
type CaptchaWindow = Window & { smartCaptcha?: SmartCaptcha; comfortCaptchaReady?: () => void }
let loader: Promise<SmartCaptcha> | undefined
function loadCaptcha(): Promise<SmartCaptcha> {
  const w = window as CaptchaWindow
  if (w.smartCaptcha) return Promise.resolve(w.smartCaptcha)
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    function fail() {
      clearTimeout(timer)
      loader = undefined
      delete w.comfortCaptchaReady
      script.remove()
      reject(new Error('Captcha unavailable'))
    }
    const timer = window.setTimeout(fail, 15000)
    w.comfortCaptchaReady = () => {
      if (!w.smartCaptcha) return fail()
      clearTimeout(timer)
      resolve(w.smartCaptcha)
      delete w.comfortCaptchaReady
    }
    script.src = 'https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload&onload=comfortCaptchaReady'
    script.onerror = fail
    document.head.append(script)
  })
  return loader
}

export async function verifyVisitor(sitekey: string): Promise<string> {
  const api = await loadCaptcha()
  const dialog = document.createElement('dialog')
  dialog.className = 'm-auto w-[min(26rem,96vw)] rounded-2xl bg-linen p-4 text-ink backdrop:bg-ink/60'
  dialog.setAttribute('aria-label', 'Проверка перед отправкой')
  const title = document.createElement('h2')
  title.className = 'mb-3 font-bold'
  title.textContent = 'Подтвердите отправку заявки'
  const container = document.createElement('div')
  const cancel = document.createElement('button')
  cancel.textContent = 'Отмена'
  cancel.className = 'mt-3 min-h-11 underline'
  dialog.append(title, container, cancel)
  document.body.append(dialog)
  let widget: number | undefined
  try {
    dialog.showModal()
    return await new Promise<string>((resolve, reject) => {
      dialog.onclose = () => reject(new Error('Captcha cancelled'))
      cancel.onclick = () => dialog.close()
      widget = api.render(container, { sitekey, hl: 'ru', callback: resolve })
    })
  } finally {
    if (widget !== undefined) api.destroy(widget)
    dialog.remove()
  }
}
