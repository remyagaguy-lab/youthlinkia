import { createClient } from '@/lib/supabase/server'
import { OpportuniteCard } from '@/components/ui/OpportuniteCard'
import { OpportunitesSearch } from './OpportunitesSearch'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Opportunités | YouthLinkIA',
  description: 'Trouvez des bourses, stages, emplois et formations adaptés à votre profil.',
}

const ITEMS_PER_PAGE = 12

export default async function OpportunitesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const pays = typeof resolvedParams.pays === 'string' ? resolvedParams.pays : ''
  const secteur = typeof resolvedParams.secteur === 'string' ? resolvedParams.secteur : ''
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : ''
  const niveau = typeof resolvedParams.niveau === 'string' ? resolvedParams.niveau : ''
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1

  const supabase = await createClient()

  let query = supabase
    .from('opportunites')
    .select('*', { count: 'exact' })
    .eq('statut_moderation', 'publie')
    .or(`deadline.gte.${new Date().toISOString()},deadline.is.null`)

  // Text search (fallback to ilike since we don't have a computed column for tsvector)
  if (q) {
    query = query.or(`titre.ilike.%${q}%,description.ilike.%${q}%,organisme.ilike.%${q}%`)
  }

  // Filters
  if (pays) query = query.contains('pays_diffusion', [pays])
  if (secteur) query = query.contains('tags', [secteur])
  if (type) query = query.eq('type', type)
  if (niveau) query = query.ilike('niveau_requis', `%${niveau}%`)

  // Pagination
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data: opportunites, count, error } = await query

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Découvrez nos opportunités
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explorez les meilleures bourses, emplois, stages et formations disponibles pour booster votre parcours.
          </p>
        </div>

        {/* Search & Filters Component */}
        <OpportunitesSearch />

        {/* Results Section */}
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            Une erreur est survenue lors du chargement des opportunités.
          </div>
        ) : opportunites && opportunites.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-500 font-medium">
              {count} opportunité{count !== 1 ? 's' : ''} trouvée{count !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunites.map((opp: any) => (
                <OpportuniteCard key={opp.id} opp={opp} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Link
                  href={`/opportunites?${new URLSearchParams({ ...resolvedParams as Record<string, string>, page: String(Math.max(1, page - 1)) }).toString()}`}
                  className={`p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-medium text-gray-700 mx-4">
                  Page {page} sur {totalPages}
                </span>
                <Link
                  href={`/opportunites?${new URLSearchParams({ ...resolvedParams as Record<string, string>, page: String(Math.min(totalPages, page + 1)) }).toString()}`}
                  className={`p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune opportunité trouvée</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche pour trouver ce que vous cherchez.</p>
            <Link href="/opportunites" className="text-primary-600 font-medium hover:underline">
              Réinitialiser la recherche
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
