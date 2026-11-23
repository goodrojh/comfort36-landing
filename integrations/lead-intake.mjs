import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { pathToFileURL } from 'node:url'

const vkApi = 'https://api.vk.com/method/messages.send'
const channels = { hero: 'Первый экран → ВК', cart: 'Корзина сайта → ВК', config: 'Конфигуратор → ВК' }
const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const moscowDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Moscow' })
const retention = 7 * 24 * 60 * 60 * 1000
const maxBody = 20_000

function cleanLead(data, allowlist) {
  if (!data || !uuid.test(data.id) || data.consent !== true || !Object.hasOwn(channels, data.source)) return
  const { id, source, name, phone, description, order, correctionOf } = data
  if (typeof name !== 'string' || !name.trim() || name.length > 80 ||
      typeof phone !== 'string' || phone.length > 25 || !/^\+?[\d\s()-]+$/.test(phone) ||
      !/^\d{10,15}$/.test(phone.replace(/\D/g, '')) ||
      typeof description !== 'string' || description.length > 500 ||
      (order !== undefined && (typeof order !== 'string' || order.length > 4500)) ||
      (correctionOf !== undefined && !uuid.test(correctionOf))) return

  const utm = Object.fromEntries(fields.flatMap(field => {
    const value = data.attribution?.[field]
    return typeof value === 'string' && allowlist[field]?.has(value) ? [[field, value]] : []
  }))
  return {
    id, source, correctionOf, utm, name: name.trim().replace(/[\r\n]+/g, ' '),
    phone: phone.trim().replace(/[\r\n]+/g, ''), description: description.trim(),
    order: correctionOf ? undefined : order?.trim(),
  }
}

function vkMessage(lead) {
  const number = (lead.correctionOf ?? lead.id).slice(0, 8).toUpperCase()
  return [
    lead.correctionOf ? `Исправление к заявке COMFORT 36 № ${number}` : `Новая заявка с сайта COMFORT 36 № ${number}`,
    channels[lead.source],
    lead.order,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.description ? `Комментарий: ${lead.description}` : '',
    lead.correctionOf ? '' : 'Согласие на обработку данных получено на сайте.',
  ].filter(Boolean).join('\n')
}

