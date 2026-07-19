'use client'

import { useState, useTransition } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toggleSuivre } from '../actions'

export function OpportuniteInteractiveClient({ opportuniteId, initialIsFollowing }: { opportuniteId: string, initialIsFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newState = !isFollowing
    setIsFollowing(newState) // Optimistic update
    
    startTransition(async () => {
      const res = await toggleSuivre(opportuniteId, !newState)
      if (res?.error) {
        setIsFollowing(!newState) // Revert on error
        alert("Erreur: " + res.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isFollowing 
            ? "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100" 
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isFollowing ? (
          <>
            <BookmarkCheck className="w-5 h-5" />
            <span>Suivie</span>
          </>
        ) : (
          <>
            <Bookmark className="w-5 h-5" />
            <span>Suivre l'opportunité</span>
          </>
        )}
      </button>
      
      {/* Bouton Créer une alerte (Ouvre une modale dans une version avancée) */}
      <button 
        className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
        onClick={() => alert("Fonctionnalité 'Créer une alerte' en cours de développement")}
      >
        Créer une alerte similaire
      </button>
    </div>
  )
}
