import ProjectPageClient from './ProjectPageClient'
import { client } from '@/sanity/client'
import { projectBySlugQuery } from '@/sanity/queries/project'
import { Project } from '@/types/project'

interface ProjectPageWrapperProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPageWrapper({ params }: ProjectPageWrapperProps) {
  const { slug } = await params

  // Fetch the main project
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })

  // Fetch related projects: max 4, exclude current project, match at least one shared service
  const relatedProjects: Project[] = project
    ? await client.fetch(
        `*[_type == "project" && _id != $id && count((services[])[@ in $services]) > 0]{
          _id,
          slug,
          title,
          year,
          client,
          services,
          thumbnail{ asset->{_id,url}, ratio },
          hero{ desktopImage, desktopVideo, mobileImage, mobileVideo }
        }[0...4]`,
        { id: project._id, services: project.services }
      )
    : []

  return <ProjectPageClient project={project} relatedProjects={relatedProjects} />
}