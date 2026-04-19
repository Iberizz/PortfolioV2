# Ibrahim Nimaga — Portfolio Config

## Identité
- **Nom** : Ibrahim Nimaga
- **Titre** : Software Engineer
- **Localisation** : Paris, France
- **Statut** : Available for new projects
- **Accent couleur** : `#C0392B` (rouge Berizz)

## Stack technique du site
| Outil | Rôle |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Typage |
| Tailwind CSS | Styling |
| GSAP + ScrollTrigger | Animations principales |
| Framer Motion | Micro-interactions |
| Lenis | Smooth scroll |
| Supabase | BDD + formulaire contact |

## Typographie
- **Display / Titres** : `Syne` (800) — uppercase, tracking serré
- **Mono / Labels** : `Space Mono` — uppercase, letter-spacing large
- **Body** : `Syne` (400)

## Couleurs
```
bg:         #080808   (noir profond)
red-brand:  #C0392B   (accent principal)
red-dark:   #922B21
red-light:  #E74C3C
white:      #FFFFFF
muted:      rgba(255,255,255,0.35)
ghost:      rgba(255,255,255,0.025)
grid:       rgba(255,255,255,0.03)
```

## Sections (ordre)
1. **Hero** — Nom, titre animé, CTA, ghost text, grid bg
2. **About** — Bio, photo, soft skills
3. **Projects** — Berizz Auto / Maison Ora / GFC Tools
4. **Stack** — Constellation Next.js + écosystème
5. **Contact** — Formulaire → Supabase

## Projets
| Titre | Description courte |
|---|---|
| Berizz Auto | — |
| Maison Ora | — |
| GFC Tools | — |

## Structure dossiers
```
src/
├── app/
│   ├── layout.tsx        ← fonts + metadata
│   ├── page.tsx          ← assemblage sections
│   └── globals.css       ← reset + variables
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── CustomCursor.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Projects.tsx
│       ├── Stack.tsx
│       └── Contact.tsx
├── hooks/
│   └── useLenis.ts
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Commandes
```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
