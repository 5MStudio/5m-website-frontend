'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/types/project'
import type { MutableRefObject } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectsListViewProps {
  projects: Project[]
  hoveredProjectId: string | null
  setHoveredProjectId: React.Dispatch<React.SetStateAction<string | null>>
  scrollRef: MutableRefObject<HTMLDivElement | null>
  imageRefs: MutableRefObject<Record<string, HTMLDivElement[]>>
  isMobile: boolean
  getAllMediaForText: (project: Project) => { url: string; title?: string; type: 'image' | 'video' }[]
  router: ReturnType<typeof useRouter>
}

export default function ProjectsListView({
  projects,
  hoveredProjectId,
  setHoveredProjectId,
  scrollRef,
  imageRefs,
  isMobile,
  getAllMediaForText,
  router,
}: ProjectsListViewProps) {
  return (
    <motion.div key="text-view" initial="hidden" animate="visible" exit="hidden" className="flex flex-col gap-[0px]">
      {/* Horizontal images strip */}
      <div
        ref={scrollRef}
        className="flex gap-[0px] mb-[10px] h-[80px] touch-pan-x"
        style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) =>
          getAllMediaForText(project).map((mediaItem, idx) => {
            if (!imageRefs.current[project._id]) imageRefs.current[project._id] = []
            return (
              <motion.img
                key={`${project._id}-${idx}`}
                src={mediaItem.url}
                alt={mediaItem.title || 'Project media'}
                animate={{ opacity: !hoveredProjectId || hoveredProjectId === project._id ? 1 : 0.25 }}
                transition={{ duration: 0 }}
                className="h-[80px] object-contain flex-shrink-0 cursor-pointer"
                ref={(el) => { if (el) imageRefs.current[project._id][idx] = el }}
                onMouseEnter={() => setHoveredProjectId(project._id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => router.push(`/projects/${project.slug?.current}`)}
                style={{ userSelect: 'none' }}
              />
            )
          })
        )}
      </div>

      {/* Column headers */}
      {!isMobile && (
        <div className="grid grid-cols-8 gap-[30px] mx-[10px] mb-[90px] max-w-[calc(100%-20px)] font-medium text-sm">
          <div className="col-start-1 col-span-2 text-left">Year</div>
          <div className="col-start-3 col-span-2 text-left">Client</div>
          <div className="col-start-5 col-span-2 text-left">Project</div>
          <div className="col-start-7 col-span-2 text-left">Service</div>
        </div>
      )}

      {/* List view */}
      {projects.map((p) => (
        <motion.div
          key={p._id}
          className={`${isMobile ? 'grid grid-cols-2 gap-[10px] mx-[10px] py-[2px] max-w-[calc(100%-20px)]' : 'grid grid-cols-8 gap-[30px] mx-[10px] py-[2px] max-w-[calc(100%-20px)]'} cursor-pointer`}
          animate={{ opacity: !hoveredProjectId || hoveredProjectId === p._id ? 1 : 0.25 }}
          transition={{ duration: 0 }}
          onMouseEnter={() => {
            setHoveredProjectId(p._id)
            if (scrollRef.current && imageRefs.current[p._id]?.length) {
              scrollRef.current.scrollTo({
                left: imageRefs.current[p._id][0].offsetLeft,
                behavior: 'smooth',
              })
            }
          }}
          onMouseLeave={() => setHoveredProjectId(null)}
          onClick={() => router.push(`/projects/${p.slug?.current}`)}
        >
          {!isMobile && <div className="col-start-1 col-span-2 text-left">{p.year}</div>}
          <div className={`${isMobile ? 'col-span-1' : 'col-start-3 col-span-2'} text-left`}>{p.client}</div>
          {!isMobile && <div className="col-start-5 col-span-2 text-left truncate">{p.title}</div>}
          <div className={`${isMobile ? 'col-span-1' : 'col-start-7 col-span-2'} text-left truncate`}>{p.services.join(', ')}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}