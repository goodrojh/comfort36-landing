const SHEET = 'Лиды'
const CONTACT_SHEET = 'Заявки с сайта'
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const HEADERS = ['Дата (МСК)', 'Канал', ...UTM, 'ID события']
const CONTACT_HEADERS = ['Дата (МСК)', 'Канал', 'Имя', 'Телефон', 'Комментарий', 'Состав заявки', ...UTM, 'ID события', 'Обновлено (МСК)']
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
  if (name === CONTACT_SHEET) sheet.setColumnWidths(5, 2, 300)
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, headers.length).setNumberFormat('@')
  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).createFilter()
  sheet.hideColumns(headers.indexOf('ID события') + 1)
  return sheet
}

function setupComfort36() {
  const book = SpreadsheetApp.getActiveSpreadsheet()
  if (!book) throw new Error('Откройте Apps Script из целевой таблицы')
  const props = PropertiesService.getScriptProperties()
  props.setProperty('SPREADSHEET_ID', book.getId())
  prepareSheet(book, SHEET, HEADERS)
  if (props.getProperty('ALLOW_CONTACT_DATA') === 'true') prepareSheet(book, CONTACT_SHEET, CONTACT_HEADERS)
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
    const sheet = book.getSheetByName(withContactData ? CONTACT_SHEET : SHEET)
    const heads = withContactData ? CONTACT_HEADERS : HEADERS
    if (!sheet) return reply(false)
    const idColumn = heads.indexOf('ID события') + 1
    const date = textCell(data.date)
    const updated = textCell(Utilities.formatDate(new Date(), 'Europe/Moscow', 'yyyy-MM-dd HH:mm:ss'))
    if (correction) {
      const row = findRow(sheet, idColumn, correction)
      if (!row) return reply(false)
      sheet.getRange(row, 3, 1, 3).setValues([[textCell(lead.name), textCell(lead.phone), textCell(lead.description)]])
      sheet.getRange(row, CONTACT_HEADERS.length).setValue(updated)
    } else if (!findRow(sheet, idColumn, data.id)) {
      sheet.appendRow(withContactData
        ? [date, data.channel, textCell(lead.name), textCell(lead.phone), textCell(lead.description), textCell(lead.order), ...tags, data.id, updated]
        : [date, data.channel, ...tags, data.id])
    }
    SpreadsheetApp.flush()
    return reply(true)
  } finally {
    lock.releaseLock()
  }
}
