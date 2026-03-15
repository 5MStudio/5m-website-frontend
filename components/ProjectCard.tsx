'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { urlFor } from '../sanity/image'
import Link from 'next/link'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
  fadeIndex?: number
}

export default function ProjectCard({ project, fadeIndex = 0 }: ProjectCardProps) {
  if (!project.slug?.current) return null

  // ───────────────────
  // Thumbnail media
  // ───────────────────
  const aspect = project.thumbnail?.ratio === 'landscape' ? 16 / 9 : 4 / 5

  const thumbnailVideoId =
    project.thumbnail?.video?.asset?.data?.playback_ids?.[0]?.id
  const thumbnailVideoUrl = thumbnailVideoId
    ? `https://stream.mux.com/${thumbnailVideoId}.m3u8`
    : undefined

  const thumbnailImageUrl = project.thumbnail?.asset
    ? urlFor(project.thumbnail.asset, 400, aspect)
    : undefined

  // ───────────────────
  // Count images for overlay
  // ───────────────────
  const imageCount =
    (project.thumbnail?.asset || project.thumbnail?.video ? 1 : 0) +
    (project.contentBlocks?.reduce((acc, block) => {
      if (block._type === 'galleryBlock') return acc + (block.images?.length || 0)
      if (block._type === 'singleImageBlock') return acc + 1
      if (block._type === 'fullImageBlock') return acc + 1
      return acc
    }, 0) || 0)

  // ───────────────────
  // Services visibility logic
  // ───────────────────
  const containerRef = useRef<HTMLSpanElement>(null)
  const [visibleCount, setVisibleCount] = useState(project.services.length)

  useEffect(() => {
    function updateVisible() {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      let totalWidth = 0
      let count = project.services.length

      for (let i = 0; i < project.services.length; i++) {
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

  // ───────────────────
  // Render
  // ───────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: fadeIndex * 0.1, duration: 0.5 }}
    >
      <Link
        href={`/projects/${project.slug.current}`}
        className="group block relative rounded overflow-hidden mx-[-10px] shadow-sm cursor-pointer"
      >
        {(thumbnailVideoUrl || thumbnailImageUrl) && (
          <div className="relative w-full">
            {thumbnailVideoUrl ? (
              <video
                src={thumbnailVideoUrl}
                className={`w-full object-cover ${
                  project.thumbnail?.ratio === 'landscape'
                    ? 'aspect-video'
                    : 'aspect-[4/5]'
                }`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={thumbnailImageUrl!}
                alt={project.title}
                className={`w-full object-cover ${
                  project.thumbnail?.ratio === 'landscape'
                    ? 'aspect-video'
                    : 'aspect-[4/5]'
                }`}
              />
            )}

            <div className="absolute top-[10px] right-[10px] bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded z-10 opacity-0 group-hover:opacity-0 transition-opacity duration-200">
              {`0${imageCount}`}
            </div>
          </div>
        )}

        <div className="pt-[10px] px-[10px] flex justify-between text-sm transition-opacity duration-200 group-hover:opacity-25">
          <span>{project.client}</span>
          <span
            ref={containerRef}
            className="flex items-center whitespace-nowrap overflow-hidden"
          >
            {visibleServices.map((service, idx) => (
              <span
                key={service}
                style={{
                  marginRight:
                    idx === visibleServices.length - 1 && hiddenCount <= 0
                      ? 0
                      : '10px',
                }}
              >
                {service}
              </span>
            ))}
            {hiddenCount > 0 && <span>+{hiddenCount}</span>}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}