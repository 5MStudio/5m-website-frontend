import type { Project, ImageWithVideo, ContentBlock } from '@/types/project'

export interface MediaItem {
  url: string
  title?: string
  type: 'image' | 'video'
}

export function getAllMediaForGrid(project: Project): MediaItem[] {
  const media: MediaItem[] = []
  if (project.thumbnail) {
    if (project.thumbnail.video?.asset?.data?.playback_ids?.[0]?.id) {
      media.push({
        url: `https://stream.mux.com/${project.thumbnail.video.asset.data.playback_ids[0].id}.m3u8`,
        title: project.title,
        type: 'video',
      })
    } else if (project.thumbnail.asset?.url) {
      media.push({ url: project.thumbnail.asset.url, title: project.title, type: 'image' })
    }
  }
  project.contentBlocks?.forEach((block: ContentBlock) => {
    if (block._type === 'galleryBlock') {
      block.images?.forEach((img: ImageWithVideo) => {
        if (img.video?.asset?.data?.playback_ids?.[0]?.id) {
          media.push({
            url: `https://stream.mux.com/${img.video.asset.data.playback_ids[0].id}.m3u8`,
            title: img?.asset?.url ?? undefined,
            type: 'video',
          })
        } else if (img.asset?.url) {
          media.push({ url: img.asset.url, type: 'image' })
        }
      })
    }
    if (block._type === 'singleImageBlock' && block.image) {
      if (block.image.video?.asset?.data?.playback_ids?.[0]?.id) {
        media.push({
          url: `https://stream.mux.com/${block.image.video.asset.data.playback_ids[0].id}.m3u8`,
          title: block.title,
          type: 'video',
        })
      } else if (block.image.asset?.url) {
        media.push({ url: block.image.asset.url, title: block.title, type: 'image' })
      }
    }
    if (block._type === 'fullImageBlock' && block.fullImage) {
      if (block.fullImage.video?.asset?.data?.playback_ids?.[0]?.id) {
        media.push({
          url: `https://stream.mux.com/${block.fullImage.video.asset.data.playback_ids[0].id}.m3u8`,
          title: block.fullImage.asset?.url,
          type: 'video',
        })
      } else if (block.fullImage.asset?.url) {
        media.push({ url: block.fullImage.asset.url, title: block.fullImage.asset.url, type: 'image' })
      }
    }
  })
  return media
}

export function getAllMediaForText(project: Project): MediaItem[] {
  const media: MediaItem[] = []
  if (project.thumbnail) {
    if (project.thumbnail.video?.asset?.data?.playback_ids?.[0]?.id) {
      const playbackId = project.thumbnail.video.asset.data.playback_ids[0].id
      media.push({
        url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=0`,
        title: project.title,
        type: 'image',
      })
    } else if (project.thumbnail.asset?.url) {
      media.push({ url: `${project.thumbnail.asset.url}?h=200`, title: project.title, type: 'image' })
    }
  }
  project.contentBlocks?.forEach((block: ContentBlock) => {
    if (block._type === 'galleryBlock') {
      block.images?.forEach((img: ImageWithVideo) => {
        if (img.video?.asset?.data?.playback_ids?.[0]?.id) {
          const playbackId = img.video.asset.data.playback_ids[0].id
          media.push({
            url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
            title: img?.asset?.url ?? undefined,
            type: 'image',
          })
        } else if (img.asset?.url) {
          media.push({ url: `${img.asset.url}?h=200`, type: 'image' })
        }
      })
    }
    if (block._type === 'singleImageBlock' && block.image) {
      if (block.image.video?.asset?.data?.playback_ids?.[0]?.id) {
        const playbackId = block.image.video.asset.data.playback_ids[0].id
        media.push({
          url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
          title: block.title,
          type: 'image',
        })
      } else if (block.image.asset?.url) {
        media.push({ url: `${block.image.asset.url}?h=200`, title: block.title, type: 'image' })
      }
    }
    if (block._type === 'fullImageBlock' && block.fullImage) {
      if (block.fullImage.video?.asset?.data?.playback_ids?.[0]?.id) {
        const playbackId = block.fullImage.video.asset.data.playback_ids[0].id
        media.push({
          url: `https://image.mux.com/${playbackId}/thumbnail.jpg?height=200`,
          title: block.fullImage.asset?.url,
          type: 'image',
        })
      } else if (block.fullImage.asset?.url) {
        media.push({ url: `${block.fullImage.asset.url}?h=200`, title: block.fullImage.asset.url, type: 'image' })
      }
    }
  })
  return media
}