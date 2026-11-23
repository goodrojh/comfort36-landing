const SHEET = 'Лиды'
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const HEADERS = ['Дата (МСК)', 'Канал', ...UTM, 'ID события']
const CHANNELS = ['Первый экран → ВК', 'Корзина сайта → ВК', 'Конфигуратор → ВК', 'ВК Маркет']

function setupComfort36() {
  const book = SpreadsheetApp.getActiveSpreadsheet()
  if (!book) throw new Error('Откройте Apps Script из целевой таблицы')
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', book.getId())
  const sheet = book.getSheetByName(SHEET) || book.insertSheet(SHEET)
  if (sheet.getLastRow() && sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0].join('|') !== HEADERS.join('|')) {
    throw new Error('Лист «Лиды» уже содержит другой отчёт. Переименуйте существующий лист.')
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground('#102e23').setFontColor('#ffffff').setFontWeight('bold')
  sheet.setFrozenRows(1)
  sheet.setColumnWidth(1, 125)
  sheet.setColumnWidth(2, 210)
  sheet.setColumnWidths(3, UTM.length, 156)
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, HEADERS.length).setNumberFormat('@')
  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), HEADERS.length).createFilter()
  sheet.hideColumns(HEADERS.length)
}

function doPost(e) {
  const reply = ok => ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON)
  const props = PropertiesService.getScriptProperties()
  let data
  try {
    if (!e?.postData?.contents || e.postData.contents.length > 4000) return reply(false)
    data = JSON.parse(e.postData.contents)
  } catch {
    return reply(false)
  }
  const key = props.getProperty('SHEETS_KEY')
  if (!key || data?.key !== key || !/^[0-9a-f-]{36}$/.test(data.id) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !CHANNELS.includes(data.channel)) return reply(false)
  const tags = UTM.map(field => {
    const value = data.utm?.[field]
    return typeof value === 'string' && /^[\p{L}\p{N}_. -]{1,80}$/u.test(value) && !/\d{8}/.test(value)
      ? "'" + value : ''
  })
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)
  try {
    const sheet = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName(SHEET)
    const last = sheet.getLastRow()
    if (last >= 2 && sheet.getRange(2, HEADERS.length, last - 1, 1).createTextFinder(data.id).matchEntireCell(true).findNext()) {
      return reply(true)
    }
    sheet.appendRow(["'" + data.date, data.channel, ...tags, data.id])
    SpreadsheetApp.flush()
    return reply(true)
  } finally {
    lock.releaseLock()
  }
}
