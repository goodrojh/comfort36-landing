import type { Product } from './catalog'

const products: [number, string, string, number, Product['kind'], string][] = [
  [13070080, '3D-ковры для Sitrak MAX', 'Чёрные · серая стёжка', 7990, 'Соты', '3d-kovry-dlya-sitrak-max-chernaya-kozha-seraya-sota'],
  [13056094, '3D-ковры для Volvo FM', 'Паприка · бежевая стёжка', 7990, 'Соты', '3d-kovry-dlya-volvo-fm-kozha-paprika-sota-bezhevaya'],
  [12987969, '3D-ковры для Volvo Euro 6', 'Чёрные · красная стёжка', 7990, 'Соты', '3d-kovry-dlya-volvo-euro-6-chernaya-kozha-krasnaya-sota'],
  [13056088, '3D-ковры для MAN TGA', 'Оранжевые · узкая кабина', 7990, 'Соты', '3d-kovry-dlya-man-tga-uzkaya-kabina-oranzhevaya-kozha'],
  [13466797, '3D-ковры для FAW G7', 'Бежевые', 7990, 'Соты', '3d-kovry-dlya-faw-g7-tsvet-bezhevy'],
  [13442476, '3D-ковры для Mercedes MP 4–5', 'Бежевые', 10990, 'Гладкие', '3d-kovriki-dlya-mercedes-mp-4-5-tsvet-bezhevy'],
  [13634612, '3D-ковры для DAF 105', 'Чёрные', 10990, 'Гладкие', '3d-kovriki-dlya-daf-105-tsvet-chyorny'],
  [13501557, '3D-ковры для Shacman X6000', 'Паприка', 10990, 'Гладкие', '3d-kovriki-shacman-x6000-tsvet-paprika'],
  [13414302, '3D-ковры для Volvo Euro 6', 'Шоколадные', 10990, 'Гладкие', '3d-kovry-dlya-volvo-euro-6-tsvet-shokoladny'],
  [13466803, 'Чехлы для Mercedes MP 2–3', 'Чёрные', 7990, 'Чехлы', 'chekhly-na-sidenya-dlya-mercedes-mp-2-3-tsvet-chyorny'],
  [13466801, 'Чехлы для FAW G7', 'Бежевые · чёрная алькантара', 7990, 'Чехлы', 'chekhly-na-sidenya-dlya-faw-g7-tsvet-bezhevy'],
  [13474022, '3D-ковры для Dongfeng', 'Шоколадные', 10990, 'Гладкие', '3d-kovry-premium-dlya-dongfeng-tsvet-shokolad'],
]

export const catalog = products.map(([id, title, color, price, kind, slug]) => ({
  id, title, color, price, kind, url: `https://vk.ru/market/product/${slug}-216385176-${id}`,
} satisfies Product))
