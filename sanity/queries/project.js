// sanity/queries/project.ts
export const projectBySlugQuery = `
*[_type == "project" && slug.current == $slug][0]{
  _id,
  slug,
  title,
  year,
  client,
  services,
  hero{
    desktopImage,
    desktopVideo,
    mobileImage,
    mobileVideo
  },
  contentBlocks[]{
    _type,
    text,
    images[]{
      asset->{_id, url},
      title
    },
    layout,
    // SingleImageBlock fields
    image { asset->{_id, url} },
    title,
    alignment,
    // FullImageBlock fields
    fullImage { asset->{_id, url}, title }
  }
}
`