export function createLeadIntake({
  dbPath, origin, token, peerId, apiVersion = '5.199',
  sheetsUrl, sheetsKey, utm = {}, fetchImpl = fetch,
}) {
  if (!dbPath || !origin || !token || !/^-?[1-9]\d*$/.test(peerId) || Boolean(sheetsUrl) !== Boolean(sheetsKey)) {
    throw new Error('Configure LEAD_DB_PATH, LEAD_ORIGIN, VK_COMMUNITY_TOKEN and VK_PEER_ID. Set both Sheets values to enable reporting.')
  }
  const allowlist = Object.fromEntries(fields.map(field => [field, new Set(
    (utm[field] ?? []).filter(value => typeof value === 'string' && /^[\p{L}\p{N}_. -]{1,80}$/u.test(value) && !/\d{8}/.test(value)),
  )]))
  const db = new DatabaseSync(dbPath)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    PRAGMA secure_delete = ON;
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, source TEXT NOT NULL, correction_of TEXT,
      created_at INTEGER NOT NULL, vk_payload TEXT, vk_due INTEGER NOT NULL, vk_attempts INTEGER NOT NULL DEFAULT 0,
      report_payload TEXT, report_due INTEGER NOT NULL, report_attempts INTEGER NOT NULL DEFAULT 0
    );
  `)
  const lookup = db.prepare('SELECT fingerprint, source, correction_of FROM leads WHERE id = ?')
  const insert = db.prepare(`
    INSERT INTO leads (id, fingerprint, source, correction_of, created_at, vk_payload, vk_due, report_payload, report_due)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const removeExpired = db.prepare('DELETE FROM leads WHERE created_at < ?')
  const deliveries = ['vk', 'report'].map(channel => ({
    channel,
    due: db.prepare(`
      SELECT id, ${channel}_payload AS payload, ${channel}_attempts AS attempts FROM leads AS current
      WHERE ${channel}_payload IS NOT NULL AND ${channel}_due <= ?
      ${channel === 'vk' ? `AND NOT EXISTS (
        SELECT 1 FROM leads AS earlier WHERE current.correction_of IS NOT NULL AND earlier.vk_payload IS NOT NULL
        AND (earlier.id = current.correction_of OR (
          earlier.correction_of = current.correction_of AND earlier.rowid < current.rowid
        ))
      )` : ''}
      ORDER BY ${channel}_due LIMIT 6
    `),
    done: db.prepare(`UPDATE leads SET ${channel}_payload = NULL WHERE id = ?`),
    retry: db.prepare(`UPDATE leads SET ${channel}_attempts = ?, ${channel}_due = ? WHERE id = ?`),
  }))

  async function deliver(channel, row) {
    if (channel === 'vk') {
      const randomId = createHash('sha256').update(row.id).digest().readUInt32BE() % 2147483646 + 1
      const response = await fetchImpl(vkApi, {
        method: 'POST',
        body: new URLSearchParams({
          v: apiVersion, peer_id: peerId, random_id: String(randomId),
          message: row.payload, access_token: token, dont_parse_links: '1', disable_mentions: '1',
        }),
        signal: AbortSignal.timeout(8000),
      })
      const result = await response.json()
      if (!response.ok || result.error || !Number.isInteger(result.response)) {
        throw Object.assign(new Error('VK delivery rejected'), { code: result.error?.error_code })
      }
      return
    }

    const response = await fetchImpl(sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...JSON.parse(row.payload), key: sheetsKey }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok || (await response.json()).ok !== true) throw new Error('Report delivery rejected')
  }

  let active
  let closed = false
  function flush() {
    if (active || closed) return active
    active = (async () => {
      const now = Date.now()
      removeExpired.run(now - retention)
      await Promise.all(deliveries.map(async delivery => {
        for (const row of delivery.due.all(now)) {
          try {
            await deliver(delivery.channel, row)
            delivery.done.run(row.id)
          } catch (error) {
            const attempts = row.attempts + 1
            const delay = Math.min(60 * 60_000, 15_000 * 2 ** Math.min(attempts - 1, 8))
            delivery.retry.run(attempts, Date.now() + delay, row.id)
            const code = Number.isInteger(error?.code) ? `, VK API ${error.code}` : ''
            console.error(`[leads] ${delivery.channel} delivery failed (attempt ${attempts}${code})`)
          }
        }
      }))
    })().catch(() => console.error('[leads] queue error')).finally(() => { active = undefined })
    return active
  }

  const limits = new Map()
  const rateWindow = 10 * 60_000
  function limited(request) {
    // Production reverse proxy overwrites X-Real-IP. Never expose this port externally.
    const ip = request.headers['x-real-ip'] ?? request.socket.remoteAddress
    const now = Date.now()
    const entry = limits.get(ip)
    if (entry && entry.reset > now) return ++entry.count > 12
    for (const [key, limit] of limits) {
      if (limit.reset <= now) limits.delete(key)
    }
    if (limits.size >= 5000) return true
    limits.set(ip, { reset: now + rateWindow, count: 1 })
    return false
  }

  const server = createServer(async (request, response) => {
    const reply = (status, data) => {
      response.statusCode = status
      response.end(data ? JSON.stringify(data) : undefined)
    }
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Vary', 'Origin')
    if (request.url !== '/leads') return reply(404)
    if (request.headers.origin !== origin) return reply(403)
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (request.method === 'OPTIONS') return reply(204)
    if (request.method !== 'POST') return reply(405)
    if (request.headers['content-type']?.split(';')[0] !== 'application/json') return reply(415)
    if (limited(request)) return reply(429)
    if (Number(request.headers['content-length']) > maxBody) return reply(413)

    let data
    try {
      const chunks = []
      let size = 0
      for await (const chunk of request) {
        size += chunk.length
        if (size > maxBody) return reply(413)
        chunks.push(chunk)
      }
      data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      return reply(400)
    }
    const lead = cleanLead(data, allowlist)
    if (!lead) return reply(422)

    try {
      const fingerprint = createHash('sha256').update(JSON.stringify(lead)).digest('hex')
      const existing = lookup.get(lead.id)
      if (existing) return existing.fingerprint === fingerprint ? reply(202, { id: lead.id }) : reply(409)

      if (lead.correctionOf) {
        const original = lookup.get(lead.correctionOf)
        if (!original || original.correction_of || original.source !== lead.source) return reply(410)
      }
      const now = Date.now()
      const report = sheetsUrl && !lead.correctionOf ? {
        id: lead.id, date: moscowDate.format(now), channel: channels[lead.source], utm: lead.utm,
      } : null
      insert.run(lead.id, fingerprint, lead.source, lead.correctionOf ?? null, now,
        vkMessage(lead), now, report && JSON.stringify(report), now)
      reply(202, { id: lead.id })
      void flush()
    } catch {
      console.error('[leads] database write failed')
      reply(503)
    }
  })
  server.requestTimeout = 12_000
  // Pending deliveries are picked up after restart, including when a provider is temporarily unavailable.
  const timer = setInterval(flush, 3000).unref()
  server.on('close', async () => {
    closed = true
    clearInterval(timer)
    await active
    db.close()
  })
  return server
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { env } = process
  createLeadIntake({
    dbPath: env.LEAD_DB_PATH, origin: env.LEAD_ORIGIN,
    token: env.VK_COMMUNITY_TOKEN, peerId: env.VK_PEER_ID, apiVersion: env.VK_API_VERSION,
    sheetsUrl: env.SHEETS_WEB_APP, sheetsKey: env.SHEETS_KEY,
    utm: JSON.parse(env.UTM_ALLOWLIST_JSON ?? '{}'),
  }).listen(Number(env.LEAD_PORT ?? 8788), '127.0.0.1', () => console.log('[leads] listening'))
}
