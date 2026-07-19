import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNavigation } from '@/components/ui/BottomNavigation'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '../(auth)/actions'

export default async function AppLayout({
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-gray-200 h-24 items-center px-6 justify-between sticky top-0 z-50">
        <Link href="/tableau-de-bord">
          <Image src="/brand/logo-color.png" alt="YouthLinkIA" width={150} height={64} className="h-16 w-auto object-contain" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/tableau-de-bord" className="text-gray-600 hover:text-primary-900 font-medium">Tableau de bord</Link>
          <Link href="/opportunites" className="text-gray-600 hover:text-primary-900 font-medium">Opportunités</Link>
          {profile?.role === 'lyceen_etudiant' && (
            <Link href="/orientation-scolaire" className="text-gray-600 hover:text-primary-900 font-medium">Orientation Scolaire</Link>
          )}
          {profile?.role === 'jeune_professionnel' && (
            <Link href="/insertion-professionnelle" className="text-gray-600 hover:text-primary-900 font-medium">Insertion Pro</Link>
          )}
          {profile?.role === 'entrepreneur' && (
            <Link href="/entrepreneuriat" className="text-gray-600 hover:text-primary-900 font-medium">Entrepreneuriat</Link>
          )}
          <Link href="/profil" className="text-gray-600 hover:text-primary-900 font-medium">Mon Profil</Link>
          <form action={signOut}>
            <button className="text-sm text-red-600 hover:underline">Déconnexion</button>
          </form>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 h-20 flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/tableau-de-bord">
          <img src="/brand/logo-color.png" alt="YouthLinkIA" className="h-12 object-contain" />
        </Link>
        <form action={signOut}>
          <button className="text-xs text-red-600 font-medium">Quitter</button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </main>

      <BottomNavigation />
    </div>
  )
}
