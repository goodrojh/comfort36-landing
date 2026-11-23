const brands = ['Mercedes', 'DAF', 'Shacman', 'Volvo', 'FAW', 'MAN', 'Sitrak', 'Dongfeng']

export default function Marquee() {
  return <section className="border-y border-ink/10 bg-cream px-4 py-6 md:py-8" aria-label="Марки грузовиков">
    <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10">
      {brands.map(brand => <li key={brand} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-graphite/75">
        <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-primary/60" />{brand}
      </li>)}
    </ul>
  </section>
}
