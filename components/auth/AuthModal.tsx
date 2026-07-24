'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  redirectUrl?: string
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Rejoignez YouthLinkIA",
  description = "Créez un compte gratuit ou connectez-vous pour effectuer cette action, sauvegarder des opportunités et recevoir des alertes personnalisées.",
  redirectUrl = "/connexion"
}: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 md:p-8 space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Image
              src="/brand/logo-color.png"
              alt="YouthLinkIA"
              width={140}
              height={45}
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Compte requis</span>
          </div>
          <h3 className="text-xl font-bold font-heading text-[var(--color-primary)]">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="cta"
            className="w-full justify-center gap-2 text-base font-semibold py-3"
            asChild
          >
            <Link href={`/inscription/lyceen_etudiant?next=${encodeURIComponent(redirectUrl)}`}>
              <UserPlus className="w-5 h-5" />
              <span>Créer un compte gratuitement</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center gap-2 text-base font-medium py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
            asChild
          >
            <Link href={`/connexion?next=${encodeURIComponent(redirectUrl)}`}>
              <LogIn className="w-5 h-5" />
              <span>Se connecter</span>
            </Link>
          </Button>
        </div>

        <p className="text-xs text-center text-gray-400">
          Rejoignez gratuitement la communauté YouthLinkIA. Annulation & gestion libre à tout moment.
        </p>
      </div>
    </div>
  )
}
