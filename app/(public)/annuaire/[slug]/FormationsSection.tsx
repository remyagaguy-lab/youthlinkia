'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react'

interface FormationsSectionProps {
  formations: any[]
  structureSlug?: string
}

export function FormationsSection({ formations, structureSlug }: FormationsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout')

  const getCategory = (form: any) => {
    const text = `${form.filiere || ''} ${form.nom || ''} ${form.niveau || ''} ${form.domaine || ''}`.toLowerCase();
    if (text.includes('faculté') || text.includes('facultes') || text.includes('fdd') || text.includes('fshs') || text.includes('flla') || text.includes('fss') || text.includes('fsen') || text.includes('faseg')) {
      return "Facultés";
    }
    if (text.includes('école') || text.includes('ecole') || text.includes('ensi') || text.includes('esa') || text.includes('estba') || text.includes('eam') || text.includes('essd')) {
      return "Écoles Supérieures";
    }
    if (text.includes('institut') || text.includes('inse') || text.includes('iut') || text.includes('injs') || text.includes('isica') || text.includes('i2m') || text.includes('infa') || text.includes('infts') || text.includes('ic-ul') || text.includes('iasm')) {
      return "Instituts";
    }
    if (text.includes('centre') || text.includes('cersa') || text.includes('cerme') || text.includes('cervida') || text.includes('cfrsp') || text.includes('cic') || text.includes('cer')) {
      return "Centres d'Excellence & de Recherche";
    }
    if (text.includes('licence') || text.includes('bachelor') || text.includes('bts') || text.includes('dut')) {
      return "Licence / 1er Cycle";
    }
    if (text.includes('master') || text.includes('ingénieur') || text.includes('mba')) {
      return "Master / 2nd Cycle";
    }
    if (text.includes('doctorat') || text.includes('phd') || text.includes('thèse')) {
      return "Doctorat / 3ème Cycle";
    }
    return "Autres Formations";
  };

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    formations.forEach((form) => {
      const cat = getCategory(form);
      cats.add(cat);
    });
    const order = ["Facultés", "Écoles Supérieures", "Instituts", "Centres d'Excellence & de Recherche", "Licence / 1er Cycle", "Master / 2nd Cycle", "Doctorat / 3ème Cycle", "Autres Formations"];
    return ["Tout", ...Array.from(cats).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    })];
  }, [formations]);

  const filteredFormations = useMemo(() => {
    if (selectedCategory === 'Tout') return formations;
    return formations.filter(form => getCategory(form) === selectedCategory);
  }, [formations, selectedCategory]);

  if (!formations || formations.length === 0) {
    return (
      <Card className="p-10 border-slate-200 bg-white rounded-2xl text-center border-dashed">
        <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-500 font-medium">Les détails des formations seront bientôt disponibles.</p>
      </Card>
    );
  }

  return (
    <div>
      {/* BOUTONS DE FILTRE */}
      {availableCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 whitespace-nowrap">
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "Tout" ? formations.length : formations.filter(f => getCategory(f) === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  isSelected 
                    ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-600/20 scale-[1.02]' 
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 font-semibold'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* LISTE DES FORMATIONS / COMPOSANTES */}
      <div className="space-y-3">
        {filteredFormations.map((form: any, idx: number) => {
          const filiere = form.filiere || form.nom || form.description || 'Formation';
          const defaultSlug = encodeURIComponent(filiere.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
          const targetUrl = structureSlug ? `/annuaire/${structureSlug}/composante/${form.slug || defaultSlug}` : '#';
          const badgeText = form.domaine || (form.niveau && form.niveau !== "Reconnu par le CAMES" ? form.niveau : null) || form.badge || getCategory(form);

          return (
            <Link 
              key={idx} 
              href={targetUrl}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-primary-500 hover:shadow-md hover:bg-slate-50/60 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 pr-2">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:scale-105 transition-all shadow-2xs">
                  <GraduationCap className="text-primary-600 group-hover:text-white transition-colors" size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-white bg-primary-600 rounded-md shrink-0 shadow-2xs uppercase tracking-wider">
                      {badgeText}
                    </span>
                    {form.category && form.category !== badgeText && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md uppercase tracking-wider">
                        {form.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-primary-600 transition-colors leading-snug">
                    {filiere}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white px-3.5 py-2 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0 shadow-2xs self-end sm:self-center">
                <span>Voir parcours</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}
