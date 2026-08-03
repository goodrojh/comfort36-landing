const brands = [
  'SCANIA',
  'VOLVO',
  'MERCEDES ACTROS',
  'DAF XF',
  'MAN TGX',
  'RENAULT T',
  'IVECO S-WAY',
  'КАМАЗ',
  'SHACMAN',
  'SITRAK',
  'FAW',
  'HOWO',
  'ГАЗЕЛЬ NEXT',
  'МАЗ',
]

export default function Marquee() {
  const row = [...brands, ...brands]
  return (
    <section className="bg-cream py-6 md:py-9 border-y border-ink/10 overflow-hidden">
      <div className="marquee-mask">
        <div className="flex w-max animate-marquee">
          {row.map((b, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="px-6 md:px-9 text-sm md:text-lg font-semibold tracking-[0.14em] text-graphite/55 whitespace-nowrap">
                {b}
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
