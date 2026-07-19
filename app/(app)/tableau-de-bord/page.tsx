import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // We already know user exists because of layout.tsx
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/connexion')

  // Fetch the profile to get the 'prenom' and 'role'
  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, role, statut_validation')
    .eq('id', user.id)
    .single()

  // Fetch followed opportunities
  const { data: suivis } = await supabase
    .from('opportunites_suivies')
    .select(`
      opportunite_id,
      opportunites (
        id, slug, titre, type
      )
    `)
    .eq('utilisateur_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch alerts
  const { data: alertes } = await supabase
    .from('alertes_utilisateur')
    .select('*')
    .eq('utilisateur_id', user.id)
    .eq('actif', true)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch recommendations for lyceen_etudiant
  let recommandations = null
  if (profile?.role === 'lyceen_etudiant') {
    let query = supabase
      .from('opportunites')
      .select('*')
      .contains('tags', ['orientation_scolaire'])
      .eq('statut_moderation', 'publie')
      .order('created_at', { ascending: false })
      .limit(3)
      
    if (profile.niveau_etudes) {
      query = query.eq('niveau_requis', profile.niveau_etudes)
    }
    
    const { data } = await query
    recommandations = data
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-poppins text-primary-900">
        Bonjour, {profile?.prenom || 'Nouveau talent'} 👋
      </h1>

      {profile?.role === 'partenaire' && profile?.statut_validation === 'en_attente_validation' && (
        <Card className="bg-warning-50 border-warning-200 p-4">
          <p className="text-warning-800 font-medium">
            Votre compte partenaire est en cours de validation par notre équipe. 
            Certaines fonctionnalités de publication sont temporairement bloquées.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-poppins text-gray-900">
              Opportunités suivies
            </h2>
          </div>
          {suivis && suivis.length > 0 ? (
            <ul className="space-y-3">
              {suivis.map((suivi: any) => {
                const opp = suivi.opportunites
                if (!opp) return null
                return (
                  <li key={suivi.opportunite_id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <a href={`/opportunites/${opp.slug}`} className="block hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors">
                      <span className="text-xs font-medium text-primary-600 uppercase mb-1 block">{opp.type}</span>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{opp.titre}</h3>
                      <p className="text-xs text-gray-500 mt-1">Structure partenaire</p>
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Vous ne suivez aucune opportunité pour le moment.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold font-poppins text-gray-900 mb-4">
            Mes alertes actives
          </h2>
          {alertes && alertes.length > 0 ? (
            <ul className="space-y-3">
              {alertes.map((alerte: any) => {
                const criteres = alerte.criteres
                const keys = Object.keys(criteres)
                return (
                  <li key={alerte.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {keys.map(key => (
                        <span key={key} className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                          {key}: {criteres[key].join(', ')}
                        </span>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Aucune alerte configurée.</p>
          )}
        </Card>
      </div>

      {profile?.role === 'lyceen_etudiant' && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-poppins text-gray-900">
              Recommandations pour toi 🎯
            </h2>
            <a href="/orientation-scolaire" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Voir tout l'espace Orientation
            </a>
          </div>
          
          {recommandations && recommandations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommandations.map((opp: any) => (
                <a key={opp.id} href={`/opportunites/${opp.slug}`} className="block group">
                  <Card className="h-full p-4 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group-hover:-translate-y-1">
                    <span className="text-xs font-medium text-primary-600 uppercase mb-2 block">{opp.type}</span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">{opp.titre}</h3>
                    <div className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span>{opp.pays_eligibles_residence?.[0] || 'International'}</span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
             <Card className="p-6 text-center border-dashed bg-gray-50">
               <p className="text-gray-500 text-sm mb-4">Complète ton profil (niveau d'études, etc.) pour recevoir des recommandations personnalisées.</p>
               <a href="/profil" className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                 Mettre à jour mon profil
               </a>
             </Card>
          )}
        </div>
      )}
    </div>
  )
}
