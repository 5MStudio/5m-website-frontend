// app/page.tsx
export const dynamic = "force-dynamic"

import { client } from '../sanity/client'
import { Project } from '../types/project'
import HomePageClient from './HomePageClient'

export default async function HomePageWrapper() {
  const homepageData = await client.fetch(`*[_type == "homepage"][0]{
    introText,
    "featuredProjects": featuredProjects[]->{
      _id,
      title,
      slug,
      year,
      client,
      services[]->{title},
      thumbnail{
        asset->{_id,url},
        ratio,
        video{
          asset->{
            data{
              playback_ids
            }
          }
        }
      },
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
      }
    }
  }`)

  const allProjects: Project[] = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    slug,
    year,
    client,
    services[]->{title},
    thumbnail{
      asset->{_id,url},
      ratio,
      video{
        asset->{
          data{
            playback_ids
          }
        }
      }
    },
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
    } 
  }`)

  return (
    <HomePageClient 
      featuredProjects={homepageData.featuredProjects || []} 
      allProjects={allProjects} 
      homepageData={homepageData} 
    />
  )
}