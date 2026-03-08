'use client'

import React from 'react'
import type { SingleImageBlock as SingleImageBlockType } from '@/types/project'
import { urlFor } from '@/sanity/image'

interface SingleImageBlockProps {
  block: SingleImageBlockType
  index?: number
}

export default function SingleImageBlock({ block, index = 0 }: SingleImageBlockProps) {
  const imageUrl = block.image ? urlFor(block.image) : undefined
  if (!imageUrl) return null

  // Sticky overlay style
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

  // Determine image alignment
  const isRight = block.alignment === 'right'
  const justify = isRight ? 'flex-end' : 'flex-start'
  const paddingLeft = !isRight ? '10px' : undefined
  const paddingRight = isRight ? '10px' : undefined

  // Width of image: half minus 5px gutter
  const imageWidth = 'calc((100% - 10px) / 2)'

  return (
    <section className="relative py-[50px] w-full flex justify-between box-border">
      {/* Image half */}
      <div className={`relative flex ${isRight ? 'order-2 justify-end' : 'justify-start'}`} style={{ width: imageWidth }}>
        <img
          src={imageUrl}
          alt={block.title || 'Project Image'}
          className="w-full h-auto object-cover"
        />

        {/* Sticky overlay */}
        <div style={stickyOverlayStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            <div className="grid grid-cols-4 w-full">
              {/* 0X */}
              <div
                className="col-span-2 flex items-center"
                style={{
                  justifyContent: justify,
                  mixBlendMode: 'normal',
                  paddingLeft,
                  paddingRight,
                }}
              >
                {`0${index + 1}`}
              </div>

              {/* Image title */}
              {block.title && (
                <div
                  className="col-span-2 flex items-center"
                  style={{
                    justifyContent: justify,
                    mixBlendMode: 'normal',
                    paddingLeft,
                    paddingRight,
                  }}
                >
                  {block.title}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty half for alignment */}
      <div style={{ width: imageWidth }} />
    </section>
  )
}