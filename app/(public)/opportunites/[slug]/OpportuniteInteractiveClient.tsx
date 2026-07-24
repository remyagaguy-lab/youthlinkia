'use client'

import { useState, useTransition } from 'react'
import { Bookmark, BookmarkCheck, Bell } from 'lucide-react'
import { toggleSuivre } from '../actions'
import { AuthModal } from '@/components/auth/AuthModal'

export function OpportuniteInteractiveClient({ opportuniteId, initialIsFollowing }: { opportuniteId: string, initialIsFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [modalDescription, setModalDescription] = useState("")

  const handleToggle = () => {
    const newState = !isFollowing
    setIsFollowing(newState) // Optimistic update
    
    startTransition(async () => {
      const res = await toggleSuivre(opportuniteId, !newState)
      if (res?.error) {
        setIsFollowing(!newState) // Revert on error
        setModalDescription("Créez un compte gratuit pour sauvegarder des opportunités et les retrouver sur votre tableau de bord.")
        setShowAuthModal(true)
      }
    })
  }

  const handleAlertClick = () => {
    setModalDescription("Inscrivez-vous pour créer des alertes personnalisées et recevoir les opportunités similaires directement par email.")
    setShowAuthModal(true)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={handleToggle}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
            isFollowing 
              ? "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {isFollowing ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-primary-600" />
              <span>Suivie</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span>Suivre l'opportunité</span>
            </>
          )}
        </button>
        
        <button 
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={handleAlertClick}
        >
          <Bell className="w-4 h-4 text-gray-500" />
          <span>Créer une alerte</span>
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Connexion nécessaire"
        description={modalDescription}
      />
    </>
  )
}
