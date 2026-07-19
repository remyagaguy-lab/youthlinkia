'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function moderateStructure(formData: FormData) {
  const supabase = await createClient()
  
  // Verify admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const structureId = formData.get('id') as string
  const action = formData.get('action') as string // 'valider' | 'rejeter'
  const motif = formData.get('motif') as string
  const partenaireId = formData.get('partenaire_id') as string

  if (!structureId || !action) return

  const nouveauStatut = action === 'valider' ? 'publiee' : 'rejetee'

  // Update structure
  const { error } = await supabase
    .from('structures')
    .update({ statut: nouveauStatut })
    .eq('id', structureId)

  if (error) {
    console.error('Erreur moderation:', error)
    return
  }

  // If validated, maybe we need to validate the partner profile as well
  if (action === 'valider' && partenaireId) {
    await supabase
      .from('profiles')
      .update({ statut_validation: 'valide' })
      .eq('id', partenaireId)
  }

  // Send email if rejected
  if (action === 'rejeter' && process.env.RESEND_API_KEY) {
    // Get partner email
    const { data: profileData } = await supabase.auth.admin.getUserById(partenaireId)
    const email = profileData?.user?.email

    if (email) {
      try {
        await resend.emails.send({
          // Pour les tests sans nom de domaine, Resend exige d'utiliser cette adresse d'envoi exacte :
          from: 'Acme <onboarding@resend.dev>',
          to: email,
          subject: 'Votre fiche structure a été rejetée',
          html: `
            <p>Bonjour,</p>
            <p>Votre fiche structure a été examinée par notre équipe et ne peut être publiée en l'état pour la raison suivante :</p>
            <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
              ${motif || 'Non respect de la charte YouthLinkIA.'}
            </blockquote>
            <p>Merci de vous connecter à votre espace partenaire pour corriger ces informations.</p>
            <p>L'équipe YouthLinkIA.</p>
          `
        })
      } catch (e) {
        console.error("Erreur lors de l'envoi de l'email Resend :", e)
      }
    }
  }

  revalidatePath('/admin/moderation-partenaires')
  revalidatePath('/annuaire')
}
