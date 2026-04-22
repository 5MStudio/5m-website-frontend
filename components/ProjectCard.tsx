'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { urlFor } from '../sanity/image'
import type { Project } from '@/types/project'

const MAX_HOVER_IMAGES = 3
const MAX_SERVICES = 2

function TruncatedServices({ services }: { services: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(services.length)

  const measure = useCallback(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.offsetWidth
    let totalWidth = 0
    let count = 0

    for (let i = 0; i < Math.min(services.length, MAX_SERVICES); i++) {
      const temp = document.createElement('span')
      temp.style.visibility = 'hidden'
      temp.style.position = 'absolute'
      temp.style.whiteSpace = 'nowrap'
      temp.style.fontSize = window.getComputedStyle(containerRef.current).fontSize
      temp.style.fontFamily = window.getComputedStyle(containerRef.current).fontFamily
      temp.innerText = services[i]
      document.body.appendChild(temp)
      const spanWidth = temp.offsetWidth
      document.body.removeChild(temp)

      const gap = i < services.length - 1 ? 10 : 0
      const remainderLabel = i + 1 < services.length ? ` +${services.length - (i + 1)}` : ''
      const remainderWidth = remainderLabel
        ? (() => {
            const t = document.createElement('span')
            t.style.visibility = 'hidden'
            t.style.position = 'absolute'
            t.style.whiteSpace = 'nowrap'
            t.style.fontSize = window.getComputedStyle(containerRef.current!).fontSize
            t.style.fontFamily = window.getComputedStyle(containerRef.current!).fontFamily
            t.innerText = remainderLabel.trim()
            document.body.appendChild(t)
            const w = t.offsetWidth
            document.body.removeChild(t)
            return w + 10
          })()
        : 0

      if (totalWidth + spanWidth + gap + remainderWidth <= containerWidth) {
        totalWidth += spanWidth + gap
        count = i + 1
      } else {
        break
      }
    }

    setVisibleCount(Math.max(count, 0))
  }, [services])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measure])

  const visible = services.slice(0, visibleCount)
  const hiddenCount = services.length - visibleCount

  return (
    <div ref={containerRef} className="flex justify-end items-center whitespace-nowrap overflow-hidden min-w-0">
      {visible.map((service, idx) => (
        <span
          key={idx}
          style={{ marginRight: idx === visible.length - 1 && hiddenCount <= 0 ? 0 : '10px' }}
        >
          {service}
        </span>
      ))}
      {hiddenCount > 0 && <span>+{hiddenCount}</span>}
    </div>
  )
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const aspectRatio = project.thumbnail?.ratio === 'landscape' ? 16 / 9 : 4 / 5

  const videoId = project.thumbnail?.video?.asset?.data?.playback_ids?.[0]?.id
  const videoUrl = videoId ? `https://stream.mux.com/${videoId}.m3u8` : undefined

  const imageAsset = project.thumbnail?.asset ?? (project.thumbnail as any)?.image?.asset
  const imageUrl = imageAsset ? urlFor(imageAsset) : undefined

  let allImages: any[] = []
  for (const block of project.contentBlocks || []) {
    if (block._type === 'galleryBlock' && block.images?.length) {
      allImages.push(...block.images.filter((img: any) => img?.asset))
    } else if (block._type === 'singleImageBlock' && block.image?.asset) {
      allImages.push(block.image)
    } else if (block._type === 'fullImageBlock' && block.image?.asset) {
      allImages.push(block.image)
    }
  }
  allImages = allImages.slice(0, MAX_HOVER_IMAGES)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(() => {})
      })
      return () => hls.destroy()
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = videoUrl
      videoRef.current.play().catch(() => {})
    }
  }, [videoUrl])

  return (
    <a
      href={`/projects/${project.slug?.current}`}
      className="group block rounded overflow-hidden shadow-sm w-full"
    >
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-full" style={{ aspectRatio: `${aspectRatio}` }}>
          {videoUrl ? (
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-20"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-20"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 transition-opacity duration-300 group-hover:opacity-20" />
          )}

          {allImages.length > 0 && (
            <div
              className="absolute bottom-[10px] left-[10px] right-[10px] flex gap-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ width: 'calc(100% - 20px)' }}
            >
              {allImages.map((img: any, idx: number) => {
                const asset = img?.asset
                if (!asset) return null
                return (
                  <img key={idx} src={`${urlFor(asset)}?w=80`} alt="" style={{ height: '40px', width: 'auto' }} />
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-[10px] px-[10px] flex justify-between text-sm transition-opacity duration-200 group-hover:opacity-25 gap-[10px]">
        <span className="whitespace-nowrap shrink-0">{project.client}</span>
        <div className="min-w-0 flex-1">
          <TruncatedServices services={project.services.map(s => s.title)} />
        </div>
      </div>
    </a>
  )
}