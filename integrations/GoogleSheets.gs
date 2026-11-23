const SHEET = 'Лиды'
const CONTACT_SHEET = 'Заявки с сайта'
const OLD_INBOX = 'Заявки GitHub'
const SITE_CHANNELS = ['Первый экран сайта', 'Корзина', 'Подбор комплекта']
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const INBOX_HEADERS = ['Дата (МСК)', 'Источник', 'Имя', 'Телефон', 'Комментарий', 'Состав заявки', ...UTM, 'ID события', 'Telegram', 'Почта', 'Исходная заявка', 'Обновлено (МСК)']
const HEADERS = ['Дата (МСК)', 'Канал', ...UTM, 'ID события']
const CHANNELS = ['Первый экран сайта', 'Корзина сайта', 'Подбор комплекта', 'Первый экран → ВК', 'Корзина сайта → ВК', 'Конфигуратор → ВК', 'ВК Маркет']
const ID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/

function prepareSheet(book, name, headers) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name)
  if (sheet.getLastRow() && sheet.getRange(1, 1, 1, headers.length).getValues()[0].join('|') !== headers.join('|')) {
    throw new Error('Лист «' + name + '» уже содержит другой отчёт. Переименуйте существующий лист.')
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#102e23').setFontColor('#ffffff').setFontWeight('bold')
  sheet.setFrozenRows(1)
  sheet.setColumnWidth(1, 125)
  sheet.setColumnWidth(2, 205)
  sheet.setColumnWidths(3, headers.length - 2, 145)
  if (name === SHEET) sheet.setColumnWidths(5, 2, 300)
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, headers.length).setNumberFormat('@')
  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).createFilter()
  sheet.hideColumns(headers.indexOf('ID события') + 1)
  return sheet
}

function prepareInbox(book) {
  const existing = book.getSheetByName(SHEET)
  if (existing && existing.getLastRow() &&
      existing.getRange(1, 1, 1, HEADERS.length).getValues()[0].join('|') === HEADERS.join('|')) {
    // Keep the existing sheet ID and shift the historical UTM and event IDs together.
    if (existing.getFilter()) existing.getFilter().remove()
    existing.insertColumnsAfter(2, 4)
    existing.getRange(1, 1, 1, INBOX_HEADERS.length).setValues([INBOX_HEADERS])
  }
  const inbox = prepareSheet(book, SHEET, INBOX_HEADERS)
  const count = inbox.getLastRow() - 1
  const known = new Set(count ? inbox.getRange(2, 12, count, 1).getDisplayValues().flat() : [])
  for (const name of [OLD_INBOX, CONTACT_SHEET]) {
    const old = book.getSheetByName(name)
    if (!old || old.getLastRow() < 2) continue
    const rows = old.getRange(2, 1, old.getLastRow() - 1, 15).getDisplayValues()
    const additions = []
    for (const row of rows) {
      if (!ID.test(row[11]) || known.has(row[11])) continue
      known.add(row[11])
      const values = name === OLD_INBOX ? [...row, ''] : [...row.slice(0, 12), '', '', '', row[12]]
      additions.push(values.map(textCell))
    }
    if (additions.length) {
      const end = inbox.getLastRow()
      if (end + additions.length > inbox.getMaxRows()) inbox.insertRowsAfter(inbox.getMaxRows(), end + additions.length - inbox.getMaxRows())
      inbox.getRange(end + 1, 1, additions.length, INBOX_HEADERS.length).setValues(additions)
    }
  }
}

function setupComfort36() {
  const book = SpreadsheetApp.getActiveSpreadsheet()
  if (!book) throw new Error('Откройте Apps Script из целевой таблицы')
  const props = PropertiesService.getScriptProperties()
  props.setProperty('SPREADSHEET_ID', book.getId())
  const lock = LockService.getScriptLock()
  lock.waitLock(30000)
  try {
    prepareInbox(book)
    SpreadsheetApp.flush()
  } finally {
    lock.releaseLock()
  }
  MailApp.getRemainingDailyQuota()
  if (!ScriptApp.getProjectTriggers().some(trigger => trigger.getHandlerFunction() === 'deliverPending')) {
    ScriptApp.newTrigger('deliverPending').timeBased().everyMinutes(1).create()
  }
}

