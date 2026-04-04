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
          <div className="flex flex-col min-h-screen">
            <Header />
            
            {/* main content grows to fill remaining space */}
            <main className="flex-grow">
              {children}
            </main>
            
            <Footer />
          </div>
        </PageFadeWrapper>
      </body>
    </html>
  )
}