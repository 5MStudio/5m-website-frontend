'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Project } from '../types/project'
import { urlFor } from '../sanity/image'

interface SelectedProjectHeroProps {
  project: Project
}

export default function SelectedProjectHero({ project }: SelectedProjectHeroProps) {
  const heroImageUrl = project.hero?.desktopImage ? urlFor(project.hero.desktopImage) : undefined
  const playbackId = project.hero?.desktopVideo?.asset?.data?.playback_ids?.[0]?.id
  const heroVideoUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : undefined

  const servicesRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(project.services.length)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    function updateVisible() {
      if (!servicesRef.current) return
      const containerWidth = servicesRef.current.offsetWidth
      let totalWidth = 0
      let count = project.services.length

      for (let i = 0; i < project.services.length; i++) {
        if (i >= 2) {
          count = 2
          break
        }

        const temp = document.createElement('span')
        temp.style.visibility = 'hidden'
        temp.style.position = 'absolute'
        temp.style.whiteSpace = 'nowrap'
        temp.style.fontSize = '12px'
        temp.style.fontFamily = 'AntiqueLegacy, sans-serif'
        temp.innerText = project.services[i]

        document.body.appendChild(temp)
        totalWidth += temp.offsetWidth + (i < project.services.length - 1 ? 10 : 0)
        document.body.removeChild(temp)

        if (totalWidth > containerWidth) {
          count = i
          break
        }
      }

      setVisibleCount(count)
    }

    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [project.services])

  const visibleServices = project.services.slice(0, visibleCount)
  const hiddenCount = project.services.length - visibleServices.length

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
            src={heroVideoUrl}
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
                <div
                  className="col-start-7 col-span-2 text-right whitespace-nowrap overflow-hidden flex justify-end"
                  ref={servicesRef}
                >
                  {visibleServices.map((service, idx) => (
                    <span
                      key={service}
                      style={{ marginRight: idx === visibleServices.length - 1 && hiddenCount <= 0 ? 0 : '10px' }}
                    >
                      {service}
                    </span>
                  ))}
                  {hiddenCount > 0 && <span>+{hiddenCount}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}