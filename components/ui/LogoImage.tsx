'use client'

import { useState } from 'react'

interface LogoImageProps {
  src: string | null
  alt: string
  fallbackLetter: string
  className?: string
  containerClassName?: string
}

export function LogoImage({ src, alt, fallbackLetter, className, containerClassName }: LogoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={`bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-cta)] flex items-center justify-center text-white font-bold flex-shrink-0 ${containerClassName || ''}`}>
        {fallbackLetter.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`bg-white flex-shrink-0 flex items-center justify-center overflow-hidden ${containerClassName || ''}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`object-contain ${className || ''}`}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
