import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { submitOpportunite } from '../opportunites-actions'

export default async function PartenaireOpportunitesPage({
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
    .select('id')
    .eq('partenaire_id', user.id)
    .single()

  let opportunites: any[] = []
  if (structure) {
    const { data } = await supabase
      .from('opportunites')
      .select('*')
      .eq('structure_id', structure.id)
      .order('created_at', { ascending: false })
    opportunites = data || []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-poppins text-primary-900">Soumettre une Opportunité</h1>
        <p className="text-gray-600 mt-1">
          Partagez une bourse, un emploi ou un financement avec la communauté YouthLinkIA.
        </p>
      </div>

      {params.message && (
        <div className={`p-4 text-sm rounded-lg ${params.error ? 'bg-red-50 text-red-700' : 'bg-success-50 text-success-700'}`}>
          {params.message}
        </div>
      )}

      {!structure ? (
        <Card className="p-8 text-center bg-warning-50 border-warning-200">
          <p className="text-warning-800 font-medium">
            Vous devez d'abord créer la fiche de votre structure avant de pouvoir publier des opportunités.
          </p>
          <Button asChild className="mt-4">
            <a href="/partenaire/fiche-structure">Créer ma fiche structure</a>
          </Button>
        </Card>
      ) : (
        <>
          <Card className="p-8">
            <form action={submitOpportunite} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="titre" label="Titre de l'opportunité" placeholder="Bourse d'excellence 2024" required />
                
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-gray-700">Type d'opportunité</label>
                  <select name="type" required className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent">
                    <option value="">Sélectionnez...</option>
                    <option value="bourse_etude">Bourse d'étude</option>
                    <option value="emploi">Emploi</option>
                    <option value="formation_courte">Formation courte</option>
                    <option value="volontariat">Volontariat</option>
                    <option value="financement">Financement de projet</option>
                    <option value="concours">Concours</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Description détaillée</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  required 
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="lien_source" type="url" label="Lien de candidature" placeholder="https://..." required />
                <Input name="deadline" type="date" label="Date limite de candidature (optionnel)" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="pays_eligibles_residence" label="Pays éligibles (séparés par virgule)" placeholder="Mali, Sénégal, Togo..." />
                <Input name="tags" label="Mots-clés (séparés par virgule)" placeholder="Tech, Entrepreneuriat, Master..." />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <Button type="submit">Soumettre à l'équipe</Button>
              </div>
            </form>
          </Card>

          <div>
            <h2 className="text-lg font-bold font-poppins text-gray-900 mb-4">Vos opportunités soumises</h2>
            <div className="space-y-4">
              {opportunites.length === 0 && (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200 text-gray-500">
                  Vous n'avez pas encore soumis d'opportunité.
                </div>
              )}
              {opportunites.map(opp => (
                <Card key={opp.id} className="p-4 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{opp.titre}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{opp.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      opp.statut_moderation === 'publie' ? 'bg-success-100 text-success-800' :
                      opp.statut_moderation === 'rejete' ? 'bg-red-100 text-red-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {opp.statut_moderation.replace('_', ' ')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
