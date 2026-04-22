export const projectBySlugQuery = `
*[_type == "project" && slug.current == $slug][0]{
  _id,
  slug,
  title,
  year,
  client,
  services[]->{title},

  // ─ Thumbnail with video
  thumbnail{
    asset->{_id, url},
    ratio,
    video{
      _type,
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
      _type,
      asset->{
        data{
          playback_ids
        }
      }
    },
    mobileImage,
    mobileVideo{
      _type,
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
        _type,
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
        _type,
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
        _type,
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