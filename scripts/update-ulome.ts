import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Credentials Supabase manquants.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const formationsULome = [
  // Facultés
  { niveau: "Reconnu par le CAMES", filiere: "Faculté de Droit (FDD)", domaine: "Droit & Sciences Politiques" },
  { niveau: "Reconnu par le CAMES", filiere: "Faculté des Sciences de l'Homme et de la Société (FSHS)", domaine: "Sciences Humaines & Sociales" },
  { niveau: "Reconnu par le CAMES", filiere: "Faculté des Lettres, Langues et Arts (FLLA)", domaine: "Lettres & Langues" },
  { niveau: "Reconnu par le CAMES", filiere: "Faculté des Sciences de la Santé (FSS)", domaine: "Santé & Médecine" },
  { niveau: "Reconnu par le CAMES", filiere: "Faculté des Sciences Exactes et Naturelles (FSEN / ex-FDS)", domaine: "Sciences Fondamentales & Appliquées" },
  { niveau: "Reconnu par le CAMES", filiere: "Faculté des Sciences Économiques et de Gestion (FASEG)", domaine: "Économie & Gestion" },

  // Écoles Supérieures
  { niveau: "Reconnu par le CAMES", filiere: "École Nationale Supérieure d'Ingénieurs (ENSI)", domaine: "Ingénierie & Génie" },
  { niveau: "Reconnu par le CAMES", filiere: "École Supérieure d'Agronomie (ESA)", domaine: "Agronomie & Environnement" },
  { niveau: "Reconnu par le CAMES", filiere: "École Supérieure des Techniques Biologiques et Alimentaires (ESTBA)", domaine: "Biologie & Agroalimentaire" },
  { niveau: "Reconnu par le CAMES", filiere: "École des Assistants Médicaux (EAM)", domaine: "Santé & Soins" },
  { niveau: "Reconnu par le CAMES", filiere: "École Supérieure du Secrétariat de Direction (ESSD)", domaine: "Administration & Secrétariat" },

  // Instituts Universitaires
  { niveau: "Reconnu par le CAMES", filiere: "Institut National des Sciences de l'Éducation (INSE)", domaine: "Éducation & Pédagogie" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut Universitaire de Technologie de Gestion (IUT-Gestion)", domaine: "Gestion & Entreprise" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut National de la Jeunesse et des Sports (INJS)", domaine: "Sport & Animation" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut des Sciences de l'Information, de la Communication et des Arts (ISICA)", domaine: "Journalisme & Communication" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut des Métiers de la Mer (I2M)", domaine: "Logistique Maritime & Portuaire" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut National de Formation Agricole (INFA de Tové)", domaine: "Agriculture & Élevage" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut National de Formation en Travail Social (INFTS)", domaine: "Travail Social & Développement" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut Confucius de l'Université de Lomé (IC-UL)", domaine: "Langues & Cultures Asie" },
  { niveau: "Reconnu par le CAMES", filiere: "Institut Africain des Sciences de la Mission (IASM)", domaine: "Théologie & Mission" },

  // Centres d'Excellence & de Formation
  { niveau: "Reconnu par le CAMES", filiere: "Centre d'Excellence Régional sur les Sciences Aviaires (CERSA)", domaine: "Recherche & Aviculture" },
  { niveau: "Reconnu par le CAMES", filiere: "Centre d'Excellence Régional pour la Maîtrise de l'Électricité (CERME)", domaine: "Électricité & Énergie" },
  { niveau: "Reconnu par le CAMES", filiere: "Centre d'Excellence Régional pour les Villes Durables en Afrique (CERViDA-DOUNEDON)", domaine: "Urbanisme & Développement Durable" },
  { niveau: "Reconnu par le CAMES", filiere: "Centre de Formation et de Recherche en Santé Publique (CFRSP)", domaine: "Santé Publique & Épidémiologie" },
  { niveau: "Reconnu par le CAMES", filiere: "Centre Informatique et de Calcul (CIC)", domaine: "Informatique & Technologies" },
  { niveau: "Reconnu par le CAMES", filiere: "Centre des Énergies Renouvelables (CER)", domaine: "Énergies Propres" }
]

async function run() {
  console.log("🚀 Mise à jour des formations pour l'Université de Lomé...")
  
  const { data: ulome, error: findError } = await supabase
    .from('structures')
    .select('id, nom, slug')
    .ilike('nom', '%université de lomé%')
    .single()

  if (findError || !ulome) {
    console.error("❌ Université de Lomé non trouvée dans la BDD:", findError)
    return
  }

  console.log(`✅ Trouvé : ${ulome.nom} (ID: ${ulome.id})`)

  const { error: updateError } = await supabase
    .from('structures')
    .update({
      formations_proposees: formationsULome
    })
    .eq('id', ulome.id)

  if (updateError) {
    console.error("❌ Erreur lors de la mise à jour:", updateError)
  } else {
    console.log(`✨ ${formationsULome.length} Facultés, Écoles, Instituts et Centres ont été ajoutés avec succès à l'Université de Lomé !`)
  }
}

run()
