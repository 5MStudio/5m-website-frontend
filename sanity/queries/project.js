// sanity/queries/project.js

export const projectBySlugQuery = `
*[_type == "project" && slug.current == $slug][0]{
  _id,
  slug,
  title,
  year,
  client,
  services,

  // ─ Thumbnail with video
  thumbnail{
    asset->{_id, url},
    ratio,
    video{
      asset->{
        data{
          playback_ids
        }
      }
    }
  },

  // ─ Hero videos
  hero{
    desktopImage,
    desktopVideo{
      asset->{
        data{
          playback_ids
        }
      }
    },
    mobileImage,
    mobileVideo{
      asset->{
        data{
          playback_ids
        }
      }
    }
  },

  // ─ Content blocks
  contentBlocks[]{
    _type,
    text,

    images[]{
      asset->{_id, url},
      title,
      video{
        asset->{
          data{
            playback_ids
          }
        }
      }
    },

    layout,

    image{
      asset->{_id, url},
      video{
        asset->{
          data{
            playback_ids
          }
        }
      }
    },

    title,
    alignment,

    fullImage{
      asset->{_id, url},
      title,
      video{
        asset->{
          data{
            playback_ids
          }
        }
      }
    }
  }
}
`