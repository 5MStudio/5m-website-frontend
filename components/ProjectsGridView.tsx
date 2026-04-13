'use client'

import { motion } from 'framer-motion'
import ProjectGrid from './ProjectGrid'
import type { Project } from '@/types/project'

export default function ProjectsGridView({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      key="grid-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProjectGrid projects={projects} />
    </motion.div>
  )
}