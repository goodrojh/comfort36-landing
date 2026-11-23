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
export const productPhoto = (id: number) => asset(`catalog/${id}.webp`)
