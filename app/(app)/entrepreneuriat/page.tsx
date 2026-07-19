import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'
import { Rocket, Lightbulb, Building2, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Entrepreneuriat | YouthLinkIA',
  description: 'Ressources et structures d\'accompagnement pour les entrepreneurs.',
}

export default async function EntrepreneuriatPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'entrepreneur') {
    redirect('/tableau-de-bord')
  }

  // Fetch methodologie articles
  const { data: articles } = await supabase
    .from('articles')
    .select('titre, slug, chapo, image_couverture_url')
    .eq('categorie', 'methodologie_entrepreneuriale')
    .eq('statut', 'publie')
    .order('published_at', { ascending: false })
    .limit(4)

  // Fetch structures d'accompagnement
  const { data: structures } = await supabase
    .from('structures')
    .select('id, nom, type_structure, pays, logo_url, slug')
    .in('type_structure', ['structure_accompagnement', 'incubateur', 'bailleur'])
    .eq('statut_validation', 'valide')
    .limit(6)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-amber-200" />
            <h1 className="text-3xl md:text-4xl font-bold font-poppins">
              Labo du Business
            </h1>
          </div>
          <p className="text-amber-100 text-lg">
            De l'idée au premier client : accédez aux ressources méthodologiques et connectez-vous avec les structures d'accompagnement de la région.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            Méthodologie Entrepreneuriale
          </h2>
        </div>
        
        {!articles || articles.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 border-dashed">
            <p className="text-gray-500">Aucune ressource disponible pour le moment.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {articles.map((article) => (
              <a key={article.slug} href={`/filieres/${article.slug}`} className="block group">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-amber-300">
                  <div className="aspect-[4/3] w-full bg-gray-100 relative">
                    {article.image_couverture_url ? (
                      <Image 
                        src={article.image_couverture_url} 
                        alt={article.titre} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                        <Lightbulb className="w-8 h-8 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-bold text-gray-900 font-poppins mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {article.titre}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {article.chapo}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-600" />
            Où se faire accompagner ?
          </h2>
          <a href="/annuaire?types=incubateur,structure_accompagnement,bailleur" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Voir tout l'annuaire <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {!structures || structures.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 border-dashed">
            <p className="text-gray-500">Aucune structure d'accompagnement référencée pour l'instant.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {structures.map((struct) => (
              <a key={struct.id} href={`/annuaire/${struct.slug}`} className="block group">
                <Card className="p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 relative">
                    {struct.logo_url ? (
                      <Image src={struct.logo_url} alt={struct.nom} fill sizes="48px" className="object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">{struct.nom}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 capitalize">
                        {struct.type_structure.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{struct.pays}</span>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
