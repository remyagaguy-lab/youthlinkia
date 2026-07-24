import Image from "next/image";
import Link from "next/link";
import { Compass, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PublicHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/logo-color.png" alt="YouthLinkIA Logo" width={160} height={50} className="h-14 w-auto object-contain scale-[2.2] origin-left" priority />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
          <Link href="/" className="font-bold text-[var(--color-primary)]">Accueil</Link>
          <Link href="/opportunites" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-gray-400" />
            <span>Explorer les opportunités</span>
          </Link>
          <Link href="/annuaire" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span>Annuaire des structures</span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/connexion">Se connecter</Link>
          </Button>
          <Button variant="cta" size="sm" asChild>
            <Link href="/inscription/lyceen_etudiant">Rejoindre l'écosystème</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
