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
  // ==========================================
  // 1. FACULTÉS
  // ==========================================
  {
    slug: "fdd",
    category: "Faculté",
    filiere: "Faculté de Droit (FDD)",
    domaine: "Droit & Sciences Politiques",
    description: "La Faculté de Droit (FDD) de l'Université de Lomé est l'institution de référence pour la formation juridique et politique au Togo. Elle forme des juristes de haut niveau en droit public, droit privé et sciences politiques, capables de relever les défis juridiques des administrations, du barreau et du monde des affaires.",
    licence: [
      "Licence Fondamentale en Droit Privé (Option Droit des Affaires / Carrières Judiciaires)",
      "Licence Fondamentale en Droit Public et Science Administrative",
      "Licence en Sciences Politiques et Relations Internationales",
      "Licence Professionnelle en Droit Foncier et Notarial"
    ],
    master: [
      "Master Professionnel en Droit des Affaires et Fiscalité des Entreprises",
      "Master Recherche en Droit Public Fondamental et Institutions Constitutionnelles",
      "Master en Droits de l'Homme, Droit Humanitaire et Justice Internationale",
      "Master Professionnel en Droit Maritime, Portuaire et Logistique du Commerce International",
      "Master en Marchés Publics et Partenariats Public-Privé (PPP)"
    ],
    doctorat: [
      "Doctorat en Droit Privé et Sciences Criminelles (École Doctorale des Sciences Juridiques et Politiques)",
      "Doctorat en Droit Public et Droit International",
      "Doctorat en Sciences Politiques et Gouvernance"
    ],
    admission: "Baccalauréat toutes séries (A4, C, D, G1, G2 recommandés). Sélection sur dossier scolaire ou concours selon la capacité d'accueil. Maîtrise rigoureuse de la langue française exigée.",
    debouches: [
      "Magistrature (Avocats, Juges, Procureurs, Greffiers)",
      "Offices notariaux, Huissiers de justice et Commissaires-priseurs",
      "Juristes d'entreprise, fiscalistes et cadres de banques/assurances",
      "Fonction publique, administration centrale et diplomatie (CEDEAO, UEMOA, ONU)",
      "Enseignement universitaire et recherche juridique"
    ]
  },
  {
    slug: "fshs",
    category: "Faculté",
    filiere: "Faculté des Sciences de l'Homme et de la Société (FSHS)",
    domaine: "Sciences Humaines & Sociales",
    description: "La FSHS se consacre à l'étude des dynamiques sociales, historiques, géographiques et philosophiques. Elle prépare à la compréhension critique des sociétés africaines contemporaines et forme des analystes, enseignants, urbanistes et acteurs du développement.",
    licence: [
      "Licence en Sociologie et Anthropologie du Développement",
      "Licence en Géographie (Aménagement du Territoire et Gestion de l'Environnement)",
      "Licence en Histoire et Archéologie",
      "Licence en Philosophie et Éthique",
      "Licence en Psychologie Appliquée et Sciences du Comportement"
    ],
    master: [
      "Master en Aménagement Urbain, Régional et Villes Durables",
      "Master en Sociologie des Organisations et Gestion des Ressources Humaines",
      "Master Recherche en Histoire Africaine et Relations Interculturelles",
      "Master en Psychologie Clinique et Psychologie du Travail",
      "Master en Gestion des Risques de Catastrophes et Changements Climatiques"
    ],
    doctorat: [
      "Doctorat en Sociologie et Anthropologie",
      "Doctorat en Géographie et Aménagement de l'Espace",
      "Doctorat en Histoire et Patrimoine Culturel",
      "Doctorat en Philosophie et Sciences des Religions"
    ],
    admission: "Baccalauréat séries A, C, D ou équivalent. Sélection sur étude de dossier.",
    debouches: [
      "Aménageurs du territoire, urbanistes et experts environnementaux",
      "Consultants en développement social et ONG internationales",
      "Responsables RH et analystes du comportement en entreprise",
      "Professeurs de l'enseignement secondaire et supérieur",
      "Chargés de recherche et conservateurs du patrimoine"
    ]
  },
  {
    slug: "flla",
    category: "Faculté",
    filiere: "Faculté des Lettres, Langues et Arts (FLLA)",
    domaine: "Lettres & Langues",
    description: "Pôle d'excellence en expression littéraire, linguistique et artistique, la FLLA forme des spécialistes du langage, de la traduction, de la communication interculturelle et des arts plastiques et dramatiques.",
    licence: [
      "Licence en Lettres Modernes (Littérature et Linguistique)",
      "Licence en Études Anglaises et Nord-Américaines",
      "Licence en Études Germaniques (Allemand) et Hispaniques (Espagnol)",
      "Licence en Linguistique Africaine et Traduction",
      "Licence en Arts du Spectacle et Communication Visuelle"
    ],
    master: [
      "Master en Littératures Africaines et Comparées",
      "Master Professionnel en Traduction et Interprétation de Conférence",
      "Master en Didactique des Langues et Ingénierie Pédagogique",
      "Master en Industries Créatives, Management des Arts et du Culturel"
    ],
    doctorat: [
      "Doctorat en Sciences du Langage et Linguistique",
      "Doctorat en Littératures et Civilisations",
      "Doctorat en Arts et Études Culturelles"
    ],
    admission: "Baccalauréat série A, C ou D. Bon dossier en langues vivantes.",
    debouches: [
      "Traducteurs et interprètes internationaux",
      "Éditeurs, critiques littéraires et journalistes culturels",
      "Attachés culturels en ambassades et diplomatie",
      "Enseignants-chercheurs et formateurs en langues",
      "Directeurs artistiques et gestionnaires d'institutions culturelles"
    ]
  },
  {
    slug: "fss",
    category: "Faculté",
    filiere: "Faculté des Sciences de la Santé (FSS)",
    domaine: "Santé & Médecine",
    description: "Institution médicale faîtière du Togo, la FSS forme des médecins, pharmaciens, chirurgiens-dentistes et spécialistes biomédicaux d'élite. En étroite collaboration avec le CHU Sylvanus Olympio, elle conjugue excellence clinique et recherche médicale fondamentale.",
    licence: [
      "Licence en Sciences Biomédicales et Analyses de Laboratoire",
      "Diplôme d'Études Fondamentales de Médecine (1er Cycle Médecine)",
      "Diplôme d'Études Fondamentales en Pharmacie",
      "Licence en Odonto-Stomatologie"
    ],
    master: [
      "Diplôme d'État de Docteur en Médecine Générale (2nd et 3ème Cycle Médical - 7 ans)",
      "Diplôme d'État de Docteur en Pharmacie",
      "Master Professionnel en Biologie Médicale et Pathologie Humaine",
      "Master en Santé Publique, Épidémiologie et Gestion des Services de Santé"
    ],
    doctorat: [
      "Certificats d'Études Spécialisées (CES) / Internat : Chirurgie, Pédiatrie, Gynécologie, Cardiologie, etc.",
      "Doctorat de Recherche (Ph.D) en Sciences Biomédicales et Pharmacologie",
      "Doctorat de 3ème cycle en Épidémiologie et Maladies Tropicales"
    ],
    admission: "Baccalauréat séries C ou D avec mentions (très bon niveau en sciences de la vie et physique-chimie). Concours sélectif à l'entrée.",
    debouches: [
      "Médecins généralistes et chirurgiens spécialistes en centres hospitaliers",
      "Pharmaciens d'officine, industriels et biologistes des hôpitaux",
      "Chirurgiens-dentistes et stomatologues",
      "Chercheurs en virologie, parasitologie et pharmacopée africaine",
      "Experts en santé publique et consultants OMS / UNICEF"
    ]
  },
  {
    slug: "fsen",
    category: "Faculté",
    filiere: "Faculté des Sciences Exactes et Naturelles (FSEN / ex-FDS)",
    domaine: "Sciences Fondamentales & Appliquées",
    description: "La FSEN constitue le cœur de l'enseignement scientifique et technologique à l'Université de Lomé. Elle forme des scientifiques hautement qualifiés en mathématiques, physique, chimie, biosciences et géologie.",
    licence: [
      "Licence en Mathématiques et Applications",
      "Licence en Physique Fondamentale et Physique Appliquée",
      "Licence en Chimie et Analyse Instrumentale",
      "Licence en Sciences de la Vie (Biologie et Physiologie)",
      "Licence en Sciences de la Terre et Géologie Minière"
    ],
    master: [
      "Master en Modélisation Mathématique et Calcul Scientifique",
      "Master en Énergies Renouvelables et Physique des Matériaux",
      "Master en Chimie Organique, Minérale et de l'Environnement",
      "Master en Biotechnologies, Microbiologie et Valorisation des Ressources Biologiques",
      "Master en Hydrogéologie et Gestion des Ressources Minières"
    ],
    doctorat: [
      "Doctorat en Mathématiques Pures et Appliquées",
      "Doctorat en Physique de l'Atmosphère et Matériaux",
      "Doctorat en Sciences Chimiques et Biologiques",
      "Doctorat en Géologie et Sciences de la Terre"
    ],
    admission: "Baccalauréat séries C, D ou E. Sélection sur dossier avec un bon niveau dans les disciplines scientifiques.",
    debouches: [
      "Chercheurs et ingénieurs de recherche en laboratoires industriels",
      "Experts en contrôle qualité, chimie environnementale et agrochimie",
      "Géologue d'exploration minière et hydrogéologue",
      "Modélisateurs statistiques et analystes scientifiques",
      "Enseignants de chaire dans le supérieur et les lycées scientifiques"
    ]
  },
  {
    slug: "faseg",
    category: "Faculté",
    filiere: "Faculté des Sciences Économiques et de Gestion (FASEG)",
    domaine: "Économie & Gestion",
    description: "La FASEG est un pôle incontournable en Afrique de l'Ouest pour la formation en finance, économie du développement, audit, marketing et management stratégique. Elle forme les décideurs économiques et gestionnaires d'organisations de demain.",
    licence: [
      "Licence en Économie et Gestion (Tronc commun L1/L2 puis spécialisation)",
      "Licence en Analyse Économique et Politique de Développement",
      "Licence en Comptabilité, Contrôle et Audit (CCA)",
      "Licence en Gestion des Ressources Humaines et Organisation",
      "Licence en Marketing, Communication et Vente"
    ],
    master: [
      "Master Professionnel en Banque, Finance et Gestion des Risques",
      "Master en Audit et Contrôle de Gestion",
      "Master en Économie Quantitative et Modélisation Macroéconomique",
      "Master en Management Stratégique et Entrepreneuriat",
      "Master en Économie Agricole et Sécurité Alimentaire"
    ],
    doctorat: [
      "Doctorat en Économie du Développement et Économétrie",
      "Doctorat en Sciences de Gestion (Comptabilité, Finance, Marketing, Stratégie)",
      "Doctorat en Économie Internationale et Politique Monétaire"
    ],
    admission: "Baccalauréat séries G2, G3, C, D ou A4 (avec bon niveau en mathématiques). Sélection sur dossier.",
    debouches: [
      "Auditeurs financiers et commissaires aux comptes",
      "Directeurs financiers, analystes de crédit et banquiers d'affaires",
      "Macroéconomistes et conseillers économiques en ministères / banques centrales",
      "Chefs de produits et directeurs marketing",
      "Consultants en stratégie et organisation d'entreprises"
    ]
  },

  // ==========================================
  // 2. ÉCOLES SUPÉRIEURES
  // ==========================================
  {
    slug: "ensi",
    category: "École Supérieure",
    filiere: "École Nationale Supérieure d'Ingénieurs (ENSI)",
    domaine: "Ingénierie & Génie",
    description: "L'ENSI est l'école d'ingénieurs d'élite du Togo. Elle forme des ingénieurs de conception et des cadres techniques de haut niveau en génie civil, génie électrique, génie mécanique et informatique industrielle.",
    licence: [
      "Licence en Génie Civil (Bâtiments et Travaux Publics)",
      "Licence en Génie Électrique et Électrotechnique",
      "Licence en Génie Mécanique et Énergétique",
      "Licence Professionnelle en Télécommunications et Réseaux"
    ],
    master: [
      "Diplôme d'Ingénieur de Conception en Génie Civil (BTP, Ouvrages d'Art et Hydraulique)",
      "Diplôme d'Ingénieur de Conception en Génie Électrique et Automatismes Industriels",
      "Diplôme d'Ingénieur de Conception en Génie Mécanique et Maintenance Industrielle",
      "Master Spécialisé en Efficacité Énergétique et Énergies Renouvelables"
    ],
    doctorat: [
      "Doctorat en Sciences de l'Ingénieur (Mécanique des Structures, Énergétique)",
      "Doctorat en Génie Électrique, Automatique et Informatique Industrielle",
      "Doctorat en Matériaux de Construction et Géotechnique"
    ],
    admission: "Baccalauréat séries C, D, E, F1, F2, F3, F4 ou Ti. Concours d'entrée très sélectif en 1ère année ou admission sur titre en cycle ingénieur.",
    debouches: [
      "Ingénieurs de grands projets BTP, ponts et chaussées",
      "Directeurs techniques et responsables de maintenance industrielle",
      "Ingénieurs en réseaux électriques et énergies renouvelables",
      "Chefs de projets technologiques et bureaux d'études",
      "Experts consultants en génie industriel et télécoms"
    ]
  },
  {
    slug: "esa",
    category: "École Supérieure",
    filiere: "École Supérieure d'Agronomie (ESA)",
    domaine: "Agronomie & Environnement",
    description: "L'ESA est dédiée à la transformation de l'agriculture et de l'agro-industrie en Afrique. Elle forme des agronomes, zootechniciens et forestiers capables de concilier productivité agricole, innovation durable et sécurité alimentaire.",
    licence: [
      "Licence Professionnelle en Sciences Agronomiques",
      "Licence en Production Végétale et Amélioration des Plantes",
      "Licence en Production Animale et Élevage Durable",
      "Licence en Sciences du Sol et Foresterie"
    ],
    master: [
      "Diplôme d'Ingénieur Agronome (Spécialités : Agroéconomie, Phytotechnie, Zootechnie)",
      "Master en Technologies Agroalimentaires et Innovation",
      "Master en Gestion Durable des Terres et Changements Climatiques",
      "Master en Protection des Végétaux et Phytopathologie"
    ],
    doctorat: [
      "Doctorat en Sciences Agronomiques et Ingénierie Biologique",
      "Doctorat en Agroéconomie et Gestion des Systèmes Ruraux",
      "Doctorat en Sciences Forestières et Biodiversité"
    ],
    admission: "Baccalauréat séries C, D ou E ou diplôme agricole équivalent. Concours d'entrée ou étude de dossier.",
    debouches: [
      "Ingénieurs agronomes en grandes exploitations et coopératives agricoles",
      "Directeurs d'unités de transformation agroalimentaire",
      "Experts en sécurité alimentaire pour la FAO, le PAM ou le FIDA",
      "Inspecteurs qualité phytosanitaire et vétérinaire",
      "Chercheurs en génétique végétale et agroécologie"
    ]
  },
  {
    slug: "estba",
    category: "École Supérieure",
    filiere: "École Supérieure des Techniques Biologiques et Alimentaires (ESTBA)",
    domaine: "Biologie & Agroalimentaire",
    description: "L'ESTBA forme des techniciens supérieurs et ingénieurs technologues dans les domaines des analyses de biologie médicale, du contrôle qualité alimentaire, de l'assainissement et des bio-industries.",
    licence: [
      "Licence Professionnelle en Analyses Biomédicales",
      "Licence en Contrôle de Qualité et Sécurité Sanitaire des Aliments",
      "Licence en Génie Biologique et Technologies Appliquées",
      "Licence en Gestion de l'Eau et Assainissement Environnemental"
    ],
    master: [
      "Master Professionnel en Assurance Qualité et Bio-Industries",
      "Master en Microbiologie Industrielle et Sécurité des Aliments",
      "Master en Technologies de Traitement des Eaux et Écotoxicologie"
    ],
    doctorat: [
      "Doctorat de Recherche en Sciences Biologiques Appliquées",
      "Thèse en Technologies Alimentaires et Assurance Qualité"
    ],
    admission: "Baccalauréat séries C, D ou F7. Concours d'entrée sélectif.",
    debouches: [
      "Responsables qualité en industries agroalimentaires (brasseries, laiteries, minoteries)",
      "Chefs de laboratoires d'analyses biomédicales et d'hygiène publique",
      "Inspecteurs de la sécurité sanitaire des aliments",
      "Ingénieurs d'assainissement et gestionnaires d'usines de traitement d'eau",
      "Consultants en normes ISO (9001, 22000) et audit qualité"
    ]
  },
  {
    slug: "eam",
    category: "École Supérieure",
    filiere: "École des Assistants Médicaux (EAM)",
    domaine: "Santé & Soins",
    description: "L'EAM forme la colonne vertébrale des professionnels paramédicaux et des assistants médicaux au Togo. Elle délivre une formation pratique et clinique de pointe en radiologie, kinésithérapie, soins obstétricaux et ophtalmologie.",
    licence: [
      "Licence d'Assistant Médical en Radiologie et Imagerie Médicale",
      "Licence en Kinésithérapie et Réadaptation Physique",
      "Licence en Soins Obstétricaux (Maïeutique / Sage-Femme d'État)",
      "Licence d'Assistant en Ophtalmologie et Santé Oculaire",
      "Licence en Anesthésie et Réanimation"
    ],
    master: [
      "Master en Gestion des Services de Soins Paramédicaux et Hospitaliers",
      "Master de Spécialisation en Imagerie Médicale Avancée (IRM / Scanner)",
      "Master en Rééducation Fonctionnelle de Haut Niveau"
    ],
    doctorat: [
      "Recherche en Sciences Hospitalières et Pratiques de Soins de Santé"
    ],
    admission: "Baccalauréat séries C ou D. Concours national d'entrée à l'EAM.",
    debouches: [
      "Manipulateurs en radiologie et imagerie dans les CHU et cliniques privées",
      "Kinésithérapeutes du sport et centres de réadaptation fonctionnelle",
      "Sages-femmes d'État et coordinateurs de centres de santé de base",
      "Assistants chirurgicaux et techniciens d'anesthésie",
      "Directeurs de soins paramédicaux"
    ]
  },
  {
    slug: "essd",
    category: "École Supérieure",
    filiere: "École Supérieure du Secrétariat de Direction (ESSD)",
    domaine: "Administration & Secrétariat",
    description: "L'ESSD prépare aux métiers de l'assistanat de direction bilingue, de la gestion administrative de haut niveau et de la coordination organisationnelle pour les grandes entreprises, ministères et institutions internationales.",
    licence: [
      "Licence Professionnelle en Assistanat de Direction Bilingue (Français - Anglais)",
      "Licence en Office Management et Coordination Administrative",
      "Licence en Gestion des Archives Médicales et Administratives"
    ],
    master: [
      "Master en Management Administratif et Communication Exécutive",
      "Master en Assistanat de Haute Direction pour Institutions Internationales"
    ],
    doctorat: [
      "Recherche en Sciences de l'Information et Management des Organisations"
    ],
    admission: "Baccalauréat séries G1, A4, G2 ou D. Bon niveau d'anglais et d'expression écrite.",
    debouches: [
      "Attachés et assistants de direction de PDG, Ministres et Ambassadeurs",
      "Office managers et coordinateurs administratifs de grands groupes",
      "Responsables de la gestion documentaire et des archives numériques",
      "Rédacteurs bilingues et chargés de protocole",
      "Chefs de cabinet administratif"
    ]
  },

  // ==========================================
  // 3. INSTITUTS UNIVERSITAIRES
  // ==========================================
  {
    slug: "inse",
    category: "Institut Universitaire",
    filiere: "Institut National des Sciences de l'Éducation (INSE)",
    domaine: "Éducation & Pédagogie",
    description: "L'INSE est l'institut moteur de la recherche pédagogique et de la formation des encadreurs de l'enseignement. Il forme des inspecteurs, conseillers pédagogiques, psychologues scolaires et experts du système éducatif.",
    licence: [
      "Licence en Sciences de l'Éducation et Pédagogie Appliquée",
      "Licence en Administration et Inspection des Institutions Scolaires",
      "Licence en Éducation Spécialisée et Inclusion Scolaire"
    ],
    master: [
      "Master en Ingénierie de la Formation et Didactique des Disciplines",
      "Master en Planification, Évaluation et Gestion des Systèmes Éducatifs",
      "Master en Psychopedagogie et Orientation Scolaire et Professionnelle"
    ],
    doctorat: [
      "Doctorat en Sciences de l'Éducation et Psychologie de l'Apprentissage",
      "Doctorat en Politiques Éducatives et Développement en Afrique"
    ],
    admission: "Baccalauréat toutes séries ou diplôme d'instituteur/professeur certifié. Sélection sur dossier ou concours.",
    debouches: [
      "Inspecteurs de l'enseignement national et conseillers pédagogiques",
      "Concepteurs de curricula et de programmes scolaires",
      "Directeurs d'établissements scolaires et universitaires",
      "Experts pour l'UNESCO, l'UNICEF et les ministères de l'Éducation",
      "Formateurs d'enseignants dans les Écoles Normales"
    ]
  },
  {
    slug: "iut-gestion",
    category: "Institut Universitaire",
    filiere: "Institut Universitaire de Technologie de Gestion (IUT-Gestion)",
    domaine: "Gestion & Entreprise",
    description: "L'IUT-Gestion dispense des formations courtes et intensives à visée immédiatement professionnelle. Il forme des cadres intermédiaires et techniciens supérieurs très prisés dans le monde du travail en gestion commerciale, logistique et comptable.",
    licence: [
      "Diplôme Universitaire de Technologie (DUT) en Gestion Commerciale et Marketing",
      "DUT en Gestion Logistique et Transport (GLT)",
      "DUT / Licence Professionnelle en Gestion des Entreprises et des Administrations (GEA)",
      "Licence Professionnelle en Commerce International et Transit",
      "Licence Professionnelle en Gestion Bancaire et de Microfinance"
    ],
    master: [
      "Master Professionnel en Supply Chain Management et Logistique Internationale",
      "Master Professionnel en Marketing Digital et Relation Client",
      "Master Professionnel en Comptabilité et Gestion de Trésorerie"
    ],
    doctorat: [
      "Recherche Appliquée en Sciences Industrielles et Commerciales"
    ],
    admission: "Baccalauréat séries G2, G3, B, C, D ou A4. Sélection sur dossier très concurrentielle.",
    debouches: [
      "Responsables logistiques et gestionnaires d'approvisionnement",
      "Chefs d'agence bancaire ou de microfinance",
      "Attachés commerciaux, chefs de rayon et délégués commerciaux",
      "Déclarants en douane, transitaires et agents maritimes",
      "Comptables d'entreprise et assistants gestionnaires de paie"
    ]
  },
  {
    slug: "injs",
    category: "Institut Universitaire",
    filiere: "Institut National de la Jeunesse et des Sports (INJS)",
    domaine: "Sport & Animation",
    description: "L'INJS forme des cadres de la jeunesse, des professeurs d'éducation physique et sportive (EPS), des entraîneurs de haut niveau et des administrateurs de structures sportives et de loisirs.",
    licence: [
      "Licence STAPS (Sciences et Techniques des Activités Physiques et Sportives)",
      "Licence en Éducation Physique et Sportive (EPS)",
      "Licence en Animation Socio-Culturelle et Éducation Populaire",
      "Licence en Management des Sports et des Structures de Loisirs"
    ],
    master: [
      "Master en Entraînement Sportif de Haut Niveau et Préparation Physique",
      "Master en Gouvernance du Sport et Événementiel Sportif",
      "Master en Politiques de Jeunesse et Développement Communautaire"
    ],
    doctorat: [
      "Recherche en Sciences du Mouvement Humain et Physiologie du Sport"
    ],
    admission: "Baccalauréat toutes séries + Épreuves physiques et sportives d'admission sélectives.",
    debouches: [
      "Professeurs certifiés d'Éducation Physique et Sportive (EPS) en lycées",
      "Entraîneurs sportifs et préparateurs physiques de clubs professionnels",
      "Directeurs de centres de loisirs, stades et infrastructures sportives",
      "Conseillers d'éducation populaire et de jeunesse pour les municipalités",
      "Organisateurs de compétitions sportives et événements internationaux"
    ]
  },
  {
    slug: "isica",
    category: "Institut Universitaire",
    filiere: "Institut des Sciences de l'Information, de la Communication et des Arts (ISICA)",
    domaine: "Journalisme & Communication",
    description: "L'ISICA est le berceau du journalisme moderne, de la communication digitale et de la publicité au Togo. Il combine enseignement théorique de pointe et studios pratiques en presse écrite, radio, télévision et nouveaux médias.",
    licence: [
      "Licence en Journalisme (Presse écrite, Radio, Télévision, Web)",
      "Licence en Communication des Organisations et Relations Publiques",
      "Licence en Publicité, Création Graphique et Multimédia",
      "Licence en Communication Institutionnelle et Politique"
    ],
    master: [
      "Master Professionnel en Journalisme d'Investigation et Média Digital",
      "Master en Communication Stratégique, Publicité et Gestion de Crise",
      "Master en Management des Médias et Production Audiovisuelle"
    ],
    doctorat: [
      "Doctorat en Sciences de l'Information et de la Communication (SIC)",
      "Thèse sur la Sociologie des Médias en Afrique"
    ],
    admission: "Baccalauréat toutes séries (A4, G1, D recommandés). Concours d'entrée écrit (culture générale, rédaction) et entretien oral.",
    debouches: [
      "Journalistes reporters d'images (JRI), présentateurs TV/Radio et rédacteurs en chef",
      "Directeurs de communication (DIRCOM) en entreprises et ministères",
      "Attachés de presse et conseillers en relations publiques",
      "Social Media Managers, stratèges digitaux et concepteurs-rédacteurs",
      "Producteurs audiovisuels et documentaristes"
    ]
  },
  {
    slug: "i2m",
    category: "Institut Universitaire",
    filiere: "Institut des Métiers de la Mer (I2M)",
    domaine: "Logistique Maritime & Portuaire",
    description: "Né pour accompagner la vocation portuaire et maritime du Togo (Port Autonome de Lomé), l'I2M forme les spécialistes de la logistique portuaire, de l'économie maritime, de l'ingénierie côtière et du droit marin.",
    licence: [
      "Licence en Gestion Portuaire et Consignation Maritime",
      "Licence en Logistique Internationale et Multimodale",
      "Licence en Sécurité, Sûreté Maritime et Protection de l'Environnement Marin",
      "Licence Technique en Maintenance des Équipements Maritimes"
    ],
    master: [
      "Master Professionnel en Administration des Ports et Gestion du Littoral",
      "Master en Droit Maritime, Assurances et Contrats Maritimes",
      "Master en Ingénierie Logistique Internationale et Commerce Transfrontalier"
    ],
    doctorat: [
      "Recherche en Économie Blue (Économie Maritime et Portuaire)",
      "Doctorat en Droit et Sécurité Maritimes du Golfe de Guinée"
    ],
    admission: "Baccalauréat séries C, D, E, G2 ou G3. Sélection sur dossier et entretien.",
    debouches: [
      "Officiers de port, consignataires de navires et agents maritimes",
      "Responsables logistiques au Port Autonome, terminaux à conteneurs (LCT, Bolloré)",
      "Courtier d'assurances maritimes et experts en avaries",
      "Inspecteurs de sécurité maritime et garde-côtes",
      "Cadres dans les compagnies maritimes de transport (CMA CGM, Maersk, MSC)"
    ]
  },
  {
    slug: "infa",
    category: "Institut Universitaire",
    filiere: "Institut National de Formation Agricole (INFA de Tové)",
    domaine: "Agriculture & Élevage",
    description: "Situé historiquement à Tové (Kpalimé) et rattaché à l'Université de Lomé, l'INFA forme des techniciens agricoles de terrain, des conseillers ruraux et des gestionnaires d'exploitations agricoles modernes.",
    licence: [
      "Licence Professionnelle en Agriculture et Techniques Culturales",
      "Licence en Santé Animale et Techniques d'Élevage",
      "Licence en Vulgarisation Agricole et Conseil Rural",
      "Licence en Machinisme Agricole et Irrigation"
    ],
    master: [
      "Master en Innovation Agricole et Entrepreneuriat Rural",
      "Master en Gestion des Coopératives et Chaînes de Valeur Agricoles"
    ],
    doctorat: [
      "Recherche Appliquée en Systèmes de Production Rurale et Tropicale"
    ],
    admission: "Baccalauréat séries D, C ou diplôme agricole de lycée technique. Concours d'entrée.",
    debouches: [
      "Conseillers agricoles pour les chambres d'agriculture et ONG",
      "Chefs d'exploitations agricoles, fermes avicoles et d'élevage modernes",
      "Techniciens de groupements de producteurs et coopératives de cacao/café/coton",
      "Inspecteurs des services vétérinaires et phytosanitaires de province",
      "Entrepreneurs agricoles et gestionnaires de pépinières"
    ]
  },
  {
    slug: "infts",
    category: "Institut Universitaire",
    filiere: "Institut National de Formation en Travail Social (INFTS)",
    domaine: "Travail Social & Développement",
    description: "L'INFTS prépare aux professions de l'intervention sociale, de la protection de l'enfance, du développement communautaire et de l'assistance humanitaire pour un développement inclusif et solidaire.",
    licence: [
      "Licence Professionnelle en Travail Social et Assistance Sociale d'État",
      "Licence en Développement Communautaire et Gestion des Projets Locaux",
      "Licence en Éducation Spécialisée et Protection de l'Enfance et de la Famille",
      "Licence en Action Humanitaire et Gestion des Réfugiés"
    ],
    master: [
      "Master en Ingénierie Sociale et Politiques d'Inclusion",
      "Master en Management des ONG et Projets de Solidarité Internationale",
      "Master en Gérontologie Sociale et Prise en charge du Handicap"
    ],
    doctorat: [
      "Recherche en Sociologie du Travail Social et Action Publique"
    ],
    admission: "Baccalauréat toutes séries. Concours national d'entrée.",
    debouches: [
      "Assistants sociaux de l'État en hôpitaux, tribunaux et mairies",
      "Coordinateurs de projets humanitaires (croix-rouge, Plan International, UNICEF)",
      "Éducateurs spécialisés dans les centres d'accueil pour mineurs",
      "Directeurs d'ONG locales et internationales de développement",
      "Experts en protection sociale et inclusion financière"
    ]
  },
  {
    slug: "ic-ul",
    category: "Institut Universitaire",
    filiere: "Institut Confucius de l'Université de Lomé (IC-UL)",
    domaine: "Langues & Cultures Asie",
    description: "Pont culturel et universitaire entre le Togo et la Chine, l'IC-UL forme à la langue chinoise (mandarin), à la civilisation asiatique, à la traduction bilingue et au commerce international afro-chinois.",
    licence: [
      "Licence en Langue et Civilisation Chinoise (Mandarin)",
      "Licence Professionnelle en Traduction et Interprétariat Commercial Français - Chinois",
      "Certificats de Compétence en Mandarin (HSK Niveau 1 à 6)"
    ],
    master: [
      "Master Professionnel en Négociation Commerciale Internationale et Relations Sino-Africaines",
      "Master en Traduction Technique et Interprétation de Conférence Sino-Française"
    ],
    doctorat: [
      "Recherche en Études Comparées et Relations Diplomatiques Afro-Asiatiques"
    ],
    admission: "Baccalauréat toutes séries pour la Licence, ou inscription libre pour les modules de certification HSK.",
    debouches: [
      "Interprètes et traducteurs pour les grandes multinationales chinoises en Afrique (BTP, Mines, Télécoms)",
      "Médiateurs commerciaux en douane, transit et import-export Asie-Afrique",
      "Diplomates et conseillers économiques auprès des ambassades",
      "Professeurs de langue chinoise dans l'enseignement secondaire",
      "Guides touristiques internationaux et conférenciers"
    ]
  },
  {
    slug: "iasm",
    category: "Institut Universitaire",
    filiere: "Institut Africain des Sciences de la Mission (IASM)",
    domaine: "Théologie & Mission",
    description: "Institut académique spécialisé en théologie interculturelle, en anthropologie religieuse et en missiologie, l'IASM forme des leaders religieux, des chercheurs en dialogue interreligieux et des acteurs de paix.",
    licence: [
      "Licence en Sciences Religieuses et Théologie Interculturelle",
      "Licence en Missiologie et Anthropologie de la Religion",
      "Licence en Médiation Sociale et Dialogue Interreligieux"
    ],
    master: [
      "Master en Éthique Publique, Religion et Paix Sociale",
      "Master de Recherche en Histoire des Religions en Afrique"
    ],
    doctorat: [
      "Doctorat en Sciences Religieuses et Anthropologie Culturelle"
    ],
    admission: "Baccalauréat toutes séries. Sélection sur dossier et entretien de motivation.",
    debouches: [
      "Chercheurs en socio-anthropologie des religions",
      "Médiateurs et conseillers en résolution de conflits intercommunautaires",
      "Cadres des ONG d'inspiration religieuse ou humanitaire (Caritas, etc.)",
      "Enseignants de philosophie et d'histoire des religions",
      "Aumôniers d'hôpitaux et responsables d'institutions religieuses"
    ]
  },

  // ==========================================
  // 4. CENTRES D'EXCELLENCE & DE RECHERCHE
  // ==========================================
  {
    slug: "cersa",
    category: "Centre d'Excellence",
    filiere: "Centre d'Excellence Régional sur les Sciences Aviaires (CERSA)",
    domaine: "Recherche & Aviculture",
    description: "Financé par la Banque Mondiale, le CERSA est un centre d'excellence pancafricain unique dédié à la recherche en aviculture moderne, à la sécurité alimentaire et à la formation d'experts en sciences aviaires pour toute l'Afrique de l'Ouest et du Centre.",
    licence: [
      "Certificats et Formations Courtes Spécialisées en Conduite d'Élevage Avicole Moderne",
      "Stage de Recherche Appliquée pour étudiants techniciens agricoles (L3)"
    ],
    master: [
      "Master Régional en Sciences Aviaires (Spécialités : Nutrition Avicole, Pathologie, Génétique)",
      "Master en Biologie de la Reproduction Aviaire et Techniques de Couvoir",
      "Master en Gestion Économique et Industrielle de la Filière Avicole"
    ],
    doctorat: [
      "Doctorat (Ph.D) Régional en Sciences Aviaires (Génétique, Virologie aviaire, Nutrition de précision)",
      "Thèse de recherche internationale en partenariat avec l'INRAE (France), WUR (Pays-Bas) et USDA"
    ],
    admission: "Master / Doctorat : ouvert aux titulaires d'une Licence ou d'un Master en Agronomie, Médecine Vétérinaire, Biologie ou Zootechnie de toute l'Afrique. Sélection sur dossier par un jury international.",
    debouches: [
      "Chercheurs internationaux et généticiens en santé et nutrition aviaires",
      "Directeurs de complexes industriels avicoles et grands couvoirs",
      "Experts internationaux en biosécurité et épidémiologie des maladies aviaires (grippe aviaire)",
      "Consultants de haut niveau pour les ministères de l'Élevage dans la zone CEDEAO",
      "Enseignants-chercheurs dans les universités africaines"
    ]
  },
  {
    slug: "cerme",
    category: "Centre d'Excellence",
    filiere: "Centre d'Excellence Régional pour la Maîtrise de l'Électricité (CERME)",
    domaine: "Électricité & Énergie",
    description: "Le CERME est le pôle de référence de la Banque Mondiale pour la formation d'ingénieurs et chercheurs de haut niveau en génie électrique, réseaux intelligents (Smart Grids), efficacité énergétique et électrification rurale en Afrique.",
    licence: [
      "Certificats de Qualification Professionnelle en Installation et Maintenance Solaire",
      "Formations techniques d'appoint pour techniciens de réseaux électriques"
    ],
    master: [
      "Master Régional en Génie Électrique et Énergies Renouvelables",
      "Master Spécialisé en Smart Grids et Gestion Technico-Économique des Réseaux Électriques",
      "Master en Efficacité Énergétique dans le Bâtiment et l'Industrie",
      "Master Professionnel en Électrification Rurale et Systèmes Hybrides"
    ],
    doctorat: [
      "Doctorat (Ph.D) en Électrotechnique et Électronique de Puissance",
      "Doctorat en Optimisation des Systèmes Énergétiques Africains",
      "Recherche sur l'intégration massive du solaire photovoltaïque sur les réseaux interconnectés (WAPP)"
    ],
    admission: "Titulaires d'une Licence ou d'un diplôme d'Ingénieur en Génie Électrique, Énergétique, Électromécanique ou Physique. Bourses régionales d'excellence disponibles.",
    debouches: [
      "Ingénieurs hautement spécialisés des sociétés nationales d'électricité (CEET, CEB, CIE, VRA)",
      "Directeurs techniques d'entreprises internationales d'énergies renouvelables et solaires",
      "Experts consultants en audit énergétique pour l'industrie et les organisations internationales",
      "Concepteurs de mini-réseaux (Mini-grids) pour l'électrification rurale en Afrique",
      "Chercheurs et professeurs d'universités en ingénierie électrique"
    ]
  },
  {
    slug: "cervida",
    category: "Centre d'Excellence",
    filiere: "Centre d'Excellence Régional pour les Villes Durables en Afrique (CERViDA-DOUNEDON)",
    domaine: "Urbanisme & Développement Durable",
    description: "Le CERViDA-DOUNEDON répond au défi crucial de l'urbanisation rapide en Afrique. Il forme des experts en aménagement urbain durable, architecture écologique, assainissement urbain et gestion résiliente des villes intelligentes (Smart Cities).",
    licence: [
      "Ateliers et Écoles d'Été de formation continue pour techniciens municipaux et agents territoriaux",
      "Certificats universitaires en SIG (Systèmes d'Information Géographique) appliqués à l'urbanisme"
    ],
    master: [
      "Master Régional en Planification et Gestion des Villes Durables en Afrique",
      "Master Spécialisé en Assainissement Urbain, Gestion des Déchets et Économie Circulaire",
      "Master en Architecture Éco-Responsable et Habitat Durable",
      "Master en Gouvernance Municipale, Mobilité Urbaine et Transports Durables"
    ],
    doctorat: [
      "Doctorat (Ph.D) en Sciences de la Ville et Urbanisme Durable",
      "Doctorat en Écologie Urbaine et Résilience aux Changements Climatiques en Afrique"
    ],
    admission: "Sélection sur concours ou dossier pour les titulaires d'une Licence / Master en Géographie, Architecture, Génie Civil, Sociologie Urbaine ou Sciences de l'Environnement.",
    debouches: [
      "Directeurs de l'urbanisme, de l'habitat et de l'aménagement des grandes métropoles africaines",
      "Experts internationaux en villes résilientes et changements climatiques (ONU-Habitat, Banque Mondiale)",
      "Ingénieurs en assainissement et gestionnaires de déchets municipaux",
      "Architectes urbanistes concepteurs d'éco-quartiers",
      "Consultants en mobilité urbaine durable et planification territoriale"
    ]
  },
  {
    slug: "cfrsp",
    category: "Centre d'Excellence",
    filiere: "Centre de Formation et de Recherche en Santé Publique (CFRSP)",
    domaine: "Santé Publique & Épidémiologie",
    description: "Rattaché à la FSS, le CFRSP est le centre d'élite pour la santé publique, la surveillance épidémiologique, la biostatistique et l'évaluation des politiques de santé pour faire face aux épidémies et endémies tropicales.",
    licence: [
      "Certificats en Veille Épidémiologique et Enquêtes de Santé Publique pour infirmiers et techniciens",
      "Diplôme d'Université en Hygiène Hospitalière et Prévention de l'Infection"
    ],
    master: [
      "Master Professionnel en Épidémiologie de Terrain (Field Epidemiology Training Program - FETP)",
      "Master en Santé Internationale, Biostatistique et Informatique Médicale",
      "Master en Gestion des Systèmes de Santé et Surveillance des Épidémies",
      "Master en Santé Environnementale et Toxicologie"
    ],
    doctorat: [
      "Doctorat en Santé Publique et Épidémiologie Analytique",
      "Thèse de recherche clinique sur les maladies transmissibles (Paludisme, VIH/SIDA, Tuberculose, Zoonoses)"
    ],
    admission: "Médecins, pharmaciens, vétérinaires, biologistes, statisticiens ou infirmiers d'État titulaires d'un Master/Licence. Admission sélective sur dossier.",
    debouches: [
      "Épidémiologistes de terrain pour l'OMS, Africa CDC, UNICEF et Fonds Mondial",
      "Directeurs des directions régionales et nationales de la santé publique",
      "Biostatisticiens et analystes de données médicales pour les instituts de recherche (INSERM, IRD, CDC)",
      "Coordonnateurs de programmes nationaux de lutte contre les épidémies",
      "Consultants internationaux en gestion des urgences sanitaires"
    ]
  },
  {
    slug: "cic",
    category: "Centre d'Excellence",
    filiere: "Centre Informatique et de Calcul (CIC)",
    domaine: "Informatique & Technologies",
    description: "Le CIC est le cœur numérique de l'Université de Lomé. Outre la gestion de l'infrastructure technologique du campus, il abrite des formations de pointe en génie logiciel, cybersécurité, intelligence artificielle et calcul haute performance (HPC).",
    licence: [
      "Licence Professionnelle en Génie Logiciel et Développement Web/Mobile",
      "Licence en Administration des Réseaux et Cybersécurité",
      "Licence en Sciences des Données (Data Science) et Bases de Données",
      "Certifications de compétences en langages modernes (Python, React, Cloud, DevOps)"
    ],
    master: [
      "Master en Cybersécurité, Cryptographie et Audit de Sécurité des Systèmes d'Information",
      "Master en Intelligence Artificielle, Big Data et Apprentissage Automatique (Machine Learning)",
      "Master en Architecture Logicielle et Cloud Computing",
      "Master Professionnel en Ingénierie des Systèmes d'Information Répartis"
    ],
    doctorat: [
      "Doctorat (Ph.D) en Informatique Théorique et Calcul Haute Performance (HPC)",
      "Doctorat en Intelligence Artificielle Appliquée et Sécurité Informatique"
    ],
    admission: "Baccalauréat séries C, D, E ou Ti pour la Licence. Titulaires d'une Licence en Informatique ou Mathématiques pour le Master.",
    debouches: [
      "Ingénieurs en cybersécurité, analystes SOC et auditeurs RSSI",
      "Architectes logiciels et ingénieurs DevOps en entreprises technologiques et banques",
      "Data Scientists et ingénieurs en Intelligence Artificielle",
      "Administrateurs systèmes, réseaux et infrastructures Cloud (AWS, Azure, GCP)",
      "Directeurs des Systèmes d'Information (DSI) et consultants en transformation digitale"
    ]
  },
  {
    slug: "cer",
    category: "Centre d'Excellence",
    filiere: "Centre des Énergies Renouvelables (CER)",
    domaine: "Énergies Propres",
    description: "Le CER se consacre à la recherche appliquée sur les énergies renouvelables (solaire, éolien, biomasse, hydroélectricité) et au développement de solutions écologiques adaptées aux conditions climatiques et industrielles africaines.",
    licence: [
      "Licence Professionnelle en Maintenance des Équipements Solaires et Éoliens",
      "Licence en Thermique du Bâtiment et Installations Énergétiques"
    ],
    master: [
      "Master Spécialisé en Ingénierie Solaire Photovoltaïque et Thermique",
      "Master en Valorisation Énergétique de la Biomasse et Biocarburants",
      "Master Professionnel en Audit Énergétique et Transition Écologique"
    ],
    doctorat: [
      "Doctorat en Physique des Matériaux Solaires et Nano-énergies",
      "Thèse en Modélisation des Systèmes Hybrides d'Énergies Renouvelables"
    ],
    admission: "Licence en Physique, Énergétique, Électromécanique ou Chimie. Sélection sur dossier.",
    debouches: [
      "Ingénieurs de projets de fermes solaires et éoliennes en Afrique",
      "Experts en efficacité énergétique pour l'industrie et le bâtiment",
      "Chercheurs en nanotechnologies photovoltaïques et biocarburants",
      "Consultants en transition énergétique et marchés du carbone",
      "Chefs d'entreprises d'installations solaires et énergies autonomes"
    ]
  }
]

async function run() {
  console.log("🚀 Mise à jour complète (LMD + Détails) pour les 26 composantes de l'Université de Lomé...")
  
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
    console.log(`✨ ${formationsULome.length} Facultés, Écoles, Instituts et Centres ont été enrichis avec leurs parcours LMD complets dans Supabase !`)
  }
}

run()
