import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/** Слова «выезжают» снизу с каскадной задержкой. */
export function WordsPullUp({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}) {
  const words = text.split(' ')
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <span key={`${word}-${i}`} className="overflow-hidden inline-block pb-[0.06em]">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: delay + i * 0.08, ease: EASE }}
              className={`inline-block ${wordClassName}`}
            >
              {word}
              {!isLast && <span>&nbsp;</span>}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export type Segment = { text: string; className?: string }

/** То же, но с разной типографикой у сегментов (в т.ч. курсивная антиква). */
export function WordsPullUpMultiStyle({
  segments,
  className = '',
  align = 'center',
}: {
  segments: Segment[]
  className?: string
  align?: 'center' | 'left'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const words = segments.flatMap((seg) =>
    seg.text.split(' ').map((w) => ({ word: w, className: seg.className ?? '' })),
  )

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {words.map((item, i) => (
        <span key={`${item.word}-${i}`} className="overflow-hidden inline-block pb-[0.08em]">
          <motion.span
            initial={{ y: 24, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
            className={`inline-block ${item.className}`}
          >
            {item.word}
            <span>&nbsp;</span>
          </motion.span>
        </span>
      ))}
    </div>
  )
}

function AnimatedLetter({
  char,
  index,
  total,
  progress,
}: {
  char: string
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const charProgress = index / total
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

/** Текст «проявляется» посимвольно по мере скролла. */
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const chars = text.split('')

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  )
}

/** Универсальное появление блока снизу. */
export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 24, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Счётчик, который «докручивается» до значения при появлении. */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <span ref={ref}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {inView ? <Ticker to={to} /> : 0}
      </motion.span>
      {suffix}
    </span>
  )
}

function Ticker({ to }: { to: number }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{value.toLocaleString('ru-RU')}</>
}

export { EASE }
