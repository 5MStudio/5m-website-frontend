export const dynamic = "force-dynamic"

import { client } from '@/sanity/client'
import { aboutQuery } from '@/sanity/queries/about'
import type { About } from '@/types/about'
import AboutContent from '@/components/AboutContent'

export default async function AboutPage() {
  const about: About | null = await client.fetch(aboutQuery)

  if (!about) return <div>No content found</div>

  return (
    <main className="pt-[107px] pb-[0px]">
      <AboutContent about={about} />
    </main>
  )
}