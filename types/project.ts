// types/project.ts
export interface Thumbnail {
  asset: { _ref: string; _type: string }
  ratio: 'landscape' | 'portrait'
}

export interface Hero {
  desktopImage?: { asset: { _ref: string; _type: string } }
  desktopVideo?: { asset: { _ref: string; _type: string } }
  mobileImage?: { asset: { _ref: string; _type: string } }
  mobileVideo?: { asset: { _ref: string; _type: string } }
}

export interface TextBlock {
  _type: 'textBlock'
  text: any[]
}

export interface GalleryImage {
  asset?: { _id: string; url: string } // optional to avoid runtime errors
  title?: string
}

export interface GalleryBlock {
  _type: 'galleryBlock'
  images: GalleryImage[]
  layout: 'full' | 'two' | 'grid'
}

// ───────────────────────────
// Single image block (50% width)
// ───────────────────────────
export interface SingleImageBlock {
  _type: 'singleImageBlock'
  image: { asset: { _id: string; url: string } }
  title?: string
  alignment: 'left' | 'center' | 'right'
}

// ───────────────────────────
// Full image block (100% width)
// ───────────────────────────
export interface FullImageBlock {
  _type: 'fullImageBlock'
  image: { asset: { _id: string; url: string } }
  title?: string
}

// ───────────────────────────
// Update ContentBlock union
// ───────────────────────────
export type ContentBlock =
  | TextBlock
  | GalleryBlock
  | SingleImageBlock
  | FullImageBlock

export interface Project {
  _id: string
  slug: {
    current: string
  }
  title: string
  year: string
  client: string
  services: string[]
  hero: Hero
  thumbnail?: Thumbnail
  selected?: boolean
  contentBlocks?: ContentBlock[]
}