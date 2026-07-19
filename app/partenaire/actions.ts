'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveStructure(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const nom = formData.get('nom') as string
  const mission = formData.get('mission') as string
  const type = formData.get('type') as string
  const lien = formData.get('lien') as string
  const contact = formData.get('contact') as string
  const secteursString = formData.get('secteurs') as string
  const paysString = formData.get('pays_intervention') as string

  // Simple basic validation
  if (!nom || !mission || !type || !secteursString || !paysString || !lien || !contact) {
    redirect('/partenaire/fiche-structure?message=Tous les champs sont obligatoires&error=true')
  }

  const secteurs = secteursString.split(',').map(s => s.trim()).filter(Boolean)
  const pays_intervention = paysString.split(',').map(s => s.trim()).filter(Boolean)

  const slug = nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const payload = {
    partenaire_id: user.id,
    nom,
    slug,
    mission,
    type,
    lien,
    contact,
    secteurs,
    pays_intervention,
    // When saved, it goes back to 'a_valider'
    statut: 'a_valider' 
  }

  // Check if structure already exists for this user
  const { data: existing } = await supabase
    .from('structures')
    .select('id')
    .eq('partenaire_id', user.id)
    .single()

  let error
  if (existing) {
    ({ error } = await supabase.from('structures').update(payload).eq('id', existing.id))
  } else {
    ({ error } = await supabase.from('structures').insert(payload))
  }

  if (error) {
    console.error(error)
    redirect('/partenaire/fiche-structure?message=Erreur lors de la sauvegarde&error=true')
  }

  revalidatePath('/annuaire')
  redirect('/partenaire/fiche-structure?message=Fiche soumise avec succès. Elle est en attente de modération.')
}
