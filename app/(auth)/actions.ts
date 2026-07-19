'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/connexion?message=Identifiants invalides')
  }

  redirect('/tableau-de-bord')
}

export async function signup(formData: FormData, type: string) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const prenom = formData.get('prenom') as string
  const pays = formData.get('pays') as string

  // Note: the `raw_user_meta_data` is passed to the Postgres trigger `handle_new_user`
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: type,
        prenom: prenom,
        pays: pays,
      },
    },
  })

  if (error) {
    console.error("Signup error:", error)
    return redirect(`/inscription/${type}?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/tableau-de-bord')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/profil`,
  })

  if (error) {
    return redirect('/mot-de-passe-oublie?message=Erreur lors de la réinitialisation')
  }

  redirect('/mot-de-passe-oublie?message=Vérifiez vos emails')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}
