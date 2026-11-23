import { Minus, Plus, ShoppingCart } from 'lucide-react'

export default function CartControl({ quantity, label, onChange, disabled = false }: {
  quantity: number
  label: string
  onChange: (delta: number) => void
  disabled?: boolean
}) {
  const control = 'min-h-11 w-32 rounded-full'
  return quantity === 0
    ? <button type="button" onClick={() => onChange(1)} aria-label={`В корзину: ${label}`} disabled={disabled}
        className={`${control} inline-flex items-center justify-center gap-2 bg-ink px-3 text-xs font-bold text-cream hover:bg-graphite disabled:opacity-50`}>
        <ShoppingCart size={17} className="shrink-0" aria-hidden="true" /> В корзину
      </button>
    : <div role="group" aria-label={`В корзине: ${label}`}
        className={`${control} grid grid-cols-[44px_1fr_44px] items-center bg-sand ring-1 ring-inset ring-primary/25`}>
        <button type="button" aria-label={`Уменьшить количество: ${label}`} onClick={() => onChange(-1)}
          disabled={disabled} className="grid h-11 place-items-center rounded-full hover:bg-primary/10 disabled:opacity-50">
          <Minus size={17} aria-hidden="true" />
        </button>
        <output aria-label="Количество" aria-live="polite" className="text-center text-sm font-extrabold tabular-nums">{quantity}</output>
        <button type="button" aria-label={`Увеличить количество: ${label}`} onClick={() => onChange(1)}
          disabled={disabled || quantity >= 99} className="grid h-11 place-items-center rounded-full hover:bg-primary/10 disabled:opacity-50">
          <Plus size={17} aria-hidden="true" />
        </button>
      </div>
}
