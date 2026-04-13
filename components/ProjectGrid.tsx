// ProjectGrid.tsx
'use client'

import { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/types/project'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 1024) setColumns(2)
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
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  )
}