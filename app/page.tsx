// app/page.tsx
export const dynamic = "force-dynamic"

import { client } from '../sanity/client'
import { Project } from '../types/project'
import HomePageClient from './HomePageClient'

export default async function HomePageWrapper() {
  const selectedProjects: Project[] = await client.fetch(
    `*[_type == "project" && selected == true]{ 
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
    }`
  )

  const allProjects: Project[] = await client.fetch(
    `*[_type == "project"]{ 
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
    }`
  )

  const homepageData = await client.fetch(`*[_type == "homepage"][0]{ introText }`)

  return (
    <HomePageClient 
      selectedProjects={selectedProjects} 
      allProjects={allProjects} 
      homepageData={homepageData} 
    />
  )
}