import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogoImage } from '@/components/ui/LogoImage'
import { FormationsSection } from './FormationsSection'
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Building,
  Share2,
  ArrowRight
} from 'lucide-react'

export const revalidate = 3600 // Revalidate cache every hour (ISR)

function getSocialIcon(reseau: string) {
  const n = reseau.toLowerCase();
  if (n.includes('facebook')) {
    return (
      <svg className="w-[18px] h-[18px] text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    );
  }
  if (n.includes('linkedin')) {
    return (
      <svg className="w-[18px] h-[18px] text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.75a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63s1.63-.73 1.63-1.63c0-.9-.73-1.63-1.63-1.63z" clipRule="evenodd" />
      </svg>
    );
  }
  if (n.includes('twitter') || n.includes('x')) {
    return (
      <svg className="w-[18px] h-[18px] text-slate-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (n.includes('instagram')) {
    return (
      <svg className="w-[18px] h-[18px] text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    );
  }
  if (n.includes('youtube')) {
    return (
      <svg className="w-[18px] h-[18px] text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM10 15l5-3-5-3v6z" clipRule="evenodd" />
      </svg>
    );
  }
  return <Share2 className="text-primary-600" size={18} />;
}

function formatMarkdownToHtml(text: string) {
  if (!text) return '';
  
  const lines = text.split(/\r?\n/);
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    // Headers
    if (line.startsWith('### ') || line.startsWith('#### ') || line.startsWith('##### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      const title = line.replace(/^#{3,5}\s+/, '');
      html += `<h3 class="text-lg md:text-xl font-bold font-poppins text-slate-900 mt-8 mb-3 flex items-center gap-2.5"><span class="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block shrink-0"></span><span>${title}</span></h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 class="text-xl md:text-2xl font-bold font-poppins text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2.5">${line.substring(3)}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 class="text-xl md:text-2xl font-bold font-poppins text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2.5">${line.substring(2)}</h2>`;
      continue;
    }

    // Lists
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="space-y-2.5 my-4 text-slate-700 pl-2">';
        inList = true;
      }
      let item = line.substring(2);
      item = item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
      item = item.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
      html += `<li class="flex items-start gap-2.5 leading-relaxed"><span class="text-primary-600 font-bold mt-1 shrink-0">•</span><span>${item}</span></li>`;
      continue;
    }

    if (inList) {
      html += '</ul>';
      inList = false;
    }

    // Normal paragraph
    let p = line;
    p = p.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    p = p.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html += `<p class="mb-4 leading-relaxed text-slate-700">${p}</p>`;
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

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

  // Fetch 3 similar structures
  let { data: similarStructures } = await supabase
    .from('structures')
    .select('id, nom, slug, type, logo_url, mission, site_web_officiel, lien')
    .eq('statut', 'publiee')
    .neq('id', structure.id)
    .eq('type', structure.type)
    .limit(3)

  if (!similarStructures || similarStructures.length < 3) {
    const { data: moreStructures } = await supabase
      .from('structures')
      .select('id, nom, slug, type, logo_url, mission, site_web_officiel, lien')
      .eq('statut', 'publiee')
      .neq('id', structure.id)
      .limit(3)
    similarStructures = moreStructures || []
  }

  // Fallbacks if new fields are empty
  const couvertureUrl = structure.couverture_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  const formations = structure.formations_proposees || []
  const galerie = structure.galerie_images || []
  const chiffres = structure.chiffres_cles || {}

  // 1. Calcul des Domaines de formation
  let domainesList: string[] = [];
  if (structure.nom.toLowerCase().includes('lomé') || structure.slug?.includes('lome')) {
    domainesList = [
      "Agronomie & Environnement",
      "Droit & Sciences Politiques",
      "Économie & Gestion",
      "Éducation, Communication & Sport",
      "Lettres, Langues & Arts",
      "Santé & Médecine",
      "Sciences Fondamentales & Ingénierie",
      "Sciences Humaines & Sociales"
    ];
  } else {
    const domainesSet = new Set<string>();
    if (Array.isArray(structure.domaines)) {
      structure.domaines.forEach((d: string) => d && domainesSet.add(d.trim()));
    }
    formations.forEach((f: any) => {
      if (f.domaine) {
        f.domaine.split(',').forEach((d: string) => d.trim() && domainesSet.add(d.trim()));
      }
    });
    domainesList = Array.from(domainesSet).sort();
  }

  // 2. Calcul des Diplômes proposés
  let diplomesList: string[] = [];
  if (structure.nom.toLowerCase().includes('lomé') || structure.slug?.includes('lome')) {
    diplomesList = [
      "Licence",
      "Master",
      "Doctorat",
      "Diplôme d'Ingénieur",
      "Diplôme d'État en Santé",
      "DUT / Certificats Spécialisés"
    ];
  } else {
    const diplomesSet = new Set<string>();
    formations.forEach((f: any) => {
      if (f.niveau && f.niveau !== "Reconnu par le CAMES" && !f.niveau.toLowerCase().includes("faculté") && !f.niveau.toLowerCase().includes("école") && !f.niveau.toLowerCase().includes("institut") && !f.niveau.toLowerCase().includes("centre")) {
        diplomesSet.add(f.niveau.trim());
      }
    });
    diplomesList = Array.from(diplomesSet).sort();
    if (diplomesList.length === 0) {
      diplomesList = ["Licence", "Master", "Doctorat"];
    }
  }

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
              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <Building className="text-primary-600" size={26} />
                  <h2 className="text-xl md:text-2xl font-bold font-poppins text-slate-900">À propos de l'établissement</h2>
                </div>
                
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-poppins prose-a:text-primary-600 leading-relaxed text-slate-700">
                  {structure.description_detaillee ? (
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(structure.description_detaillee) }} />
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

              <FormationsSection formations={formations} />
            </section>

          </div>

          {/* COLONNE DROITE (Sidebar Infos) */}
          <div className="space-y-8">
            
            {/* DOMAINES DE FORMATION */}
            {domainesList.length > 0 && (
              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="font-bold text-xl text-slate-900 font-poppins mb-4">Domaines de formation</h3>
                <ul className="space-y-2.5 text-slate-700">
                  {domainesList.map((dom, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 hover:text-primary-600 transition-colors">
                      <span className="text-primary-600 font-bold mt-0.5 shrink-0">•</span>
                      <span className="font-medium leading-snug">{dom}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* DIPLÔMES PROPOSÉS */}
            {diplomesList.length > 0 && (
              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="font-bold text-xl text-slate-900 font-poppins mb-4">Diplômes proposés</h3>
                <ul className="space-y-2.5 text-slate-700">
                  {diplomesList.map((dip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 hover:text-primary-600 transition-colors">
                      <span className="text-cta-600 font-bold mt-0.5 shrink-0">•</span>
                      <span className="font-medium leading-snug">{dip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

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
                        {getSocialIcon(reseau)}
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
                    {structure.pays_intervention?.join(', ') || 'Togo'}
                  </span>
                </li>
              </ul>
            </Card>

          </div>

        </div>
      </div>

      {/* SECTION DÉCOUVRIR D'AUTRES ÉTABLISSEMENTS */}
      {similarStructures && similarStructures.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="border-t border-slate-200 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900">
                  Découvrir d'autres établissements
                </h2>
                <p className="text-slate-500 mt-1">
                  Explorez d'autres opportunités de formation et d'accompagnement
                </p>
              </div>
              <Link href="/annuaire">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl font-bold border-slate-300 hover:bg-slate-100">
                  Voir tout l'annuaire
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarStructures.map((item: any) => {
                const website = item.site_web_officiel || item.lien;
                let fallbackLogoUrl = item.logo_url;
                if (!fallbackLogoUrl && website) {
                  try {
                    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
                    fallbackLogoUrl = `https://logo.clearbit.com/${url.hostname}`;
                  } catch (e) {}
                }

                return (
                  <Link 
                    key={item.id} 
                    href={`/annuaire/${item.slug}`}
                    className="group block h-full"
                  >
                    <Card className="p-6 border-slate-200 shadow-sm rounded-2xl bg-white hover:shadow-lg hover:border-primary-200 transition-all h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <LogoImage 
                            src={fallbackLogoUrl} 
                            website={website}
                            alt={item.nom} 
                            fallbackLetter={item.nom}
                            containerClassName="w-14 h-14 rounded-xl shadow-sm border border-slate-100 p-2 text-xl shrink-0"
                            className="w-full h-full"
                          />
                          <div>
                            <span className="inline-block px-2.5 py-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-full">
                              {item.type?.replace(/_/g, ' ')}
                            </span>
                            <h3 className="font-bold font-poppins text-slate-900 text-base line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                              {item.nom}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {item.mission}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700">
                        <span>En savoir plus</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
