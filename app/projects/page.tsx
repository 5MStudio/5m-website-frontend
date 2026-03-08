// app/projects/page.tsx
import { client } from '@/sanity/client'
import ProjectsToggle from '@/components/ProjectsToggle'
import type { Project } from '@/types/project'

export default async function ProjectsPage() {
  // Fetch all projects directly from Sanity, server-side
  const projects: Project[] = await client.fetch(`
    *[_type == "project"]{
      _id,
      title,
      year,
      client,
      services,
      slug{current},
      thumbnail{ asset, ratio },
      hero{ desktopImage, desktopVideo, mobileImage, mobileVideo },
      contentBlocks[]{
        _type,
        text,
        images[]{ asset->{_id,url}, title },
        layout,
        image{ asset->{_id,url} },
        title,
        alignment
      }
    } | order(year desc)
  `)

  return (
    <main className="pt-[100px] pb-[0px]">
      <ProjectsToggle projects={projects} />
    </main>
  )
}