import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { OpportuniteCard } from "@/components/ui/OpportuniteCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Sparkles, Search, Compass, BookOpen, Building2, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  // Fetch 6 published opportunities for guest preview
  const { data: opportunites } = await supabase
    .from('opportunites')
    .select('id, titre, type, pays_diffusion, deadline, slug, created_at')
    .eq('statut_moderation', 'publie')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header Public */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/brand/logo-color.png" alt="YouthLinkIA Logo" width={160} height={50} className="h-12 w-auto object-contain" priority />
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
              <Link href="/inscription/lyceen_etudiant">Rejoindre gratuitement</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-16">
        {/* Hero Section */}
        <section className="space-y-6 text-center max-w-4xl mx-auto pt-8 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-[var(--color-primary)] text-xs font-semibold border border-primary-100 shadow-xs">
            <Sparkles className="w-4 h-4 text-[var(--color-cta)]" />
            <span>Accès libre & gratuit — Inscription uniquement pour sauvegarder ou postuler</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[var(--color-primary)] leading-tight tracking-tight">
            Les meilleures opportunités pour la jeunesse, <span className="text-[var(--color-cta)]">triées à la main.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Trouvez les bourses d'études, offres d'emploi, stages et concours au Bénin et en Afrique francophone. Découvrez notre annuaire et nos guides d'orientation librement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button variant="cta" size="lg" className="w-full sm:w-auto px-8 gap-2 font-bold shadow-md" asChild>
              <Link href="/opportunites">
                <Search className="w-5 h-5" />
                <span>Explorer toutes les annonces</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href="/inscription/lyceen_etudiant">
                <span>Créer mon profil membre</span>
              </Link>
            </Button>
          </div>

          {/* Quick Categories Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {[
              { label: "🎓 Bourses d'études", type: "bourse" },
              { label: "💼 Emplois", type: "emploi" },
              { label: "🌱 Stages", type: "stage" },
              { label: "📚 Formations", type: "formation" },
              { label: "🏆 Concours", type: "concours" }
            ].map((cat) => (
              <Link
                key={cat.type}
                href={`/opportunites?type=${cat.type}`}
                className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary-400 hover:text-[var(--color-primary)] transition-all shadow-2xs"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Live Opportunities Grid */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-cta)] mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Opportunités récentes</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary)]">
                Dernières annonces vérifiées
              </h2>
            </div>
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-primary)] hover:text-[var(--color-cta)] transition-colors"
            >
              <span>Voir tout l'annuaire ({opportunites?.length || 0}+ récents)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {opportunites && opportunites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunites.map((opp) => (
                <OpportuniteCard key={opp.id} opp={opp} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium">Aucune opportunité récente disponible pour le moment.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/opportunites">Voir le catalogue d'opportunités</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Partner & Value Proposition Cards */}
        <section className="grid md:grid-cols-2 gap-8 pt-4">
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[var(--color-primary)]">
                Pourquoi rejoindre YouthLinkIA ?
              </CardTitle>
              <CardDescription className="text-gray-600">
                Un espace personnalisé pour propulser vos projets scolaires et professionnels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Sauvegardez vos annonces favorites et suivez l'avancement de vos candidatures.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Recevez des alertes automatiques selon votre niveau et vos centres d'intérêt.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Accédez à l'orientation scolaire et à l'accompagnement à l'entrepreneuriat.</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="cta" className="w-full font-semibold" asChild>
                <Link href="/inscription/lyceen_etudiant">Créer mon compte gratuitement</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-[var(--color-primary)] text-white border-none shadow-md">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Vous êtes une institution ou un partenaire ?
              </CardTitle>
              <CardDescription className="text-gray-200">
                Diffusez vos offres de bourses, emplois et formations auprès des jeunes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-200">
              <p>
                Gagnez en visibilité dans notre annuaire officiel, soumettez vos opportunités en quelques clics et entrez en contact avec les meilleurs talents.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="cta" className="w-full font-semibold" asChild>
                <Link href="/inscription/partenaire">Devenir structure partenaire</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

