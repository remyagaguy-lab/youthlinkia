import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { message } = await searchParams

  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const updateProfile = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const updates = {
      prenom: formData.get('prenom'),
      pays: formData.get('pays'),
      secteur: formData.get('secteur'),
      niveau_etudes_experience: formData.get('niveau'),
      ambitions: formData.get('ambitions'),
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      redirect('/profil?message=Erreur lors de la mise à jour')
    }

    revalidatePath('/profil')
    redirect('/profil?message=Profil mis à jour avec succès')
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-poppins text-primary-900 mb-6">
        Compléter mon profil
      </h1>

      {message && (
        <div className={`mb-6 p-4 text-sm rounded-lg ${message.includes('succès') ? 'bg-success-50 text-success-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form action={updateProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            id="prenom" 
            name="prenom" 
            label="Prénom" 
            defaultValue={profile?.prenom || ''}
            required 
          />
          <Input 
            id="pays" 
            name="pays" 
            label="Pays" 
            defaultValue={profile?.pays || ''}
            required 
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold font-poppins mb-4">Informations facultatives</h2>
          
          <div className="space-y-4">
            <Input 
              id="secteur" 
              name="secteur" 
              label="Secteur d'activité visé / actuel" 
              placeholder="Ex: Informatique, Agriculture..."
              defaultValue={profile?.secteur || ''}
            />
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="niveau" className="text-sm font-medium text-gray-700">
                Niveau d'études ou d'expérience
              </label>
              <textarea 
                id="niveau"
                name="niveau"
                rows={2}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Ex: Master 1 en cours, ou 2 ans d'expérience..."
                defaultValue={profile?.niveau_etudes_experience || ''}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ambitions" className="text-sm font-medium text-gray-700">
                Vos ambitions principales
              </label>
              <textarea 
                id="ambitions"
                name="ambitions"
                rows={2}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Ex: Trouver un premier emploi, lancer mon entreprise..."
                defaultValue={profile?.ambitions || ''}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Card>
  )
}
