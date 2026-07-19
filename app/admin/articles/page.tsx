import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArticlesClient } from './ArticlesClient'

export const metadata = {
  title: 'Administration Articles | YouthLinkIA'
}

export default async function AdminArticlesPage() {
  const supabase = await createClient()

  // Protect route
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/tableau-de-bord')
  }

  // Fetch articles
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto py-8">
      <ArticlesClient articles={articles || []} />
    </div>
  )
}
