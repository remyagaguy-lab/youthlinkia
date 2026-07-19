"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Compass, BookOpen, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname();

  const tabs = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Opportunités", href: "/opportunites", icon: Compass },
    { name: "Annuaire", href: "/annuaire", icon: BookOpen },
    { name: "Profil", href: "/profil", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-[var(--color-background)] md:hidden safe-area-bottom">
      <div className="grid h-full w-full grid-cols-4 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 hover:bg-gray-50 active:bg-gray-100 transition-colors",
                isActive ? "text-[var(--color-cta)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current opacity-20 stroke-2")} />
              <span className="text-[10px] font-medium leading-none">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
