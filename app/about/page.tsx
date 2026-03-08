// app/about/page.tsx
import { client } from '@/sanity/client'
import { aboutQuery } from '@/sanity/queries/about'
import type { About } from '@/types/about'
import AboutContent from '@/components/AboutContent'

export default async function AboutPage() {
  const about: About | null = await client.fetch(aboutQuery)

  if (!about) return <div>No content found</div>

  return (
    <main className="pt-[80px] pb-[100px]">
      <AboutContent about={about} />
    </main>
  )
}