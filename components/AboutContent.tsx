'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { About } from '@/types/about'

interface AboutContentProps {
  about: About
}

export default function AboutContent({ about }: AboutContentProps) {
  return (
    <div className="grid grid-cols-8 gap-[30px] px-[10px] max-w-[calc(100%-20px)] mx-auto">
      {/* Studio Text like a textBlock */}
      {about.studioText && (
        <div className="col-start-5 col-span-2 py-[50px]">
          <PortableText value={about.studioText} />
        </div>
      )}

      {/* Other fields */}
      {about.services && (
       <div className="col-start-5 col-span-2 py-[20px]">
        Services {about.services.join(', ')}
        </div>
      )}
      {about.clients && (
        <div className="col-start-5 col-span-2 py-[20px]">
          <strong>Clients</strong> {about.clients.join(', ')}
        </div>
      )}
      {about.offices && (
        <div className="col-start-5 col-span-2 py-[20px]">
          <strong>Offices</strong> {about.offices}
        </div>
      )}
      {about.contact && (
        <div className="col-start-5 col-span-2 py-[20px]">
          <strong>Contact</strong> {about.contact}
        </div>
      )}
      {about.platforms && (
        <div className="col-start-5 col-span- py-[20px]">
          <strong>Platforms</strong> {about.platforms}
        </div>
      )}
    </div>
  )
}