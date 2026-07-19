import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PartenaireLayout({
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
    .select('role, statut_validation')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'partenaire') {
    redirect('/tableau-de-bord')
  }

  if (profile?.statut_validation !== 'valide') {
    // Redirige vers le tableau de bord avec un paramètre pour afficher un toast ou simplement laisser le tableau de bord afficher l'alerte
    redirect('/tableau-de-bord?message=Votre compte partenaire est en cours de validation')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 h-24 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/tableau-de-bord">
            <img src="/brand/logo-color.png" alt="YouthLinkIA" className="h-16 object-contain" />
          </Link>
          <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md hidden md:block">
            Espace Partenaire
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/partenaire/fiche-structure" className="text-gray-600 hover:text-primary-900 font-medium text-sm">
            Ma Fiche Structure
          </Link>
          <Link href="/partenaire/opportunites" className="text-gray-600 hover:text-primary-900 font-medium text-sm">
            Soumettre une Opportunité
          </Link>
          <Link href="/tableau-de-bord" className="text-gray-600 hover:text-primary-900 font-medium text-sm">
            Retour au tableau de bord
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
