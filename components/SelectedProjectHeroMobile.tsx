'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Project } from '../types/project'
import { urlFor } from '../sanity/image'

interface SelectedProjectHeroMobileProps {
  project: Project
}

export default function SelectedProjectHeroMobile({ project }: SelectedProjectHeroMobileProps) {
  const heroImageUrl = project.hero?.desktopImage
    ? urlFor(project.hero.desktopImage)
    : undefined

  const playbackId = project.hero?.desktopVideo?.asset?.data?.playback_ids?.[0]?.id
  const heroVideoUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : undefined

  const servicesRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(Math.min(project.services.length, 2))

  useEffect(() => {
    function updateVisible() {
      if (!servicesRef.current) return

      const containerWidth = servicesRef.current.offsetWidth
      let totalWidth = 0
      let count = 0

      for (let i = 0; i < Math.min(project.services.length, 2); i++) {
        const temp = document.createElement('span')
        temp.style.visibility = 'hidden'
        temp.style.position = 'absolute'
        temp.style.whiteSpace = 'nowrap'
        temp.style.fontSize = '12px'
        temp.style.fontFamily = 'AntiqueLegacy, sans-serif'
        temp.innerText = project.services[i]

        document.body.appendChild(temp)
        totalWidth += temp.offsetWidth
        if (i < project.services.length - 1) totalWidth += 10
        document.body.removeChild(temp)

        if (totalWidth > containerWidth) {
          count = i
          break
        } else {
          count = i + 1
        }
      }

      setVisibleCount(count)
    }

    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [project.services])

  const visibleServices = project.services.slice(0, visibleCount)
  const hiddenCount = project.services.length - visibleCount

  return (
    <section className="relative h-screen w-full sm:hidden">
      <div className="relative w-full h-full">
        {/* HERO MEDIA */}
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

        {/* MOBILE TEXT OVERLAY */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
          <div className="flex gap-[10px] truncate">
            <span className="font-medium truncate">{project.client}</span>
            <span className="truncate">{project.title}</span>
          </div>

          <div className="flex items-center whitespace-nowrap overflow-hidden" ref={servicesRef}>
            {visibleServices.map((service, idx) => (
              <span
                key={service}
                style={{
                  marginRight: idx === visibleServices.length - 1 && hiddenCount <= 0 ? 0 : '10px',
                }}
              >
                {service}
              </span>
            ))}
            {hiddenCount > 0 && <span>+{hiddenCount}</span>}
          </div>
        </div>
      </div>
    </section>
  )
}