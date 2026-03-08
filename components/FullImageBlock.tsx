'use client'

import React from 'react'
import type { FullImageBlock as FullImageBlockType } from '@/types/project'
import { urlFor } from '@/sanity/image'

interface FullImageBlockProps {
  block: FullImageBlockType
  index?: number
}

export default function FullImageBlock({ block, index = 0 }: FullImageBlockProps) {
  if (!block.image) return null
  const imageUrl = urlFor(block.image)
  if (!imageUrl) return null

  const stickyOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 15,
    paddingBottom: 15,
    pointerEvents: 'none',
    zIndex: 10,
  }

  return (
    <section className="relative w-full py-[50px]">
      <div className="relative w-full">
        {/* Image */}
        <img
          src={imageUrl}
          alt={block.title || 'Project Image'}
          className="w-full h-auto object-cover"
        />

        {/* Sticky overlay */}
        <div style={stickyOverlayStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            <div className="grid grid-cols-8 w-full">
              
              {/* Number */}
              <div
                className="col-start-1 flex items-center"
                style={{
                  justifyContent: 'flex-start',
                  paddingLeft: '10px',
                  mixBlendMode: 'normal',
                }}
              >
                {`0${index + 1}`}
              </div>

              {/* Title */}
              {block.title && (
                <div
                  className="col-start-3 flex items-center"
                  style={{
                    justifyContent: 'flex-start',
                    paddingLeft: '10px',
                    mixBlendMode: 'normal',
                  }}
                >
                  {block.title}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}