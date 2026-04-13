'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Project,
  ContentBlock,
  GalleryBlock,
  SingleImageBlock as SingleImageBlockType,
  FullImageBlock as FullImageBlockType,
} from '@/types/project'
import SelectedProjectHero from '@/components/SelectedProjectHero'
import Gallery from '@/components/Gallery'
import ProjectGrid from '@/components/ProjectGrid'
import SingleImageBlock from '@/components/SingleImageBlock'
import FullImageBlock from '@/components/FullImageBlock'
import { PortableText } from '@portabletext/react'

function isGalleryBlock(block: ContentBlock): block is GalleryBlock {
  return block._type === 'galleryBlock'
}

function isSingleImageBlock(block: ContentBlock): block is SingleImageBlockType {
  return block._type === 'singleImageBlock'
}

function isFullImageBlock(block: ContentBlock): block is FullImageBlockType {
  return block._type === 'fullImageBlock'
}

interface ProjectPageClientProps {
  project: Project | null
  relatedProjects?: Project[]
}

const colStartClass: Record<number, string> = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
}

const colSpanClass: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
}

export default function ProjectPageClient({ project, relatedProjects = [] }: ProjectPageClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [colStart, setColStart] = useState(5)
  const [colSpan, setColSpan] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColStart(3)
        setColSpan(6)
      } else if (width < 1024) {
        setColStart(3)
        setColSpan(6)
      } else {
        setColStart(5)
        setColSpan(2)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!project) return <div>Project not found</div>

  const servicesUsed = project.services?.join(', ') || ''

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Hero */}
      <div className="mb-[10px]">
        <SelectedProjectHero project={project} />
      </div>

      {/* Content blocks */}
      {project.contentBlocks?.map((block, idx) => {
        const blockClass = 'mb-[10px]'

        if (block._type === 'textBlock') {
          return (
            <section key={idx} className={blockClass}>
              <div
                className="grid grid-cols-8 gap-[30px] px-[10px] mx-auto"
                style={{ maxWidth: 'calc(100% - 20px)' }}
              >
                <div className={`${colStartClass[colStart]} ${colSpanClass[colSpan]} pt-[90px] pb-[90px]`}>
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

        if (isSingleImageBlock(block)) {
          return (
            <div key={idx} className={blockClass}>
              <SingleImageBlock block={block} index={idx} />
            </div>
          )
        }

        if (isFullImageBlock(block)) {
          return (
            <div key={idx} className={blockClass}>
              <FullImageBlock block={block} index={idx} />
            </div>
          )
        }

        return null
      })}

      {/* Discover more text */}
      {relatedProjects.length > 0 && (
        <section className="pb-[10px]">
          <div
            className="grid grid-cols-8 gap-[30px] px-[10px] mx-auto"
            style={{ maxWidth: 'calc(100% - 100px)' }}
          >
            <div
              className={`${colStartClass[colStart]} ${colSpanClass[colSpan]} cursor-pointer pt-[90px] pb-[90px]`}
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

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="mb-[10px]">
          <ProjectGrid projects={relatedProjects.slice(0, 4)} />
        </section>
      )}
    </motion.main>
  )
}