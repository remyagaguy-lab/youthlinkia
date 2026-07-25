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
Tu es un expert web scraper et chercheur spécialisé dans l'enseignement supérieur au Togo.
Ta mission est de faire une RECHERCHE EXHAUSTIVE et APPROFONDIE sur l'établissement suivant situé au Togo :
Nom : ${nom}
Type : ${type}

Prends le temps d'analyser toutes les sources possibles (site officiel, pages Wikipedia, pages Facebook, LinkedIn, articles, annuaires...). Je veux des données RICHES et COMPLÈTES. Ne te contente pas d'un résumé superficiel.

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour (pas de markdown \`\`\`json).
Voici la structure exacte du JSON attendu :
{
  "description_detaillee": "Un texte complet et très riche en Markdown (4-5 paragraphes) présentant l'établissement, son histoire, ses infrastructures, sa vision, ses partenariats et pourquoi le choisir. Sois très détaillé.",
  "formations_proposees": [
    {
      "niveau": "Licence / Master / BTS / Certificat",
      "domaine": "Ex: Informatique, Gestion, Santé...",
      "filiere": "Nom exact de la filière",
      "description": "Description détaillée de cette formation, des débouchés, et de son contenu (2-3 phrases minimum)."
    }
  ],
  "conditions_admission": "Un texte (en Markdown) détaillant très précisément les modalités d'admission (bac requis, séries acceptées, concours, étude de dossier, dates de rentrée...).",
  "frais_scolarite": "Une indication textuelle précise des frais de scolarité (ex: 'Licence: 450 000 FCFA/an. Master: 600 000 FCFA/an' ou 'Non communiqué').",
  "chiffres_cles": {
    "etudiants": "ex: +5000",
    "enseignants": "ex: +200",
    "taux_insertion": "ex: 85%",
    "reseaux_sociaux": {
      "facebook": "Lien ou nom de page",
      "linkedin": "Lien ou nom de page",
      "twitter": "Lien ou nom de page"
    }
  },
  "site_web_officiel": "URL du site officiel ou de la page Facebook (si connu, sinon null)",
  "contact_email": "Email officiel de contact (si connu, sinon null)",
  "contact_telephone": "Numéros de téléphone (si connu, sinon null)",
  "logo_url": "Une URL valide vers le logo de l'établissement (ex: Wikimedia Commons, Facebook, site officiel). IMPORTANT: Cherche bien le logo officiel. Fournis un lien direct vers l'image (.png, .jpg ou .svg). Si vraiment introuvable, mets null.",
  "couverture_url": "Une URL d'image générique de haute qualité (Unsplash) représentant un campus ou des étudiants africains.",
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
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText} - ${errorText}`)
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

  // Get all structures to enrich them thoroughly
  const { data: structures, error } = await supabase
    .from('structures')
    .select('id, nom, type')

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
      // The AI generates reseaux_sociaux inside chiffres_cles, which is perfect since
      // chiffres_cles is a JSONB column in the database.
      // So we can just save generatedData directly without modifications!
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
