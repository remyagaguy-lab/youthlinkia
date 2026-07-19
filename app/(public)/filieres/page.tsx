import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Filières Porteuses | YouthLinkIA',
  description: 'Découvrez les fiches informatives sur les filières porteuses en Afrique.',
}

export default async function FilieresPage() {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('titre, slug, chapo, image_couverture_url, published_at')
    .eq('categorie', 'filieres')
    .eq('statut', 'publie')
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-poppins mb-4">
          Filières Porteuses
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les secteurs qui recrutent, les formations pour y accéder et les métiers d'avenir.
        </p>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500">Aucune fiche filière n'a été publiée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <a key={article.slug} href={`/filieres/${article.slug}`} className="block group">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                {article.image_couverture_url ? (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img 
                      src={article.image_couverture_url} 
                      alt={article.titre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-primary-800 font-semibold font-poppins">Fiche Info</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 font-poppins mb-3 group-hover:text-primary-600 transition-colors">
                    {article.titre}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {article.chapo}
                  </p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
