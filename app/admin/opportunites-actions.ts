'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ----- SOURCES DE VEILLE -----

export async function saveSource(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string
  const nom = formData.get('nom') as string
  const url = formData.get('url') as string
  const score = parseFloat(formData.get('score_confiance') as string)

  if (!nom || !url) return

  const payload = {
    nom,
    url,
    score_confiance: isNaN(score) ? 0.5 : score,
  }

  if (id) {
    await supabase.from('sources_veille').update(payload).eq('id', id)
  } else {
    await supabase.from('sources_veille').insert(payload)
  }

  revalidatePath('/admin/sources')
}

export async function deleteSource(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  if (!id) return
  await supabase.from('sources_veille').delete().eq('id', id)
  revalidatePath('/admin/sources')
}


// ----- OPPORTUNITES -----

export async function moderateOpportunite(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const action = formData.get('action') as string // 'valider', 'rejeter'

  if (!id || !action) return

  const statut_moderation = action === 'valider' ? 'publie' : 'rejete'

  const { error } = await supabase
    .from('opportunites')
    .update({ statut_moderation })
    .eq('id', id)

  if (error) {
    console.error("Erreur modération opportunité:", error)
  }

  revalidatePath('/admin/moderation-opportunites')
  revalidatePath('/opportunites') // Path public (à créer plus tard)
}

export async function saveOpportunite(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  
  // Parse tags
  const tagsString = formData.get('tags') as string
  const tags = tagsString ? tagsString.split(',').map(s => s.trim()).filter(Boolean) : []
  
  const paysResString = formData.get('pays_eligibles_residence') as string
  const paysRes = paysResString ? paysResString.split(',').map(s => s.trim()).filter(Boolean) : []
  
  const paysDiffString = formData.get('pays_diffusion') as string
  const paysDiff = paysDiffString ? paysDiffString.split(',').map(s => s.trim()).filter(Boolean) : []

  const payload = {
    titre: formData.get('titre') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    montant_couverture: formData.get('montant_couverture') as string,
    niveau_requis: formData.get('niveau_requis') as string,
    lien_source: formData.get('lien_source') as string,
    deadline: formData.get('deadline') ? formData.get('deadline') as string : null,
    tags,
    pays_eligibles_residence: paysRes,
    pays_diffusion: paysDiff,
    statut_moderation: 'publie' // Si c'est un admin qui crée/édite, on publie direct
  }

  if (id) {
    // Edit existing
    await supabase.from('opportunites').update(payload).eq('id', id)
  } else {
    // Create new (Admin seeding)
    const slug = payload.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)
    await supabase.from('opportunites').insert({
      ...payload,
      slug,
    })
  }

  revalidatePath('/admin/moderation-opportunites')
}

// ----- SIGNALEMENTS -----

export async function resolveSignalement(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  if (!id) return

  await supabase
    .from('signalements')
    .update({ statut: 'traite' })
    .eq('id', id)

  revalidatePath('/admin/moderation-signalements')
}
