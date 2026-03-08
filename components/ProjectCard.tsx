'use client'

import React from 'react'
import { urlFor } from '../sanity/image'
import Link from 'next/link'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  if (!project.slug?.current) return null

  const thumbnailUrl = project.thumbnail ? urlFor(project.thumbnail) : undefined

  // Count all images in contentBlocks + thumbnail itself
  const imageCount =
    (project.thumbnail ? 1 : 0) +
    (project.contentBlocks?.reduce((acc, block) => {
      if (block._type === 'galleryBlock') return acc + (block.images?.length || 0)
      if (block._type === 'singleImageBlock') return acc + 1
      return acc
    }, 0) || 0)

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group block relative rounded overflow-hidden mx-[-10px] shadow-sm cursor-pointer"
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={project.title}
            className={`w-full object-cover ${
              project.thumbnail!.ratio === 'landscape'
                ? 'aspect-video'
                : 'aspect-[4/5]'
            }`}
          />

          {/* Top-right overlay 0X */}
          <div className="absolute top-[10px] right-[10px] bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {`0${imageCount}`}
          </div>
        </div>
      )}

      {/* Info below the image */}
      <div className="pt-[10px] px-[10px] flex justify-between text-sm transition-opacity duration-200 group-hover:opacity-25">
        <span>{project.client}</span>
        <span>{project.services.join(', ')}</span>
      </div>
    </Link>
  )
}