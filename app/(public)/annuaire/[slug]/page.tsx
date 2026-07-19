import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600 // Revalidate cache every hour (ISR)

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: structures } = await supabase
    .from('structures')
    .select('slug')
    .eq('statut', 'publiee')

  return structures?.map((s) => ({ slug: s.slug })) || []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: structure } = await supabase
    .from('structures')
    .select('nom, mission')
    .eq('slug', slug)
    .single()

  if (!structure) return { title: 'Non trouvé | YouthLinkIA' }

  return {
    title: `${structure.nom} | YouthLinkIA Annuaire`,
    description: structure.mission,
  }
}

export default async function StructureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: structure } = await supabase
    .from('structures')
    .select('*')
    .eq('slug', slug)
    .eq('statut', 'publiee')
    .single()

  if (!structure) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/annuaire" className="text-primary-600 hover:underline text-sm font-medium">
          &larr; Retour à l'annuaire
        </Link>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          {structure.logo_url ? (
            <img 
              src={structure.logo_url} 
              alt={structure.nom} 
              className="w-32 h-32 rounded-xl object-contain border border-gray-200 p-2 bg-white flex-shrink-0" 
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-4xl flex-shrink-0">
              {structure.nom.charAt(0)}
            </div>
          )}
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-poppins text-gray-900">{structure.nom}</h1>
              <span className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {structure.type.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {structure.secteurs.map((s: string) => (
                <span key={s} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
            {structure.lien && (
              <Button asChild>
                <a href={structure.lien} target="_blank" rel="noopener noreferrer">
                  Visiter le site web
                </a>
              </Button>
            )}
            {structure.contact && (
              <Button variant="outline" asChild>
                <a href={`mailto:${structure.contact}`}>
                  Contacter par email
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-primary max-w-none mb-8">
          <h2 className="text-xl font-semibold font-poppins text-gray-900 mb-4">Notre mission</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{structure.mission}</p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold font-poppins text-gray-900 mb-4">Pays d'intervention</h2>
          <div className="flex flex-wrap gap-2">
            {structure.pays_intervention.map((p: string) => (
              <span key={p} className="text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-md">
                📍 {p}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
