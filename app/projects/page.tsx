// app/projects/page.tsx
export const dynamic = "force-dynamic"

import { client } from '@/sanity/client'
import ProjectsToggle from '@/components/ProjectsToggle'
import type { Project } from '@/types/project'

export default async function ProjectsPage() {
  const projectsPage = await client.fetch(`
    *[_type == "projectsPage"][0]{
      orderedProjects[]->{
        _id,
        title,
        year,
        client,
        services[]->{title},
        slug{current},
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
          images[]{
            asset->{_id,url},
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
            asset->{_id,url},
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
            asset->{_id,url},
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
    }
  `)

  const projects: Project[] = projectsPage?.orderedProjects || []

  return (
    <main className="pt-[120px] pb-[0px]">
      <ProjectsToggle projects={projects} />
    </main>
  )
}