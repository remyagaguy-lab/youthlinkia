import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Erreur: Variables d'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requises.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const sources = [
  { nom: "GreatYop", url: "https://greatyop.com/", score_confiance: 0.8 },
  { nom: "Afri-Carrières", url: "https://afri-carrieres.com/", score_confiance: 0.8 },
  { nom: "Mina7 / Mina7Portal", url: "https://mina7portal.com/", score_confiance: 0.8 },
  { nom: "Opportunities For Africans (OFA)", url: "https://www.opportunitiesforafricans.com/", score_confiance: 0.8 },
  { nom: "World Scholarship Forum", url: "https://worldscholarshipforum.com/", score_confiance: 0.7 },
  { nom: "Scholarship Positions", url: "https://scholarship-positions.com/", score_confiance: 0.7 },
  { nom: "YouthOP (Youth Opportunities)", url: "https://www.youthop.com/scholarships", score_confiance: 0.8 },
  { nom: "Scholars4Dev", url: "https://www.scholars4dev.com/", score_confiance: 0.8 },
  { nom: "ScholarshipTab", url: "https://www.scholarshiptab.com/", score_confiance: 0.7 },
  { nom: "WeMakeScholars", url: "https://www.wemakescholars.com/", score_confiance: 0.7 },
  { nom: "Advance Africa", url: "https://www.advance-africa.com/", score_confiance: 0.7 },
  { nom: "Bourse France Excellence Eiffel", url: "https://www.campusfrance.org/fr/la-bourse-france-excellence-eiffel", score_confiance: 0.95 },
  { nom: "Campus France", url: "https://www.campusfrance.org/", score_confiance: 0.95 },
  { nom: "Chevening Scholarships", url: "https://www.chevening.org/", score_confiance: 0.95 },
  { nom: "DAAD - Base de données des bourses", url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/", score_confiance: 0.95 },
  { nom: "Fulbright Foreign Student Program", url: "https://foreign.fulbrightonline.org/", score_confiance: 0.95 },
  { nom: "MEXT Scholarships (Japon)", url: "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/", score_confiance: 0.95 },
  { nom: "Türkiye Bursları", url: "https://www.turkiyeburslari.gov.tr/", score_confiance: 0.95 },
  { nom: "China Scholarship Council (CSC)", url: "https://www.campuschina.org/", score_confiance: 0.95 },
  { nom: "Commonwealth Scholarship Commission (UK)", url: "https://cscuk.fcdo.gov.uk/", score_confiance: 0.95 },
  { nom: "Bourses d'excellence de la Confédération suisse (ESKAS)", url: "https://www.sbfi.admin.ch/fr/bourses-dexcellence-de-la-confederation-suisse", score_confiance: 0.95 },
  { nom: "Mastercard Foundation Scholars Program", url: "https://mastercardfdn.org/all/scholars/", score_confiance: 0.9 },
  { nom: "World Bank Scholarships Program", url: "https://www.worldbank.org/en/programs/scholarships", score_confiance: 0.95 },
  { nom: "Banque Africaine de Développement (BAD/AfDB)", url: "https://www.afdb.org/", score_confiance: 0.9 },
  { nom: "AUF - Agence Universitaire de la Francophonie", url: "https://www.auf.org/nos-actions/bourse/", score_confiance: 0.9 },
  { nom: "UEMOA - Bourses d'Excellence", url: "https://www.uemoa.int/bourse-excellence-uemoa", score_confiance: 0.95 },
  { nom: "UNESCO Fellowships", url: "https://www.unesco.org/fr/fellowships", score_confiance: 0.9 },
  { nom: "Erasmus Mundus Joint Masters", url: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters-scholarships", score_confiance: 0.95 },
  { nom: "Togo - Direction des Bourses et Stages (DBS)", url: "https://dbs.tg/", score_confiance: 0.95 },
  { nom: "Sénégal - Direction des Bourses", url: "https://www.directiondesbourses.sn/", score_confiance: 0.9 },
  { nom: "Côte d'Ivoire - Direction de l'Orientation et des Bourses (DOB)", url: "http://www.bourses.enseignement.gouv.ci/", score_confiance: 0.9 },
  { nom: "Côte d'Ivoire - Bourses de Coopération Internationale", url: "https://bourses.diplomatie.gouv.ci/", score_confiance: 0.9 },
  { nom: "Bénin - Direction des Bourses et Aides Universitaires (DBAU)", url: "https://bourses.enseignementsuperieur.gouv.bj/", score_confiance: 0.9 },
  { nom: "Cameroun - MINESUP", url: "https://www.minesup.gov.cm/", score_confiance: 0.9 },
  { nom: "Burkina Faso - CIOSPB", url: "https://www.ciospb.gov.bf/", score_confiance: 0.9 },
  { nom: "Mali - DGESRS", url: "https://dg-enseignementsup.ml/", score_confiance: 0.9 }
]

async function seedSources() {
  console.log(`Insertion de ${sources.length} sources de veille dans Supabase...`)
  let count = 0

  for (const src of sources) {
    const { data: existing } = await supabase
      .from('sources_veille')
      .select('id')
      .eq('url', src.url)
      .single()

    if (existing) {
      console.log(`ℹ️ Déjà présent : ${src.nom}`)
      continue
    }

    const { error } = await supabase
      .from('sources_veille')
      .insert(src)

    if (error) {
      console.error(`❌ Erreur sur ${src.nom}:`, error.message)
    } else {
      count++
      console.log(`✅ Ajouté avec succès : ${src.nom}`)
    }
  }

  console.log(`🎉 Terminé ! ${count} nouvelles sources insérées.`)
}

seedSources()
