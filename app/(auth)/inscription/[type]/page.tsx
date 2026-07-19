import { signup } from '../../actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ROLE_TITLES: Record<string, string> = {
  lyceen_etudiant: 'Lycéen / Étudiant',
  jeune_professionnel: 'Jeune Professionnel',
  entrepreneur: 'Entrepreneur',
  partenaire: 'Partenaire / Structure',
}

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<{ message?: string }>
}) {
  const { type } = await params
  const { message } = await searchParams

  if (!ROLE_TITLES[type]) {
    redirect('/connexion')
  }

  // Bind the action to pass the type parameter
  const signupAction = async (formData: FormData) => {
    'use server'
    await signup(formData, type)
  }

  return (
    <Card className="p-8">
      <h1 className="text-2xl font-bold font-poppins text-center text-primary-900 mb-2">
        Créer un compte
      </h1>
      <p className="text-center text-gray-500 mb-6 font-medium">
        Profil : {ROLE_TITLES[type]}
      </p>
      
      {message && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {message}
        </div>
      )}

      <form className="space-y-4" action={signupAction}>
        <Input 
          id="prenom" 
          name="prenom" 
          type="text" 
          label="Prénom (ou Nom de la structure)" 
          placeholder="Jean" 
          required 
        />
        <Input 
          id="email" 
          name="email" 
          type="email" 
          label="Adresse email" 
          placeholder="vous@exemple.com" 
          required 
        />
        <Input 
          id="pays" 
          name="pays" 
          type="text" 
          label="Pays de résidence" 
          placeholder="Ex: Togo" 
          required 
        />
        <Input 
          id="password" 
          name="password" 
          type="password" 
          label="Mot de passe" 
          required 
        />

        <Button type="submit" className="w-full mt-2">
          M'inscrire
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-primary-600 hover:underline">
          Se connecter
        </Link>
      </div>
    </Card>
  )
}
