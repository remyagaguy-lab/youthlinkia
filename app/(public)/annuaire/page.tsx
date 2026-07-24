import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Search, MapPin, Building2 } from 'lucide-react'
import { LogoImage } from '@/components/ui/LogoImage'

export const metadata = {
  title: 'Annuaire des Partenaires | YouthLinkIA',
  description: 'Découvrez les structures académiques, incubateurs et bailleurs de notre réseau.',
}

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; pays?: string; q?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase.from('structures').select('*').eq('statut', 'publiee')

  if (params.type) query = query.eq('type', params.type)
  if (params.pays) query = query.contains('pays_intervention', [params.pays])
  if (params.q) query = query.ilike('nom', `%${params.q}%`)

  const { data: structures } = await query.order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[#0A2239] overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-cta)]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-poppins text-white mb-6 tracking-tight drop-shadow-sm">
            Annuaire des Partenaires
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez les structures d'accompagnement, institutions académiques et entreprises qui forgent l'avenir avec YouthLinkIA.
          </p>
        </div>
      </div>

      {/* Floating Glassmorphism Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-14 relative z-10">
        <form className="bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 border border-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              name="q" 
              defaultValue={params.q || ''} 
              placeholder="Rechercher une structure..." 
              className="w-full pl-12 pr-4 h-12 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-gray-400" 
            />
          </div>
          
          <div className="relative w-full md:w-64 group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <select 
              name="type" 
              defaultValue={params.type || ''} 
              className="w-full pl-12 pr-4 h-12 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none appearance-none cursor-pointer transition-all text-gray-700 font-medium"
            >
              <option value="">Tous les types</option>
              <option value="institution_academique">Institution académique</option>
              <option value="structure_accompagnement">Structure d'accompagnement</option>
              <option value="bailleur">Bailleur de fonds</option>
              <option value="incubateur">Incubateur</option>
              <option value="association">Association</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-64 group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              name="pays" 
              defaultValue={params.pays || ''} 
              placeholder="Ex: Togo" 
              className="w-full pl-12 pr-4 h-12 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-gray-400" 
            />
          </div>

          <Button type="submit" variant="cta" className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-md hover:shadow-xl hover:shadow-[var(--color-cta)]/20 transition-all hover:-translate-y-0.5">
            Filtrer
          </Button>
        </form>
      </div>

      {/* Grid List */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        {structures?.length === 0 && (
          <div className="text-center bg-white rounded-3xl p-16 border border-gray-100 shadow-sm mt-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Nous n'avons trouvé aucune structure correspondant à vos critères de recherche.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {structures?.map((structure) => (
            <Link href={`/annuaire/${structure.slug}`} key={structure.id} className="group outline-none">
              <Card className="h-full bg-white border border-gray-100/80 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4">
                <div className="p-7 flex flex-col h-full relative">
                  <div className="flex items-start gap-5 mb-5">
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
                          containerClassName="w-16 h-16 rounded-xl shadow-sm border border-gray-100 p-2 text-2xl"
                          className="w-full h-full"
                        />
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-3 py-1 mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full">
                        {structure.type.replace(/_/g, ' ')}
                      </span>
                      <h2 className="font-bold font-poppins text-gray-900 text-[17px] leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {structure.nom}
                      </h2>
                    </div>
                  </div>
                  
                  <p className="text-[15px] text-gray-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {structure.mission || "Aucune description fournie pour le moment."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-5 border-t border-gray-50">
                    {structure.pays_intervention.slice(0, 2).map((p: string) => (
                      <span key={p} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-cta)]" />
                        {p}
                      </span>
                    ))}
                    {structure.pays_intervention.length > 2 && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                        +{structure.pays_intervention.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
