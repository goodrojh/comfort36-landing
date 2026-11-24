import type { Product } from './catalog'

const products: [number, string, string, number, Product['kind'], string][] = [
  [13070080, '3D-ковры для Sitrak MAX', 'Чёрные · серая стёжка', 7990, 'Соты', '3d-kovry-dlya-sitrak-max-chernaya-kozha-seraya-sota'],
  [13070105, '3D-ковры для Volvo FH 12–13', 'Чёрные · красная стёжка', 7990, 'Соты', '3d-kovry-dlya-volvo-fh-12-13-chernaya-kozha-krasnaya-sota'],
  [13070145, '3D-ковры для DAF 105', 'Серые · серая стёжка', 7990, 'Соты', '3d-kovry-dlya-daf-105-seraya-kozha-seraya-sota'],
  [13056086, '3D-ковры для Scania 5G', 'Бежевые', 7990, 'Соты', '3d-kovry-dlya-scania-5g-bezhevaya-kozha'],
  [13056094, '3D-ковры для Volvo FM', 'Паприка · бежевая стёжка', 7990, 'Соты', '3d-kovry-dlya-volvo-fm-kozha-paprika-sota-bezhevaya'],
  [13056088, '3D-ковры для MAN TGA', 'Оранжевые · узкая кабина', 7990, 'Соты', '3d-kovry-dlya-man-tga-uzkaya-kabina-oranzhevaya-kozha'],
  [13442520, '3D-ковры для DAF 105', 'Чёрные', 10990, 'Гладкие', '3d-kovriki-dlya-daf-105-tsvet-chyorny'],
  [13442476, '3D-ковры для Mercedes MP 4–5', 'Бежевые', 10990, 'Гладкие', '3d-kovriki-dlya-mercedes-mp-4-5-tsvet-bezhevy'],
  [13414319, '3D-ковры для Volvo Euro 6', 'Паприка', 10990, 'Гладкие', '3d-kovry-dlya-volvo-euro-6-tsvet-paprika'],
  [13466797, '3D-ковры для FAW G7', 'Бежевые', 7990, 'Соты', '3d-kovry-dlya-faw-g7-tsvet-bezhevy'],
  [13466803, 'Чехлы для Mercedes MP 2–3', 'Чёрные', 7990, 'Чехлы', 'chekhly-na-sidenya-dlya-mercedes-mp-2-3-tsvet-chyorny'],
  [13466801, 'Чехлы для FAW G7', 'Бежевые · чёрная алькантара', 7990, 'Чехлы', 'chekhly-na-sidenya-dlya-faw-g7-tsvet-bezhevy'],
]

export const catalog = products.map(([id, title, color, price, kind, slug]) => ({
  id, title, color, price, kind, url: `https://vk.ru/market/product/${slug}-216385176-${id}`,
} satisfies Product))
