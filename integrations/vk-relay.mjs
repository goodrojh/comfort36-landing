import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'

const groupId = 216385176
const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const env = process.env
for (const name of ['VK_CALLBACK_SECRET', 'VK_CONFIRMATION_CODE', 'SHEETS_WEB_APP', 'SHEETS_KEY', 'QUEUE_PATH']) {
  if (!env[name]) throw new Error(`Missing ${name}`)
}
const sheetsUrl = new URL(env.SHEETS_WEB_APP)
if (sheetsUrl.origin !== 'https://script.google.com' || !sheetsUrl.pathname.endsWith('/exec')) {
  throw new Error('SHEETS_WEB_APP must be the HTTPS Apps Script /exec deployment URL')
}
const rules = JSON.parse(env.UTM_ALLOWLIST_JSON ?? '{}')
const allowlist = Object.fromEntries(fields.map(key => [key, new Set(Array.isArray(rules[key]) ? rules[key] : [])]))

const db = new DatabaseSync(env.QUEUE_PATH)
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = FULL;
  CREATE TABLE IF NOT EXISTS events (
    vk_key TEXT PRIMARY KEY, payload TEXT NOT NULL, delivered INTEGER NOT NULL DEFAULT 0
  );
`)
const insert = db.prepare('INSERT OR IGNORE INTO events(vk_key, payload) VALUES (?, ?)')
const backlog = db.prepare('SELECT vk_key, payload FROM events WHERE delivered = 0 ORDER BY rowid LIMIT 40')
const complete = db.prepare("UPDATE events SET delivered = 1, payload = '' WHERE vk_key = ?")

function secretMatches(value) {
  const supplied = Buffer.from(typeof value === 'string' ? value : '')
  const secret = Buffer.from(env.VK_CALLBACK_SECRET)
  return supplied.length === secret.length && timingSafeEqual(supplied, secret)
}

function normalize(event) {
  if (event.type === 'market_order_new') {
    const orderId = event.object?.order_id ?? event.object?.id ?? event.object?.order?.id
    return { channel: 'ВК Маркет', utm: {}, key: String(event.event_id ?? orderId ?? '') }
  }

  if (event.type !== 'message_new') return null
  const message = event.object?.message
  if (typeof message?.text !== 'string' || message.out) return null
  const lines = message.text.split(/\r?\n/).map(line => line.trim())
  const marker = lines.findIndex(line => /^\[comfort36:site:(hero|cart|config)\]$/.test(line))
  if (marker < 0) return null
  const utm = {}
  for (const part of (lines[marker + 1] ?? '').split(' · ')) {
    const [field, value] = part.split('=')
    if (fields.includes(field) && allowlist[field].has(value)) utm[field] = value
  }
  const key = event.event_id || (message.peer_id && message.conversation_message_id
    ? `${message.peer_id}/${message.conversation_message_id}` : '')
  const channels = { hero: 'Первый экран → ВК', cart: 'Корзина сайта → ВК', config: 'Конфигуратор → ВК' }
  const source = lines[marker].slice('[comfort36:site:'.length, -1)
  return { channel: channels[source], utm, key }
}

function reportDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Moscow',
  }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(part => parts.find(item => item.type === part).value).join('-')
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 64 * 1024) throw new Error('Payload size exceeded')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = createServer(async (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  if (request.method !== 'POST' || request.url !== '/vk/callback') {
    response.writeHead(404).end('not found')
    return
  }
  let event
  try { event = await readJson(request) } catch { response.writeHead(400).end('invalid payload'); return }
  if (Number(event?.group_id) !== groupId || !secretMatches(event.secret)) {
    response.writeHead(403).end('forbidden')
    return
  }
  if (event.type === 'confirmation') { response.end(env.VK_CONFIRMATION_CODE); return }

  const lead = normalize(event)
  if (lead?.key) {
    try {
      const vkKey = createHash('sha256').update(`${env.VK_CALLBACK_SECRET}:${event.type}:${lead.key}`).digest('hex')
      insert.run(vkKey, JSON.stringify({ id: randomUUID(), date: reportDate(), channel: lead.channel, utm: lead.utm }))
    } catch {
      console.error('Could not enqueue VK event')
      response.writeHead(503).end('retry')
      return
    }
  }
  response.end('ok')
})

let flushing = false
async function flush() {
  if (flushing) return
  flushing = true
  try {
    for (const row of backlog.all()) {
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key: env.SHEETS_KEY, ...JSON.parse(row.payload) }),
        signal: AbortSignal.timeout(8000),
      })
      if (!response.ok || (await response.json()).ok !== true) throw new Error('Apps Script rejected event')
      complete.run(row.vk_key)
    }
  } catch {
    console.error('Google Sheets unavailable. Pending events will be retried.')
  } finally {
    flushing = false
  }
}

server.requestTimeout = 10000
server.listen(Number(env.PORT ?? 8787), env.HOST ?? '127.0.0.1')
setInterval(() => { void flush() }, 15000)
