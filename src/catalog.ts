export type Product = {
  id: number
  title: string
  color: string
  price: number
  kind: 'Соты' | 'Гладкие' | 'Чехлы'
  url: string
}

export { catalog } from './catalog-data'
export const money = (value: number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
export const asset = (path: string) => `${import.meta.env.BASE_URL}media/${path}`
export const cartUrl = `${import.meta.env.BASE_URL}cart.html`
export const catalogImage = (id: number, index = 0, thumb = false) =>
  asset(`catalog/${id}${index ? `-${index}` : ''}${thumb ? '-thumb' : ''}.webp`)
export const productPhoto = (id: number) => catalogImage(id)
export const catalogCover = (id: number) => asset(`catalog/${id}-card.webp`)
