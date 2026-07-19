import { login } from '../actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  
  return (
    <Card className="p-8">
      <h1 className="text-2xl font-bold font-poppins text-center text-primary-900 mb-6">
        Connexion
      </h1>
      
      {message && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {message}
        </div>
      )}

      <form className="space-y-4">
        <Input 
          id="email" 
          name="email" 
          type="email" 
          label="Adresse email" 
          placeholder="vous@exemple.com" 
          required 
        />
        <Input 
          id="password" 
          name="password" 
          type="password" 
          label="Mot de passe" 
          required 
        />
        
        <div className="flex justify-end">
          <Link 
            href="/mot-de-passe-oublie" 
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button formAction={login} className="w-full">
          Se connecter
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <div className="mt-2 flex flex-col gap-2">
          <Link href="/inscription/lyceen_etudiant" className="text-primary-600 hover:underline">
            S'inscrire comme Jeune / Étudiant
          </Link>
          <Link href="/inscription/partenaire" className="text-primary-600 hover:underline">
            S'inscrire comme Partenaire
          </Link>
        </div>
      </div>
    </Card>
  )
}
