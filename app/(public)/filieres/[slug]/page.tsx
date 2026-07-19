import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('titre, meta_description, meta_title')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Fiche Introuvable | YouthLinkIA' }

  return {
    title: data.meta_title || `${data.titre} | Filières | YouthLinkIA`,
    description: data.meta_description,
  }
}

export default async function FiliereDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('categorie', 'filieres')
    .eq('statut', 'publie')
    .single()

  if (!article) notFound()

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/filieres" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8">
        &larr; Retour aux filières
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-6">
          {article.titre}
        </h1>
        <p className="text-xl text-gray-600 font-medium leading-relaxed mb-8">
          {article.chapo}
        </p>
        
        {article.image_couverture_url && (
          <div className="rounded-2xl overflow-hidden aspect-[21/9] w-full bg-gray-100 mt-8 shadow-sm">
            <img 
              src={article.image_couverture_url} 
              alt={article.image_couverture_alt || article.titre} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
      </header>

      {/* Render Markdown/HTML from corps */}
      <div 
        className="prose prose-lg prose-primary max-w-none text-gray-700 font-inter"
        dangerouslySetInnerHTML={{ __html: article.corps }}
      />
    </article>
  )
}
