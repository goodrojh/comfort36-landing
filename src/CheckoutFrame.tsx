import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import Navbar from './components/Navbar'
import { media } from './media'

const home = import.meta.env.BASE_URL
export const checkoutPanel = 'rounded-[1.5rem] border border-ink/10 bg-linen p-4 sm:p-6 lg:p-7'
export const outlineButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/20 px-4 text-sm font-bold hover:bg-sand'

export default function CheckoutFrame({ count, title, description, icon, children }: {
  count: number
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}) {
  return <main className="min-h-[72vh] bg-cream px-4 pb-12 pt-[4.5rem] sm:pt-20 md:px-6 md:pb-20">
    <div className="mx-auto max-w-7xl">
      <Navbar count={count} subpage />
      <div className="relative isolate mt-3 overflow-hidden rounded-[1.5rem] bg-sand md:mt-5 md:rounded-[2rem]">
        <img src={media.heroPoster} width="1280" height="720" alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_57%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cream via-cream/95 to-cream/55" />
        <div className="flex items-end justify-between gap-2 px-4 pb-6 pt-4 sm:px-8 sm:py-8 lg:px-10">
          <div className="max-w-4xl">
            <a href={home + '#products'} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-linen px-4 text-xs font-bold hover:bg-sand sm:text-sm">
              <ArrowLeft size={16} /> В каталог
            </a>
            <h1 className="text-[clamp(2.1rem,5.6vw,4.6rem)] font-extrabold leading-none tracking-[-0.05em]">{title}</h1>
            <p className="mt-3 max-w-prose text-sm font-semibold text-graphite sm:text-base">{description}</p>
          </div>
          <div className="hidden h-20 w-20 shrink-0 place-items-center rounded-full bg-ink text-primarysoft md:grid" aria-hidden="true">
            {icon}
          </div>
        </div>
      </div>
      {children}
    </div>
  </main>
}
