# Dished

**Canada's Home Kitchen Marketplace** — A Next.js 14 + Tailwind CSS static site connecting independent home chefs with customers across Canada.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000

# Production build (stop dev server first)
npm run build
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout + metadata + favicon
│   ├── page.tsx             # Main page (composes all sections)
│   ├── globals.css          # Tailwind + global styles + animations
│   ├── privacy/page.tsx     # Privacy policy page
│   └── terms/page.tsx       # Terms of service page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Fixed nav — "Become a Chef" coming soon
│   │   ├── Footer.tsx       # Footer with province tags
│   │   └── LegalLayout.tsx  # Shared layout for legal pages
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx        # Split hero with postal search + chef scene
│   │   ├── ChefShowcaseBanner.tsx # Full-bleed stats banner
│   │   ├── ChefGrid.tsx           # Chef cards with filter + sort
│   │   ├── HowItWorks.tsx         # 3-step explainer cards
│   │   ├── AboutSection.tsx       # Story + photo gallery
│   │   └── BecomeChefCTA.tsx      # Dark CTA section (coming soon)
│   │
│   ├── chef/
│   │   ├── ChefCard.tsx     # Chef card (badge, story ring, cuisines)
│   │   └── ChefModal.tsx    # Chef detail modal (bio + info only)
│   │
│   └── ui/
│       ├── Icons.tsx          # All SVG icon components
│       ├── StarRating.tsx     # Reusable star rating
│       ├── Toast.tsx          # Notification toast
│       └── ChefHeroScene.tsx  # Animated photo hero scene (hero right panel)
│
├── lib/
│   ├── data.ts              # Chef data, cuisine filters, gallery images
│   └── utils.ts             # formatPostal, validatePostal, filterAndSort
│
└── types/
    └── index.ts             # Chef, SortOption
```

---

## Features

| Feature | Status |
|---|---|
| Canadian postal code search (A1A 1A1) with validation | ✅ |
| Animated cinematic hero scene (photo crossfade on scroll) | ✅ |
| Steam wisps + heart particle animations | ✅ |
| Ken Burns image animation + parallax scroll | ✅ |
| Chef cards with story ring, badge, cuisine tags | ✅ |
| Cuisine filter pills (8 options) | ✅ |
| Sort dropdown (5 options) | ✅ |
| Chef detail modal with bio | ✅ |
| Smooth scroll navigation | ✅ |
| Toast notifications | ✅ |
| How It Works hover cards | ✅ |
| About / gallery section | ✅ |
| Become a Chef — coming soon state | ✅ |
| Fully responsive footer with province tags | ✅ |
| Privacy policy + Terms of service pages | ✅ |
| Dished favicon + Apple touch icon | ✅ |
| Prefers-reduced-motion accessibility support | ✅ |

---

## Chef Lineup

| Chef | Cuisine | Province |
|---|---|---|
| Priya Nair | South Indian, Kerala, Vegetarian | ON |
| Arjun Malhotra | Punjabi, North Indian, Mughlai | ON |
| Mei Lin Zhang | Cantonese, Dim Sum, Hong Kong | BC |
| Wei Chen | Sichuan, Chinese Street Food | BC |
| Nalini Patel | Gujarati, Indo-Chinese, Fusion | ON |
| Tanvir Rahman | Bengali, South Asian, Multicultural | ON |

---

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript
- **Images**: `next/image` with Unsplash + local `/public/images/`
- **Fonts**: Fraunces (serif) + DM Sans (sans-serif) — Google Fonts

---

## Deployment

Hosted on Vercel. Push to `dev` branch triggers a preview deployment.

```bash
git add .
git commit -m "your message"
git push origin dev
```

---

## Next Steps (Production)

- Connect to a real backend (Node.js + PostgreSQL)
- Chef registration + onboarding flow
- Stripe payments integration
- Mapbox map discovery view
- Real order management system
- Province-based compliance verification
