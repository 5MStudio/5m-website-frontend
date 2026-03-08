'use client'

import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageFadeWrapper from '../components/PageFadeWrapper'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [key, setKey] = useState(pathname)

  // Update key when pathname changes (forces re-render)
  useEffect(() => {
    setKey(pathname)
  }, [pathname])

  return (
    <html lang="en">
      <body className="bg-red-500 font-sans">
        <PageFadeWrapper key={key}>
          <Header />
          {children}
          <Footer />
        </PageFadeWrapper>
      </body>
    </html>
  )
}