'use client'

import React, { useState, useEffect } from 'react'
import { urlFor } from '../sanity/image'
import type { Project } from '@/types/project'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [columns, setColumns] = useState(4)
  const MAX_SERVICES = 1
  const MAX_HOVER_IMAGES = 4 // <-- limit hover images

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 1024) setColumns(2)
      else setColumns(4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-full overflow-x-hidden px-[0px]">
      <div
        className="grid gap-x-[10px] gap-y-[50px] items-start"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {projects.map(project => {
          const aspectRatio =
            project.thumbnail?.ratio === 'landscape' ? 16 / 9 : 4 / 5

          // -------------------------
          // Video / image URLs
          // -------------------------
          const videoId = project.thumbnail?.video?.asset?.data?.playback_ids?.[0]?.id
          const videoUrl = videoId ? `https://stream.mux.com/${videoId}.m3u8` : undefined

          const imageAsset = project.thumbnail?.asset ?? (project.thumbnail as any)?.image?.asset
          const imageUrl = imageAsset ? urlFor(imageAsset) : undefined

          // -------------------------
          // Gather all images for hover (max 3)
          // -------------------------
          let allImages: any[] = []
          for (const block of project.contentBlocks || []) {
            if (block._type === 'galleryBlock' && block.images?.length) {
              allImages.push(...block.images.filter(img => img?.asset))
            } else if (block._type === 'singleImageBlock' && block.image?.asset) {
              allImages.push(block.image)
            } else if (block._type === 'fullImageBlock' && block.image?.asset) {
              allImages.push(block.image)
            }
          }
          allImages = allImages.slice(0, MAX_HOVER_IMAGES) // <-- slice to max 3

          // -------------------------
          // Compute visible services dynamically
          // -------------------------
          let visibleCount = project.services.length
          let totalWidth = 0
          for (let i = 0; i < project.services.length; i++) {
            if (i >= MAX_SERVICES) {
              visibleCount = MAX_SERVICES
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
            totalWidth += temp.offsetWidth + 10
            document.body.removeChild(temp)
            if (totalWidth > 99999) break
          }
          const visibleServices = project.services.slice(0, visibleCount)
          const hiddenCount = project.services.length - visibleServices.length

          return (
            <a
              key={project._id}
              href={`/projects/${project.slug?.current}`}
              className="group block rounded overflow-hidden shadow-sm w-full"
            >
              {/* Card wrapper */}
              <div className="w-full flex justify-center">
                <div
                  className="relative w-full max-w-full"
                  style={{ aspectRatio: `${aspectRatio}` }}
                >
                  {/* Main thumbnail/video */}
                  {videoUrl ? (
                    <video
                      src={videoUrl}
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

                  {/* Hover images row */}
                  {allImages.length > 0 && (
                    <div
                      className="absolute bottom-[10px] left-[10px] right-[10px] flex gap-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        width: 'calc(100% - 20px)',
                      }}
                    >
                      {allImages.map((img, idx) => {
                        const asset = img?.asset
                        if (!asset) return null
                        return (
                          <img
                            key={idx}
                            src={`${urlFor(asset)}?w=80`} // low-res load
                            alt=""
                            style={{
                              height: '40px', // fixed height
                              width: 'auto',   // aspect ratio determines width
                            }}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Project info */}
              <div className="pt-[10px] px-[10px] flex justify-between text-sm transition-opacity duration-200 group-hover:opacity-25">
                <span>{project.client}</span>
                <span className="flex items-center whitespace-nowrap overflow-hidden">
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
            </a>
          )
        })}
      </div>
    </div>
  )
}