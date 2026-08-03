/**
 * Медиа лежат в public/media и раздаются с того же домена.
 * Всё сжато: ~1 МБ на весь пакет вместо ~85 МБ исходников.
 */
const M = `${import.meta.env.BASE_URL}media`

export const media = {
  heroPoster: `${M}/hero.webp`,
  heroVideo: `${M}/hero.mp4`,
  stitchMacro: `${M}/stitch.webp`,
  stitchVideo: `${M}/stitch.mp4`,
  iconScan: `${M}/icon-scan.webp`,
  iconCut: `${M}/icon-cut.webp`,
  iconSew: `${M}/icon-sew.webp`,
  workSeats: `${M}/work-seats.webp`,
  workMats: `${M}/work-mats.webp`,
  workDash: `${M}/work-dash.webp`,
}

const PHONE_DIGITS = '79066770713'

export const contacts = {
  phone: '8 (906) 677-07-13',
  phoneHref: `tel:+${PHONE_DIGITS}`,
  whatsapp: `https://wa.me/${PHONE_DIGITS}`,
  telegram: `https://t.me/+${PHONE_DIGITS}`,
  // MAX не поддерживает ссылки по номеру телефона — только персональная ссылка
  // вида https://max.ru/u/xxxxxxx. Подставьте её из профиля мессенджера.
  max: 'https://max.ru/',
  vk: 'https://vk.com/autocomfort36',
  vkWrite: 'https://vk.com/write-216385176',
  address: 'Воронежская обл., Рамонский р-н, д. Князево, ул. Сенновские Выселки, 10',
  addressShort: 'д. Князево, ул. Сенновские Выселки, 10',
  mapHref:
    'https://yandex.ru/maps/?ll=39.182949%2C52.080462&mode=search&text=Сенновские Выселки, 10, Князево&z=16',
  mapEmbed:
    'https://yandex.ru/map-widget/v1/?ll=39.182949%2C52.080462&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgozNTQ0MTIwMjExEuUB0KDQvtGB0YHQuNGPLCDQktC-0YDQvtC90LXQttGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCDQoNCw0LzQvtC90YHQutC40Lkg0YDQsNC50L7QvSwg0JrQvtC80YHQvtC80L7Qu9GM0YHQutC-0LUg0YHQtdC70YzRgdC60L7QtSDQv9C-0YHQtdC70LXQvdC40LUsINC00LXRgNC10LLQvdGPINCa0L3Rj9C30LXQstC-LCDRg9C70LjRhtCwINCh0LXQvdC90L7QstGB0LrQuNC1INCS0YvRgdC10LvQutC4LCAxMCIKDVe7HEIVZFJQQg%2C%2C&z=16',
}

/** Ссылка в WhatsApp с заранее подставленным текстом заявки. */
export const waWithText = (text: string) =>
  `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(text)}`
