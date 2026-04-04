'use client'

import React, { useState, useEffect } from 'react'
import { grid } from '../tokens/grid'
import { spacing } from '../tokens/spacing'

export default function Footer() {
  const [colStart, setColStart] = useState(5)
  const [colSpan, setColSpan] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        // small screens
        setColStart(5)
        setColSpan(4)
      } else if (width < 1024) {
        // medium screens
        setColStart(5)
        setColSpan(4)
      } else {
        // large screens
        setColStart(5)
        setColSpan(2)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <footer className="relative w-full">
      {/* Intro text */}
      <div
        className="mx-auto grid grid-cols-8"
        style={{
          maxWidth: `calc(100% - ${grid.margin * 2}px)`,
          columnGap: `${grid.gutter}px`,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
        }}
      >
        <div className={`col-start-${colStart} col-span-${colSpan} text-left`}>
          <p>
            We are always happy to meet new people.
            <br />
            Email us at{' '}
            <a href="mailto:hi@5-m.com" className="no-underline">
              hi@5-m.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer grid (same layout as Header, NOT fixed, NO blend mode) */}
      <div
        className="mx-auto grid grid-cols-8 items-center py-[10px]"
        style={{
          maxWidth: `calc(100% - ${grid.margin * 2}px)`,
          columnGap: `${grid.gutter}px`,
        }}
      >
        <span className="col-start-1 col-span-1 text-left text-sm">0</span>

        <span className="col-start-3 col-span-1 text-left text-sm">A</span>

        <div className="col-start-4 col-span-2 flex justify-center">
          <span className="font-bold text-xl">5M</span>
        </div>

        <span className="col-start-6 col-span-1 text-right text-sm">9</span>

        <span className="col-start-8 col-span-1 text-right text-sm">Z</span>
      </div>
    </footer>
  )
}