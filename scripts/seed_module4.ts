import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log("Seeding Module 4 data...")

  // 1. Get the first user (usually the one logged in) to make them a lyceen_etudiant
  const { data: users, error: usersErr } = await supabase.auth.admin.listUsers()
  if (usersErr) throw usersErr
  
  if (users.users.length > 0) {
    const userId = users.users[0].id
    await supabase.from('profiles').update({
      role: 'lyceen_etudiant',
      niveau_etudes: 'licence',
      centres_interet: ['Tech', 'Agriculture']
    }).eq('id', userId)
    console.log(`Updated user ${users.users[0].email} to lyceen_etudiant (licence)`)
  }

  // 2. Insert a test 'filiere' article
  const { data: article } = await supabase.from('articles').upsert({
    titre: 'Devenir Développeur Full-Stack',
    slug: 'devenir-developpeur-full-stack',
    chapo: 'La filière du développement web est en pleine explosion en Afrique. Découvrez comment vous former et décrocher votre premier emploi.',
    corps: '<h2>Pourquoi choisir cette filière ?</h2><p>Le marché manque cruellement de talents techniques...</p>',
    categorie: 'filieres',
    statut: 'publie',
    published_at: new Date().toISOString()
  }, { onConflict: 'slug' }).select()
  console.log('Inserted filière article:', article?.[0]?.titre)

  // 3. Insert a test opportunity for orientation_scolaire matching 'licence'
  const { data: opp } = await supabase.from('opportunites').upsert({
    slug: 'bourse-master-informatique-france',
    titre: 'Bourse de Master en Informatique - Campus France',
    description: 'Une bourse d\'excellence pour les étudiants africains souhaitant poursuivre un Master en Informatique en France.',
    type: 'bourse',
    statut_moderation: 'publie',
    tags: ['orientation_scolaire', 'tech', 'informatique'],
    niveau_requis: 'licence',
    pays_eligibles_residence: ['Togo', 'Sénégal', 'Côte d\'Ivoire']
  }, { onConflict: 'slug' }).select()
  console.log('Inserted opportunity:', opp?.[0]?.titre)

  console.log("Seeding complete.")
}

seed().catch(console.error)
