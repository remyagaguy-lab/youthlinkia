import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

// These must be set when running the script
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Erreur: Les variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  const csvFilePath = path.join(__dirname, 'data.csv')
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`Erreur: Le fichier ${csvFilePath} est introuvable. Veuillez le créer.`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')
  
  // Format attendu: nom,mission,type,secteurs,pays_intervention,lien,contact
  // secteurs et pays séparés par des ;
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })

  console.log(`Début de l'import de ${records.length} structures...`)

  for (const record of records) {
    const slug = record.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    const payload = {
      nom: record.nom,
      slug: slug,
      mission: record.mission,
      type: record.type,
      secteurs: record.secteurs ? record.secteurs.split(';').map((s: string) => s.trim()) : [],
      pays_intervention: record.pays_intervention ? record.pays_intervention.split(';').map((s: string) => s.trim()) : [],
      lien: record.lien,
      contact: record.contact,
      statut: 'publiee'
    }

    const { error } = await supabase.from('structures').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`Erreur sur l'import de ${record.nom}:`, error.message)
    } else {
      console.log(`✅ Succès: ${record.nom}`)
    }
  }

  console.log("Import terminé !")
}

seed()
