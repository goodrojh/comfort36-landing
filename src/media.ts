const local = `${import.meta.env.BASE_URL}media/`
export const media = {
  heroPoster: local + 'hero.webp',
  heroVideo: local + 'hero.mp4',
  iconScan: local + 'icon-scan.webp',
  iconCut: local + 'icon-cut.webp',
  iconSew: local + 'icon-sew.webp',
}

const PHONE_DIGITS = '79066770713'

export const contacts = {
  phone: '8 (906) 677-07-13',
  phoneHref: `tel:+${PHONE_DIGITS}`,
  max: 'https://max.ru/u/f9LHodD0cOJaH16z3gW6jf7eVhBms64KiaqJ5dxovY3SpGjyqUGzGsRl08Y',
  vk: 'https://vk.ru/autocomfort36',
  vkWrite: 'https://vk.ru/write-216385176',
  address: 'Воронежская обл., Рамонский р-н, д. Князево, ул. Сенновские Выселки, 10',
  addressShort: 'д. Князево, ул. Сенновские Выселки, 10',
  mapHref:
    'https://yandex.ru/maps/?ll=39.182949%2C52.080462&mode=search&text=Сенновские Выселки, 10, Князево&z=16',
  mapEmbed:
    'https://yandex.ru/map-widget/v1/?ll=39.182949%2C52.080462&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgozNTQ0MTIwMjExEuUB0KDQvtGB0YHQuNGPLCDQktC-0YDQvtC90LXQttGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCDQoNCw0LzQvtC90YHQutC40Lkg0YDQsNC50L7QvSwg0JrQvtC80YHQvtC80L7Qu9GM0YHQutC-0LUg0YHQtdC70YzRgdC60L7QtSDQv9C-0YHQtdC70LXQvdC40LUsINC00LXRgNC10LLQvdGPINCa0L3Rj9C30LXQstC-LCDRg9C70LjRhtCwINCh0LXQvdC90L7QstGB0LrQuNC1INCS0YvRgdC10LvQutC4LCAxMCIKDVe7HEIVZFJQQg%2C%2C&z=16',
}
