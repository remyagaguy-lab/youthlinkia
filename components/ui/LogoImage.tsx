'use client'

import { useState } from 'react'

interface LogoImageProps {
  src: string | null
  website?: string | null
  alt: string
  fallbackLetter: string
  className?: string
  containerClassName?: string
}

export function LogoImage({ src, website, alt, fallbackLetter, className, containerClassName }: LogoImageProps) {
  const [errorLevel, setErrorLevel] = useState(0)

  const getHostname = () => {
    if (website) {
      try {
        const url = new URL(website.startsWith('http') ? website : `https://${website}`);
        return url.hostname;
      } catch (e) {}
    }
    if (src && src.includes('logo.clearbit.com/')) {
      return src.split('logo.clearbit.com/')[1]
    }
    return null
  }

  const hostname = getHostname()

  // Niveau 0: src d'origine (AI ou Clearbit)
  // Niveau 1: Google Favicon (basé sur le site web)
  // Niveau 2: Lettre
  const currentSrc = errorLevel === 0 ? src : (errorLevel === 1 && hostname) ? `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=128` : null

  if (!currentSrc || errorLevel >= 2) {
    return (
      <div className={`bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-cta)] flex items-center justify-center text-white font-bold flex-shrink-0 ${containerClassName || ''}`}>
        {fallbackLetter.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`bg-white flex-shrink-0 flex items-center justify-center overflow-hidden ${containerClassName || ''}`}>
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`object-contain ${className || ''}`}
        onError={() => setErrorLevel(prev => prev + 1)}
      />
    </div>
  )
}
