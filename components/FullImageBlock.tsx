'use client'

import React from 'react'
import type { FullImageBlock } from '@/types/project'
import { urlFor } from '@/sanity/image'

interface FullImageBlockProps {
  block: FullImageBlock
  index?: number
}

export default function FullImageBlock({ block, index = 0 }: FullImageBlockProps) {
  const imageUrl = urlFor(block.fullImage) // ✅ block.fullImage is already ImageWithVideo
  if (!imageUrl) return null

  const stickyOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 10,
    pointerEvents: 'none',
    zIndex: 10,
  }

  return (
    <section className="relative w-full">
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={block.title || 'Project Image'}
          className="w-full h-auto object-cover"
        />

        <div style={stickyOverlayStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            <div className="grid grid-cols-8 w-full">
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