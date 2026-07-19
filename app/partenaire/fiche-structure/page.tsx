import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { saveStructure } from '../actions'

export default async function FicheStructurePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams
  
  if (!user) return null

  const { data: structure } = await supabase
    .from('structures')
    .select('*')
    .eq('partenaire_id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins text-primary-900">Ma Fiche Structure</h1>
        <p className="text-gray-600 mt-1">
          Gérez la présence publique de votre organisation sur l'annuaire YouthLinkIA.
        </p>
      </div>

      {params.message && (
        <div className={`mb-6 p-4 text-sm rounded-lg ${params.error ? 'bg-red-50 text-red-700' : 'bg-success-50 text-success-700'}`}>
          {params.message}
        </div>
      )}

      {structure && structure.statut === 'a_valider' && (
        <div className="mb-6 p-4 text-sm rounded-lg bg-warning-50 text-warning-800 border border-warning-200">
          Votre fiche est actuellement en cours de modération par notre équipe. Elle n'est pas encore visible sur l'annuaire public.
        </div>
      )}
      
      {structure && structure.statut === 'rejetee' && (
        <div className="mb-6 p-4 text-sm rounded-lg bg-red-50 text-red-800 border border-red-200">
          Votre fiche a été rejetée. Veuillez vérifier vos emails pour consulter le motif et corrigez vos informations avant de soumettre à nouveau.
        </div>
      )}

      <Card className="p-8">
        <form action={saveStructure} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="nom" 
              name="nom" 
              label="Nom de la structure" 
              placeholder="YouthLinkIA Inc." 
              defaultValue={structure?.nom || ''} 
              required 
            />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="type" className="text-sm font-medium text-gray-700">Type de structure</label>
              <select 
                name="type" 
                id="type" 
                defaultValue={structure?.type || ''}
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Sélectionnez un type...</option>
                <option value="institution_academique">Institution académique</option>
                <option value="structure_accompagnement">Structure d'accompagnement</option>
                <option value="bailleur">Bailleur de fonds</option>
                <option value="incubateur">Incubateur</option>
                <option value="association">Association</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="mission" className="text-sm font-medium text-gray-700">Mission principale</label>
            <textarea 
              id="mission"
              name="mission"
              rows={4}
              required
              defaultValue={structure?.mission || ''}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Décrivez la mission de votre structure..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="secteurs" 
              name="secteurs" 
              label="Secteurs d'activité (séparés par des virgules)" 
              placeholder="Tech, Agriculture, Éducation..." 
              defaultValue={structure?.secteurs?.join(', ') || ''} 
              required 
            />
            <Input 
              id="pays_intervention" 
              name="pays_intervention" 
              label="Pays d'intervention (séparés par des virgules)" 
              placeholder="Sénégal, Côte d'Ivoire..." 
              defaultValue={structure?.pays_intervention?.join(', ') || ''} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="lien" 
              name="lien" 
              type="url"
              label="Lien vers votre site web" 
              placeholder="https://votre-site.com" 
              defaultValue={structure?.lien || ''} 
              required 
            />
            <Input 
              id="contact" 
              name="contact" 
              type="email"
              label="Email de contact public" 
              placeholder="contact@votre-site.com" 
              defaultValue={structure?.contact || ''} 
              required 
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <Button type="submit">
              {structure ? 'Mettre à jour et soumettre à modération' : 'Créer ma fiche structure'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
