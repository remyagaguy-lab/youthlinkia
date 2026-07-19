import { createClient } from '@/lib/supabase/server'
import ModerationClient from './ModerationClient'

export default async function ModerationOpportunitesPage() {
  const supabase = await createClient()

  // Fetch all opportunities (in real life, with pagination, but here we keep it simple)
  const { data: opportunites } = await supabase
    .from('opportunites')
    .select(`
      *,
      structures:structure_id(nom)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-gray-900">Modération des Opportunités</h1>
        <p className="text-gray-600">
          Gérez, éditez et validez les opportunités détectées ou soumises manuellement. L'affichage est en temps réel (Realtime).
        </p>
      </div>

      <ModerationClient initialOpportunites={opportunites || []} />
    </div>
  )
}
