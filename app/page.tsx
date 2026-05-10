export const dynamic = "force-dynamic"

import { client } from '../sanity/client'
import { Project } from '../types/project'
import HomePageClient from './HomePageClient'

const projectFields = `
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
`

export default async function HomePageWrapper() {
  const homepageData = await client.fetch(`*[_type == "homepage"][0]{
    introText,
    "featuredProjects": featuredProjects[]->{
      ${projectFields}
    }
  }`)

  const allProjects: Project[] = await client.fetch(`*[_type == "project"]{
    ${projectFields}
  }`)

  const projectsPageData = await client.fetch(`*[_type == "projectsPage"][0]{
    "featuredGridProjects": featuredGridProjects[]->{
      ${projectFields}
    }
  }`)

  return (
    <HomePageClient
      featuredProjects={homepageData.featuredProjects || []}
      allProjects={allProjects}
      homepageData={homepageData}
      featuredGridProjects={projectsPageData?.featuredGridProjects || []}
    />
  )
}