// app/page.tsx
export const dynamic = "force-dynamic"

import { client } from '../sanity/client'
import { Project } from '../types/project'
import HomePageClient from './HomePageClient'

export default async function HomePageWrapper() {
  // Fetch homepage data including ordered featured projects
  const homepageData = await client.fetch(`*[_type == "homepage"][0]{
    introText,
    "featuredProjects": featuredProjects[]->{
      _id,
      title,
      slug,
      year,
      client,
      services,
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

  // Optionally, fetch all projects for other sections like "latest projects"
  const allProjects: Project[] = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    slug,
    year,
    client,
    services, 
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