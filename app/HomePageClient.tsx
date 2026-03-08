'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Project } from '../types/project'
import SelectedProjectHero from '../components/SelectedProjectHero'
import ProjectGrid from '../components/ProjectGrid'
import { PortableText } from '@portabletext/react'

interface HomePageClientProps {
  selectedProjects: Project[]
  allProjects: Project[]
  homepageData: { introText?: any }
}

export default function HomePageClient({ selectedProjects, allProjects, homepageData }: HomePageClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {selectedProjects.map((project, index) => (
        <div key={index} className="mb-[10px] cursor-pointer" onClick={() => router.push(`/projects/${project.slug.current}`)}>
          <SelectedProjectHero project={project} />
        </div>
      ))}

      {homepageData?.introText && (
        <section className="py-[100px]">
          <div className="mx-auto grid grid-cols-8 gap-[30px]" style={{ maxWidth: 'calc(100%-20px)' }}>
            <div className="col-start-5 col-span-2" style={{ mixBlendMode: 'normal' }}>
              <PortableText value={homepageData.introText} />
            </div>
          </div>
        </section>
      )}

      {allProjects.length > 0 && (
        <section className="py-16">
          <ProjectGrid projects={allProjects} />
        </section>
      )}

      <div className="py-[100px]" />
    </motion.main>
  )
}