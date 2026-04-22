// types/project.ts

// ───────────────────
// Mux video type
// ───────────────────
export type MuxVideo = {
  _type: 'mux.video'
  asset: {
    data: {
      playback_ids: {
        id: string
        policy: string
      }[]
    }
  }
}

// ───────────────────
// Unified image type with optional video
// ───────────────────
export interface ImageWithVideo {
  _id?: string
  asset?: {
    _id: string
    url: string
  }
  ratio?: 'landscape' | 'portrait'
  video?: MuxVideo
  title?: string
}

// ───────────────────
// Hero section
// ───────────────────
export interface Hero {
  desktopImage?: ImageWithVideo
  mobileImage?: ImageWithVideo
  desktopVideo?: MuxVideo
  mobileVideo?: MuxVideo
}

// ───────────────────
// Content blocks
// ───────────────────
export interface ContentBlock {
  _type: string
  text?: any

  // GalleryBlock
  images?: ImageWithVideo[]

  // SingleImageBlock
  image?: ImageWithVideo

  // FullImageBlock
  fullImage?: ImageWithVideo

  layout?: string
  title?: string
  alignment?: 'left' | 'center' | 'right'
}

// ───────────────────
// GalleryBlock (specialized ContentBlock)
// ───────────────────
export interface GalleryBlock extends ContentBlock {
  _type: 'galleryBlock'
  images: ImageWithVideo[]
  layout: 'two' | 'grid' | 'full' | 'single' | 'imageText'
  alignment?: 'left' | 'center' | 'right'
  imagePosition?: 'left' | 'right'
  text?: any[]
}

// ───────────────────
// SingleImageBlock
// ───────────────────
export interface SingleImageBlock extends ContentBlock {
  _type: 'singleImageBlock'
  image: ImageWithVideo
}

// ───────────────────
// FullImageBlock
// ───────────────────
export interface FullImageBlock extends ContentBlock {
  _type: 'fullImageBlock'
  fullImage: ImageWithVideo
}

// ───────────────────
// Project type
// ───────────────────
export interface Project {
  _id: string
  slug: { current: string }
  title: string
  year: string
  client: string
  services: { title: string }[]
  thumbnail?: ImageWithVideo
  hero: Hero
  contentBlocks?: ContentBlock[]
}