/**
 * Медиа сгенерированы в Higgsfield (Nano Banana Pro 2K + Kling 3.0 pro),
 * затем сжаты и положены в public/media — раздаются с того же домена.
 * Вес всего пакета ~1 МБ вместо ~85 МБ оригиналов.
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
  vk: 'https://vk.com/comfort36',
  address: 'Воронеж, д. Князево, Сенновские выселки, 10',
  mapHref: 'https://yandex.ru/maps/?text=Воронеж, Князево, Сенновские выселки, 10',
}

/** Ссылка в WhatsApp с заранее подставленным текстом заявки. */
export const waWithText = (text: string) =>
  `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(text)}`
