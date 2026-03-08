'use client'

import React from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/types/project'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-8 gap-[30px] mx-[10px]">
      {projects.map((project, index) => (
        <div key={index} className="col-span-2">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}