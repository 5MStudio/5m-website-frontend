'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { grid } from '../tokens/grid'

export default function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShowOverlay(false), 1200)

    // Track screen width for mobile
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Variants for letters
  const letterVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.15,
        staggerDirection: -1,
      },
    },
  }

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white z-[9999] flex justify-center items-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Grid layout exactly like header */}
          <motion.div
            className="grid grid-cols-8 items-center text-xl font-bold w-full absolute top-1/2 -translate-y-1/2"
            style={{
              maxWidth: `calc(100% - ${grid.margin * 2}px)`,
              columnGap: `${grid.gutter}px`,
            }}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Left */}
            <motion.span
              className="col-start-1 col-span-1 text-left"
              variants={letterVariants}
            >
              {isMobile ? '0A' : '0'}
            </motion.span>

            {/* Middle left (desktop only) */}
            {!isMobile && (
              <motion.span
                className="col-start-3 col-span-1 text-left"
                variants={letterVariants}
              >
                A
              </motion.span>
            )}

            {/* Center */}
            <motion.span
              className={`${isMobile ? 'col-start-4 col-span-2 text-center font-bold text-2xl' : 'col-start-4 col-span-2 text-center font-bold text-2xl'}`}
              variants={letterVariants}
            >
              5M
            </motion.span>

            {/* Right middle (desktop only) */}
            {!isMobile && (
              <motion.span
                className="col-start-6 col-span-1 text-right"
                variants={letterVariants}
              >
                9
              </motion.span>
            )}

            {/* Right */}
            <motion.span
              className="col-start-8 col-span-1 text-right"
              variants={letterVariants}
            >
              {isMobile ? '9Z' : 'Z'}
            </motion.span>
          </motion.div>
        </motion.div>
      )}

      {!showOverlay && (
        <motion.div
          key="page-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}