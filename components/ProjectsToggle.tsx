'use client'

import React, { useState, useMemo } from 'react'
import ProjectGrid from './ProjectGrid'
import type { Project } from '@/types/project'
import { urlFor } from '../sanity/image'

interface ProjectsToggleProps {
  projects: Project[]
}

export default function ProjectsToggle({ projects }: ProjectsToggleProps) {
  const [view, setView] = useState<'grid' | 'text'>('grid')
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [activeService, setActiveService] = useState<string | null>(null)

  // Helper to extract all images from content blocks + thumbnail
  const getAllImages = (project: Project) => {
    const images: { url: string; title?: string }[] = []

    if (project.thumbnail) {
      const thumbnailUrl = urlFor(project.thumbnail)
      if (thumbnailUrl) images.push({ url: thumbnailUrl, title: project.title })
    }

    project.contentBlocks?.forEach(block => {
      if (block._type === 'galleryBlock') {
        block.images.forEach(img => {
          if (img.asset?.url) images.push({ url: img.asset.url, title: img.title })
        })
      }

      if (block._type === 'singleImageBlock') {
        if (block.image?.asset?.url) images.push({ url: block.image.asset.url, title: block.title })
      }
    })

    return images
  }

  // Get all unique services across projects
  const allServices = useMemo(() => {
    const serviceSet = new Set<string>()
    projects.forEach(p => p.services.forEach(s => serviceSet.add(s)))
    return Array.from(serviceSet)
  }, [projects])

  // Filter projects based on active service
  const filteredProjects = useMemo(() => {
    if (!activeService) return projects
    return projects.filter(p => p.services.includes(activeService))
  }, [projects, activeService])

  return (
    <>
      {/* Heading + Toggle + Filter in 8-column grid */}
      <div className="grid grid-cols-8 gap-[30px] mx-[10px] mb-[10px] max-w-[calc(100%-20px)]">
        {/* All Projects heading */}
        <div className="col-start-1 col-span-2 text-left text-3xl">
          All Projects
        </div>

        {/* Grid + Text toggle group */}
        <div className="col-start-3 col-span-2 flex justify-start gap-[10px] items-center">
          <span
            className={`cursor-pointer transition-opacity duration-200 ${view === 'grid' ? 'opacity-100' : 'opacity-25'}`}
            onClick={() => setView('grid')}
          >
            Grid
          </span>
          <span
            className={`cursor-pointer transition-opacity duration-200 ${view === 'text' ? 'opacity-100' : 'opacity-25'}`}
            onClick={() => setView('text')}
          >
            Index
          </span>
        </div>

        {/* Filter / Services */}
        <div className="col-start-5 col-span-4 flex flex-wrap justify-start gap-[10px]">
          {allServices.map(service => (
            <span
              key={service}
              className={`cursor-pointer px-2 py-1 transition-opacity duration-200 ${
                activeService && activeService !== service ? 'opacity-25' : 'opacity-100'
              }`}
              onClick={() =>
                setActiveService(activeService === service ? null : service)
              }
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Horizontal image strip (text view) */}
      {view === 'text' && (
        <div className="flex overflow-x-auto gap-[0px] mb-[80px] h-[80px]">
          {filteredProjects.map(project =>
            getAllImages(project).map((img, idx) => {
              const isActive = !hoveredProjectId || hoveredProjectId === project._id
              return (
                <img
                  key={`${project._id}-${idx}`}
                  src={img.url}
                  alt={img.title || 'Project image'}
                  className={`h-[80px] object-contain flex-shrink-0 transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-25'
                  }`}
                  onMouseEnter={() => setHoveredProjectId(project._id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                />
              )
            })
          )}
        </div>
      )}

      {/* Render projects */}
      {view === 'grid' ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <section className="flex flex-col gap-[0px]">
          {filteredProjects.map((p) => {
            const isActive = !hoveredProjectId || hoveredProjectId === p._id
            return (
              <div
                key={p._id}
                className={`grid grid-cols-8 gap-[30px] mx-[10px] py-[2px] max-w-[calc(100%-20px)] transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-25'
                }`}
                onMouseEnter={() => setHoveredProjectId(p._id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <div className="col-start-1 col-span-2 text-left">{p.year}</div>
                <div className="col-start-3 col-span-2 text-left">{p.client}</div>
                <div className="col-start-5 col-span-2 text-left truncate">{p.title}</div>
                <div className="col-start-7 col-span-2 text-left truncate">{p.services.join(', ')}</div>
              </div>
            )
          })}
        </section>
      )}
    </>
  )
}