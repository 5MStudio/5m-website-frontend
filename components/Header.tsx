'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { grid } from '../tokens/grid'

export default function Header() {
  const [visible, setVisible] = useState(true) // header visibility
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scrolling down
        setVisible(false)
      } else {
        // scrolling up
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-transparent border-0 py-[10px] transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="mx-auto grid grid-cols-8 items-center"
        style={{
          maxWidth: `calc(100% - ${grid.margin * 2}px)`,
          columnGap: `${grid.gutter}px`,
        }}
      >
        <Link href="/" className="col-start-1 col-span-1 text-left text-sm">
          0
        </Link>

        <Link href="/" className="col-start-3 col-span-1 text-left text-sm">
          A
        </Link>

        <div
          className="col-start-4 col-span-2 flex justify-center items-center"
          style={{ gap: `30px` }}
        >
          <Link href="/about" className="no-underline">
            Studio
          </Link>

          <Link href="/projects" className="no-underline">
            Work
          </Link>

          <Link href="/" className="font-bold text-xl text-white">
            5M
          </Link>

          <a
            href="https://www.5-m.com"
            className="no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Store
          </a>

          <a href="mailto:hi@5-m.com" className="no-underline">
            Contact
          </a>
        </div>

        <Link href="/" className="col-start-6 col-span-1 text-right text-sm">
          9
        </Link>

        <Link href="/" className="col-start-8 col-span-1 text-right text-sm">
          Z
        </Link>
      </div>
    </header>
  )
}