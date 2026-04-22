'use client'

import { useState, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

import ProjectsHeader from './ProjectsHeader'
import ProjectsGridView from './ProjectsGridView'
import ProjectsIndexView from './ProjectsIndexView'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Project } from '@/types/project'

export default function ProjectsToggle({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams()

  const [view, setView] = useState<'grid' | 'text'>('text')
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const isHoveringImage = useRef(false)

  const [activeService, setActiveService] = useState<string | null>(searchParams.get('service'))
  const [activeClient] = useState<string | null>(searchParams.get('client'))
  const [showServices, setShowServices] = useState(false)
  const [showReorder, setShowReorder] = useState(false)
  const [sortBy, setSortBy] = useState<string | null>(null)

  const isMobile = useIsMobile()

  const allServices = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.services.forEach((s) => set.add(s.title)))
    return Array.from(set)
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result = projects
    if (activeService) result = result.filter((p) => p.services.some((s) => s.title === activeService))
    if (activeClient) result = result.filter((p) => p.client === activeClient)
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'Year') return (a.year || '').localeCompare(b.year || '')
        if (sortBy === 'Client') return (a.client || '').localeCompare(b.client || '')
        if (sortBy === 'Service') return (a.services[0]?.title || '').localeCompare(b.services[0]?.title || '')
        return 0
      })
    }
    return result
  }, [projects, activeService, activeClient, sortBy])

  return (
    <>
      <ProjectsHeader
        view={view} setView={setView}
        allServices={allServices}
        activeService={activeService} setActiveService={setActiveService}
        showServices={showServices} setShowServices={setShowServices}
        sortBy={sortBy} setSortBy={setSortBy}
        showReorder={showReorder} setShowReorder={setShowReorder}
        isMobile={isMobile}
      />
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <ProjectsGridView key="grid" projects={filteredProjects} />
        ) : (
          <ProjectsIndexView
            key="index"
            projects={filteredProjects}
            hoveredProjectId={hoveredProjectId}
            setHoveredProjectId={setHoveredProjectId}
            isHoveringImage={isHoveringImage}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </>
  )
}