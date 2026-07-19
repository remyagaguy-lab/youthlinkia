# **Briefing fonctionnel — YouthLinkIA**

## **1\. Vue d'ensemble**

YouthLinkIA est un écosystème numérique qui centralise, qualifie et connecte la jeunesse africaine (15-35 ans) aux opportunités et acteurs de son parcours de formation, d'insertion professionnelle et d'entrepreneuriat. Le produit repose sur deux piliers :

* **Un système d'orientation intelligent** structuré autour de 3 axes : orientation scolaire, insertion professionnelle, orientation entrepreneuriale  
* **Un accompagnement humain** structuré autour de 3 pôles : Tremplin de Carrière, Labo du Business, TalentUp Room

Le cœur technique du produit est un **agent IA de veille et de recherche d'opportunités**, qui alimente en continu une base de données interrogeable en langage naturel.

## **2\. Profils utilisateurs (rôles)**

| Profil | Description |
| ----- | ----- |
| Visiteur | Non connecté, accès en lecture limitée |
| Lycéen / Étudiant | Profil orienté formation, bourses, filières |
| Jeune professionnel | Profil orienté emploi, volontariat, montée en compétences |
| Entrepreneur | Profil orienté financement, incubation, concours |
| Partenaire / Structure | Institution, incubateur, bailleur, entreprise — peut soumettre du contenu (opportunités, fiche structure) |
| Administrateur / Modérateur | Équipe interne — valide les opportunités extraites, modère les soumissions partenaires |

## **3\. Modules fonctionnels**

### **Module 1 — Espace utilisateur & profil**

**Objectif** : permettre l'inscription et la définition d'un profil qui alimente les recommandations personnalisées.

**Fonctionnalités clés**

* Inscription / connexion (email — authentification sociale )  
* Formulaire de profil différencié selon le type d'utilisateur (secteur, pays, niveau d'études/expérience, ambitions)  
* Tableau de bord personnel (opportunités suivies, alertes actives, recommandations)  
* Paramètres de notification (fréquence, canaux)

**Priorité** : MVP

---

### **Module 2 — Annuaire des structures et acteurs**

