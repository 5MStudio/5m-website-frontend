'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Project } from '@/types/project'
import SelectedProjectHero from '@/components/SelectedProjectHero'
import Gallery from '@/components/Gallery'
import ProjectGrid from '@/components/ProjectGrid'
import SingleImageBlock from '@/components/SingleImageBlock'
import FullImageBlock from '@/components/FullImageBlock' // ✅ new full-width image component
import { PortableText } from '@portabletext/react'

interface ProjectPageClientProps {
  project: Project | null
  relatedProjects?: Project[]
}

export default function ProjectPageClient({ project, relatedProjects = [] }: ProjectPageClientProps) {
  const pathname = usePathname()

  if (!project) return <div>Project not found</div>

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <SelectedProjectHero project={project} />

      {project.contentBlocks?.map((block, idx) => {
        if (block._type === 'textBlock') {
          return (
            <section key={idx} className="py-[100px]">
              <div className="grid grid-cols-8 gap-[30px] px-[10px] max-w-[calc(100%-20px)] mx-auto">
                <div className="col-start-5 col-span-2">
                  <PortableText value={block.text} />
                </div>
              </div>
            </section>
          )
        }

        if (block._type === 'galleryBlock') {
          return <Gallery key={idx} block={block} />
        }

        if (block._type === 'singleImageBlock') {
          return <SingleImageBlock key={idx} block={block} index={idx} />
        }

        if (block._type === 'fullImageBlock') {
          return <FullImageBlock key={idx} block={block} index={idx} />
        }

        return null
      })}

      {relatedProjects.length > 0 && (
        <section className="py-16">
          <ProjectGrid projects={relatedProjects.slice(0, 4)} />
        </section>
      )}
    </motion.main>
  )
}