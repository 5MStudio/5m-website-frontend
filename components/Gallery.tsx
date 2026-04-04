'use client'

import React, { useEffect, useState } from 'react'
import { GalleryBlock } from '@/types/project'

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

  return (
    <section className="relative w-screen box-border">
      {block.layout === 'two' ? (
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
                    <div
                      className="col-span-2 flex items-center"
                      style={{
                        justifyContent: idx === 0 ? 'flex-start' : 'flex-end',
                        paddingLeft: idx === 0 ? '10px' : undefined,
                        paddingRight: idx === 0 ? undefined : '10px',
                      }}
                    >
                      {`0${idx + 1}`}
                    </div>

                    {img.title && (
                      <div
                        className="col-span-2 flex items-center"
                        style={{
                          justifyContent: idx === 0 ? 'flex-start' : 'flex-end',
                          paddingLeft: idx === 0 ? '10px' : undefined,
                          paddingRight: idx === 0 ? undefined : '10px',
                        }}
                      >
                        {img.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                      <div
                        className="col-span-2 flex items-center"
                        style={{
                          justifyContent: 'flex-start',
                          paddingLeft: '10px',
                        }}
                      >
                        {`0${idx + 1}`}
                      </div>
                      {img.title && (
                        <div
                          className="col-span-2 flex items-center"
                          style={{
                            justifyContent: 'flex-end',
                            paddingRight: '10px',
                          }}
                        >
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
      )}
    </section>
  )
}