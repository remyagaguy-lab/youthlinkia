import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'moderateur') {
    redirect('/tableau-de-bord')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/moderation-partenaires">
            <span className="text-white font-bold text-lg font-poppins">YouthLinkIA Admin</span>
          </Link>
          <span className="text-xs font-semibold text-gray-900 bg-warning-400 px-2 py-1 rounded-md hidden md:block">
            Accès Staff
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/admin/moderation-partenaires" className="text-gray-300 hover:text-white font-medium text-sm">
            Partenaires
          </Link>
          <Link href="/admin/moderation-opportunites" className="text-gray-300 hover:text-white font-medium text-sm">
            Opportunités
          </Link>
          <Link href="/admin/moderation-signalements" className="text-gray-300 hover:text-white font-medium text-sm">
            Signalements
          </Link>
          <Link href="/admin/sources" className="text-gray-300 hover:text-white font-medium text-sm">
            Sources
          </Link>
          <Link href="/tableau-de-bord" className="text-gray-300 hover:text-white font-medium text-sm border-l border-gray-700 pl-6">
            Quitter l'admin
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
