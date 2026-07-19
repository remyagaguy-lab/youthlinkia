import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/brand/logo-color.png" alt="YouthLinkIA Logo" width={150} height={40} className="object-contain" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="font-semibold text-[var(--color-primary)] hover:opacity-80">Accueil</Link>
            <Link href="/opportunites" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">Opportunités</Link>
            <Link href="/annuaire" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">Annuaire</Link>
          </nav>
          <div className="hidden md:flex gap-4">
            <Button variant="outline" asChild><Link href="/connexion">Connexion</Link></Button>
            <Button variant="cta" asChild><Link href="/inscription/lyceen_etudiant">Inscription</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
        {/* Hero Section */}
        <section className="space-y-6 text-center max-w-3xl mx-auto py-12">
          <Badge variant="info" className="mb-4">Version Beta MVP</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--color-primary)] leading-tight">
            Bienvenue sur YouthLinkIA
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            La plateforme d'orientation scolaire, d'insertion professionnelle et d'entrepreneuriat pour la jeunesse francophone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="cta" size="lg" asChild>
              <Link href="/inscription/lyceen_etudiant">Créer mon profil</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/opportunites">Explorer les opportunités</Link>
            </Button>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connexion à l'espace</CardTitle>
                <CardDescription>Accédez à votre tableau de bord personnel ou partenaire.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">Retrouvez vos opportunités sauvegardées, suivez vos candidatures et accédez aux ressources premium.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full" asChild>
                  <Link href="/connexion">Se connecter</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[var(--color-primary)] text-white border-none">
              <CardHeader>
                <CardTitle className="text-white">Devenir Partenaire</CardTitle>
                <CardDescription className="text-gray-300">Rejoignez notre réseau de structures d'accompagnement.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200">
                  Publiez vos opportunités, rendez-vous visible dans l'annuaire et accompagnez la jeunesse vers le succès.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="cta" className="w-full" asChild>
                  <Link href="/inscription/partenaire">Créer un compte partenaire</Link>
                </Button>
              </CardFooter>
            </Card>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
