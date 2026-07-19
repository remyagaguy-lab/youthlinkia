import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const baseUrl = 'https://youthlinkia.com' // Replace with actual production URL

  // Fetch dynamic content
  const { data: opportunites } = await supabase.from('opportunites').select('slug, updated_at').eq('statut_moderation', 'publie')
  const { data: articles } = await supabase.from('articles').select('slug, updated_at').eq('statut', 'publie')
  const { data: structures } = await supabase.from('structures').select('slug, updated_at').eq('statut_validation', 'valide')

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/opportunites`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/annuaire`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/filieres`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Add dynamic opportunities
  if (opportunites) {
    opportunites.forEach((opp) => {
      sitemap.push({
        url: `${baseUrl}/opportunites/${opp.slug}`,
        lastModified: new Date(opp.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  }

  // Add dynamic articles
  if (articles) {
    articles.forEach((art) => {
      sitemap.push({
        url: `${baseUrl}/filieres/${art.slug}`, // All articles are routed under /filieres or similar
        lastModified: new Date(art.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  }

  // Add dynamic structures
  if (structures) {
    structures.forEach((struct) => {
      sitemap.push({
        url: `${baseUrl}/annuaire/${struct.slug}`,
        lastModified: new Date(struct.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  }

  return sitemap
}
