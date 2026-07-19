'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitOpportunite(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Verify user has a structure
  const { data: structure } = await supabase
    .from('structures')
    .select('id')
    .eq('partenaire_id', user.id)
    .single()

  if (!structure) {
    redirect('/partenaire/opportunites?message=Vous devez d\'abord créer votre fiche structure&error=true')
  }

  const tagsString = formData.get('tags') as string
  const tags = tagsString ? tagsString.split(',').map(s => s.trim()).filter(Boolean) : []
  
  const paysResString = formData.get('pays_eligibles_residence') as string
  const paysRes = paysResString ? paysResString.split(',').map(s => s.trim()).filter(Boolean) : []

  const payload = {
    structure_id: structure.id,
    titre: formData.get('titre') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    lien_source: formData.get('lien_source') as string,
    deadline: formData.get('deadline') ? formData.get('deadline') as string : null,
    tags,
    pays_eligibles_residence: paysRes,
    statut_moderation: 'detecte' // Forcé pour les partenaires
  }

  const slug = payload.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

  const { error } = await supabase.from('opportunites').insert({
    ...payload,
    slug
  })

  if (error) {
    console.error(error)
    redirect('/partenaire/opportunites?message=Erreur lors de la soumission&error=true')
  }

  revalidatePath('/partenaire/opportunites')
  redirect('/partenaire/opportunites?message=Opportunité soumise avec succès. Elle est en cours de modération.')
}
