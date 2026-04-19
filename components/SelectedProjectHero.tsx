'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Hls from 'hls.js'
import { Project } from '../types/project'
import { urlFor } from '../sanity/image'

interface SelectedProjectHeroProps {
  project: Project
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
    <div ref={containerRef} className="col-start-7 col-span-2 flex justify-end items-center whitespace-nowrap overflow-hidden">
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

export default function SelectedProjectHero({ project }: SelectedProjectHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const desktopImageUrl = project.hero?.desktopImage ? urlFor(project.hero.desktopImage) : undefined
  const mobileImageUrl  = project.hero?.mobileImage  ? urlFor(project.hero.mobileImage)  : undefined
  const heroImageUrl    = isMobile ? (mobileImageUrl ?? desktopImageUrl) : desktopImageUrl

  const desktopPlaybackId = project.hero?.desktopVideo?.asset?.data?.playback_ids?.[0]?.id
  const mobilePlaybackId  = project.hero?.mobileVideo?.asset?.data?.playback_ids?.[0]?.id
  const desktopVideoUrl   = desktopPlaybackId ? `https://stream.mux.com/${desktopPlaybackId}.m3u8` : undefined
  const mobileVideoUrl    = mobilePlaybackId  ? `https://stream.mux.com/${mobilePlaybackId}.m3u8`  : undefined
  const heroVideoUrl      = isMobile ? (mobileVideoUrl ?? desktopVideoUrl) : desktopVideoUrl

  useEffect(() => {
    if (!videoRef.current || !heroVideoUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(heroVideoUrl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(() => {})
      })
      return () => hls.destroy()
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = heroVideoUrl
      videoRef.current.play().catch(() => {})
    }
  }, [heroVideoUrl])

  const stickyContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: '17px',
    paddingBottom: '3px',
    pointerEvents: 'none',
    mixBlendMode: 'difference',
    color: 'white',
  }

  return (
    <section className="relative h-screen w-full">
      <div className="relative w-full h-full">
        {heroVideoUrl ? (
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={project.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200" />
        )}

        <div style={stickyContainerStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            {isMobile ? (
              <div className="flex justify-between items-center px-[10px] max-w-[calc(100%-20px)] mx-auto">
                <span className="truncate">{project.client}</span>
                <span className="truncate">{project.title}</span>
              </div>
            ) : (
              <div className="grid grid-cols-8 px-[10px] gap-[30px] max-w-[calc(100%-20px)] mx-auto">
                <div className="col-start-1 col-span-2 text-left">{project.year}</div>
                <div className="col-start-3 col-span-2 text-left">{project.client}</div>
                <div className="col-start-5 col-span-2 text-right truncate">{project.title}</div>
                <TruncatedServices services={project.services} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}