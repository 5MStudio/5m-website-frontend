'use client'

import React, { useState, useEffect } from 'react'
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
      if (width < 640) setColumns(1)
      else if (width < 1024) setColumns(2)
      else setColumns(4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-screen overflow-x-hidden box-border px-[10px]">
      <div
        className="grid gap-x-[30px] gap-y-[50px] box-border"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} fadeIndex={index} />
        ))}
      </div>
    </div>
  )
}