function testComfort36() {
  const props = PropertiesService.getScriptProperties()
  const key = props.getProperty('SHEETS_KEY')
  if (!key || !props.getProperty('SPREADSHEET_ID')) {
    throw new Error('Сначала задайте SHEETS_KEY и запустите setupComfort36.')
  }
  const sample = {
    key,
    id: Utilities.getUuid(),
    date: Utilities.formatDate(new Date(), 'Europe/Moscow', 'yyyy-MM-dd'),
    channel: 'Первый экран сайта',
    utm: { utm_source: 'github', utm_medium: 'test', utm_campaign: 'comfort36_preview' },
  }
  if (props.getProperty('ALLOW_CONTACT_DATA') === 'true') {
    sample.lead = {
      name: 'Тест COMFORT 36',
      phone: '+7 900 000 00 00',
      description: 'Проверка Google Таблицы',
      order: 'Демонстрационный комплект',
    }
  }
  const response = doPost({ postData: { contents: JSON.stringify(sample) } })
  if (!JSON.parse(response.getContent()).ok) throw new Error('Проверьте настройки и повторите setupComfort36.')
}

function textCell(value) {
  // Force plain text, including Russian phone numbers beginning with "+" and pasted formulas.
  return typeof value === 'string' && value !== '' ? "'" + value : ''
}

function findRow(sheet, idColumn, id) {
  const last = sheet.getLastRow()
  if (last < 2) return 0
  const cell = sheet.getRange(2, idColumn, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext()
  return cell ? cell.getRow() : 0
}

function telegramApi(props, method, fields) {
  const token = props.getProperty('TELEGRAM_BOT_TOKEN')
  if (!token || !/^[1-9]\d*:[A-Za-z0-9_-]{20,}$/.test(token)) {
    throw new Error('Добавьте токен бота в свойство TELEGRAM_BOT_TOKEN.')
  }
  let result
  try {
    const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/' + method, {
      method: 'post', contentType: 'application/json', payload: JSON.stringify(fields), muteHttpExceptions: true,
    })
    result = JSON.parse(response.getContentText())
  } catch {
    throw new Error('Telegram API временно недоступен.')
  }
  if (result.ok !== true) throw new Error('Telegram API отклонил запрос (' + Number(result.error_code || 0) + ').')
  return result.result
}

function connectTelegram() {
  const props = PropertiesService.getScriptProperties()
  const code = props.getProperty('TELEGRAM_CONNECT_CODE')?.trim()
  if (!code || code.length < 8) throw new Error('Добавьте свой код из сообщения боту в TELEGRAM_CONNECT_CODE.')
  const updates = telegramApi(props, 'getUpdates', { limit: 100, timeout: 0, allowed_updates: ['message'] })
  const chats = [...new Set(updates.flatMap(update =>
    update.message?.chat?.type === 'private' && update.message.text?.trim() === code
      ? [String(update.message.chat.id)] : [],
  ))]
  if (chats.length !== 1) throw new Error('Откройте личный чат с ботом и отправьте код из TELEGRAM_CONNECT_CODE, затем повторите.')
  telegramApi(props, 'sendMessage', { chat_id: chats[0], text: 'COMFORT 36 · Telegram подключён.' })
  props.setProperty('TELEGRAM_CHAT_ID', chats[0])
  props.deleteProperty('TELEGRAM_CONNECT_CODE')
}

