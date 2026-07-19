import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Image src="/brand/logo-color.png" alt="YouthLinkIA Logo" width={150} height={40} className="object-contain" />
          <nav className="hidden md:flex gap-6">
            <span className="font-semibold text-[var(--color-primary)]">Accueil</span>
            <span className="text-[var(--color-text-secondary)]">Opportunités</span>
            <span className="text-[var(--color-text-secondary)]">Annuaire</span>
          </nav>
          <div className="hidden md:flex gap-4">
            <Button variant="outline">Connexion</Button>
            <Button variant="cta">Inscription</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
        {/* Typography Section */}
        <section className="space-y-4">
          <h1 className="text-4xl font-heading font-bold text-[var(--color-primary)]">
            Design System YouthLinkIA
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Ceci est un aperçu des composants UI construits selon la charte graphique et éditoriale (Section 6).
            La police des titres est <strong>Poppins</strong> et le corps de texte est en <strong>Inter</strong>.
          </p>
        </section>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-[var(--color-primary)] border-b pb-2">Couleurs Principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 rounded-xl bg-[var(--color-primary)] flex items-end p-3 text-white font-medium shadow-sm">Primaire</div>
            <div className="h-24 rounded-xl bg-[var(--color-cta)] flex items-end p-3 text-white font-medium shadow-sm">CTA (Rouge)</div>
            <div className="h-24 rounded-xl bg-[var(--color-accent)] flex items-end p-3 text-white font-medium shadow-sm text-black">Accent (Cyan)</div>
            <div className="h-24 rounded-xl bg-[var(--color-background)] border flex items-end p-3 text-[var(--color-text-secondary)] font-medium shadow-sm">Background</div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-[var(--color-primary)] border-b pb-2">Boutons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primaire</Button>
            <Button variant="cta">Action (CTA)</Button>
            <Button variant="outline">Contour</Button>
            <Button variant="ghost">Fantôme</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-[var(--color-primary)] border-b pb-2">Badges de Statut</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success">Sélectionné</Badge>
            <Badge variant="warning">En attente</Badge>
            <Badge variant="neutral">Brouillon</Badge>
            <Badge variant="info">Nouveau</Badge>
          </div>
        </section>

        {/* Forms & Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-[var(--color-primary)] border-b pb-2">Formulaires et Cartes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connexion à l'espace</CardTitle>
                <CardDescription>Accédez à vos opportunités et votre tableau de bord.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-primary)]">Adresse email</label>
                  <Input placeholder="nom@exemple.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-primary)]">Mot de passe</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full">Se connecter</Button>
              </CardFooter>
            </Card>

            <Card className="bg-[var(--color-primary)] text-white border-none">
              <CardHeader>
                <CardTitle className="text-white">Opportunité Spéciale</CardTitle>
                <CardDescription className="text-gray-300">Boostez votre carrière dès aujourd'hui.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200">
                  Découvrez les dernières offres de nos partenaires exclusifs dans le secteur de la technologie.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="cta" className="w-full">Postuler maintenant</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Logo Dark Mode Showcase */}
        <section className="space-y-4 bg-[var(--color-primary)] p-8 rounded-xl">
           <h2 className="text-2xl font-heading font-semibold text-white border-b border-white/20 pb-2">Logo sur fond sombre</h2>
           <Image src="/brand/logo-white.png" alt="YouthLinkIA Logo Blanc" width={200} height={60} className="object-contain" />
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
