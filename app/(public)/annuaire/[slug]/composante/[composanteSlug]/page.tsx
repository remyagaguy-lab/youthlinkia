import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { GraduationCap, BookOpen, ArrowLeft, Building, CheckCircle2, Briefcase, Award, Clock, Users, Sparkles, ChevronRight, Globe } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; composanteSlug: string }> }) {
  const { slug, composanteSlug } = await params
  const supabase = await createClient()
  const { data: structure } = await supabase
    .from('structures')
    .select('nom, formations_proposees')
    .eq('slug', slug)
    .single()

  if (!structure) return { title: 'Non trouvé | YouthLinkIA' }

  const formations = structure.formations_proposees || []
  const composante = formations.find((f: any) => {
    const defaultSlug = encodeURIComponent((f.filiere || f.nom || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    return f.slug === composanteSlug || defaultSlug === composanteSlug
  })

  const nomComposante = composante?.filiere || composante?.nom || 'Détails de la formation'
  return {
    title: `${nomComposante} | ${structure.nom} - YouthLinkIA`,
    description: composante?.description || `Parcours de formation Licence, Master et Doctorat proposés par ${nomComposante} à ${structure.nom}.`
  }
}

export default async function ComposanteDetailPage({
  params,
}: {
  params: Promise<{ slug: string; composanteSlug: string }>
}) {
  const { slug, composanteSlug } = await params
  const supabase = await createClient()

  const { data: structure } = await supabase
    .from('structures')
    .select('*')
    .eq('slug', slug)
    .eq('statut', 'publiee')
    .single()

  if (!structure) {
    notFound()
  }

  const formations = structure.formations_proposees || []
  const composante = formations.find((f: any) => {
    const defaultSlug = encodeURIComponent((f.filiere || f.nom || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    return f.slug === composanteSlug || defaultSlug === composanteSlug
  })

  if (!composante) {
    notFound()
  }

  const nomFiliere = composante.filiere || composante.nom || 'Cette composante'
  const domaine = composante.domaine || 'Enseignement Supérieur'
  const category = composante.category || (composante.niveau !== "Reconnu par le CAMES" ? composante.niveau : null) || "Formation Supérieure"
  
  const description = composante.description || `Bienvenue sur la page de présentation de ${nomFiliere} au sein de ${structure.nom}. Cette composante a pour vocation d'offrir des formations académiques et professionnalisantes de haut niveau, alignées sur les normes internationales du système LMD (Licence, Master, Doctorat) et répondant aux exigences du marché de l'emploi en Afrique et dans le monde.`

  const licenceList = Array.isArray(composante.licence) ? composante.licence : []
  const masterList = Array.isArray(composante.master) ? composante.master : []
  const doctoratList = Array.isArray(composante.doctorat) ? composante.doctorat : []

  const admissionText = composante.admission || "Les modalités d'admission (sélection sur dossier, séries de Baccalauréat requises ou épreuves de concours) sont fixées annuellement par la DAAS (Direction des Affaires Académiques et de la Scolarité) de l'Université de Lomé."

  const debouchesList = Array.isArray(composante.debouches) ? composante.debouches : []

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-spartan">
      
      {/* 1. BANNIÈRE / EN-TÊTE DE LA COMPOSANTE */}
      <div className="relative bg-gradient-to-br from-slate-900 via-[#0A2239] to-primary-900 text-white pt-12 pb-16 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cta-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* BREADCRUMBS */}
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-8 font-poppins">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={12} className="text-slate-500" />
            <Link href="/annuaire" className="hover:text-white transition-colors">Annuaire</Link>
            <ChevronRight size={12} className="text-slate-500" />
            <Link href={`/annuaire/${structure.slug}`} className="hover:text-white transition-colors font-medium text-primary-300">
              {structure.nom}
            </Link>
            <ChevronRight size={12} className="text-slate-500" />
            <span className="text-white font-semibold line-clamp-1">{nomFiliere}</span>
          </nav>

          {/* BADGES & BOUTON RETOUR */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-primary-600 text-white rounded-lg shadow-sm">
                {category}
              </span>
              {domaine && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/10 text-primary-200 rounded-lg border border-white/10">
                  {domaine}
                </span>
              )}
            </div>

            <Link 
              href={`/annuaire/${structure.slug}#formations`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft size={16} />
              <span>Retour à {structure.nom}</span>
            </Link>
          </div>

          {/* TITRE DE LA COMPOSANTE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins text-white tracking-tight leading-tight mb-4 max-w-4xl">
            {nomFiliere}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed flex items-center gap-2 font-light">
            <Building className="text-primary-400 shrink-0" size={20} />
            <span>Composante de formation et de recherche de <strong>{structure.nom}</strong></span>
          </p>
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE (Présentation & Parcours LMD) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CARTE PRÉSENTATION */}
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <BookOpen className="text-primary-600 shrink-0" size={26} />
                <h2 className="text-xl md:text-2xl font-bold font-poppins text-slate-900">Présentation & Vocation</h2>
              </div>
              <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                {description}
              </p>
            </Card>

            {/* SECTION PARCOURS LMD */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-cta-600" size={28} />
                <h2 className="text-2xl font-bold font-poppins text-slate-900">Parcours de Formation par Cycle (LMD)</h2>
              </div>
              <p className="text-sm text-slate-600 -mt-2 mb-6">
                Découvrez la structuration détaillée des diplômes dispensés au sein de cette composante selon le système international Licence, Master et Doctorat.
              </p>

              {/* 1. CYCLE LICENCE */}
              {licenceList.length > 0 && (
                <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-black text-lg shrink-0">
                        L
                      </div>
                      <div>
                        <h3 className="font-bold text-lg md:text-xl font-poppins text-slate-900">Niveau Licence (1er Cycle)</h3>
                        <p className="text-xs text-slate-500">Durée d'études : 3 ans (6 semestres - 180 crédits ECTS)</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-extrabold text-xs">
                      Bac + 3
                    </span>
                  </div>
                  
                  <ul className="space-y-3.5">
                    {licenceList.map((prog: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-primary-50/40 hover:border-primary-200 transition-colors">
                        <CheckCircle2 className="text-primary-600 shrink-0 mt-0.5" size={18} />
                        <span className="font-semibold text-slate-800 text-sm md:text-base leading-snug">{prog}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* 2. CYCLE MASTER */}
              {masterList.length > 0 && (
                <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-cta-600"></div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-cta-50 flex items-center justify-center text-cta-600 font-black text-lg shrink-0">
                        M
                      </div>
                      <div>
                        <h3 className="font-bold text-lg md:text-xl font-poppins text-slate-900">Niveau Master & Ingénierie (2nd Cycle)</h3>
                        <p className="text-xs text-slate-500">Durée d'études : 2 ans après la Licence (4 semestres - 120 crédits ECTS)</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cta-50 text-cta-700 font-extrabold text-xs">
                      Bac + 5
                    </span>
                  </div>
                  
                  <ul className="space-y-3.5">
                    {masterList.map((prog: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-cta-50/40 hover:border-cta-200 transition-colors">
                        <CheckCircle2 className="text-cta-600 shrink-0 mt-0.5" size={18} />
                        <span className="font-semibold text-slate-800 text-sm md:text-base leading-snug">{prog}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* 3. CYCLE DOCTORAT */}
              {doctoratList.length > 0 && (
                <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-lg shrink-0">
                        D
                      </div>
                      <div>
                        <h3 className="font-bold text-lg md:text-xl font-poppins text-slate-900">Niveau Doctorat & Recherche (3ème Cycle)</h3>
                        <p className="text-xs text-slate-500">Recherche approfondie en laboratoire, rédaction de thèse et innovation</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs">
                      Bac + 8
                    </span>
                  </div>
                  
                  <ul className="space-y-3.5">
                    {doctoratList.map((prog: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-purple-50/40 hover:border-purple-200 transition-colors">
                        <Sparkles className="text-purple-600 shrink-0 mt-0.5" size={18} />
                        <span className="font-semibold text-slate-800 text-sm md:text-base leading-snug">{prog}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {licenceList.length === 0 && masterList.length === 0 && doctoratList.length === 0 && (
                <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white text-center">
                  <Clock className="mx-auto text-primary-500 mb-4" size={40} />
                  <h3 className="font-bold text-lg text-slate-900 font-poppins mb-2">Parcours en cours d'intégration officielle</h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Les parcours détaillés pour les cycles Licence, Master et Doctorat de cette composante sont actuellement en cours d'intégration depuis les sources officielles de la DAAS (Direction des Affaires Académiques et de la Scolarité) de l'Université de Lomé.
                  </p>
                </Card>
              )}

            </div>

          </div>

          {/* COLONNE DROITE (Sidebar Admission & Débouchés) */}
          <div className="space-y-8">
            
            {/* CARTE ADMISSION */}
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 font-poppins">Conditions d'Admission</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4 font-medium">
                {admissionText}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-600" />
                  <span>Modalités de sélection</span>
                </div>
                <p>
                  Les candidatures s'effectuent sur le portail officiel de l'établissement lors des périodes d'ouverture des inscriptions universitaires.
                </p>
              </div>
            </Card>

            {/* CARTE DÉBOUCHÉS */}
            {debouchesList.length > 0 && (
              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-cta-50 flex items-center justify-center text-cta-600 shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 font-poppins">Débouchés & Carrières</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Les diplômés de cette composante s'insèrent avec succès dans les secteurs suivants :
                </p>
                <ul className="space-y-2.5">
                  {debouchesList.map((deb: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                      <span className="text-cta-500 font-bold mt-0.5 shrink-0">✓</span>
                      <span className="leading-snug">{deb}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* CARTE ACTION / LIEN PRINCIPAL */}
            <Card className="p-8 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-primary-900 via-slate-900 to-[#0A2239] text-white text-center">
              <Building size={40} className="mx-auto text-primary-300 mb-4" />
              <h3 className="font-bold text-lg font-poppins mb-2">{structure.nom}</h3>
              <p className="text-xs text-primary-200 mb-6 leading-relaxed">
                Pour toute question sur le calendrier académique, les frais de scolarité ou les inscriptions définitives :
              </p>
              <div className="space-y-3">
                <Link
                  href={`/annuaire/${structure.slug}`}
                  className="block w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition-all shadow-md"
                >
                  Voir l'établissement principal
                </Link>
                {structure.site_web_officiel && (
                  <a
                    href={structure.site_web_officiel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10"
                  >
                    <Globe size={16} />
                    <span>Site web officiel</span>
                  </a>
                )}
              </div>
            </Card>

          </div>

        </div>
      </div>

    </div>
  )
}
