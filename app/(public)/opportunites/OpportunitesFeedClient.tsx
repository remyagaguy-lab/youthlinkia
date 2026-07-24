'use client'

import React, { useState, useTransition } from 'react'
import { OpportuniteCard } from '@/components/ui/OpportuniteCard'
import { Search, SlidersHorizontal, Loader2, RefreshCw, Filter, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface OpportuniteItem {
  id: string
  titre: string
  type: string
  pays_diffusion: string[]
  deadline: string | null
  slug: string
  created_at: string
}

interface OpportunitesFeedClientProps {
  initialOpportunites: OpportuniteItem[]
  totalCount: number
}

const PAGE_SIZE = 9

export function OpportunitesFeedClient({
  initialOpportunites,
  totalCount: initialTotalCount
}: OpportunitesFeedClientProps) {
  const supabase = createClient()
  const [opportunites, setOpportunites] = useState<OpportuniteItem[]>(initialOpportunites)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
  const [page, setPage] = useState<number>(1)
  
  // Filter states
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPays, setSelectedPays] = useState('')
  const [selectedNiveau, setSelectedNiveau] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Loading states
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isFiltering, startFiltering] = useTransition()

  // Types definitions
  const typesList = [
    { label: "Toutes", value: "" },
    { label: "🎓 Bourses", value: "bourse" },
    { label: "💼 Emplois", value: "emploi" },
    { label: "🌱 Stages", value: "stage" },
    { label: "📚 Formations", value: "formation" },
    { label: "🏆 Concours", value: "concours" },
  ]

  // Execute Filter Search
  const fetchFilteredOpportunities = async (
    searchQ: string,
    typeVal: string,
    paysVal: string,
    niveauVal: string,
    resetPage = true
  ) => {
    let q = supabase
      .from('opportunites')
      .select('id, titre, type, pays_diffusion, deadline, slug, created_at', { count: 'exact' })
      .eq('statut_moderation', 'publie')

    if (searchQ.trim()) {
      q = q.or(`titre.ilike.%${searchQ}%,description.ilike.%${searchQ}%`)
    }

    if (typeVal) {
      q = q.eq('type', typeVal)
    }

    if (paysVal) {
      q = q.contains('pays_diffusion', [paysVal])
    }

    if (niveauVal) {
      q = q.ilike('niveau_requis', `%${niveauVal}%`)
    }

    const targetPage = resetPage ? 1 : page + 1
    const from = resetPage ? 0 : page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    q = q.order('created_at', { ascending: false }).range(from, to)

    const { data, count, error } = await q

    if (!error && data) {
      if (resetPage) {
        setOpportunites(data as OpportuniteItem[])
        setPage(1)
      } else {
        setOpportunites((prev) => [...prev, ...(data as OpportuniteItem[])])
        setPage(targetPage)
      }
      if (count !== null) setTotalCount(count)
    }
  }

  const handleFilterChange = (
    newQuery = query,
    newType = selectedType,
    newPays = selectedPays,
    newNiveau = selectedNiveau
  ) => {
    startFiltering(() => {
      fetchFilteredOpportunities(newQuery, newType, newPays, newNiveau, true)
    })
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await fetchFilteredOpportunities(query, selectedType, selectedPays, selectedNiveau, false)
    setIsLoadingMore(false)
  }

  const handleReset = () => {
    setQuery('')
    setSelectedType('')
    setSelectedPays('')
    setSelectedNiveau('')
    handleFilterChange('', '', '', '')
  }

  const hasMore = opportunites.length < totalCount

  return (
    <div className="space-y-8">
      {/* 🔍 FILTRE PRINCIPAL EN HAUT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
        {/* Search Bar + Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une bourse, un emploi, une formation..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleFilterChange(e.target.value, selectedType, selectedPays, selectedNiveau)
              }}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                showAdvancedFilters || selectedPays || selectedNiveau
                  ? "bg-primary-50 border-primary-200 text-[var(--color-primary)]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
            </button>

            {(query || selectedType || selectedPays || selectedNiveau) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-xs font-semibold flex items-center gap-1.5"
                title="Réinitialiser les filtres"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Effacer</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Catégories:
          </span>
          {typesList.map((cat) => {
            const isSelected = selectedType === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedType(cat.value)
                  handleFilterChange(query, cat.value, selectedPays, selectedNiveau)
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[var(--color-primary)] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Advanced Filters Dropdown */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                📍 Filtrer par pays
              </label>
              <select
                value={selectedPays}
                onChange={(e) => {
                  setSelectedPays(e.target.value)
                  handleFilterChange(query, selectedType, e.target.value, selectedNiveau)
                }}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les pays</option>
                <option value="TG">Togo 🇹🇬</option>
                <option value="CI">Côte d'Ivoire 🇨🇮</option>
                <option value="SN">Sénégal 🇸🇳</option>
                <option value="BJ">Bénin 🇧🇯</option>
                <option value="FR">France 🇫🇷</option>
                <option value="CA">Canada 🇨🇦</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                🎓 Niveau d'études requis
              </label>
              <select
                value={selectedNiveau}
                onChange={(e) => {
                  setSelectedNiveau(e.target.value)
                  handleFilterChange(query, selectedType, selectedPays, e.target.value)
                }}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les niveaux</option>
                <option value="bac">Bac / Bachelier</option>
                <option value="licence">Licence / Bachelor</option>
                <option value="master">Master</option>
                <option value="doctorat">Doctorat / PhD</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Header Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 font-medium px-1">
        <span>
          {isFiltering ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
              Recherche en cours...
            </span>
          ) : (
            `${totalCount} opportunité${totalCount > 1 ? 's' : ''} disponible${totalCount > 1 ? 's' : ''}`
          )}
        </span>
        {opportunites.length > 0 && (
          <span className="text-xs text-gray-400">
            Affichage de 1 à {opportunites.length} sur {totalCount}
          </span>
        )}
      </div>

      {/* 📦 GRILLE D'OPPORTUNITÉS */}
      {opportunites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunites.map((opp) => (
            <OpportuniteCard key={opp.id} opp={opp} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <div className="text-4xl">🔎</div>
          <h3 className="text-lg font-bold text-gray-900">Aucune opportunité ne correspond à ces critères</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Essayez de modifier votre mot-clé ou de réinitialiser les filtres pour afficher davantage de bourses et d'offres.
          </p>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Réinitialiser tous les filtres
          </Button>
        </div>
      )}

      {/* 🔘 BOUTON CHARGER PLUS EN BAS */}
      {hasMore && (
        <div className="pt-6 pb-4 flex justify-center">
          <Button
            variant="cta"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3.5 text-base font-bold shadow-md gap-2.5 rounded-xl transition-all"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Chargement des opportunités...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Charger plus d'opportunités ({totalCount - opportunites.length} restantes)</span>
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && opportunites.length > 0 && (
        <div className="text-center py-6 text-xs text-gray-400 font-medium border-t border-gray-200/60 mt-8">
          ✓ Vous avez consulté toutes les opportunités actuellement disponibles.
        </div>
      )}
    </div>
  )
}
