'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { About } from '@/types/about'
import { grid } from '../tokens/grid'

interface AboutContentProps {
  about: About
}

export default function AboutContent({ about }: AboutContentProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  }

  const dynamicSpan = isSmallScreen ? 'col-span-4' : 'col-span-2'

  const renderClickableList = (items?: string[], queryParam?: string) =>
    items?.map((item, idx) => (
      <React.Fragment key={item}>
        <span
          className="cursor-pointer"
          onClick={() =>
            router.push(`/projects?${queryParam}=${encodeURIComponent(item)}`)
          }
        >
          {item}
        </span>
        {idx !== items.length - 1 && ', '}
      </React.Fragment>
    ))

  return (
    <div
      className="mx-auto flex flex-col"
      style={{
        maxWidth: `calc(100% - ${grid.margin * 2}px)`,
      }}
    >
      {/* ─ Studio Text ─ */}
      <motion.div
        className="grid grid-cols-8"
        style={{ columnGap: `${grid.gutter}px` }}
        initial="hidden"
        animate="visible"
        custom={0}
        variants={rowVariants}
      >
        <div className={`col-start-5 ${dynamicSpan}`}>
          {about.studioText?.map((block, i) => (
            <p key={i} className="m-0">
              {block.children?.map((c: { text: string }) => c.text).join('')}
            </p>
          ))}
        </div>
      </motion.div>

      <div style={{ height: '80px', width: '100%' }} />

      <div
        className="grid grid-cols-8 mx-auto"
        style={{
          columnGap: isSmallScreen ? '12px' : `${grid.gutter}px`,
          rowGap: '24px',
        }}
      >
        {/* Services */}
        <motion.div
          className="col-span-8 grid grid-cols-8"
          style={{ columnGap: '30px' }}
          initial="hidden"
          animate="visible"
          custom={1}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold">01</div>
          <div className="col-start-3 col-span-2 font-bold">Services</div>
          <div className={`col-start-5 ${dynamicSpan}`}>
            {renderClickableList(about.services?.map(s => s.title), 'service')}
          </div>
        </motion.div>

        {/* Clients */}
        <motion.div
          className="col-span-8 grid grid-cols-8"
          style={{ columnGap: '30px' }}
          initial="hidden"
          animate="visible"
          custom={2}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold">02</div>
          <div className="col-start-3 col-span-2 font-bold">Clients</div>
          <div className={`col-start-5 ${dynamicSpan}`}>
            {renderClickableList(about.clients, 'client')}
          </div>
        </motion.div>

        {/* Offices */}
        <motion.div
          className="col-span-8 grid grid-cols-8"
          style={{ columnGap: '30px' }}
          initial="hidden"
          animate="visible"
          custom={3}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold">03</div>
          <div className="col-start-3 col-span-2 font-bold">Offices</div>
          <div className={`col-start-5 ${dynamicSpan} flex flex-col gap-1`}>
            {about.offices?.map((office, idx) => (
              <div key={idx}>{office}</div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="col-span-8 grid grid-cols-8"
          style={{ columnGap: '30px' }}
          initial="hidden"
          animate="visible"
          custom={4}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold">04</div>
          <div className="col-start-3 col-span-2 font-bold">Contact</div>
          <div className={`col-start-5 ${dynamicSpan} flex flex-col gap-1`}>
            {about.contact?.map((item, idx) => (
              <div key={idx}>
                <a href={`mailto:${item.email}`}>{item.label}</a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platforms */}
        <motion.div
          className="col-span-8 grid grid-cols-8"
          style={{ columnGap: '30px' }}
          initial="hidden"
          animate="visible"
          custom={5}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold">05</div>
          <div className="col-start-3 col-span-2 font-bold">Platforms</div>
          <div className={`col-start-5 ${dynamicSpan} flex flex-col gap-1`}>
            {about.platforms?.map((p, idx) => (
              <div key={idx}>
                <a href={p.url} target="_blank" rel="noopener noreferrer">{p.label}</a>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}