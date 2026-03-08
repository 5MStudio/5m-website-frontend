import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'p8hrggg4',  // replace with your Sanity project ID
  dataset: 'production',         // or your dataset
  apiVersion: '2026-02-27',      // today’s date
  useCdn: true,                  // `false` if you want fresh data during development
})