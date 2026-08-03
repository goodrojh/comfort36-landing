import { useEffect, useRef } from 'react'
import { useHeavyMedia } from '../hooks'

/**
 * Фоновое медиа: на десктопе — зацикленное видео, на мобильных и медленной
 * сети — статичный постер. Видео монтируется только когда его реально можно
 * проиграть, поэтому мобильные браузеры не рисуют заглушку «play».
 */
export default function BgMedia({
  video,
  poster,
  alt,
  className = '',
}: {
  video: string
  poster: string
  alt: string
  className?: string
}) {
  const allowVideo = useHeavyMedia()
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    const play = () => void el.play().catch(() => {})
    play()
    el.addEventListener('canplay', play)
    return () => el.removeEventListener('canplay', play)
  }, [allowVideo])

  if (!allowVideo) {
    return (
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    )
  }

  return (
    <video
      ref={ref}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      src={video}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-label={alt}
    />
  )
}
