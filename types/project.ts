// types/project.ts

export type MuxVideo = {
  _type: 'mux.video'
  asset?: {
    data?: {
      playback_ids?: {
        id: string
        policy: string
      }[]
    }
  }
}

export interface ImageAsset {
  asset: {
    _id: string
    url: string
  }
}

// Unified image type with optional video
export interface ImageWithVideo {
  asset?: {
    _id: string
    url: string
  }
  ratio?: 'landscape' | 'portrait'
  video?: MuxVideo
  title?: string // <-- added for Gallery usage
}

export interface Hero {
  desktopImage?: ImageWithVideo
  mobileImage?: ImageWithVideo
  desktopVideo?: MuxVideo
  mobileVideo?: MuxVideo
}

export interface ContentBlock {
  _type: string
  text?: any
  images?: ImageWithVideo[] // galleryBlock images
  image?: ImageWithVideo // singleImageBlock
  fullImage?: ImageWithVideo // fullImageBlock
  layout?: string
  title?: string
  alignment?: 'left' | 'center' | 'right'
}

// ───────────────
// NEW: GalleryBlock type
// ───────────────
export interface GalleryBlock extends ContentBlock {
  _type: 'galleryBlock'
  images: ImageWithVideo[]
  layout: 'two' | 'grid' | 'full'
}

export interface Project {
  _id: string
  slug: { current: string }
  title: string
  year: string
  client: string
  services: string[]
  thumbnail?: ImageWithVideo
  hero: Hero
  contentBlocks?: ContentBlock[]
}