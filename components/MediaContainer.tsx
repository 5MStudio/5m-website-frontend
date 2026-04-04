'use client'

import React from 'react'

interface MediaContainerProps {
  videoUrl?: string
  imageUrl?: string
  aspectRatio?: number // e.g., 16/9 or 4/5
  fullScreen?: boolean // for hero
  className?: string // optional extra classes
}

export default function MediaContainer({
  videoUrl,
  imageUrl,
  aspectRatio = 16 / 9,
  fullScreen = false,
  className = '',
}: MediaContainerProps) {
  // If fullScreen, take full viewport height
  const wrapperClasses = fullScreen
    ? `relative w-full h-screen ${className}`
    : `relative w-full` // height handled by aspect ratio

  // Style for aspect ratio if not fullScreen
  const aspectStyle = fullScreen
    ? {}
    : { aspectRatio: `${aspectRatio}` } // modern CSS property

  return (
    <div className={wrapperClasses} style={aspectStyle}>
      {videoUrl ? (
        <video
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200" />
      )}
    </div>
  )
}