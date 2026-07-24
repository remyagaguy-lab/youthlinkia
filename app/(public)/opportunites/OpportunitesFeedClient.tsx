'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { OpportuniteCard } from '@/components/ui/OpportuniteCard'
import { Search, SlidersHorizontal, Loader2, RefreshCw, Filter, Sparkles, X, Check, Globe, GraduationCap, Calendar, Clock, Briefcase, Sprout, BookOpen, Trophy } from 'lucide-react'
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

const PAGE_SIZE = 8

export function OpportunitesFeedClient({
  initialOpportunites,
  totalCount: initialTotalCount
}: OpportunitesFeedClientProps) {
  const supabase = createClient()
  const [opportunites, setOpportunites] = useState<OpportuniteItem[]>(initialOpportunites)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
  const [page, setPage] = useState<number>(1)
  
  // Filter States
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPays, setSelectedPays] = useState('')
  const [selectedNiveau, setSelectedNiveau] = useState('')
  const [onlyUrgent, setOnlyUrgent] = useState(false)

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // Loading States
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isFiltering, startFiltering] = useTransition()

  const typesList = [
    { label: "Toutes les catégories", value: "", icon: Sparkles },
    { label: "Bourses d'études", value: "bourse", icon: GraduationCap },
    { label: "Emplois & Volontariat", value: "emploi", icon: Briefcase },
    { label: "Stages & Alternance", value: "stage", icon: Sprout },
    { label: "Formations & Filières", value: "formation", icon: BookOpen },
    { label: "Concours & Challenges", value: "concours", icon: Trophy },
  ]

  const paysList = [
    { label: "Tous les pays", value: "" },
    { label: "Togo", value: "TG" },
    { label: "Bénin", value: "BJ" },
    { label: "Côte d'Ivoire", value: "CI" },
    { label: "Sénégal", value: "SN" },
    { label: "France", value: "FR" },
    { label: "Canada", value: "CA" },
    { label: "International", value: "INT" },
  ]

  const niveauxList = [
    { label: "Tous les niveaux", value: "" },
    { label: "Bac / Bachelier", value: "bac" },
    { label: "Licence / Bachelor", value: "licence" },
    { label: "Master / M1 & M2", value: "master" },
    { label: "Doctorat / PhD", value: "doctorat" },
  ]

  // Count active applied filters
  const activeFiltersCount = (selectedType ? 1 : 0) + (selectedPays ? 1 : 0) + (selectedNiveau ? 1 : 0) + (onlyUrgent ? 1 : 0) + (query ? 1 : 0)

  // Execute Filter Query
  const fetchFilteredOpportunities = async (
    searchQ: string,
    typeVal: string,
    paysVal: string,
    niveauVal: string,
    urgentVal: boolean,
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

    if (urgentVal) {
      const in15Days = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      q = q.lte('deadline', in15Days).gte('deadline', new Date().toISOString())
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
    newNiveau = selectedNiveau,
    newUrgent = onlyUrgent
  ) => {
    startFiltering(() => {
      fetchFilteredOpportunities(newQuery, newType, newPays, newNiveau, newUrgent, true)
    })
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await fetchFilteredOpportunities(query, selectedType, selectedPays, selectedNiveau, onlyUrgent, false)
    setIsLoadingMore(false)
  }

  const handleReset = () => {
    setQuery('')
    setSelectedType('')
    setSelectedPays('')
    setSelectedNiveau('')
    setOnlyUrgent(false)
    handleFilterChange('', '', '', '', false)
  }

  const hasMore = opportunites.length < totalCount

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileDrawerOpen])

  return (
    <div className="space-y-6">
      
      {/* 📱 MOBILE SEARCH BAR & DRAWER TRIGGER (Visible on small & medium screens) */}
      <div className="lg:hidden space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une bourse, un emploi..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleFilterChange(e.target.value, selectedType, selectedPays, selectedNiveau, onlyUrgent)
              }}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] text-sm outline-none shadow-xs"
            />
          </div>

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xs shrink-0 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-cta)] text-white text-xs font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Horizontal Type Pills on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {typesList.map((t) => {
            const IconComp = t.icon
            return (
              <button
                key={t.value}
                onClick={() => {
                  const val = selectedType === t.value ? '' : t.value
                  setSelectedType(val)
                  handleFilterChange(query, val, selectedPays, selectedNiveau, onlyUrgent)
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  selectedType === t.value
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 💻 DESKTOP GRID LAYOUT (Main Content Left + Advanced Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Opportunity Cards & Load More */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Bar with Search Input (Desktop) */}
          <div className="hidden lg:flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par mot-clé, domaine, organisme..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  handleFilterChange(e.target.value, selectedType, selectedPays, selectedNiveau, onlyUrgent)
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] text-sm outline-none transition-all"
              />
            </div>

            <div className="text-xs text-gray-500 font-semibold whitespace-nowrap">
              {isFiltering ? (
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mise à jour...
                </span>
              ) : (
                `${totalCount} opportunité${totalCount > 1 ? 's' : ''}`
              )}
            </div>
          </div>

          {/* Active Filter Badges Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-primary-50/60 rounded-xl border border-primary-100 text-xs">
              <span className="font-bold text-[var(--color-primary)] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtres actifs :
              </span>
              {selectedType && (
                <span className="px-2.5 py-1 rounded-md bg-white border border-primary-200 text-primary-800 font-semibold flex items-center gap-1">
                  Catégorie : {typesList.find(t => t.value === selectedType)?.label}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => { setSelectedType(''); handleFilterChange(query, '', selectedPays, selectedNiveau, onlyUrgent); }} />
                </span>
              )}
              {selectedPays && (
                <span className="px-2.5 py-1 rounded-md bg-white border border-primary-200 text-primary-800 font-semibold flex items-center gap-1">
                  Pays : {paysList.find(p => p.value === selectedPays)?.label}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => { setSelectedPays(''); handleFilterChange(query, selectedType, '', selectedNiveau, onlyUrgent); }} />
                </span>
              )}
              {selectedNiveau && (
                <span className="px-2.5 py-1 rounded-md bg-white border border-primary-200 text-primary-800 font-semibold flex items-center gap-1">
                  Niveau : {niveauxList.find(n => n.value === selectedNiveau)?.label}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => { setSelectedNiveau(''); handleFilterChange(query, selectedType, selectedPays, '', onlyUrgent); }} />
                </span>
              )}
              {onlyUrgent && (
                <span className="px-2.5 py-1 rounded-md bg-white border border-primary-200 text-primary-800 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-cta)]" /> Clôture sous 15j
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => { setOnlyUrgent(false); handleFilterChange(query, selectedType, selectedPays, selectedNiveau, false); }} />
                </span>
              )}
              <button onClick={handleReset} className="ml-auto text-xs font-bold text-red-600 hover:underline">
                Tout effacer
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {opportunites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {opportunites.map((opp) => (
                <OpportuniteCard key={opp.id} opp={opp} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">Aucune opportunité ne correspond à ces critères</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Modifiez vos filtres ou effectuez une nouvelle recherche.
              </p>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Réinitialiser les filtres
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
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-md gap-2.5 rounded-xl transition-all"
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
              ✓ Vous avez consulté toutes les {totalCount} opportunités actuellement disponibles.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Advanced Filter Panel (Desktop Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 font-bold text-[var(--color-primary)] text-base font-heading">
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-cta)]" />
                <span>Filtres Avancés</span>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            {/* Filter 1: Type / Category */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600">
                1. Catégorie d'opportunité
              </label>
              <div className="space-y-1.5">
                {typesList.map((t) => {
                  const isChecked = selectedType === t.value
                  const IconComp = t.icon
                  return (
                    <button
                      key={t.value}
                      onClick={() => {
                        setSelectedType(t.value)
                        handleFilterChange(query, t.value, selectedPays, selectedNiveau, onlyUrgent)
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isChecked
                          ? "bg-primary-50 text-[var(--color-primary)] border border-primary-200 font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <IconComp className="w-4 h-4 text-[var(--color-primary)]" />
                        <span>{t.label}</span>
                      </span>
                      {isChecked && <Check className="w-4 h-4 text-[var(--color-primary)]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter 2: Pays / Geographic Area */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                2. Zone / Pays de diffusion
              </label>
              <select
                value={selectedPays}
                onChange={(e) => {
                  setSelectedPays(e.target.value)
                  handleFilterChange(query, selectedType, e.target.value, selectedNiveau, onlyUrgent)
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                {paysList.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Niveau d'études */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                3. Niveau d'études requis
              </label>
              <select
                value={selectedNiveau}
                onChange={(e) => {
                  setSelectedNiveau(e.target.value)
                  handleFilterChange(query, selectedType, selectedPays, e.target.value, onlyUrgent)
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                {niveauxList.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 4: Deadline urgente */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-[var(--color-cta)]" />
                  <span>Clôture sous 15 jours</span>
                </span>
                <input
                  type="checkbox"
                  checked={onlyUrgent}
                  onChange={(e) => {
                    setOnlyUrgent(e.target.checked)
                    handleFilterChange(query, selectedType, selectedPays, selectedNiveau, e.target.checked)
                  }}
                  className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-primary-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Apply Button Summary */}
            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full justify-center text-xs font-bold py-3 rounded-xl"
                onClick={() => handleFilterChange()}
              >
                Appliquer les filtres ({totalCount})
              </Button>
            </div>

          </div>
        </div>

      </div>

      {/* 📱 SLIDE-OVER MOBILE FILTER DRAWER (Mobile Modal) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />

          {/* Drawer Container */}
          <div className="bg-white rounded-t-3xl border-t border-gray-200 max-h-[85vh] flex flex-col shadow-2xl animate-slideUp">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div className="flex items-center gap-2 font-bold text-[var(--color-primary)] text-base font-heading">
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-cta)]" />
                <span>Filtres Avancés ({activeFiltersCount})</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Category Filter */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  1. Catégorie
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {typesList.map((t) => {
                    const isChecked = selectedType === t.value
                    const IconComp = t.icon
                    return (
                      <button
                        key={t.value}
                        onClick={() => setSelectedType(t.value)}
                        className={`p-3 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all ${
                          isChecked
                            ? "bg-primary-50 border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <IconComp className="w-4 h-4 text-[var(--color-primary)]" />
                          <span>{t.label}</span>
                        </span>
                        {isChecked && <Check className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Country Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  2. Pays de diffusion
                </label>
                <select
                  value={selectedPays}
                  onChange={(e) => setSelectedPays(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none"
                >
                  {paysList.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  3. Niveau d'études
                </label>
                <select
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none"
                >
                  {niveauxList.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deadline Checkbox */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-cta)]" />
                    <span>Urgent (Clôture sous 15 jours)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyUrgent}
                    onChange={(e) => setOnlyUrgent(e.target.checked)}
                    className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-primary-500"
                  />
                </label>
              </div>

            </div>

            {/* Drawer Footer Actions Sticky */}
            <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Réinitialiser
              </button>

              <Button
                variant="cta"
                className="flex-1 font-bold text-sm py-3.5 justify-center shadow-md"
                onClick={() => {
                  handleFilterChange()
                  setIsMobileDrawerOpen(false)
                }}
              >
                Voir les résultats ({totalCount})
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

