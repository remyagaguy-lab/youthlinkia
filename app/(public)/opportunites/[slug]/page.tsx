import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Building, Link as LinkIcon, Flag, Bell, Bookmark, BookmarkCheck } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { OpportuniteInteractiveClient } from './OpportuniteInteractiveClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: opp } = await supabase.from('opportunites').select('titre, description').eq('slug', slug).single()
  
  if (!opp) return { title: 'Non trouvé' }
  return {
    title: `${opp.titre} | YouthLinkIA`,
    description: opp.description?.substring(0, 160) || 'Détails de l\'opportunité',
  }
}

export default async function OpportuniteDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: opp, error } = await supabase
    .from('opportunites')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !opp) {
    notFound()
  }

  // Check user authentication for "Soft Wall"
  const { data: { user } } = await supabase.auth.getUser()
  const isConnected = !!user

  // Check if following
  let isFollowing = false
  if (user) {
    const { count } = await supabase
      .from('opportunites_suivies')
      .select('*', { count: 'exact', head: true })
      .eq('utilisateur_id', user.id)
      .eq('opportunite_id', opp.id)
    isFollowing = (count || 0) > 0
  }

  const daysUntilDeadline = opp.deadline ? differenceInDays(new Date(opp.deadline), new Date()) : null
  const isExpired = daysUntilDeadline !== null && daysUntilDeadline < 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête (Toujours visible) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 capitalize mb-4">
                {opp.type}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">{opp.titre}</h1>
            </div>
            {isConnected && (
              <OpportuniteInteractiveClient 
                opportuniteId={opp.id} 
                initialIsFollowing={isFollowing} 
              />
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">Structure partenaire</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{opp.pays_diffusion?.[0] || 'Non spécifié'}</span>
            </div>
            {opp.deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className={isExpired ? "text-red-600 font-bold" : ""}>
                  {isExpired ? "Expirée" : `Date limite : ${format(new Date(opp.deadline), 'dd MMMM yyyy', { locale: fr })}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contenu (Mur doux si non connecté) */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          
          <div className={`prose max-w-none text-gray-600 ${!isConnected ? 'blur-[4px] select-none h-40 overflow-hidden' : 'whitespace-pre-wrap'}`}>
            {opp.description}
          </div>

          {!isConnected && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-xl">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Débloquez l'opportunité</h3>
                <p className="text-gray-600 mb-6">
                  Inscrivez-vous gratuitement pour voir la description complète, les critères d'éligibilité et le lien pour postuler.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/inscription/lyceen_etudiant" className="w-full bg-primary-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    S'inscrire gratuitement
                  </Link>
                  <Link href="/connexion" className="text-primary-600 font-medium hover:underline">
                    J'ai déjà un compte
                  </Link>
                </div>
              </div>
            </div>
          )}

          {isConnected && opp.niveau_requis && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Niveau requis</h2>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {opp.niveau_requis}
              </pre>
            </div>
          )}
        </div>

        {/* Call To Action & Footer (Connecté uniquement) */}
        {isConnected && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {opp.lien_source ? (
              <a 
                href={opp.lien_source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                Postuler maintenant <LinkIcon className="w-5 h-5" />
              </a>
            ) : (
              <div className="text-gray-500 italic">Lien non disponible</div>
            )}

            <button className="text-gray-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 transition-colors">
              <Flag className="w-4 h-4" /> Signaler un problème
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
