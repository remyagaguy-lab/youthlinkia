import { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src="/brand/logo-color.png" alt="YouthLinkIA" className="h-20 object-contain" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
