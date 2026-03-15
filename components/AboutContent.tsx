'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { About } from '@/types/about'
import { grid } from '../tokens/grid'

interface AboutContentProps {
  about: About
}

export default function AboutContent({ about }: AboutContentProps) {
  const rowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  }

  return (
    <div className="mx-auto" style={{ maxWidth: `calc(100% - ${grid.margin * 2}px)` }}>
      {/* ─ Studio Text ─ */}
      <motion.div
        className="grid grid-cols-8"
        style={{ columnGap: `${grid.gutter}px` }}
        initial="hidden"
        animate="visible"
        custom={0}
        variants={rowVariants}
      >
        <div className="col-start-5 col-span-2">
          {about.studioText?.map((block, i) => (
            <p key={i} className="m-0">
              {block.children?.map((c: { text: string }) => c.text).join('')}
            </p>
          ))}
        </div>
      </motion.div>

      {/* ─ Spacer between Studio Text and first row ─ */}
      <div style={{ height: '100px', width: '100%' }} />

      {/* ─ Grid rows (Services → Platforms) ─ */}
      <div
        className="grid grid-cols-8 mx-auto"
        style={{
          maxWidth: `calc(100% - ${grid.margin * 2}px)`,
          columnGap: `${grid.gutter}px`,
          rowGap: '24px', // vertical spacing between rows
        }}
      >
        {/* ─ Services (01) ─ */}
        <motion.div
          className="col-span-8 grid grid-cols-8 gap-x-[30px] mb-0"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold text-left">01</div>
          <div className="col-start-3 col-span-2 font-bold text-left">Services</div>
          <div className="col-start-5 col-span-2 text-left">{about.services?.join(', ')}</div>
        </motion.div>

        {/* ─ Clients (02) ─ */}
        <motion.div
          className="col-span-8 grid grid-cols-8 gap-x-[30px] mb-0"
          initial="hidden"
          animate="visible"
          custom={2}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold text-left">02</div>
          <div className="col-start-3 col-span-2 font-bold text-left">Clients</div>
          <div className="col-start-5 col-span-2 text-left">{about.clients?.join(', ')}</div>
        </motion.div>

        {/* ─ Offices (03, vertical) ─ */}
        <motion.div
          className="col-span-8 grid grid-cols-8 gap-x-[30px] mb-0"
          initial="hidden"
          animate="visible"
          custom={3}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold text-left">03</div>
          <div className="col-start-3 col-span-2 font-bold text-left">Offices</div>
          <div className="col-start-5 col-span-2 flex flex-col gap-1 text-left">
            {about.offices?.map((office, idx) => (
              <div key={idx}>{office}</div>
            ))}
          </div>
        </motion.div>

        {/* ─ Contact (04, vertical) ─ */}
        <motion.div
          className="col-span-8 grid grid-cols-8 gap-x-[30px] mb-0"
          initial="hidden"
          animate="visible"
          custom={4}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold text-left">04</div>
          <div className="col-start-3 col-span-2 font-bold text-left">Contact</div>
          <div className="col-start-5 col-span-2 flex flex-col gap-1 text-left">
            {about.contact?.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
        </motion.div>

        {/* ─ Platforms (05, vertical) ─ */}
        <motion.div
          className="col-span-8 grid grid-cols-8 gap-x-[30px] mb-0"
          initial="hidden"
          animate="visible"
          custom={5}
          variants={rowVariants}
        >
          <div className="col-start-1 col-span-2 font-bold text-left">05</div>
          <div className="col-start-3 col-span-2 font-bold text-left">Platforms</div>
          <div className="col-start-5 col-span-2 flex flex-col gap-1 text-left">
            {about.platforms?.map((p, idx) => (
              <div key={idx}>{p}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}