'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Project, ContentBlock, GalleryBlock } from '@/types/project'
import SelectedProjectHero from '@/components/SelectedProjectHero'
import Gallery from '@/components/Gallery'
import ProjectGrid from '@/components/ProjectGrid'
import SingleImageBlock from '@/components/SingleImageBlock'
import FullImageBlock from '@/components/FullImageBlock'
import { PortableText } from '@portabletext/react'

interface ProjectPageClientProps {
  project: Project | null
  relatedProjects?: Project[]
}

// ───────────────
// Type guard for gallery blocks
// ───────────────
function isGalleryBlock(block: ContentBlock): block is GalleryBlock {
  return block._type === 'galleryBlock'
}

export default function ProjectPageClient({ project, relatedProjects = [] }: ProjectPageClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  if (!project) return <div>Project not found</div>

  // Construct the services string for the hardcoded text
  const servicesUsed = project.services?.join(', ') || ''

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Hero always on top, give bottom spacing */}
      <div className="mb-[10px]">
        <SelectedProjectHero project={project} />
      </div>

      {/* Content blocks */}
      {project.contentBlocks?.map((block, idx) => {
        const blockClass = 'mb-[10px]' // keep small spacing between sections if needed

        if (block._type === 'textBlock') {
          return (
            <section key={idx} className={blockClass}>
              <div className="grid grid-cols-8 gap-[30px] px-[10px] max-w-[calc(100%-20px)] mx-auto">
                <div className="col-start-5 col-span-2 pt-[90px] pb-[90px]">
                  <PortableText
                    value={block.text}
                    components={{
                      block: ({ children }) => <p className="m-0">{children}</p>,
                    }}
                  />
                </div>
              </div>
            </section>
          )
        }

        if (isGalleryBlock(block)) {
          return (
            <div key={idx} className={blockClass}>
              <Gallery block={block} />
            </div>
          )
        }

        if (block._type === 'singleImageBlock') {
          return (
            <div key={idx} className={blockClass}>
              <SingleImageBlock block={block} index={idx} />
            </div>
          )
        }

        if (block._type === 'fullImageBlock') {
          return (
            <div key={idx} className={blockClass}>
              <FullImageBlock block={block} index={idx} />
            </div>
          )
        }

        return null
      })}

      {/* Hardcoded “discover more projects” text like homepage */}
      {relatedProjects.length > 0 && (
        <section className="pb-[10px]">
          <div className="mx-auto grid grid-cols-8 gap-[30px]" style={{ maxWidth: 'calc(100%-20px)' }}>
            <div
              className="col-start-5 col-span-2 cursor-pointer pt-[90px] pb-[90px]"
              style={{ mixBlendMode: 'normal' }}
              onClick={() => router.push('/projects')}
            >
              <p className="m-0">
                Discover more projects that include our uncompromised attention to detail in {servicesUsed}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Related projects grid */}
      {relatedProjects.length > 0 && (
        <section className="mb-[10px]">
          <ProjectGrid projects={relatedProjects.slice(0, 4)} />
        </section>
      )}
    </motion.main>
  )
}