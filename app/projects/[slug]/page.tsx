// app/projects/[slug]/page.tsx
import ProjectPageClient from './ProjectPageClient'
import { client } from '@/sanity/client'
import { projectBySlugQuery } from '@/sanity/queries/project'
import { Project } from '@/types/project'

interface ProjectPageWrapperProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPageWrapper({ params }: ProjectPageWrapperProps) {
  const { slug } = await params

  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })

  const rawProject = project
    ? await client.fetch(
        `*[_type == "project" && slug.current == $slug][0]{ "serviceIds": services[]._ref }`,
        { slug }
      )
    : null

  const relatedProjects: Project[] = project && rawProject?.serviceIds?.length
    ? await client.fetch(
        `*[_type == "project" && _id != $id && count(services[]._ref[@ in $serviceIds]) > 0]{
          _id,
          slug,
          title,
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
          },
          contentBlocks[]{
            _type,
            text,
            layout,
            title,
            alignment,
            images[]{
              asset->{_id,url},
              ratio,
              title,
              video{
                asset->{
                  data{
                    playback_ids
                  }
                }
              }
            },
            image{
              asset->{_id,url},
              ratio,
              title,
              video{
                asset->{
                  data{
                    playback_ids
                  }
                }
              }
            },
            fullImage{
              asset->{_id,url},
              ratio,
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
        }[0...4]`,
        { id: project._id, serviceIds: rawProject.serviceIds }
      )
    : []

  return <ProjectPageClient project={project} relatedProjects={relatedProjects} />
}