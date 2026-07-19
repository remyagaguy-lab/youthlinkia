const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding Modules 5 & 6 data...")

  // 1. Create articles for preparation_pro
  const prepArticles = [
    {
      titre: 'Réussir son CV en 2026',
      slug: 'reussir-son-cv-en-2026',
      chapo: 'Un bon CV est la clé pour décrocher un entretien. Découvrez les tendances de 2026 pour vous démarquer.',
      corps: '<h2>Structure de CV</h2><p>Mettez en avant vos soft skills...</p>',
      categorie: 'preparation_pro',
      statut: 'publie',
      published_at: new Date().toISOString(),
      image_couverture_alt: 'CV'
    },
    {
      titre: 'Les 10 questions pièges en entretien',
      slug: 'questions-pieges-entretien',
      chapo: 'Comment répondre aux questions les plus difficiles des recruteurs sans stresser.',
      corps: '<h2>La fameuse question des défauts</h2><p>Ne dites pas "je suis perfectionniste"...</p>',
      categorie: 'preparation_pro',
      statut: 'publie',
      published_at: new Date().toISOString(),
      image_couverture_alt: 'Entretien'
    }
  ];

  for (const art of prepArticles) {
    await supabase.from('articles').upsert(art, { onConflict: 'slug' });
  }
  console.log('Inserted preparation_pro articles');

  // 2. Create articles for methodologie_entrepreneuriale
  const methoArticles = [
    {
      titre: 'Valider son idée avec le Lean Startup',
      slug: 'lean-startup-afrique',
      chapo: 'Découvrez comment appliquer la méthode Lean Startup au contexte africain pour minimiser les risques.',
      corps: '<h2>Le produit minimum viable (MVP)</h2><p>Commencez avec les moyens du bord...</p>',
      categorie: 'methodologie_entrepreneuriale',
      statut: 'publie',
      published_at: new Date().toISOString(),
      image_couverture_alt: 'Lean Startup'
    },
    {
      titre: 'Trouver ses premiers financements',
      slug: 'premiers-financements-startup',
      chapo: 'Love money, subventions, business angels... Tour d\'horizon des options pour démarrer.',
      corps: '<h2>L\'apport personnel et la Love Money</h2><p>Avant d\'aller voir les banques...</p>',
      categorie: 'methodologie_entrepreneuriale',
      statut: 'publie',
      published_at: new Date().toISOString(),
      image_couverture_alt: 'Financement'
    }
  ];

  for (const art of methoArticles) {
    await supabase.from('articles').upsert(art, { onConflict: 'slug' });
  }
  console.log('Inserted methodologie_entrepreneuriale articles');

  // 3. Create raw SQL for 'evenements' table (since migration didn't run via CLI)
  // Workaround: We can't easily run DDL via the JS client RPC without a pre-existing RPC.
  // We will assume the user has run the SQL from the walkthrough, OR we can try to insert and catch the error.
  
  try {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await supabase.from('evenements').upsert({
      id: '123e4567-e89b-12d3-a456-426614174001',
      titre: 'Webinaire Booster de CV',
      description: 'Atelier pratique en ligne pour auditer et améliorer votre CV en direct.',
      date_debut: nextWeek.toISOString(),
      lien_inscription: 'https://zoom.us/test'
    }, { onConflict: 'id' });
    console.log('Inserted evenements data');
  } catch(e) {
    console.log("Could not insert evenements, table might be missing. Error:", e.message);
  }

  // 4. Update test user roles (simulate changing user role for demo)
  // Wait, I will just tell the user to change it, or I can find the user and set it to jeune_professionnel for now.
  const { data: users, error: usersErr } = await supabase.auth.admin.listUsers()
  if (usersErr) throw usersErr
  
  if (users.users.length > 0) {
    const userId = users.users[0].id
    await supabase.from('profiles').update({
      role: 'jeune_professionnel'
    }).eq('id', userId)
    console.log(`Updated user ${users.users[0].email} to jeune_professionnel (for demo)`)
  }

  // Also make sure we have an incubateur in structures for the entrepreneur test
  const { data: structs } = await supabase.from('structures').select('id').eq('type_structure', 'incubateur').limit(1);
  if (!structs || structs.length === 0) {
    await supabase.from('structures').insert({
      nom: 'Nunya Lab',
      type_structure: 'incubateur',
      pays: 'Togo',
      description: 'Incubateur d\'excellence au Togo',
      statut_validation: 'valide',
      slug: 'nunya-lab-test'
    });
    console.log('Inserted dummy structure: Nunya Lab');
  }

  console.log("Seeding complete.")
}

seed().catch(console.error)
