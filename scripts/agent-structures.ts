import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openRouterKey = process.env.OPENROUTER_API_KEY

if (!supabaseUrl || !supabaseServiceKey || !openRouterKey) {
  console.error('Missing environment variables. Please check .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function generateStructureData(nom: string, type: string) {
  console.log(`\n🤖 Agent IA en cours de recherche pour : ${nom} (${type})...`)
  
  const prompt = `
Tu es un expert de l'enseignement supérieur au Togo.
Je veux que tu me fournisses des informations détaillées et réelles (ou très fidèles à la réalité) sur l'établissement suivant situé au Togo :
Nom : ${nom}
Type : ${type}

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour (pas de markdown \`\`\`json).
Voici la structure exacte du JSON attendu :
{
  "description_detaillee": "Un texte complet en Markdown (3-4 paragraphes) présentant l'établissement, son histoire, sa vision et pourquoi le choisir.",
  "formations_proposees": [
    {
      "niveau": "Licence / Master / BTS",
      "domaine": "Ex: Informatique, Gestion...",
      "filiere": "Nom exact de la filière",
      "description": "Courte description de cette formation (1 phrase)"
    }
  ],
  "conditions_admission": "Un texte (peut inclure du Markdown) expliquant les modalités d'admission (bac requis, concours, étude de dossier...).",
  "frais_scolarite": "Une indication textuelle des frais de scolarité (ex: 'Entre 300 000 FCFA et 500 000 FCFA par an' ou 'Non communiqué').",
  "chiffres_cles": {
    "etudiants": "ex: +5000",
    "enseignants": "ex: +200",
    "taux_insertion": "ex: 85%"
  },
  "site_web_officiel": "URL du site (si connu, sinon null)",
  "contact_email": "Email (si connu, sinon null)",
  "contact_telephone": "Téléphone (si connu, sinon null)",
  "couverture_url": "Une URL d'image générique de haute qualité (Unsplash) représentant un campus ou des étudiants africains. ex: https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "galerie_images": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
}
Assure-toi que le JSON est valide.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-pro', // Fast, good context window, cheap
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    
    // Clean up potential markdown formatting in the response
    const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error(`❌ Erreur lors de la génération pour ${nom}:`, error)
    return null
  }
}

async function run() {
  console.log('🚀 Démarrage de l\'Agent de Collecte YouthLinkIA...')

  // Get all structures that haven't been processed yet
  const { data: structures, error } = await supabase
    .from('structures')
    .select('id, nom, type')
    .is('description_detaillee', null) // Only process ones that don't have details
    .limit(3) // Process in small batches for safety during testing

  if (error) {
    console.error('❌ Erreur de récupération des structures:', error)
    return
  }

  if (!structures || structures.length === 0) {
    console.log('✅ Toutes les structures sont à jour !')
    return
  }

  console.log(`📋 ${structures.length} établissements trouvés pour la mise à jour (Batch de test).`)

  for (const structure of structures) {
    const generatedData = await generateStructureData(structure.nom, structure.type)
    
    if (generatedData) {
      const { error: updateError } = await supabase
        .from('structures')
        .update(generatedData)
        .eq('id', structure.id)

      if (updateError) {
        console.error(`❌ Erreur lors de la mise à jour de ${structure.nom}:`, updateError)
      } else {
        console.log(`✅ [SUCCÈS] Données mises à jour pour: ${structure.nom}`)
      }
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log('🏁 Batch terminé.')
}

run()
