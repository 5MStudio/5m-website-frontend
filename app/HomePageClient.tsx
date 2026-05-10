'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Project } from '../types/project'
import SelectedProjectHero from '../components/SelectedProjectHero'
import ProjectGrid from '../components/ProjectGrid'
import { PortableText } from '@portabletext/react'

interface HomePageClientProps {
  featuredProjects: Project[]
  allProjects: Project[]
  homepageData: { introText?: any }
  featuredGridProjects: Project[]
}

export default function HomePageClient({
  featuredProjects,
  allProjects,
  homepageData,
  featuredGridProjects,
}: HomePageClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [colStart, setColStart] = useState(5)
  const [colSpan, setColSpan] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColStart(5)
        setColSpan(4)
      } else if (width < 1024) {
        setColStart(5)
        setColSpan(4)
      } else {
        setColStart(5)
        setColSpan(2)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Use manually selected grid projects if available, fall back to 4 newest
  const latestProjects = featuredGridProjects.length > 0
    ? featuredGridProjects
    : allProjects.slice(0, 4)

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Render featured projects */}
      {featuredProjects.map((project, index) => (
        <div
          key={index}
          className="mb-[10px] cursor-pointer"
          onClick={() => router.push(`/projects/${project.slug.current}`)}
        >
          <SelectedProjectHero project={project} />
        </div>
      ))}

      {/* Intro text */}
      {homepageData?.introText && (
        <section className="py-[90px]">
          <div
            className="grid grid-cols-8 gap-[30px] px-[10px] mx-auto"
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            <div className={`col-start-${colStart} col-span-${colSpan} cursor-pointer`}>
              <PortableText value={homepageData.introText} />
            </div>
          </div>
        </section>
      )}

      {/* Latest projects */}
      {latestProjects.length > 0 && (
        <section className="py-16">
          <ProjectGrid projects={latestProjects} />
        </section>
      )}

      <div className="py-[0px]" />
    </motion.main>
  )
}