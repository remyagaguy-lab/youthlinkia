import Link from 'next/link'
import { Calendar, MapPin, Building, Clock, ArrowRight } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'

type OpportuniteProps = {
  id: string
  titre: string
  type: string
  pays_diffusion: string[]
  deadline: string | null
  slug: string
  created_at: string
}

export function OpportuniteCard({ opp }: { opp: OpportuniteProps }) {
  const daysUntilDeadline = opp.deadline ? differenceInDays(new Date(opp.deadline), new Date()) : null
  const daysSincePublished = differenceInDays(new Date(), new Date(opp.created_at))

  // Déterminer la couleur de la deadline
  let deadlineColor = "text-gray-600 bg-gray-100"
  if (daysUntilDeadline !== null) {
    if (daysUntilDeadline < 0) {
      deadlineColor = "text-red-800 bg-red-100"
    } else if (daysUntilDeadline <= 7) {
      deadlineColor = "text-red-700 bg-red-50"
    } else if (daysUntilDeadline <= 15) {
      deadlineColor = "text-orange-700 bg-orange-50"
    } else {
      deadlineColor = "text-green-700 bg-green-50"
    }
  }

  const typeLabels: Record<string, string> = {
    bourse: "Bourse",
    emploi: "Emploi",
    stage: "Stage",
    formation: "Formation",
    concours: "Concours"
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
            {typeLabels[opp.type] || opp.type}
          </span>
          {daysSincePublished <= 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
              Nouveau
            </span>
          )}
        </div>
        
        <Link href={`/opportunites/${opp.slug}`} className="block group-hover:text-primary-600 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {opp.titre}
          </h3>
        </Link>
        
        <div className="space-y-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="truncate">Structure partenaire</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{opp.pays_diffusion?.[0] || 'Non spécifié'}</span>
          </div>
          
          {opp.deadline && (
            <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded-md mt-2 ${deadlineColor}`}>
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-xs">
                {daysUntilDeadline && daysUntilDeadline < 0 
                  ? "Expirée" 
                  : `Avant le ${format(new Date(opp.deadline), 'dd MMMM yyyy', { locale: fr })}`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Publié il y a {daysSincePublished === 0 ? "aujourd'hui" : `${daysSincePublished} j`}</span>
        </div>
        
        <Link 
          href={`/opportunites/${opp.slug}`}
          className="text-sm font-semibold text-primary-600 flex items-center gap-1 hover:text-primary-800 transition-colors"
        >
          Voir détails <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
