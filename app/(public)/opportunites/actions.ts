'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSuivre(opportuniteId: string, currentlyFollowing: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Vous devez être connecté" }

  if (currentlyFollowing) {
    const { error } = await supabase
      .from('opportunites_suivies')
      .delete()
      .eq('utilisateur_id', user.id)
      .eq('opportunite_id', opportuniteId)
    
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('opportunites_suivies')
      .insert({
        utilisateur_id: user.id,
        opportunite_id: opportuniteId
      })
    
    if (error) return { error: error.message }
  }

  revalidatePath('/opportunites/[slug]', 'page')
  revalidatePath('/tableau-de-bord')
  return { success: true }
}

export async function creerAlerte(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Vous devez être connecté" }

  const pays = formData.getAll('pays').map(p => p.toString().trim()).filter(Boolean)
  const secteurs = formData.getAll('secteur').map(s => s.toString().trim()).filter(Boolean)
  const types = formData.getAll('type').map(t => t.toString().trim()).filter(Boolean)

  if (pays.length === 0 && secteurs.length === 0 && types.length === 0) {
    return { error: "Veuillez spécifier au moins un critère" }
  }

  const criteres = {
    pays: pays.length > 0 ? pays : undefined,
    secteur: secteurs.length > 0 ? secteurs : undefined,
    type: types.length > 0 ? types : undefined,
  }

  const { error } = await supabase
    .from('alertes_utilisateur')
    .insert({
      utilisateur_id: user.id,
      criteres
    })

  if (error) return { error: error.message }

  revalidatePath('/tableau-de-bord')
  return { success: true }
}

export async function signalerOpportunite(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const opportunite_id = formData.get('opportunite_id')?.toString()
  const motif = formData.get('motif')?.toString()
  const details = formData.get('details')?.toString()

  if (!opportunite_id || !motif) {
    return { error: "Motif obligatoire" }
  }

  const { error } = await supabase
    .from('signalements')
    .insert({
      opportunite_id,
      utilisateur_id: user?.id || null, // Peut être fait en tant qu'invité si RLS le permet (à vérifier), mais le cahier des charges dit connecté pour certaines actions. On autorise null si non connecté ou on force la connexion. Disons forcé:
      motif,
      details
    })

  // Check RLS - if user is not connected and RLS blocks, it will fail.
  if (error) {
    // Si l'utilisateur doit être connecté pour signaler :
    if (error.code === '42501') return { error: "Vous devez être connecté pour signaler." }
    return { error: error.message }
  }

  return { success: true }
}
