// app/page.tsx
import { client } from '../sanity/client'
import { Project } from '../types/project'
import HomePageClient from './HomePageClient'

export default async function HomePageWrapper() {
  const selectedProjects: Project[] = await client.fetch(
    `*[_type == "project" && selected == true]{ 
      title, slug, year, client, services, 
      thumbnail{ asset->{_id,url}, ratio }, 
      hero{ desktopImage, desktopVideo, mobileImage, mobileVideo } 
    }`
  )

  const allProjects: Project[] = await client.fetch(
    `*[_type == "project"]{ 
      title, slug, year, client, services, 
      thumbnail{ asset->{_id,url}, ratio }, 
      hero{ desktopImage, desktopVideo, mobileImage, mobileVideo } 
    }`
  )

  const homepageData = await client.fetch(`*[_type == "homepage"][0]{ introText }`)

  // Render classic homepage only
  return <HomePageClient 
    selectedProjects={selectedProjects} 
    allProjects={allProjects} 
    homepageData={homepageData} 
  />
}