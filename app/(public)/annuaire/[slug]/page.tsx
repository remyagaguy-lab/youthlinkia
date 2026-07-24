import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
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
import { LogoImage } from '@/components/ui/LogoImage'

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
      {/* 1. HERO BANNER */}
      <div className="relative h-80 md:h-[400px] w-full bg-slate-900">
        <img 
          src={couvertureUrl} 
          alt={`Campus de ${structure.nom}`} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Navigation retour */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/annuaire" className="text-white hover:text-primary-300 flex items-center gap-2 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-md transition-all">
            &larr; Retour à l'annuaire
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. EN-TÊTE PROFIL (Overlap sur le Hero) */}
        <div className="relative -mt-24 mb-12 flex flex-col md:flex-row gap-6 md:items-end">
          {/* Logo */}
          <div className="relative w-40 h-40 rounded-2xl bg-white shadow-xl border-4 border-white flex-shrink-0 z-10 overflow-hidden group">
            {(() => {
              let finalLogoUrl = structure.logo_url;
              if (!finalLogoUrl && (structure.site_web_officiel || structure.lien)) {
                const website = structure.site_web_officiel || structure.lien;
                try {
                  const url = new URL(website.startsWith('http') ? website : `https://${website}`);
                  finalLogoUrl = `https://logo.clearbit.com/${url.hostname}`;
                } catch (e) {}
              }
              return (
                <LogoImage 
                  src={finalLogoUrl} 
                  alt={structure.nom} 
                  fallbackLetter={structure.nom} 
                  containerClassName="w-full h-full rounded-xl text-6xl"
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
              );
            })()}
          </div>

          {/* Titre & Info */}
          <div className="flex-grow z-10 pb-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-white bg-cta-500 px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                {structure.type.replace('_', ' ')}
              </span>
              <div className="flex gap-2">
                {structure.pays_intervention?.map((p: string) => (
                  <span key={p} className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin size={12} /> {p}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white font-poppins drop-shadow-md tracking-tight leading-tight mb-2">
              {structure.nom}
            </h1>
          </div>

          {/* Actions Primaires */}
          <div className="flex flex-col gap-3 pb-4 z-10 w-full md:w-auto">
            {(structure.lien || structure.site_web_officiel) && (
              <Button asChild size="lg" className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30">
                <a href={structure.lien || structure.site_web_officiel} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-5 w-5" /> Site Officiel
                </a>
              </Button>
            )}
            {(structure.contact || structure.contact_email) && (
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 border-white/20 backdrop-blur-md">
                <a href={`mailto:${structure.contact || structure.contact_email}`}>
                  <Mail className="mr-2 h-5 w-5" /> Contacter
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* 3. MENU STICKY (Scrollspy simplifiée) */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 mb-8 rounded-2xl px-2 py-2 shadow-sm flex overflow-x-auto gap-2 no-scrollbar">
          <a href="#presentation" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl whitespace-nowrap transition-colors">
            Présentation
          </a>
          <a href="#formations" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl whitespace-nowrap transition-colors">
            Formations
          </a>
          <a href="#admission" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl whitespace-nowrap transition-colors">
            Admission & Frais
          </a>
          {galerie.length > 0 && (
            <a href="#campus" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl whitespace-nowrap transition-colors">
              Le Campus
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE (Contenu Principal) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* PRÉSENTATION */}
            <section id="presentation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <Building size={24} />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-slate-900">Présentation</h2>
              </div>
              
              <Card className="p-8 border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="prose prose-slate prose-primary max-w-none prose-headings:font-poppins prose-a:text-primary-600">
                  {structure.description_detaillee ? (
                    <div dangerouslySetInnerHTML={{ __html: structure.description_detaillee.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <>
                      <p className="text-lg font-medium text-slate-800 mb-4">{structure.mission}</p>
                      <p className="text-slate-600 italic">La présentation détaillée de cet établissement est en cours de mise à jour par notre équipe.</p>
                    </>
                  )}
                </div>
              </Card>
            </section>

            {/* FORMATIONS */}
            <section id="formations" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cta-100 flex items-center justify-center text-cta-600">
                  <GraduationCap size={24} />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-slate-900">Formations Proposées</h2>
              </div>

              {formations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formations.map((form: any, idx: number) => (
                    <Card key={idx} className="p-5 border-slate-200/60 shadow-sm hover:shadow-md hover:border-cta-300 transition-all group">
                      <div className="text-xs font-bold text-cta-600 bg-cta-50 w-fit px-2 py-1 rounded mb-2">
                        {form.niveau}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{form.filiere}</h3>
                      <p className="text-sm text-slate-500 mb-3">{form.domaine}</p>
                      {form.description && <p className="text-sm text-slate-700 line-clamp-2">{form.description}</p>}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 border-slate-200/60 bg-slate-50 text-center">
                  <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Les détails des formations seront bientôt disponibles.</p>
                </Card>
              )}
            </section>

            {/* ADMISSION ET FRAIS */}
            <section id="admission" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-slate-900">Admission & Scolarité</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-200/60 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-teal-500" size={18} /> 
                    Conditions d'Admission
                  </h3>
                  <div className="text-slate-700 text-sm whitespace-pre-wrap">
                    {structure.conditions_admission || "Sur étude de dossier et/ou concours. Veuillez contacter l'établissement pour plus de détails."}
                  </div>
                </Card>

                <Card className="p-6 border-slate-200/60 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Wallet className="text-orange-500" size={18} /> 
                    Frais de Scolarité
                  </h3>
                  <div className="text-slate-700 text-sm whitespace-pre-wrap">
                    {structure.frais_scolarite || "Les frais de scolarité ne sont pas communiqués publiquement."}
                  </div>
                </Card>
              </div>
            </section>

            {/* GALERIE (si dispo) */}
            {galerie.length > 0 && (
              <section id="campus" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <ImageIcon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-poppins text-slate-900">Le Campus</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galerie.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`Campus ${i+1}`} className="w-full h-48 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer" />
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* COLONNE DROITE (Sidebar Infos) */}
          <div className="space-y-6">
            
            {/* CARTE CONTACT */}
            <Card className="p-6 border-slate-200/60 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 font-poppins mb-4">Contacts & Accès</h3>
              <ul className="space-y-4">
                {structure.contact_telephone && (
                  <li className="flex items-start gap-3">
                    <Phone className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    <span className="text-sm text-slate-700">{structure.contact_telephone}</span>
                  </li>
                )}
                {(structure.contact_email || structure.contact) && (
                  <li className="flex items-start gap-3">
                    <Mail className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    <a href={`mailto:${structure.contact_email || structure.contact}`} className="text-sm text-primary-600 hover:underline break-all">
                      {structure.contact_email || structure.contact}
                    </a>
                  </li>
                )}
                {(structure.site_web_officiel || structure.lien) && (
                  <li className="flex items-start gap-3">
                    <Globe className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    <a href={structure.site_web_officiel || structure.lien} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline break-all">
                      Visiter le site web
                    </a>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-slate-700">
                    {structure.pays_intervention.join(', ')}
                  </span>
                </li>
              </ul>
            </Card>

            {/* CHIFFRES CLÉS */}
            {Object.keys(chiffres).length > 0 && (
              <Card className="p-6 border-slate-200/60 shadow-sm bg-gradient-to-br from-primary-900 to-slate-900 text-white">
                <h3 className="font-bold text-lg font-poppins mb-4 flex items-center gap-2">
                  <Users className="text-primary-300" size={20} />
                  Chiffres Clés
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(chiffres).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-2xl font-black text-white">{String(value)}</div>
                      <div className="text-xs text-primary-200 uppercase tracking-wider font-bold mt-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* SECTEURS / MOTS CLÉS */}
            <Card className="p-6 border-slate-200/60 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 font-poppins mb-4">Secteurs d'Activité</h3>
              <div className="flex flex-wrap gap-2">
                {structure.secteurs?.map((s: string) => (
                  <span key={s} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
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