function receiveSiteLead(data, props) {
  const id = data['ID заявки']
  const source = data['Источник']
  const name = data['Имя']
  const phone = data['Телефон']
  const description = data['Комментарий'] ?? ''
  const order = data['Состав заявки'] ?? ''
  const correction = data['ID исходной заявки']
  if (typeof id !== 'string' || !ID.test(id) || !SITE_CHANNELS.includes(source) ||
      typeof name !== 'string' || !name.trim() || name.length > 80 ||
      typeof phone !== 'string' || !/^\+?[\d ()-]+$/.test(phone) || !/^\d{10,15}$/.test(phone.replace(/\D/g, '')) ||
      typeof description !== 'string' || description.length > 500 || typeof order !== 'string' || order.length > 2600 ||
      (correction !== undefined && (typeof correction !== 'string' || !ID.test(correction) || correction === id))) return false

  const lock = LockService.getScriptLock()
  lock.waitLock(5000)
  try {
    const book = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'))
    const sheet = book.getSheetByName(SHEET)
    if (!sheet) return false
    const idColumn = INBOX_HEADERS.indexOf('ID события') + 1
    if (findRow(sheet, idColumn, id)) return true

    const bucket = String(Math.floor(Date.now() / 3600000))
    const saved = (props.getProperty('GITHUB_HOUR_LIMIT') || '').split(':')
    const used = saved[0] === bucket ? Number(saved[1]) : 0
    if (used >= 20) return false
    props.setProperty('GITHUB_HOUR_LIMIT', bucket + ':' + (used + 1))

    {
      const tags = UTM.map(field => {
        const value = data[field]
        return typeof value === 'string' && /^[\p{L}\p{N}_. -]{1,80}$/u.test(value) && !/\d{8}/.test(value) ? textCell(value) : ''
      })
      const timestamp = Utilities.formatDate(new Date(), 'Europe/Moscow', 'yyyy-MM-dd HH:mm:ss')
      sheet.appendRow([textCell(timestamp), source, textCell(name), textCell(phone), textCell(description), textCell(order), ...tags, id, 'Ожидает отправки', 'Ожидает отправки', correction || ''])
      SpreadsheetApp.flush()
    }

    return true
  } finally {
    SpreadsheetApp.flush()
    lock.releaseLock()
  }
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function formatNotification(row) {
  const [date, source, name, phone, comment, order] = row
  const number = (row[14] || row[11]).slice(0, 8).toUpperCase()
  const title = row[14] ? 'Исправление заявки' : source === 'Корзина' ? 'Заказ из корзины' :
    source === 'Подбор комплекта' ? 'Подбор комплекта' : 'Обратный звонок'
  const subject = title + ' № ' + number + ' · COMFORT 36'
  const blocks = [['Клиент', name + '\n' + phone]]
  if (order) blocks.push([source === 'Корзина' ? 'Состав заказа' : 'Комплект', order])
  if (comment) blocks.push(['Комментарий клиента', comment])
  const tags = UTM.flatMap((key, i) => row[6+i] ? [key + ': ' + row[6+i]] : [])
  if (tags.length) blocks.push(['Реклама', tags.join('\n')])
  const meta = source + ' · ' + date + ' МСК'
  const plain = [subject, meta, ...blocks.map(([label, value]) => label + '\n' + value)].join('\n\n')
  const telegram = ['<b>' + escapeHtml(subject) + '</b>', escapeHtml(meta),
    ...blocks.map(([label, value]) => '<b>' + label + '</b>\n' + escapeHtml(value))].join('\n\n')
  const html = '<div style="max-width:560px;font:16px/1.55 Arial,sans-serif;color:#183329">' +
    '<div style="background:#163d2e;color:white;padding:20px;border-radius:14px"><small>COMFORT 36</small><h2 style="margin:6px 0">' +
    escapeHtml(title) + ' № ' + number + '</h2>' + escapeHtml(meta) + '</div>' +
    blocks.map(([label, value]) => '<div style="padding:16px;border-bottom:1px solid #d6e4da"><strong>' +
      label + '</strong><br>' + escapeHtml(value).replace(/\n/g, '<br>') + '</div>').join('') + '</div>'
  return {subject, plain, html, telegram}
}

function deliverPending() {
  deliverNotifications()
}

function deliverNotifications(id) {
  const props = PropertiesService.getScriptProperties()
  const lock = LockService.getUserLock()
  if (!lock.tryLock(1000)) return
  try {
    const sheet = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName(SHEET)
    const first = id ? findRow(sheet, 12, id) : 2
    const count = id ? 1 : sheet.getLastRow() - 1
    if (!first || count < 1) return
    const rows = sheet.getRange(first, 1, count, 15).getDisplayValues()
    let budget = 12
    for (const [index, row] of rows.entries()) {
      if (!row[13] || (row[12] === 'Отправлено' && row[13] === 'Отправлено')) continue
      const notice = formatNotification(row)
      for (const column of [13, 14]) {
        if (row[column - 1] === 'Отправлено') continue
        try {
          if (column === 13) telegramApi(props, 'sendMessage', {
            chat_id: props.getProperty('TELEGRAM_CHAT_ID'), text: notice.telegram, parse_mode: 'HTML', protect_content: true,
          })
          else MailApp.sendEmail({to: props.getProperty('LEAD_EMAIL_TO') || 'Halubets-1904@mail.ru',
            subject: notice.subject, body: notice.plain, htmlBody: notice.html, name: 'COMFORT 36'})
          sheet.getRange(first + index, column).setValue('Отправлено')
        } catch {
          sheet.getRange(first + index, column).setValue('Повторить')
        }
      }
      if (--budget === 0) break
    }
  } finally {
    SpreadsheetApp.flush()
    lock.releaseLock()
  }
}

function doPost(e) {
  const reply = ok => ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON)
  const props = PropertiesService.getScriptProperties()
  let data
  try {
    const body = e?.postData?.contents
    if (!body || body.length > 18000) return reply(false)
    data = JSON.parse(body)
  } catch {
    return reply(false)
  }
  if (typeof data?.notify === 'string' && ID.test(data.notify)) {
    deliverNotifications(data.notify)
    return reply(true)
  }
  if (data?.form_data && typeof data.form_data === 'object') {
    return reply(receiveSiteLead(data.form_data, props))
  }
  const key = props.getProperty('SHEETS_KEY')
  if (!key || key !== data?.key || (typeof data.id !== 'string' || !ID.test(data.id)) || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      !CHANNELS.includes(data.channel)) return reply(false)

  const lead = data.lead
  const correction = data.correctionOf
  const withContactData = lead !== undefined
  if ((withContactData && props.getProperty('ALLOW_CONTACT_DATA') !== 'true') ||
      (correction != null && (!withContactData || typeof correction !== 'string' || !ID.test(correction) || correction === data.id))) return reply(false)
  if (withContactData && (!lead || !lead.name || typeof lead.name !== 'string' || lead.name.length > 80 ||
      typeof lead.phone !== 'string' || !/^\+?[\d ()-]+$/.test(lead.phone) ||
      !/^\d{10,15}$/.test(lead.phone.replace(/\D/g, '')) ||
      typeof lead.description !== 'string' || lead.description.length > 500 ||
      typeof lead.order !== 'string' || lead.order.length > 5000)) return reply(false)

  const tags = UTM.map(field => {
    const value = data.utm?.[field]
    return typeof value === 'string' && /^[\p{L}\p{N}_. -]{1,80}$/u.test(value) && !/\d{8}/.test(value)
      ? textCell(value) : ''
  })
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)
  try {
    const book = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'))
    const sheet = book.getSheetByName(SHEET)
    if (!sheet) return reply(false)
    const idColumn = INBOX_HEADERS.indexOf('ID события') + 1
    const date = textCell(data.date)
    const updated = textCell(Utilities.formatDate(new Date(), 'Europe/Moscow', 'yyyy-MM-dd HH:mm:ss'))
    if (correction) {
      const row = findRow(sheet, idColumn, correction)
      if (!row) return reply(false)
      sheet.getRange(row, 3, 1, 3).setValues([[textCell(lead.name), textCell(lead.phone), textCell(lead.description)]])
      sheet.getRange(row, INBOX_HEADERS.length).setValue(updated)
    } else if (!findRow(sheet, idColumn, data.id)) {
      sheet.appendRow(withContactData
        ? [date, data.channel, textCell(lead.name), textCell(lead.phone), textCell(lead.description), textCell(lead.order), ...tags, data.id, '', '', '', updated]
        : [date, data.channel, '', '', '', '', ...tags, data.id])
    }
    SpreadsheetApp.flush()
    return reply(true)
  } finally {
    lock.releaseLock()
  }
}
