"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertArticle(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string | null
  const titre = formData.get('titre') as string
  const slug = formData.get('slug') as string
  const chapo = formData.get('chapo') as string
  const corps = formData.get('corps') as string
  const categorie = formData.get('categorie') as string
  const statut = formData.get('statut') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const payload = {
    titre,
    slug,
    chapo,
    corps,
    categorie,
    statut,
    auteur_id: user.id,
    image_couverture_alt: titre, // Fallback
    published_at: statut === 'publie' ? new Date().toISOString() : null
  }

  if (id) {
    const { error } = await supabase.from('articles').update(payload).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('articles').insert([payload])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/articles')
  revalidatePath('/filieres')
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/articles')
  revalidatePath('/filieres')
}
