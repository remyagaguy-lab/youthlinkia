import { createClient } from '@/lib/supabase/server'
import { OpportunitesFeedClient } from './OpportunitesFeedClient'

export const metadata = {
  title: 'Catalogue des Opportunités | YouthLinkIA',
  description: 'Trouvez des bourses d\'études, stages, emplois et formations adaptés à votre profil.',
}

const INITIAL_PAGE_SIZE = 9

export default async function OpportunitesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : ''
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''

  const supabase = await createClient()

  let query = supabase
    .from('opportunites')
    .select('id, titre, type, pays_diffusion, deadline, slug, created_at', { count: 'exact' })
    .eq('statut_moderation', 'publie')

  if (type) {
    query = query.eq('type', type)
  }

  if (q) {
    query = query.or(`titre.ilike.%${q}%,description.ilike.%${q}%`)
  }

  query = query.order('created_at', { ascending: false }).range(0, INITIAL_PAGE_SIZE - 1)

  const { data: opportunites, count } = await query

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-heading text-[var(--color-primary)] tracking-tight sm:text-4xl">
            Catalogue des Opportunités
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-2xl">
            Explorez les meilleures bourses d'études, offres d'emploi, stages et programmes d'accompagnement au Togo et à l'international.
          </p>
        </div>

        {/* Client View with Filters on Top & Load More at Bottom */}
        <OpportunitesFeedClient
          initialOpportunites={opportunites || []}
          totalCount={count || 0}
        />
      </div>
    </div>
  )
}

