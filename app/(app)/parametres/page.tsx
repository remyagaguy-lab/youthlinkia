import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { message } = await searchParams

  if (!user) redirect('/connexion')

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const savePrefs = async (formData: FormData) => {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const frequence = formData.get('frequence')
    // Pour l'instant, on laisse l'email par défaut. On l'enrichira plus tard.
    
    // Check si la preference existe deja
    const { data: exist } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (exist) {
      await supabase.from('notification_preferences').update({ frequence }).eq('id', exist.id)
    } else {
      await supabase.from('notification_preferences').insert({ user_id: user.id, frequence })
    }

    revalidatePath('/parametres')
    redirect('/parametres?message=Préférences sauvegardées')
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-poppins text-primary-900 mb-6">
        Paramètres du compte
      </h1>

      {message && (
        <div className="mb-6 p-4 text-sm rounded-lg bg-success-50 text-success-700">
          {message}
        </div>
      )}

      <form action={savePrefs} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold font-poppins mb-2">Préférences de notifications</h2>
          <p className="text-sm text-gray-600 mb-4">A quelle fréquence souhaitez-vous recevoir nos alertes d'opportunités ?</p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="radio" name="frequence" value="immediate" defaultChecked={prefs?.frequence === 'immediate'} className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm font-medium">Immédiate (dès qu'une offre correspond)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="frequence" value="quotidienne" defaultChecked={prefs?.frequence === 'quotidienne' || !prefs} className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm font-medium">Quotidienne (un résumé par jour)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="frequence" value="hebdomadaire" defaultChecked={prefs?.frequence === 'hebdomadaire'} className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm font-medium">Hebdomadaire (un résumé par semaine)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  )
}
