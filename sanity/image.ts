// sanity/image.ts
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any, width?: number, aspect?: number) {
  if (!source) return undefined
  let img = builder.image(source)

  if (width) {
    img = img.width(width)
    if (aspect) img = img.height(Math.round(width / aspect))
  }

  return img.url()
}