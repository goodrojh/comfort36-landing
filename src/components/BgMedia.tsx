import { useEffect, useRef } from 'react'
import { useHeavyMedia } from '../hooks'

export default function BgMedia({ video, poster, alt }: { video: string; poster: string; alt: string }) {
  const allowVideo = useHeavyMedia()
  const container = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = videoRef.current
    const target = container.current
    if (!element || !target) return
    let inView = false
    const update = () => {
      if (inView && !document.hidden) void element.play().catch(() => {})
      else element.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= 0.15
      update()
    }, { threshold: 0.15 })
    observer.observe(target)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      element.pause()
    }
  }, [allowVideo])

  return <div ref={container} className="absolute inset-0 -z-10">
    <img src={poster} alt={alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
    {allowVideo && <video ref={videoRef} src={video} poster={poster} loop muted playsInline preload="none"
      disablePictureInPicture aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}
  </div>
}