**Objectif** : référencer les organismes qui interviennent dans le parcours (institutions académiques, structures d'accompagnement, bailleurs, incubateurs, associations).

**Fonctionnalités clés**

* Fiches structurées par acteur (mission, secteur, pays d'intervention, lien, contact)  
* Recherche et filtres (type de structure, pays, secteur)  
* Soumission par les partenaires eux-mêmes, avec modération avant publication

**Priorité** : MVP (version filtrée sur les acteurs prioritaires), enrichissement continu

---

### **Module 3 — Agent IA de veille & recherche d'opportunités *(cœur du produit)***

**Objectif** : centraliser, qualifier et rendre interrogeable en langage naturel l'ensemble des opportunités.

**Périmètre de lancement**

* Zone géographique : Afrique entière \+ international (opportunités ouvertes aux Africains)  
* Types prioritaires : bourses d'études, bourses de recherche / appels à projets, formations courtes / certifications  
* Emploi, volontariat et opportunités entrepreneuriales : activés en V2 (même pipeline, sources élargies)

**Fonctionnalités clés**

* Pipeline de veille : sources curatées → extraction structurée par IA → validation & dédoublonnage → publication  
* File de modération humaine avec statuts (détecté / à valider / publié / rejeté) — Phase 1  
* Score de confiance par source, permettant une auto-publication progressive — Phase 2/3  
* Agent conversationnel : recherche en langage naturel avec filtres (pays, secteur, niveau, type, deadline)  
* Fiche opportunité structurée : titre, organisme, montant/couverture, pays éligibles (distinction résidence vs. distribution), niveau requis, deadline, lien source, statut de fraîcheur  
* Alertes proactives par abonnement (secteur / pays / type)  
* Signalement communautaire (lien mort, information erronée)  
* Recheck périodique automatique des liens et des dates d'expiration

**Priorité** : MVP

---

### **Module 4 — Orientation scolaire**

**Objectif** : aider à identifier filières, bourses et formations pertinentes selon le profil et les besoins du marché.

**Fonctionnalités clés**

* Recommandations personnalisées de filières/formations selon le profil  
* Accès filtré aux opportunités du Module 3 taguées « orientation scolaire »  
* Fiches informatives sur les filières porteuses (contenu éditorial)

**Priorité** : MVP (s'appuie fortement sur le Module 3\)

---

### **Module 5 — Insertion professionnelle**

**Objectif** : préparer et connecter aux opportunités d'emploi, de volontariat et aux ateliers pratiques.

**Fonctionnalités clés**

* Offres d'emploi et missions de volontariat (flux activé en V2 via Module 3 élargi)  
* Ateliers de préparation à la vie professionnelle (contenu, calendrier)  
* Ressources CV / lettre de motivation / entretien

**Priorité** : V2 pour le flux d'opportunités ; contenu de préparation envisageable dès le MVP

---

### **Module 6 — Orientation entrepreneuriale**

**Objectif** : connecter aux structures d'accompagnement, financements et concours pour entrepreneurs.

**Fonctionnalités clés**

* Accès aux structures d'accompagnement (via Module 2, filtrées)  
* Opportunités de financement et compétitions (flux activé en V2 via Module 3 élargi)  
* Ressources méthodologiques (validation d'idée, business model)

**Priorité** : V2 pour le flux d'opportunités ; contenu méthodologique envisageable dès le MVP

---

### **Module 7 — Pôle Tremplin de Carrière (accompagnement humain)**

**Objectif** : accompagnement individualisé pour l'orientation et la recherche d'emploi.

**Fonctionnalités clés**

* Prise de rendez-vous avec un accompagnateur (modèle bénévole/salarié/partenaire)  
* Suivi de dossier / parcours  
* Ressources et ateliers dédiés

**Priorité** : V2 (dépend du modèle d'accompagnement humain à définir)

---

### **Module 8 — Pôle Labo du Business (accompagnement humain)**

**Objectif** : accompagner la transformation d'idées en projets viables.

**Fonctionnalités clés**

* Mise en relation avec mentors/experts métier  
* Suivi de projet (jalons, ressources)  
* Accès priorisé aux opportunités de financement pertinentes (lien avec Module 6\)

**Priorité** : V2 / V3

---

### **Module 9 — TalentUp Room (communauté)**

**Objectif** : communauté de talents, contenu inspirant, mentorat, networking.

**Fonctionnalités clés**

* Calendrier d'événements (webinaires, conférences)  
* Bibliothèque de contenu (podcasts, témoignages de réussite)  
* Espace communautaire — forum interne ou redirection vers réseaux sociaux existants  
* Mise en relation mentorat — structurée ou informelle   
* **Priorité** : V3 (contenu éditorial simple envisageable dès la V2)

## **4\. Récapitulatif de priorisation**

| Module | MVP | V2 | V3 |
| ----- | ----- | ----- | ----- |
| 1\. Espace utilisateur & profil | ✔ |  |  |
| 2\. Annuaire des structures | ✔ (version filtrée) | Enrichissement |  |
| 3\. Agent IA d'opportunités | ✔ | Élargissement (emploi, entrepreneuriat) |  |
| 4\. Orientation scolaire | ✔ |  |  |
| 5\. Insertion professionnelle | Contenu seul | Flux d'opportunités |  |
| 6\. Orientation entrepreneuriale | Contenu seul | Flux d'opportunités |  |
| 7\. Pôle Tremplin de Carrière |  |  | ✔ |
| 8\. Pôle Labo du Business |  |  | ✔ (Approfondissement) |
| 9\. TalentUp Room |  |  | ✔ (Communauté complète) |

# **Architecture de production**

Cloudflare DNS   
\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_|\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_\\\_  
Frontend   
└── Déploiement sur \*\*Vercel \\+ \[Next.js\](http://next.js/) 15\*\*    
├── PWA   
├── SSR   
├── ISR   
├── SSG   
├── SEO   
├── Dashboard membres   
├── UI React     
├── Server Components   
└── Server Actions légères  
\*\*Cloudflare Workers :\*\*   
├── API /api/\\\*   
├── Middleware Auth   
├── RBAC   
├── Validation Zod   
├── Logique métier   
├── Cron Jobs   
├── Webhooks Stripe/CinetPay   
├── Emails automatiques   
└── IA future

\*\*Supabase :\*\*   
Auth → gestion des 4 catégories de membres    
PostgreSQL → profils membres, annuaire, formations, cotisations. associé à du stockage d’objets pour les documents Cloudflare R2    
RLS (Row Level Security)   
Realtime → notifications ; messagerie interne ; présence en ligne ; alertes d'opportunités ; forum communautaire ; mise à jour du tableau de bord.  
Cloudflare R2   
├── PDF   
├── Mémoires   
├── Thèses   
├── Fiches techniques   
├── Images   
├── Pièces jointes   
└── Sauvegardes  
Resend pour :   
├── emails d'inscription ;   
├── récupération de mot de passe ;   
├── validation email    
├── confirmations de paiement ;   
├── notifications système  
Upstash Redis (Cache \\+ Rate Limiting) pour :   
├── cache   
├── rate limiting   
├── anti-spam   
├── compteur de vues   
├── file d'attente légère   
└── stockage temporaire

Sentry   
├── erreurs frontend   
├── erreurs backend   
├── monitoring   
└── alertes  
NB :    
\\-Les webinaires et replays peuvent être stockés sur YouTube et embarqués.    
\\-Envoie Newsletters Brevo  
