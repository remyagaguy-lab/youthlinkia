import { resetPassword } from '../actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <Card className="p-8">
      <h1 className="text-2xl font-bold font-poppins text-center text-primary-900 mb-4">
        Mot de passe oublié
      </h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>
      
      {message && (
        <div className="mb-4 p-4 text-sm text-primary-700 bg-primary-50 rounded-lg border border-primary-200">
          {message}
        </div>
      )}

      <form className="space-y-4" action={resetPassword}>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          label="Adresse email" 
          placeholder="vous@exemple.com" 
          required 
        />

        <Button type="submit" className="w-full">
          Envoyer le lien
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link href="/connexion" className="text-primary-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </Card>
  )
}
