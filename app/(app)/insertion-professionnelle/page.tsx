import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'
import { Calendar, Briefcase, FileText, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Insertion Professionnelle | YouthLinkIA',
  description: 'Préparez votre carrière avec nos ressources et ateliers.',
}

export default async function InsertionProfessionnellePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'jeune_professionnel') {
    redirect('/tableau-de-bord')
  }

  // Fetch preparation articles
  const { data: articles } = await supabase
    .from('articles')
    .select('titre, slug, chapo, image_couverture_url, published_at')
    .eq('categorie', 'preparation_pro')
    .eq('statut', 'publie')
    .order('published_at', { ascending: false })
    .limit(4)

  // Fetch upcoming events safely, using try/catch in case the table doesn't exist yet in DB
  let evenements: any[] = []
  try {
    const { data: events } = await supabase
      .from('evenements')
      .select('*')
      .gte('date_debut', new Date().toISOString())
      .order('date_debut', { ascending: true })
      .limit(3)
    if (events) evenements = events
  } catch (error) {
    console.warn("Table evenements is likely missing", error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-blue-200" />
            <h1 className="text-3xl md:text-4xl font-bold font-poppins">
              Tremplin de Carrière
            </h1>
          </div>
          <p className="text-blue-100 text-lg">
            Ressources, méthodes et ateliers pour optimiser votre profil, réussir vos entretiens et décrocher votre prochain emploi.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Ressources CV & Entretien */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-poppins flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-600" />
              Boîte à outils
            </h2>
          </div>
          
          {!articles || articles.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50 border-dashed">
              <p className="text-gray-500">Aucune ressource disponible pour le moment. L'équipe éditoriale y travaille !</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <a key={article.slug} href={`/filieres/${article.slug}`} className="block group">
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300">
                    <div className="aspect-video w-full bg-gray-100 relative">
                      {article.image_couverture_url ? (
                        <Image 
                          src={article.image_couverture_url} 
                          alt={article.titre} 
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                          <FileText className="w-10 h-10 text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 font-poppins mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {article.titre}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {article.chapo}
                      </p>
                      <div className="text-xs font-medium text-primary-600 flex items-center gap-1">
                        Lire l'article <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Calendrier des ateliers */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-28 border-primary-100 bg-primary-50/30">
            <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Prochains Ateliers
            </h2>
            
            {!evenements || evenements.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun atelier programmé pour les prochains jours.</p>
            ) : (
              <ul className="space-y-4">
                {evenements.map((evt) => (
                  <li key={evt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-bold text-primary-600 mb-1 uppercase tracking-wider">
                      {new Date(evt.date_debut).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} 
                      {' • '} 
                      {new Date(evt.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{evt.titre}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{evt.description}</p>
                    {evt.lien_inscription ? (
                      <a href={evt.lien_inscription} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white bg-primary-600 px-3 py-1.5 rounded-lg inline-block hover:bg-primary-700">
                        S'inscrire
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                        Lien à venir
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}
