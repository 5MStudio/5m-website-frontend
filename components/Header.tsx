'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { grid } from '../tokens/grid'

export default function Header() {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setVisible(!(currentScrollY > lastScrollY && currentScrollY > 50))
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = (
    <div className="flex gap-[24px]">
      <Link href="/about" className="no-underline">Studio</Link>
      <Link href="/projects" className="no-underline">Work</Link>
      <Link href="/" className="font-bold text-xl">5M</Link>
      <a href="https://www.5-m.com" className="no-underline" target="_blank" rel="noopener noreferrer">Store</a>
      <a href="mailto:hi@5-m.com" className="no-underline">Contact</a>
    </div>
  )

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-transparent border-0 py-[10px] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 1, mixBlendMode: 'difference', color: 'white' }}
    >
      {isMobile ? (
        <div className="flex justify-between items-center" style={{ maxWidth: `calc(100% - ${grid.margin * 2}px)`, margin: '0 auto' }}>
          <Link href="/" className="text-sm flex gap-[0px]">
            <span>0</span>
            <span>A</span>
          </Link>

          {navLinks}

          <Link href="/" className="text-sm flex gap-[0px]">
            <span>9</span>
            <span>Z</span>
          </Link>
        </div>
      ) : (
        <div
          className="mx-auto grid items-center"
          style={{
            maxWidth: `calc(100% - ${grid.margin * 2}px)`,
            gridTemplateColumns: 'repeat(8, 1fr)',
            columnGap: `${grid.gutter}px`,
          }}
        >
          <Link href="/" className="col-start-1 col-span-1 text-left text-sm">0</Link>
          <Link href="/" className="col-start-3 col-span-1 text-left text-sm">A</Link>

          <div
            className="col-start-4 col-span-2 flex justify-center items-center"
            style={{ gap: '24px' }}
          >
            {navLinks}
          </div>

          <Link href="/" className="col-start-6 col-span-1 text-right text-sm">9</Link>
          <Link href="/" className="col-start-8 col-span-1 text-right text-sm">Z</Link>
        </div>
      )}
    </header>
  )
}