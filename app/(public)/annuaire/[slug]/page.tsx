import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogoImage } from '@/components/ui/LogoImage'
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Wallet,
  Building,
  Image as ImageIcon
} from 'lucide-react'

export const revalidate = 3600 // Revalidate cache every hour (ISR)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: structure } = await supabase
    .from('structures')
    .select('nom, mission')
    .eq('slug', slug)
    .single()

  if (!structure) return { title: 'Non trouvé | YouthLinkIA' }

  return {
    title: `${structure.nom} | YouthLinkIA Annuaire`,
    description: structure.mission,
  }
}

export default async function StructureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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

  // Fallbacks if new fields are empty
  const couvertureUrl = structure.couverture_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  const formations = structure.formations_proposees || []
  const galerie = structure.galerie_images || []
  const chiffres = structure.chiffres_cles || {}

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-spartan">
      
      {/* 1. HERO BANNER PUREMENT DÉCORATIF */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900">
        <img 
          src={couvertureUrl} 
          alt={`Campus de ${structure.nom}`} 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Un léger overlay noir juste pour faire ressortir l'image */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Navigation retour */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/annuaire" className="text-white hover:text-white flex items-center gap-2 text-sm font-bold bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-md hover:bg-black/70 transition-all shadow-md">
            &larr; Retour à l'annuaire
          </Link>
        </div>
      </div>

      {/* 2. EN-TÊTE PROFIL (Section Blanche) */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row gap-6 pb-8 md:items-end -mt-20">
            
            {/* Logo qui chevauche */}
            <div className="relative w-40 h-40 rounded-2xl bg-white shadow-xl border-4 border-white flex-shrink-0 z-10 overflow-hidden group">
              {(() => {
                let finalLogoUrl = structure.logo_url;
                const website = structure.site_web_officiel || structure.lien;
                if (!finalLogoUrl && website) {
                  try {
                    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
                    finalLogoUrl = `https://logo.clearbit.com/${url.hostname}`;
                  } catch (e) {}
                }
                return (
                  <LogoImage 
                    src={finalLogoUrl} 
                    website={website}
                    alt={structure.nom} 
                    fallbackLetter={structure.nom} 
                    containerClassName="w-full h-full rounded-xl text-6xl"
                    className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                );
              })()}
            </div>

            {/* Titre & Info avec contraste parfait (noir sur blanc) */}
            <div className="flex-grow pt-20 md:pt-0 md:pb-2 z-10">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {structure.type.replace('_', ' ')}
                </span>
                <div className="flex gap-2">
                  {structure.pays_intervention?.map((p: string) => (
                    <span key={p} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1 border border-slate-200">
                      <MapPin size={12} className="text-cta-500" /> {p}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-poppins tracking-tight leading-tight mb-2">
                {structure.nom}
              </h1>
            </div>

            {/* Actions Primaires */}
            <div className="flex flex-col gap-3 pb-2 z-10 w-full md:w-auto">
              {(structure.lien || structure.site_web_officiel) && (
                <Button asChild size="lg" className="w-full md:w-auto bg-[var(--color-primary)] hover:opacity-90 shadow-lg shadow-black/10 text-white font-bold h-12">
                  <a href={structure.lien || structure.site_web_officiel} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-5 w-5" /> Visiter le Site
                  </a>
                </Button>
              )}
              {(structure.contact || structure.contact_email) && (
                <Button asChild variant="outline" size="lg" className="w-full md:w-auto bg-white hover:bg-slate-50 text-[var(--color-primary)] border-[var(--color-primary)] font-bold h-12">
                  <a href={`mailto:${structure.contact || structure.contact_email}`}>
                    <Mail className="mr-2 h-5 w-5 text-[var(--color-primary)]" /> Contacter
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* 3. MENU ONGLETS (Navigation Interne) */}
          <div className="flex overflow-x-auto gap-8 no-scrollbar border-t border-slate-100 pt-1">
            <a href="#presentation" className="py-4 text-sm font-bold text-primary-600 border-b-2 border-primary-600 whitespace-nowrap">
              Présentation
            </a>
            <a href="#formations" className="py-4 text-sm font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300 whitespace-nowrap transition-colors">
              Formations
            </a>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE (Contenu Principal) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* PRÉSENTATION */}
            <section id="presentation" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <Building className="text-primary-600" size={28} />
                <h2 className="text-2xl font-bold font-poppins text-slate-900">À propos de l'établissement</h2>
              </div>
              
              <Card className="p-8 border-slate-200 shadow-sm rounded-2xl bg-white">
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-poppins prose-a:text-primary-600 leading-relaxed text-slate-700">
                  {structure.description_detaillee ? (
                    <div dangerouslySetInnerHTML={{ __html: structure.description_detaillee.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <>
                      <p className="font-medium mb-4">{structure.mission}</p>
                      <p className="italic">La présentation détaillée de cet établissement est en cours de mise à jour.</p>
                    </>
                  )}
                </div>
              </Card>
            </section>

            {/* FORMATIONS */}
            <section id="formations" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="text-cta-600" size={28} />
                <h2 className="text-2xl font-bold font-poppins text-slate-900">Formations Proposées</h2>
              </div>

              {formations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {formations.map((form: any, idx: number) => (
                    <Card key={idx} className="p-6 border-slate-200 shadow-sm rounded-2xl bg-white hover:shadow-md hover:border-primary-200 transition-all group h-full flex flex-col">
                      <div className="text-xs font-black text-primary-600 bg-primary-50 w-fit px-3 py-1.5 rounded-lg mb-3 tracking-wide">
                        {form.niveau}
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">{form.filiere}</h3>
                      <p className="text-sm font-semibold text-slate-500 mb-3">{form.domaine}</p>
                      {form.description && <p className="text-sm text-slate-600 mt-auto leading-relaxed">{form.description}</p>}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-10 border-slate-200 bg-white rounded-2xl text-center border-dashed">
                  <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-medium">Les détails des formations seront bientôt disponibles.</p>
                </Card>
              )}
            </section>

          </div>

          {/* COLONNE DROITE (Sidebar Infos) */}
          <div className="space-y-8">
            
            {/* CHIFFRES CLÉS */}
            {Object.keys(chiffres).length > 0 && (
              <Card className="p-8 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-slate-900 via-[#0A2239] to-primary-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Users size={120} />
                </div>
                <h3 className="font-bold text-xl font-poppins mb-8 flex items-center gap-3 text-white/90">
                  <Users className="text-primary-300" size={24} />
                  Chiffres Clés
                </h3>
                <div className="flex flex-col gap-8 relative z-10">
                  {Object.entries(chiffres)
                    .filter(([key]) => key !== 'reseaux_sociaux')
                    .map(([key, value]) => (
                    <div key={key}>
                      <div className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-2">{String(value)}</div>
                      <div className="text-sm text-primary-200 uppercase tracking-widest font-bold">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* CARTE CONTACT */}
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <h3 className="font-bold text-xl text-slate-900 font-poppins mb-6">Contacts & Accès</h3>
              <ul className="space-y-5">
                {structure.contact_telephone && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="text-primary-600" size={18} />
                    </div>
                    <span className="text-slate-700 font-medium mt-2">{structure.contact_telephone}</span>
                  </li>
                )}
                {(structure.contact_email || structure.contact) && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="text-primary-600" size={18} />
                    </div>
                    <a href={`mailto:${structure.contact_email || structure.contact}`} className="text-primary-600 hover:text-primary-700 font-medium mt-2 break-all underline-offset-4 hover:underline">
                      {structure.contact_email || structure.contact}
                    </a>
                  </li>
                )}
                {(structure.site_web_officiel || structure.lien) && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Globe className="text-primary-600" size={18} />
                    </div>
                    <a href={structure.site_web_officiel || structure.lien} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium mt-2 break-all underline-offset-4 hover:underline">
                      Visiter le site web
                    </a>
                  </li>
                )}
                
                {/* RÉSEAUX SOCIAUX */}
                {chiffres.reseaux_sociaux && typeof chiffres.reseaux_sociaux === 'object' && Object.entries(chiffres.reseaux_sociaux).map(([reseau, url]) => {
                  if (!url) return null;
                  return (
                    <li key={reseau} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Globe className="text-primary-600" size={18} />
                      </div>
                      <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium mt-2 break-all underline-offset-4 hover:underline capitalize">
                        Page {reseau}
                      </a>
                    </li>
                  )
                })}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary-600" size={18} />
                  </div>
                  <span className="text-slate-700 font-medium mt-2">
                    {structure.pays_intervention.join(', ')}
                  </span>
                </li>
              </ul>
            </Card>

            {/* SECTEURS / MOTS CLÉS */}
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <h3 className="font-bold text-xl text-slate-900 font-poppins mb-6">Secteurs d'Activité</h3>
              <div className="flex flex-wrap gap-2">
                {structure.secteurs?.map((s: string) => (
                  <span key={s} className="text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </Card>

          </div>

        </div>
      </div>
    </div>
  )
}
