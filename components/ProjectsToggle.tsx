'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectGrid from './ProjectGrid'
import type { Project, ImageWithVideo, ContentBlock } from '@/types/project'

interface ProjectsToggleProps {
  projects: Project[]
}

interface MediaItem {
  url: string
  title?: string
  type: 'image' | 'video'
}

export default function ProjectsToggle({ projects }: ProjectsToggleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState<'grid' | 'text'>('grid')
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const isHoveringImage = useRef(false)

  // INITIAL FILTER FROM URL
  const [activeService, setActiveService] = useState<string | null>(
    searchParams.get('service')
  )
  const [activeClient, setActiveClient] = useState<string | null>(
    searchParams.get('client')
  )

  const [showServices, setShowServices] = useState(false)
  const [showReorder, setShowReorder] = useState(false)
  const [sortBy, setSortBy] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<Record<string, HTMLDivElement[]>>({})

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll image strip so hovered project's images are centered — only when hovering text rows
  useEffect(() => {
    if (!hoveredProjectId || isMobile || isHoveringImage.current) return
    const container = scrollRef.current
    const refs = imageRefs.current[hoveredProjectId]
    if (!container || !refs || refs.length === 0) return

    const firstImg = refs[0]
    const lastImg = refs[refs.length - 1]
    if (!firstImg || !lastImg) return

    const containerRect = container.getBoundingClientRect()
    const firstRect = firstImg.getBoundingClientRect()
    const lastRect = lastImg.getBoundingClientRect()

    const groupLeft = firstRect.left - containerRect.left + container.scrollLeft
    const groupRight = lastRect.right - containerRect.left + container.scrollLeft
    const groupCenter = (groupLeft + groupRight) / 2

    const targetScrollLeft = groupCenter - container.clientWidth / 2

    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
  }, [hoveredProjectId, isMobile])

  const getAllMediaForGrid = (project: Project): MediaItem[] => {
    const media: MediaItem[] = []
    if (project.thumbnail) {
      if (project.thumbnail.video?.asset?.data?.playback_ids?.[0]?.id) {
        media.push({
          url: `https://stream.mux.com/${project.thumbnail.video.asset.data.playback_ids[0].id}.m3u8`,
          title: project.title,
          type: 'video',
        })
      } else if (project.thumbnail.asset?.url) {
        media.push({ url: project.thumbnail.asset.url, title: project.title, type: 'image' })
      }
    }
    project.contentBlocks?.forEach((block: ContentBlock) => {
      if (block._type === 'galleryBlock') {
        block.images?.forEach((img: ImageWithVideo) => {
          if (img.video?.asset?.data?.playback_ids?.[0]?.id) {
            media.push({
              url: `https://stream.mux.com/${img.video.asset.data.playback_ids[0].id}.m3u8`,
              title: img?.asset?.url ? img.asset.url : undefined,
              type: 'video',
            })
          } else if (img.asset?.url) {
            media.push({ url: img.asset.url, type: 'image' })
          }
        })
      }
      if (block._type === 'singleImageBlock' && block.image) {
        if (block.image.video?.asset?.data?.playback_ids?.[0]?.id) {
          media.push({
            url: `https://stream.mux.com/${block.image.video.asset.data.playback_ids[0].id}.m3u8`,
            title: block.title,
            type: 'video',
          })
        } else if (block.image.asset?.url) {
          media.push({ url: block.image.asset.url, title: block.title, type: 'image' })
        }
      }
      if (block._type === 'fullImageBlock' && block.fullImage) {
        if (block.fullImage.video?.asset?.data?.playback_ids?.[0]?.id) {
          media.push({
            url: `https://stream.mux.com/${block.fullImage.video.asset.data.playback_ids[0].id}.m3u8`,
            title: block.fullImage.asset?.url,
            type: 'video',
          })
        } else if (block.fullImage.asset?.url) {
          media.push({ url: block.fullImage.asset.url, title: block.fullImage.asset.url, type: 'image' })
        }
      }
    })
    return media
  }

  const getAllMediaForText = (project: Project): MediaItem[] => {
    const media: MediaItem[] = []
    if (project.thumbnail) {
      if (project.thumbnail.video?.asset?.data?.playback_ids?.[0]?.id) {
        const playbackId = project.thumbnail.video.asset.data.playback_ids[0].id
        media.push({
          url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=0`,
          title: project.title,
          type: 'image',
        })
      } else if (project.thumbnail.asset?.url) {
        media.push({
          url: `${project.thumbnail.asset.url}?h=200`,
          title: project.title,
          type: 'image',
        })
      }
    }
    project.contentBlocks?.forEach((block: ContentBlock) => {
      if (block._type === 'galleryBlock') {
        block.images?.forEach((img: ImageWithVideo) => {
          if (img.video?.asset?.data?.playback_ids?.[0]?.id) {
            const playbackId = img.video.asset.data.playback_ids[0].id
            media.push({
              url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
              title: img?.asset?.url ? img.asset.url : undefined,
              type: 'image',
            })
          } else if (img.asset?.url) {
            media.push({ url: `${img.asset.url}?h=200`, type: 'image' })
          }
        })
      }
      if (block._type === 'singleImageBlock' && block.image) {
        if (block.image.video?.asset?.data?.playback_ids?.[0]?.id) {
          const playbackId = block.image.video.asset.data.playback_ids[0].id
          media.push({
            url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
            title: block.title,
            type: 'image',
          })
        } else if (block.image.asset?.url) {
          media.push({ url: `${block.image.asset.url}?h=200`, title: block.title, type: 'image' })
        }
      }
      if (block._type === 'fullImageBlock' && block.fullImage) {
        if (block.fullImage.video?.asset?.data?.playback_ids?.[0]?.id) {
          const playbackId = block.fullImage.video.asset.data.playback_ids[0].id
          media.push({
            url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
            title: block.fullImage.asset?.url,
            type: 'image',
          })
        } else if (block.fullImage.asset?.url) {
          media.push({ url: `${block.fullImage.asset.url}?h=200`, title: block.fullImage.asset.url, type: 'image' })
        }
      }
    })
    return media
  }

  const allServices = useMemo(() => {
    const serviceSet = new Set<string>()
    projects.forEach((p) => p.services.forEach((s) => serviceSet.add(s)))
    return Array.from(serviceSet)
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result = projects
    if (activeService) result = result.filter((p) => p.services.includes(activeService))
    if (activeClient) result = result.filter((p) => p.client === activeClient)
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'Year') return (a.year || '').localeCompare(b.year || '')
        if (sortBy === 'Client') return (a.client || '').localeCompare(b.client || '')
        if (sortBy === 'Service') return (a.services[0] || '').localeCompare(b.services[0] || '')
        return 0
      })
    }
    return result
  }, [projects, activeService, activeClient, sortBy])

  return (
    <>
      {/* Header / filters */}
      <div
        className={`${
          isMobile
            ? 'flex gap-[30px] px-[10px] mb-[10px] w-[calc(100%-20px)]'
            : 'grid grid-cols-8 gap-[30px] mx-[10px] mb-[10px] max-w-[calc(100%-20px)]'
        }`}
      >
        {isMobile ? (
          <>
            <div className="flex flex-1 gap-[10px]">
              <span
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: view === 'grid' ? 0.2 : 1 }}
                onClick={() => setView('grid')}
              >
                Grid
              </span>
              <span
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: view === 'text' ? 0.2 : 1 }}
                onClick={() => setView('text')}
              >
                Index
              </span>
            </div>
            <div className="flex flex-1 gap-[10px] justify-start">
              <motion.span
                key="reorder"
                className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
                style={{ opacity: showReorder ? 0.2 : 1 }}
                onClick={() => setShowReorder(!showReorder)}
              >
                Reorder
              </motion.span>
              {showReorder && (
                <div
                  className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {['Year', 'Client', 'Service'].map((opt) => (
                    <motion.span
                      key={opt}
                      className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
                      style={{ opacity: sortBy === opt ? 0.2 : 1 }}
                      onClick={() => setSortBy((prev) => (prev === opt ? null : opt))}
                    >
                      {opt}
                    </motion.span>
                  ))}
                </div>
              )}
              <motion.span
                key="refine"
                className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
                style={{ opacity: showServices ? 0.2 : 1 }}
                onClick={() => setShowServices(!showServices)}
              >
                Refine
              </motion.span>
              {showServices && (
                <div
                  className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {allServices.map((service) => (
                    <motion.span
                      key={service}
                      className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
                      style={{ opacity: activeService === service ? 0.2 : 1 }}
                      onClick={() => setActiveService((prev) => (prev === service ? null : service))}
                    >
                      {service}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-start-1 col-span-2 flex justify-start items-center">
              <span
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: view === 'grid' ? 0.2 : 1 }}
                onClick={() => setView('grid')}
              >
                Grid
              </span>
            </div>
            <div className="col-start-3 col-span-2 flex justify-start items-center">
              <span
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: view === 'text' ? 0.2 : 1 }}
                onClick={() => setView('text')}
              >
                Index
              </span>
            </div>
            <div className="col-start-5 col-span-2 flex items-center">
              <motion.span
                key="refine"
                className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
                style={{ opacity: showServices ? 0.2 : 1 }}
                onClick={() => setShowServices(!showServices)}
              >
                Refine
              </motion.span>
              {showServices && (
                <div
                  className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {allServices.map((service) => (
                    <motion.span
                      key={service}
                      className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
                      style={{ opacity: activeService === service ? 0.2 : 1 }}
                      onClick={() => setActiveService((prev) => (prev === service ? null : service))}
                    >
                      {service}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
            <div className="col-start-7 col-span-2 flex items-center">
              <motion.span
                key="reorder"
                className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
                style={{ opacity: showReorder ? 0.2 : 1 }}
                onClick={() => setShowReorder(!showReorder)}
              >
                Reorder
              </motion.span>
              {showReorder && (
                <div
                  className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {['Year', 'Client', 'Service'].map((opt) => (
                    <motion.span
                      key={opt}
                      className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
                      style={{ opacity: sortBy === opt ? 0.2 : 1 }}
                      onClick={() => setSortBy((prev) => (prev === opt ? null : opt))}
                    >
                      {opt}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Grid / Text view */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectGrid projects={filteredProjects} />
          </motion.div>
        ) : (
          <motion.div key="text-view" initial="hidden" animate="visible" exit="hidden" className="flex flex-col gap-[0px]">
            {/* Horizontal images strip */}
            <div
              ref={scrollRef}
              className="flex gap-[0px] mb-[10px] h-[100px] touch-pan-x"
              style={{
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredProjects.map((project) =>
                getAllMediaForText(project).map((mediaItem, idx) => {
                  if (!imageRefs.current[project._id]) imageRefs.current[project._id] = []
                  return (
                    <motion.img
                      key={`${project._id}-${idx}`}
                      src={mediaItem.url}
                      alt={mediaItem.title || 'Project media'}
                      animate={{ opacity: !hoveredProjectId || hoveredProjectId === project._id ? 1 : 0.25 }}
                      transition={{ duration: 0 }}
                      className="h-[100px] object-contain flex-shrink-0 cursor-pointer"
                      ref={(el) => {
                        if (el) imageRefs.current[project._id][idx] = el as unknown as HTMLDivElement
                      }}
                      onMouseEnter={() => {
                        isHoveringImage.current = true
                        setHoveredProjectId(project._id)
                      }}
                      onMouseLeave={() => {
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

            {/* Column headers */}
            <div
              className={`${
                isMobile
                  ? 'grid grid-cols-2 gap-[10px] mx-[10px] mb-[90px] max-w-[calc(100%-20px)]'
                  : 'grid grid-cols-8 gap-[30px] mx-[10px] mb-[90px] max-w-[calc(100%-20px)]'
              } font-medium text-sm`}
            >
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

            {/* List rows */}
            {filteredProjects.map((p) => (
              <motion.div
                key={p._id}
                className={`${
                  isMobile
                    ? 'grid grid-cols-2 gap-[10px] mx-[10px] py-[2px] max-w-[calc(100%-20px)]'
                    : 'grid grid-cols-8 gap-[30px] mx-[10px] py-[2px] max-w-[calc(100%-20px)]'
                } cursor-pointer`}
                animate={{ opacity: !hoveredProjectId || hoveredProjectId === p._id ? 1 : 0.25 }}
                onMouseEnter={() => {
                  isHoveringImage.current = false
                  setHoveredProjectId(p._id)
                }}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => router.push(`/projects/${p.slug?.current}`)}
              >
                {isMobile ? (
                  <>
                    <div className="col-span-1">{p.client}</div>
                    <div className="col-span-1">{p.services.join(', ')}</div>
                  </>
                ) : (
                  <>
                    <div className="col-start-1 col-span-2">{p.year}</div>
                    <div className="col-start-3 col-span-2">{p.client}</div>
                    <div className="col-start-5 col-span-2">{p.title}</div>
                    <div className="col-start-7 col-span-2">{p.services.join(', ')}</div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}