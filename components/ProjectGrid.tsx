'use client'

import React, { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/types/project'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [columns, setColumns] = useState(4) // default 4 per row

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)       // mobile
      else if (width < 1024) setColumns(2) // tablet/small laptop
      else setColumns(4)                   // large laptop / desktop
    }

    handleResize() // initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className="grid gap-x-[30px] gap-y-[50px] w-full"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} fadeIndex={index} />
      ))}
    </div>
  )
}