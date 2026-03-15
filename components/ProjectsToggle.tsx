'use client'

import React, { useState, useMemo } from 'react'
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
  const [view, setView] = useState<'grid' | 'text'>('grid')
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [activeService, setActiveService] = useState<string | null>(null)
  const [showServices, setShowServices] = useState(false)
  const [showReorder, setShowReorder] = useState(false)
  const [sortBy, setSortBy] = useState<string | null>(null)

  // ───────────────────
  // Get all media (images + videos) for grid view
  // ───────────────────
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

  // ───────────────────
  // Get only images for index/text view (use Mux thumbnails for videos)
  // ───────────────────
  const getAllMediaForText = (project: Project): MediaItem[] => {
    const media: MediaItem[] = []

    if (project.thumbnail) {
      if (project.thumbnail.video?.asset?.data?.playback_ids?.[0]?.id) {
        const playbackId = project.thumbnail.video.asset.data.playback_ids[0].id
        media.push({
          url: `https://image.mux.com/${playbackId}/thumbnail.jpg?width=400`,
          title: project.title,
          type: 'image',
        })
      } else if (project.thumbnail.asset?.url) {
        media.push({ url: project.thumbnail.asset.url, title: project.title, type: 'image' })
      }
    }

    project.contentBlocks?.forEach((block: ContentBlock) => {
      if (block._type === 'galleryBlock') {
        block.images?.forEach((img: ImageWithVideo) => {
          if (img.video?.asset?.data?.playback_ids?.[0]?.id) {
            const playbackId = img.video.asset.data.playback_ids[0].id
            media.push({
              url: `https://image.mux.com/${playbackId}/thumbnail.jpg?width=400`,
              title: img?.asset?.url ? img.asset.url : undefined,
              type: 'image',
            })
          } else if (img.asset?.url) {
            media.push({ url: img.asset.url, type: 'image' })
          }
        })
      }
      if (block._type === 'singleImageBlock' && block.image) {
        if (block.image.video?.asset?.data?.playback_ids?.[0]?.id) {
          const playbackId = block.image.video.asset.data.playback_ids[0].id
          media.push({
            url: `https://image.mux.com/${playbackId}/thumbnail.jpg?width=400`,
            title: block.title,
            type: 'image',
          })
        } else if (block.image.asset?.url) {
          media.push({ url: block.image.asset.url, title: block.title, type: 'image' })
        }
      }
      if (block._type === 'fullImageBlock' && block.fullImage) {
        if (block.fullImage.video?.asset?.data?.playback_ids?.[0]?.id) {
          const playbackId = block.fullImage.video.asset.data.playback_ids[0].id
          media.push({
            url: `https://image.mux.com/${playbackId}/thumbnail.jpg?width=400`,
            title: block.fullImage.asset?.url,
            type: 'image',
          })
        } else if (block.fullImage.asset?.url) {
          media.push({ url: block.fullImage.asset.url, title: block.fullImage.asset.url, type: 'image' })
        }
      }
    })

    return media
  }

  // ───────────────────
  // All services for filtering
  // ───────────────────
  const allServices = useMemo(() => {
    const serviceSet = new Set<string>()
    projects.forEach((p) => p.services.forEach((s) => serviceSet.add(s)))
    return Array.from(serviceSet)
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result = activeService
      ? projects.filter((p) => p.services.includes(activeService))
      : projects

    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'Year') return (a.year || '').localeCompare(b.year || '')
        if (sortBy === 'Client') return (a.client || '').localeCompare(b.client || '')
        if (sortBy === 'Service') return (a.services[0] || '').localeCompare(b.services[0] || '')
        return 0
      })
    }
    return result
  }, [projects, activeService, sortBy])

  return (
    <>
      {/* ─ Header / filters ─ */}
      <div className="grid grid-cols-8 gap-[30px] mx-[10px] mb-[10px] max-w-[calc(100%-20px)]">
        
        {/* Grid toggle */}
        <div className="col-start-1 col-span-2 flex justify-start items-center">
          <span
            className={`cursor-pointer transition-opacity duration-200 ${
              view === 'grid' ? 'opacity-25' : 'opacity-100'
            }`}
            onClick={() => setView('grid')}
          >
            Grid
          </span>
        </div>

        {/* Index toggle */}
        <div className="col-start-3 col-span-2 flex justify-start items-center">
          <span
            className={`cursor-pointer transition-opacity duration-200 ${
              view === 'text' ? 'opacity-25' : 'opacity-100'
            }`}
            onClick={() => setView('text')}
          >
            Index
          </span>
        </div>

        {/* Services / Refine */}
        <div className="col-start-5 col-span-2 flex justify-start relative">
          {showServices ? (
            <div className="absolute top-0 right-0 flex flex-wrap justify-end gap-[10px]">
              {allServices.map((service, i) => (
                <motion.span
                  key={service}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeService === service ? 0.25 : 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer px-2 py-1 text-sm font-medium"
                  onClick={() =>
                    setActiveService(activeService === service ? null : service)
                  }
                >
                  {service}
                </motion.span>
              ))}
            </div>
          ) : (
            <motion.span
              key="refine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer px-2 py-1 text-sm font-medium"
              onClick={() => setShowServices(true)}
            >
              Refine
            </motion.span>
          )}
        </div>

        {/* Reorder / sorting */}
        <div className="col-start-7 col-span-2 flex justify-start relative">
          {showReorder ? (
            <div className="absolute top-0 right-0 flex flex-wrap justify-end gap-[10px]">
              {['Year', 'Client', 'Service'].map((opt, i) => (
                <motion.span
                  key={opt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: sortBy === opt ? 0.25 : 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer px-2 py-1 text-sm font-medium"
                  onClick={() => setSortBy(sortBy === opt ? null : opt)}
                >
                  {opt}
                </motion.span>
              ))}
            </div>
          ) : (
            <motion.span
              key="reorder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer px-2 py-1 text-sm font-medium"
              onClick={() => setShowReorder(true)}
            >
              Reorder
            </motion.span>
          )}
        </div>
      </div>

      {/* ─ Project grid / text view ─ */}
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
          <motion.div
            key="text-view"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-[0px]"
          >
            {/* Horizontal images strip (posters only) */}
            <div className="flex overflow-x-auto gap-[0px] mb-[10px] h-[80px]">
              {filteredProjects.map((project, pi) =>
                getAllMediaForText(project).map((mediaItem, idx) => {
                  const isActive = !hoveredProjectId || hoveredProjectId === project._id
                  return (
                    <motion.img
                      key={`${project._id}-${idx}`}
                      src={mediaItem.url}
                      alt={mediaItem.title || 'Project media'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: pi * 0.05 }}
                      className="h-[80px] object-contain flex-shrink-0"
                      onMouseEnter={() => setHoveredProjectId(project._id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    />
                  )
                })
              )}
            </div>

            {/* Column headers row */}
            <div className="grid grid-cols-8 gap-[30px] mx-[10px] mb-[90px] max-w-[calc(100%-20px)] font-medium text-sm">
              <div className="col-start-1 col-span-2 text-left">Year</div>
              <div className="col-start-3 col-span-2 text-left">Client</div>
              <div className="col-start-5 col-span-2 text-left">Project</div>
              <div className="col-start-7 col-span-2 text-left">Service</div>
            </div>

            {/* List view */}
            {filteredProjects.map((p, i) => {
              const isActive = !hoveredProjectId || hoveredProjectId === p._id
              return (
                <motion.div
                  key={p._id}
                  className="grid grid-cols-8 gap-[30px] mx-[10px] py-[2px] max-w-[calc(100%-20px)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProjectId(p._id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <div className="col-start-1 col-span-2 text-left">{p.year}</div>
                  <div className="col-start-3 col-span-2 text-left">{p.client}</div>
                  <div className="col-start-5 col-span-2 text-left truncate">{p.title}</div>
                  <div className="col-start-7 col-span-2 text-left truncate">{p.services.join(', ')}</div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}