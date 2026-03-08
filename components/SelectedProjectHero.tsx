'use client'

import React from 'react'
import { Project } from '../types/project'
import { urlFor } from '../sanity/image'

interface SelectedProjectHeroProps {
  project: Project
}

export default function SelectedProjectHero({ project }: SelectedProjectHeroProps) {
  const heroImageUrl = project.hero.desktopImage ? urlFor(project.hero.desktopImage) : undefined
  const heroVideoUrl = project.hero.desktopVideo ? urlFor(project.hero.desktopVideo) : undefined

  // Absolute container style (defines sticky range)
  const stickyContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: '15px',
    paddingBottom: '15px',
    pointerEvents: 'none',
  }

  return (
    <section className="relative h-screen w-full">
      <div className="relative w-full h-full">
        {/* Hero media */}
        {heroVideoUrl ? (
          <video
            src={heroVideoUrl}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        ) : heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={project.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Sticky overlay texts */}
        <div style={stickyContainerStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            <div
              className="grid grid-cols-8 px-[10px] gap-[30px] max-w-[calc(100%-20px)] mx-auto"
            >
              {/* Year */}
              <div className="col-start-1 col-span-2 text-left">{project.year}</div>

              {/* Client */}
              <div className="col-start-3 col-span-2 text-left">{project.client}</div>

              {/* Project Title */}
              <div className="col-start-5 col-span-2 text-right truncate">{project.title}</div>

              {/* Services */}
              <div className="col-start-7 col-span-2 text-right truncate">
                {project.services.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}