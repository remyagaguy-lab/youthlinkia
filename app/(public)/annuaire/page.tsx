import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Annuaire des Partenaires | YouthLinkIA',
  description: 'Découvrez les structures académiques, incubateurs et bailleurs de notre réseau.',
}

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; pays?: string; q?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase.from('structures').select('*').eq('statut', 'publiee')

  if (params.type) query = query.eq('type', params.type)
  if (params.pays) query = query.contains('pays_intervention', [params.pays])
  if (params.q) query = query.ilike('nom', `%${params.q}%`)

  const { data: structures } = await query.order('nom', { ascending: true })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-poppins text-primary-900 mb-4">Annuaire des Partenaires</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez les structures d'accompagnement, institutions académiques, et entreprises qui publient des opportunités sur notre plateforme.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-8">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Input 
            id="q" 
            name="q" 
            label="Rechercher" 
            placeholder="Nom de la structure..." 
            defaultValue={params.q || ''} 
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="type" className="text-sm font-medium text-gray-700">Type de structure</label>
            <select 
              name="type" 
              id="type" 
              defaultValue={params.type || ''}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="institution_academique">Institution académique</option>
              <option value="structure_accompagnement">Structure d'accompagnement</option>
              <option value="bailleur">Bailleur de fonds</option>
              <option value="incubateur">Incubateur</option>
              <option value="association">Association</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          <Input 
            id="pays" 
            name="pays" 
            label="Pays d'intervention" 
            placeholder="Ex: Sénégal" 
            defaultValue={params.pays || ''} 
          />

          <Button type="submit" className="w-full">
            Filtrer
          </Button>
        </form>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structures?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Aucune structure ne correspond à vos critères.
          </div>
        )}

        {structures?.map((structure) => (
          <Link href={`/annuaire/${structure.slug}`} key={structure.id}>
            <Card className="h-full hover:shadow-md transition-shadow p-6 flex flex-col cursor-pointer border hover:border-primary-300">
              <div className="flex items-center gap-4 mb-4">
                {structure.logo_url ? (
                  <img src={structure.logo_url} alt={structure.nom} className="w-12 h-12 rounded-md object-contain border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                    {structure.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold font-poppins text-gray-900 line-clamp-1">{structure.nom}</h2>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full uppercase tracking-wider">
                    {structure.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                {structure.mission}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                {structure.pays_intervention.slice(0, 2).map((p: string) => (
                  <span key={p} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">📍 {p}</span>
                ))}
                {structure.pays_intervention.length > 2 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">+{structure.pays_intervention.length - 2}</span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
