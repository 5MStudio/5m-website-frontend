'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Hls from 'hls.js'
import { getAllMediaForGrid } from '@/hooks/useProjectMedia'
import type { Project } from '@/types/project'
import type { MediaItem } from '@/hooks/useProjectMedia'

function StripVideo({
  url,
  projectId,
  idx,
  activeId,
  onMouseEnter,
  onMouseLeave,
  onClick,
  refCallback,
}: {
  url: string
  projectId: string
  idx: number
  activeId: string | null
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  refCallback: (el: HTMLVideoElement | null) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true })
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
      })
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.play().catch(() => {})
    }
  }, [url])

  return (
    <motion.video
      ref={(el) => {
        ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
        refCallback(el)
      }}
      key={`${projectId}-${idx}`}
      animate={{ opacity: !activeId || activeId === projectId ? 1 : 0.25 }}
      transition={{ duration: 0 }}
      className="h-[100px] object-contain flex-shrink-0 cursor-pointer"
      autoPlay
      muted
      loop
      playsInline
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ userSelect: 'none' }}
    />
  )
}

interface ProjectsIndexViewProps {
  projects: Project[]
  hoveredProjectId: string | null
  setHoveredProjectId: (id: string | null) => void
  isHoveringImage: React.MutableRefObject<boolean>
  isMobile: boolean
}

function TruncatedServices({ services }: { services: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayCount, setDisplayCount] = useState(services.length)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const availableWidth = container.clientWidth
    if (!availableWidth) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const style = window.getComputedStyle(container)
    ctx.font = `${style.fontSize} ${style.fontFamily}`
    let count = services.length
    while (count > 0) {
      const labels = services.slice(0, count)
      const remainder = services.length - count
      const remainderLabel = remainder > 0 ? `+${remainder}` : ''
      const parts = remainderLabel ? [...labels, remainderLabel] : labels
      const totalWidth = parts.reduce((sum, part, idx) => {
        return sum + ctx.measureText(part).width + (idx < parts.length - 1 ? 10 : 0)
      }, 0)
      if (totalWidth <= availableWidth) break
      count--
    }
    setDisplayCount(Math.max(count, 0))
  }, [services])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measure])

  const shown = services.slice(0, displayCount)
  const remainder = services.length - displayCount

  return (
    <div ref={containerRef} className="flex items-center whitespace-nowrap overflow-hidden">
      {shown.map((service, idx) => (
        <span
          key={service}
          style={{ marginRight: idx === shown.length - 1 && remainder <= 0 ? 0 : '10px' }}
        >
          {service}
        </span>
      ))}
      {remainder > 0 && <span>+{remainder}</span>}
    </div>
  )
}

