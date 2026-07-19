import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { resolveSignalement } from '../opportunites-actions'

export default async function ModerationSignalementsPage() {
  const supabase = await createClient()

  const { data: signalements } = await supabase
    .from('signalements')
    .select(`
      *,
      opportunites (titre, lien_source, statut_moderation),
      profiles (prenom)
    `)
    .eq('statut', 'ouvert')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-gray-900">Modération des Signalements</h1>
        <p className="text-gray-600">
          Gérez les rapports de la communauté. Rappel : au bout de 3 signalements non résolus, une opportunité est automatiquement suspendue.
        </p>
      </div>

      <div className="space-y-4">
        {signalements?.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg border border-gray-200 text-gray-500 shadow-sm">
            Aucun signalement en attente. Bravo à la communauté ! 🎉
          </div>
        )}

        {signalements?.map((sig) => (
          <Card key={sig.id} className="p-6 border-l-4 border-l-warning-500">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {sig.motif.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Signalé par {sig.profiles?.prenom || 'Anonyme'} le {new Date(sig.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">Opportunité concernée :</h3>
                  <p className="text-gray-800 font-medium">{sig.opportunites?.titre}</p>
                  <p className="text-sm text-gray-500 mb-2">Statut actuel: <span className="font-semibold">{sig.opportunites?.statut_moderation}</span></p>
                  <div className="flex gap-4">
                    <a href={sig.opportunites?.lien_source} target="_blank" className="text-sm text-primary-600 hover:underline">
                      Vérifier le lien d'origine
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <form action={resolveSignalement}>
                  <input type="hidden" name="id" value={sig.id} />
                  <Button type="submit" className="w-full">
                    Marquer comme Traité
                  </Button>
                </form>
                {/* A link to go edit the opportunity directly */}
                <a href="/admin/moderation-opportunites" className="w-full">
                  <Button type="button" variant="outline" className="w-full">
                    Gérer l'opportunité
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
