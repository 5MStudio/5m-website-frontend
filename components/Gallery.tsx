'use client'

import React, { useEffect, useState } from 'react'
import { GalleryBlock } from '@/types/project'
import { PortableText } from '@portabletext/react'

interface GalleryProps {
  block: GalleryBlock
}

export default function Gallery({ block }: GalleryProps) {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsSmall(width < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!block.images || block.images.length === 0) return null

  const stickyOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: '17px',
    paddingBottom: '3px',
    pointerEvents: 'none',
    zIndex: 10,
    mixBlendMode: 'difference',
    color: 'white',
  }

  // ───────────────────
  // single
  // ───────────────────
  if (block.layout === 'single') {
    const img = block.images[0]
    const alignment = block.alignment ?? 'left'
    const justifyMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }

    return (
      <section className="relative w-screen box-border">
        <div className={`flex w-full ${justifyMap[alignment]}`}>
          <div className="relative box-border" style={{ width: 'calc(50% - 5px)' }}>
            <img
              src={img.asset?.url}
              alt={img.title || ''}
              className="w-full h-auto object-cover block"
            />
            <div style={stickyOverlayStyle}>
              <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
                <div className="grid grid-cols-4 w-full">
                  <div className="col-span-2 flex items-center justify-start pl-[10px]">
                    01
                  </div>
                  {img.title && (
                    <div className="col-span-2 flex items-center justify-start pl-[10px]">
                      {img.title}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ───────────────────
  // imageText
  // ───────────────────
  if (block.layout === 'imageText') {
    const img = block.images[0]
    const imageLeft = (block.imagePosition ?? 'left') === 'left'

    const imageEl = (
      <div className="relative w-1/2 box-border">
        <img
          src={img.asset?.url}
          alt={img.title || ''}
          className="w-full h-auto object-cover block"
        />
        <div style={stickyOverlayStyle}>
          <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
            <div className="grid grid-cols-4 w-full">
              {!imageLeft && img.title && (
                <div className="col-span-2 flex items-center justify-end pr-[10px]">
                  {img.title}
                </div>
              )}
              <div
                className="col-span-2 flex items-center"
                style={{
                  justifyContent: imageLeft ? 'flex-start' : 'flex-end',
                  paddingLeft: imageLeft ? '10px' : undefined,
                  paddingRight: !imageLeft ? '10px' : undefined,
                }}
              >
                01
              </div>
              {imageLeft && img.title && (
                <div className="col-span-2 flex items-center justify-start pl-[10px]">
                  {img.title}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )

    const textEl = (
      <div className="relative w-1/2 box-border">
        <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
          {block.text && <PortableText value={block.text} />}
        </div>
      </div>
    )

    return (
      <section className="relative w-screen box-border">
        <div className="flex w-full gap-[10px]">
          {imageLeft ? (
            <>{imageEl}{textEl}</>
          ) : (
            <>{textEl}{imageEl}</>
          )}
        </div>
      </section>
    )
  }

  // ───────────────────
  // two
  // ───────────────────
  if (block.layout === 'two') {
    return (
      <section className="relative w-screen box-border">
        <div className="flex w-full gap-[10px] box-border">
          {block.images.map((img, idx) => (
            <div key={idx} className="relative w-1/2 box-border">
              <img
                src={img.asset?.url}
                alt={img.title || ''}
                className="w-full h-auto object-cover block"
              />
              <div style={stickyOverlayStyle}>
                <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
                  <div className="grid grid-cols-4 w-full">
                    {idx === 1 && img.title && (
                      <div className="col-span-2 flex items-center justify-end pr-[10px]">
                        {img.title}
                      </div>
                    )}
                    <div
                      className="col-span-2 flex items-center"
                      style={{
                        justifyContent: idx === 0 ? 'flex-start' : 'flex-end',
                        paddingLeft: idx === 0 ? '10px' : undefined,
                        paddingRight: idx !== 0 ? '10px' : undefined,
                      }}
                    >
                      {`0${idx + 1}`}
                    </div>
                    {idx === 0 && img.title && (
                      <div className="col-span-2 flex items-center justify-start pl-[10px]">
                        {img.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ───────────────────
  // full / grid
  // ───────────────────
  return (
    <section className="relative w-screen box-border">
      <div
        className={`grid w-full box-border gap-[10px] ${
          isSmall
            ? block.images.length === 2
              ? 'grid-cols-1'
              : 'grid-cols-2'
            : 'grid-cols-8'
        }`}
      >
        {block.images.map((img, idx) => {
          let colSpan
          if (isSmall) {
            colSpan = 1
          } else {
            colSpan = block.layout === 'grid' ? 2 : 8
          }

          const isDesktop = !isSmall
          const half = Math.ceil(block.images.length / 2)
          const isRightSideDesktop = isDesktop && idx >= half

          const isRightSideMobile =
            isSmall && (block.images.length === 2 || block.images.length === 4)
              ? idx % 2 === 1
              : false

          const isRightSide = isRightSideDesktop || isRightSideMobile

          return (
            <div key={idx} className={`relative box-border ${!isSmall ? `col-span-${colSpan}` : ''}`}>
              <img
                src={img.asset?.url}
                alt={img.title || ''}
                className="w-full h-auto object-cover block"
              />
              <div style={stickyOverlayStyle}>
                <div className="sticky top-1/2 -translate-y-1/2 w-full h-fit">
                  <div className="grid grid-cols-4 w-full">
                    {isRightSide && img.title && (
                      <div className="col-span-2 flex items-center justify-end pr-[10px]">
                        {img.title}
                      </div>
                    )}
                    <div
                      className="col-span-2 flex items-center"
                      style={{
                        justifyContent: isRightSide ? 'flex-end' : 'flex-start',
                        paddingLeft: !isRightSide ? '10px' : undefined,
                        paddingRight: isRightSide ? '10px' : undefined,
                      }}
                    >
                      {`0${idx + 1}`}
                    </div>
                    {!isRightSide && img.title && (
                      <div className="col-span-2 flex items-center justify-start pl-[10px]">
                        {img.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}