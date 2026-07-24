import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OpportuniteCard } from '@/components/ui/OpportuniteCard'

export const metadata = {
  title: 'Orientation Scolaire | YouthLinkIA',
  description: 'Découvrez les filières et opportunités adaptées à votre profil.',
}

export default async function OrientationScolairePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, niveau_etudes, centres_interet')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'lyceen_etudiant') {
    redirect('/tableau-de-bord')
  }

  // Construct query to get opportunities with 'orientation_scolaire' tag
  let query = supabase
    .from('opportunites')
    .select('*')
    .contains('tags', ['orientation_scolaire'])
    .eq('statut_moderation', 'publie')
    .order('created_at', { ascending: false })

  // Basic matching based on level of study if it exists
  if (profile.niveau_etudes) {
    query = query.eq('niveau_requis', profile.niveau_etudes)
  }

  const { data: opportunites, error } = await query

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Votre boussole d'orientation
          </h1>
          <p className="text-primary-100 text-lg">
            Découvrez des opportunités et des filières qui correspondent exactement à votre profil ({profile.niveau_etudes || 'Lycéen/Étudiant'}).
          </p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-primary-400 opacity-20 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">
            Opportunités pour vous
          </h2>
          
          {!opportunites || opportunites.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500">Aucune opportunité correspondant spécifiquement à votre niveau n'a été trouvée pour le moment.</p>
              <button 
                className="mt-4 px-6 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                // Ideally this would clear the niveau_requis filter
              >
                Voir toutes les offres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunites.map((opp) => (
                <OpportuniteCard key={opp.id} opp={opp} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4">
              Explorez les filières
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Plongez dans nos fiches métiers et découvrez les secteurs d'avenir.
            </p>
            <a 
              href="/filieres" 
              className="block w-full text-center px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Consulter les fiches filières
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