export default function ProjectsIndexView({
  projects,
  hoveredProjectId,
  setHoveredProjectId,
  isHoveringImage,
  isMobile,
}: ProjectsIndexViewProps) {
  const router = useRouter()

  const imageScrollRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<Record<string, HTMLDivElement[]>>({})

  useEffect(() => {
    if (!hoveredProjectId || isMobile || isHoveringImage.current) return
    const container = imageScrollRef.current
    const refs = imageRefs.current[hoveredProjectId]
    if (!container || !refs?.length) return
    const firstImg = refs[0]
    const lastImg = refs[refs.length - 1]
    if (!firstImg || !lastImg) return
    const containerRect = container.getBoundingClientRect()
    const groupLeft = firstImg.getBoundingClientRect().left - containerRect.left + container.scrollLeft
    const groupRight = lastImg.getBoundingClientRect().right - containerRect.left + container.scrollLeft
    container.scrollTo({ left: (groupLeft + groupRight) / 2 - container.clientWidth / 2, behavior: 'smooth' })
  }, [hoveredProjectId, isMobile, isHoveringImage])

  const listRef = useRef<HTMLDivElement>(null)
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const ROW_HEIGHT = 20
  const VISIBLE_ROWS = 12

  const count = projects.length
  const tripled = [...projects, ...projects, ...projects]

  useEffect(() => {
    if (!isMobile || !listRef.current) return
    listRef.current.scrollTop = count * ROW_HEIGHT
  }, [isMobile, count])

  const snapToNearest = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ROW_HEIGHT)
    el.scrollTo({ top: idx * ROW_HEIGHT, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const el = listRef.current
    if (!el) return

    const onScroll = () => {
      if (el.scrollTop < ROW_HEIGHT) {
        el.scrollTop += count * ROW_HEIGHT
      } else if (el.scrollTop >= count * 2 * ROW_HEIGHT) {
        el.scrollTop -= count * ROW_HEIGHT
      }

      const idx = Math.round(el.scrollTop / ROW_HEIGHT) % count
      setActiveIndex(idx)
      setHoveredProjectId(projects[idx]._id)

      if (snapTimeout.current) clearTimeout(snapTimeout.current)
      snapTimeout.current = setTimeout(snapToNearest, 120)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isMobile, count, projects, setHoveredProjectId, snapToNearest])

  useEffect(() => {
    if (!isMobile) return
    const container = imageScrollRef.current
    const activeProject = projects[activeIndex]
    if (!container || !activeProject) return
    const refs = imageRefs.current[activeProject._id]
    if (!refs?.length) return
    const firstImg = refs[0]
    const lastImg = refs[refs.length - 1]
    if (!firstImg || !lastImg) return
    const containerRect = container.getBoundingClientRect()
    const groupLeft = firstImg.getBoundingClientRect().left - containerRect.left + container.scrollLeft
    const groupRight = lastImg.getBoundingClientRect().right - containerRect.left + container.scrollLeft
    container.scrollTo({ left: (groupLeft + groupRight) / 2 - container.clientWidth / 2, behavior: 'smooth' })
  }, [activeIndex, isMobile, projects])

  const activeId = isMobile ? projects[activeIndex]?._id : hoveredProjectId

  const gridClass = isMobile
    ? 'grid grid-cols-2 gap-[10px] mx-[10px] max-w-[calc(100%-20px)]'
    : 'grid grid-cols-8 gap-[30px] mx-[10px] max-w-[calc(100%-20px)]'

  return (
    <motion.div key="text-view" initial="hidden" animate="visible" exit="hidden" className="flex flex-col">

      {/* ── image strip ─────────────────────────────────────────────────── */}
      <div
        ref={imageScrollRef}
        className="flex mb-[10px] h-[100px] touch-pan-x"
        style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {projects.map((project) =>
          getAllMediaForGrid(project).slice(0, 4).map((mediaItem: MediaItem, idx: number) => {
            if (!imageRefs.current[project._id]) imageRefs.current[project._id] = []

            const refCallback = (el: HTMLVideoElement | HTMLImageElement | null) => {
              if (el) imageRefs.current[project._id][idx] = el as unknown as HTMLDivElement
            }

            if (mediaItem.type === 'video') {
              return (
                <StripVideo
                  key={`${project._id}-${idx}`}
                  url={mediaItem.url}
                  projectId={project._id}
                  idx={idx}
                  activeId={activeId ?? null}
                  onMouseEnter={() => {
                    if (isMobile) return
                    isHoveringImage.current = true
                    setHoveredProjectId(project._id)
                  }}
                  onMouseLeave={() => {
                    if (isMobile) return
                    isHoveringImage.current = false
                    setHoveredProjectId(null)
                  }}
                  onClick={() => router.push(`/projects/${project.slug?.current}`)}
                  refCallback={refCallback}
                />
              )
            }

            return (
              <motion.img
                key={`${project._id}-${idx}`}
                src={mediaItem.url}
                alt={mediaItem.title || 'Project media'}
                animate={{ opacity: !activeId || activeId === project._id ? 1 : 0.25 }}
                transition={{ duration: 0 }}
                className="h-[100px] object-contain flex-shrink-0 cursor-pointer"
                ref={(el) => {
                  if (el) imageRefs.current[project._id][idx] = el as unknown as HTMLDivElement
                }}
                onMouseEnter={() => {
                  if (isMobile) return
                  isHoveringImage.current = true
                  setHoveredProjectId(project._id)
                }}
                onMouseLeave={() => {
                  if (isMobile) return
                  isHoveringImage.current = false
                  setHoveredProjectId(null)
                }}
                onClick={() => router.push(`/projects/${project.slug?.current}`)}
                style={{ userSelect: 'none' }}
              />
            )
          })
        )}
      </div>

      {/* ── column headers ──────────────────────────────────────────────── */}
      <div className={`${gridClass} mb-[80px] font-medium`}>
        {isMobile ? (
          <>
            <div className="col-span-1 text-left">Client</div>
            <div className="col-span-1 text-left">Service</div>
          </>
        ) : (
          <>
            <div className="col-start-1 col-span-2 text-left">Year</div>
            <div className="col-start-3 col-span-2 text-left">Client</div>
            <div className="col-start-5 col-span-2 text-left">Project</div>
            <div className="col-start-7 col-span-2 text-left">Service</div>
          </>
        )}
      </div>

      {/* ── project list ────────────────────────────────────────────────── */}
      {isMobile ? (
        <div className="relative" style={{ height: ROW_HEIGHT * VISIBLE_ROWS }}>

          {/* top fade */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{ height: 10, background: 'linear-gradient(to bottom, white, transparent)' }}
          />

          {/* scrollable drum */}
          <div
            ref={listRef}
            className="overflow-y-scroll touch-pan-y h-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {tripled.map((p, i) => (
              <div
                key={`${p._id}-${i}`}
                className="grid grid-cols-2 gap-[10px] mx-[10px] max-w-[calc(100%-20px)] cursor-pointer overflow-hidden"
                style={{
                  height: ROW_HEIGHT,
                  lineHeight: `${ROW_HEIGHT}px`,
                  opacity: p._id === projects[activeIndex]?._id ? 1 : 0.25,
                  transition: 'opacity 0.15s',
                }}
                onClick={() => router.push(`/projects/${p.slug?.current}`)}
              >
                <div className="col-span-1 truncate">{p.client}</div>
                <div className="col-span-1 overflow-hidden">
                  <TruncatedServices services={p.services} />
                </div>
              </div>
            ))}
          </div>

          {/* bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{ height: 10, background: 'linear-gradient(to top, white, transparent)' }}
          />
        </div>
      ) : (
        projects.map((p) => (
          <motion.div
            key={p._id}
            className={`${gridClass} cursor-pointer overflow-hidden`}
            style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
            animate={{ opacity: !activeId || activeId === p._id ? 1 : 0.25 }}
            onMouseEnter={() => {
              isHoveringImage.current = false
              setHoveredProjectId(p._id)
            }}
            onMouseLeave={() => setHoveredProjectId(null)}
            onClick={() => router.push(`/projects/${p.slug?.current}`)}
          >
            <div className="col-start-1 col-span-2 truncate">{p.year}</div>
            <div className="col-start-3 col-span-2 truncate">{p.client}</div>
            <div className="col-start-5 col-span-2 truncate">{p.title}</div>
            <div className="col-start-7 col-span-2 overflow-hidden">
              <TruncatedServices services={p.services} />
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  )
}