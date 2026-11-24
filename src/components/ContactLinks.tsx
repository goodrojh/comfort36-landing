import { Phone } from 'lucide-react'
import { asset } from '../catalog'
import { contacts } from '../media'

const messengers = [
  { label: 'ВКонтакте', url: contacts.vkWrite, icon: 'vk' },
  { label: 'MAX', url: contacts.max, icon: 'max' },
]

export default function ContactLinks() {
  return <div className="flex flex-wrap gap-2">
    <a className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sand px-3.5 text-sm font-bold text-ink hover:bg-white" href={contacts.phoneHref}>
      <Phone size={17} aria-hidden="true" /> Позвонить
    </a>
    {messengers.map(({ label, url, icon }) => <a key={icon}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-linen px-3.5 text-sm font-bold text-ink hover:bg-sand"
      href={url} target="_blank" rel="noopener noreferrer">
      <img src={asset(`social/${icon}.svg`)} alt="" width="18" height="18" /> {label}
    </a>)}
  </div>
}
