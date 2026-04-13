'use client'

import { motion } from 'framer-motion'

interface ProjectsHeaderProps {
  view: 'grid' | 'text'
  setView: (v: 'grid' | 'text') => void
  allServices: string[]
  activeService: string | null
  setActiveService: (s: string | null) => void
  showServices: boolean
  setShowServices: (v: boolean) => void
  sortBy: string | null
  setSortBy: (s: string | null) => void
  showReorder: boolean
  setShowReorder: (v: boolean) => void
  isMobile: boolean
}

const scrollStyle: React.CSSProperties = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch',
}

function ServiceFilters({
  allServices,
  activeService,
  setActiveService,
}: Pick<ProjectsHeaderProps, 'allServices' | 'activeService' | 'setActiveService'>) {
  return (
    <div className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x" style={scrollStyle}>
      {allServices.map((service) => (
        <motion.span
          key={service}
          className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
          style={{ opacity: activeService === service ? 0.2 : 1 }}
          onClick={() => setActiveService(activeService === service ? null : service)}
        >
          {service}
        </motion.span>
      ))}
    </div>
  )
}

function SortOptions({
  sortBy,
  setSortBy,
}: Pick<ProjectsHeaderProps, 'sortBy' | 'setSortBy'>) {
  return (
    <div className="flex gap-[10px] ml-[10px] overflow-x-auto touch-pan-x" style={scrollStyle}>
      {['Year', 'Client', 'Service'].map((opt) => (
        <motion.span
          key={opt}
          className="cursor-pointer px-2 py-1 text-sm font-medium flex-shrink-0 transition-opacity duration-200"
          style={{ opacity: sortBy === opt ? 0.2 : 1 }}
          onClick={() => setSortBy(sortBy === opt ? null : opt)}
        >
          {opt}
        </motion.span>
      ))}
    </div>
  )
}

export default function ProjectsHeader({
  view, setView,
  allServices, activeService, setActiveService,
  showServices, setShowServices,
  sortBy, setSortBy,
  showReorder, setShowReorder,
  isMobile,
}: ProjectsHeaderProps) {
  if (isMobile) {
    return (
      <div className="flex gap-[30px] px-[10px] mb-[10px] w-[calc(100%-20px)]">
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
            className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
            style={{ opacity: showReorder ? 0.2 : 1 }}
            onClick={() => setShowReorder(!showReorder)}
          >
            Reorder
          </motion.span>
          {showReorder && <SortOptions sortBy={sortBy} setSortBy={setSortBy} />}
          <motion.span
            className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
            style={{ opacity: showServices ? 0.2 : 1 }}
            onClick={() => setShowServices(!showServices)}
          >
            Refine
          </motion.span>
          {showServices && (
            <ServiceFilters
              allServices={allServices}
              activeService={activeService}
              setActiveService={setActiveService}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-8 gap-[30px] mx-[10px] mb-[10px] max-w-[calc(100%-20px)]">
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
          className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
          style={{ opacity: showServices ? 0.2 : 1 }}
          onClick={() => setShowServices(!showServices)}
        >
          Refine
        </motion.span>
        {showServices && (
          <ServiceFilters
            allServices={allServices}
            activeService={activeService}
            setActiveService={setActiveService}
          />
        )}
      </div>
      <div className="col-start-7 col-span-2 flex items-center">
        <motion.span
          className="cursor-pointer px-2 py-1 text-sm font-medium transition-opacity duration-200"
          style={{ opacity: showReorder ? 0.2 : 1 }}
          onClick={() => setShowReorder(!showReorder)}
        >
          Reorder
        </motion.span>
        {showReorder && <SortOptions sortBy={sortBy} setSortBy={setSortBy} />}
      </div>
    </div>
  )
}