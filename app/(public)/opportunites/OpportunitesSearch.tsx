"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OpportunitesSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)

  // Filters state
  const [pays, setPays] = useState(searchParams.get('pays') || '')
  const [secteur, setSecteur] = useState(searchParams.get('secteur') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [niveau, setNiveau] = useState(searchParams.get('niveau') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (pays) params.set('pays', pays)
    if (secteur) params.set('secteur', secteur)
    if (type) params.set('type', type)
    if (niveau) params.set('niveau', niveau)
    
    startTransition(() => {
      router.push(`/opportunites?${params.toString()}`)
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une opportunité..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center transition-colors",
            showFilters ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          Rechercher
        </button>
      </form>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type d'opportunité</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
              <option value="">Tous les types</option>
              <option value="bourse">Bourse d'études</option>
              <option value="emploi">Emploi</option>
              <option value="stage">Stage</option>
              <option value="formation">Formation</option>
              <option value="concours">Concours / Hackathon</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pays</label>
            <input 
              type="text" 
              placeholder="Ex: Togo, France..." 
              value={pays} 
              onChange={(e) => setPays(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Secteur</label>
            <input 
              type="text" 
              placeholder="Ex: Tech, Agriculture..." 
              value={secteur} 
              onChange={(e) => setSecteur(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Niveau d'études</label>
            <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
              <option value="">Tous les niveaux</option>
              <option value="bac">Bac</option>
              <option value="licence">Licence</option>
              <option value="master">Master</option>
              <option value="doctorat">Doctorat</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
