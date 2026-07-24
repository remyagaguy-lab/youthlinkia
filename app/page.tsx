import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { OpportuniteCard } from "@/components/ui/OpportuniteCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Compass, Building2, Briefcase, Lightbulb, Users, CheckCircle2, Rocket, GraduationCap, Sprout, BookOpen, Trophy } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  // Fetch 6 published opportunities for public preview
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
              <Link href="/inscription/lyceen_etudiant">Rejoindre l'écosystème</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-16">
        {/* Hero Section - Official YouthLinkIA Positioning */}
        <section className="grid md:grid-cols-2 gap-8 items-center pt-8 pb-12 max-w-6xl mx-auto">
          {/* Left Column: Content */}
          <div className="space-y-6 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[var(--color-primary)] leading-tight tracking-tight">
              La boussole intelligente qui connecte vos ambitions <span className="text-[var(--color-cta)]">aux opportunités.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
              YouthLinkIA accompagne les jeunes talents dans leur transition de l'école vers le monde professionnel. Accédez librement aux bourses d'études, offres d'emploi, stages et programmes d'accompagnement au Togo et en Afrique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-3">
              <Button variant="cta" size="lg" className="w-full sm:w-auto px-8 gap-2 font-bold shadow-md hover:-translate-y-1 transition-transform" asChild>
                <Link href="/opportunites">
                  <Compass className="w-5 h-5" />
                  <span>Explorer les opportunités</span>
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                <Link href="/inscription/lyceen_etudiant">
                  <span>Créer mon profil membre</span>
                </Link>
              </Button>
            </div>

            {/* Quick Category Quick Links Container */}
            <div className="pt-4">
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap justify-start items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">Accès rapide:</span>
                {[
                  { label: "Bourses", type: "bourse", icon: GraduationCap },
                  { label: "Emploi", type: "emploi", icon: Briefcase },
                  { label: "Stages", type: "stage", icon: Sprout },
                  { label: "Formations", type: "formation", icon: BookOpen },
                  { label: "Concours", type: "concours", icon: Trophy }
                ].map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <Link
                      key={cat.type}
                      href={`/opportunites?type=${cat.type}`}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shadow-2xs flex items-center gap-1.5 group"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-[var(--color-primary)] group-hover:text-white" />
                      <span>{cat.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: La Boussole Intelligente (The Intelligent Compass) */}
          <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center lg:ml-6 mt-12 md:mt-0">
             
             {/* Glow background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-cta)]/20 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '4s' }}></div>

             {/* Central Compass */}
             <div className="relative w-64 h-64 sm:w-72 sm:h-72 z-20 flex items-center justify-center animate-float">
               
               {/* Outer Rotating Ring */}
               <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-[var(--color-primary)]/30 animate-[spin_30s_linear_infinite]"></div>
               
               {/* Middle Ring */}
               <div className="absolute inset-4 rounded-full border-2 border-[var(--color-primary)]/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] bg-white/30 backdrop-blur-md"></div>
               
               {/* Inner Dial (The Compass Face) */}
               <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-white flex items-center justify-center">
                 
                 {/* Beautiful SVG Compass Needle */}
                 <div className="relative w-3/4 h-3/4 flex items-center justify-center transition-transform duration-1000 ease-out hover:rotate-12">
                   <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" style={{ transform: 'rotate(45deg)' }}>
                     <defs>
                       <linearGradient id="needle-red" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stopColor="var(--color-cta)" />
                         <stop offset="100%" stopColor="#b91c1c" />
                       </linearGradient>
                       <linearGradient id="needle-gray" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stopColor="#f3f4f6" />
                         <stop offset="100%" stopColor="#9ca3af" />
                       </linearGradient>
                     </defs>
                     
                     {/* North Point */}
                     <path d="M50 5 L62 50 L50 55 L38 50 Z" fill="url(#needle-red)" />
                     {/* North Point Highlight */}
                     <path d="M50 5 L62 50 L50 55 Z" fill="rgba(255,255,255,0.3)" />
                     
                     {/* South Point */}
                     <path d="M50 95 L62 50 L50 45 L38 50 Z" fill="url(#needle-gray)" />
                     {/* South Point Shadow */}
                     <path d="M50 95 L62 50 L50 45 Z" fill="rgba(0,0,0,0.15)" />
                     
                     {/* Center Pin Outer */}
                     <circle cx="50" cy="50" r="10" fill="#1f2937" />
                     {/* Center Pin Inner */}
                     <circle cx="50" cy="50" r="4" fill="#ffffff" />
                   </svg>
                 </div>
                 
               </div>
             </div>

             {/* Orbiting Elements (Satellites) */}
             <div className="absolute inset-0 pointer-events-none z-30">
               
               {/* Bourse (Top Left) */}
               <div className="absolute top-[5%] left-[5%] sm:-left-[5%] bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float pointer-events-auto transition-transform hover:scale-105 hover:border-[var(--color-primary)] cursor-pointer" style={{ animationDelay: '0s' }}>
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
                   <GraduationCap className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-sm font-extrabold text-gray-800">Bourses d'études</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Orientation 360°</div>
                 </div>
               </div>

               {/* Emploi (Top Right) */}
               <div className="absolute top-[20%] right-[0%] sm:-right-[10%] bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float pointer-events-auto transition-transform hover:scale-105 hover:border-[var(--color-cta)] cursor-pointer" style={{ animationDelay: '1s' }}>
                 <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[var(--color-cta)]">
                   <Briefcase className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-sm font-extrabold text-gray-800">Emplois & Stages</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Tremplin de carrière</div>
                 </div>
               </div>

               {/* Entrepreneuriat (Bottom Left) */}
               <div className="absolute bottom-[20%] left-[0%] sm:-left-[10%] bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float pointer-events-auto transition-transform hover:scale-105 hover:border-green-500 cursor-pointer" style={{ animationDelay: '2s' }}>
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                   <Lightbulb className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-sm font-extrabold text-gray-800">Entrepreneuriat</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Labo du business</div>
                 </div>
               </div>

               {/* Mentorat (Bottom Right) */}
               <div className="absolute bottom-[5%] right-[5%] sm:right-[0%] bg-[var(--color-primary)] px-4 py-3 rounded-2xl shadow-xl border border-primary-800 flex items-center gap-3 animate-float pointer-events-auto transition-transform hover:scale-105 cursor-pointer" style={{ animationDelay: '1.5s' }}>
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                   <Users className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-sm font-extrabold text-white">TalentUp Room</div>
                   <div className="text-[10px] text-primary-200 font-bold uppercase tracking-wide">Réseau & Mentorat</div>
                 </div>
               </div>

             </div>
          </div>
        </section>

        {/* Live Opportunities Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-cta)] mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Dernières annonces vérifiées</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary)]">
                Opportunités récentes en ligne
              </h2>
            </div>
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 font-semibold text-sm text-[var(--color-primary)] hover:text-[var(--color-cta)] transition-colors"
            >
              <span>Consulter tout le catalogue ({opportunites?.length || 0}+ annonces)</span>
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
                <Link href="/opportunites">Explorer toutes les offres</Link>
              </Button>
            </div>
          )}
        </section>

        {/* 3 Pillars of Expertise - Charte Éditoriale YouthLinkIA */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary)]">
              Un accompagnement adapté à chaque étape de votre parcours
            </h2>
            <p className="text-sm text-gray-600">
              De l'orientation académique à l'insertion professionnelle et la création d'entreprise, YouthLinkIA structure votre réussite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Pôle Tremplin de Carrière */}
            <Card className="border border-gray-200 bg-white hover:border-primary-300 transition-all shadow-xs">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-[var(--color-primary)] flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[var(--color-primary)]">
                  Le Tremplin de Carrière
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  L'accélérateur d'employabilité pour les jeunes talents. Découvrez votre voie, développez vos compétences et accédez directement aux offres d'emploi, de stage et de volontariat.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href="/insertion-professionnelle" className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-cta)] flex items-center gap-1">
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>

            {/* Pôle Labo du Business */}
            <Card className="border border-gray-200 bg-white hover:border-primary-300 transition-all shadow-xs">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-[var(--color-primary)] flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-[var(--color-cta)]" />
                </div>
                <CardTitle className="text-lg font-bold text-[var(--color-primary)]">
                  Le Labo du Business
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Le laboratoire de l'entrepreneuriat pour structurer votre projet. De l'idée au lancement, accédez aux incubateurs, programmes de financement et concours d'innovation.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href="/entrepreneuriat" className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-cta)] flex items-center gap-1">
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>

            {/* La TalentUp Room */}
            <Card className="border border-gray-200 bg-white hover:border-primary-300 transition-all shadow-xs">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-[var(--color-primary)] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-[var(--color-primary)]">
                  La TalentUp Room
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Une communauté engagée de talents et de mentors. Participez à des ateliers, échangez avec des professionnels et inspirez-vous de retours d'expérience concrets.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href="/profil" className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-cta)] flex items-center gap-1">
                  Rejoindre la communauté <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Value Proposition B2C & B2G/B2B */}
        <section className="grid md:grid-cols-2 gap-8 pt-4">
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-[var(--color-primary)] mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[var(--color-primary)]">
                Pourquoi s'inscrire sur YouthLinkIA ?
              </CardTitle>
              <CardDescription className="text-gray-600">
                Un espace personnalisé pour piloter l'ensemble de votre avenir professionnel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Recevez des recommandations d'opportunités sur mesure adaptées à votre profil.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Sauvegardez vos offres préférées et suivez vos démarches au même endroit.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-cta)] font-bold">✓</span>
                <span>Bénéficiez d'une orientation claire pour prendre les bonnes décisions au bon moment.</span>
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
                Institutions & Structures Partenaires
              </CardTitle>
              <CardDescription className="text-gray-200">
                Connectez vos programmes aux talents de la jeunesse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-200">
              <p>
                Valorisez vos bourses, offres et dispositifs d'accompagnement dans notre annuaire de référence. Rejoignez le réseau qui brise les silos entre éducation, emploi et politiques publiques.
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


