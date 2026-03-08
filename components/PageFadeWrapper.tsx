'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { grid } from '../tokens/grid'

export default function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShowOverlay(false), 1200)
    return () => clearTimeout(timeout)
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
        staggerChildren: 0.2, // time between letters appearing
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.15, // time between letters disappearing
        staggerDirection: -1, // reverse order on exit
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
            <motion.span className="col-start-1 col-span-1 text-left" variants={letterVariants}>
              0
            </motion.span>
            <motion.span className="col-start-3 col-span-1 text-left" variants={letterVariants}>
              A
            </motion.span>
            <motion.span
              className="col-start-4 col-span-2 text-center font-bold text-2xl"
              variants={letterVariants}
            >
              5M
            </motion.span>
            <motion.span className="col-start-6 col-span-1 text-right" variants={letterVariants}>
              9
            </motion.span>
            <motion.span className="col-start-8 col-span-1 text-right" variants={letterVariants}>
              Z
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