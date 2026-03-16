# DisheD 🍽️

**Canada's Home Kitchen Marketplace** — A Next.js 14 + Tailwind CSS web application connecting independent home chefs with customers across Canada.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main page (composes all sections)
│   └── globals.css         # Tailwind + global styles + animations
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Fixed nav with auth + cart
│   │   └── Footer.tsx      # Footer with province tags
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx    # Split hero with postal search
│   │   ├── ChefGrid.tsx       # Chef cards with filter + sort
│   │   ├── HowItWorks.tsx     # 3-step explainer cards
│   │   ├── AboutSection.tsx   # Story + photo gallery
│   │   ├── BecomeChefCTA.tsx  # Dark CTA section
│   │   └── VideoModal.tsx     # Video overlay modal
│   │
│   ├── chef/
│   │   ├── ChefCard.tsx    # Individual chef card (heart, badge, story ring)
│   │   └── ChefModal.tsx   # Chef detail + menu + cart
│   │
│   ├── auth/
│   │   └── AuthModal.tsx   # Login / Register / Phone OTP modal
│   │
│   ├── order/
│   │   └── OrderModal.tsx  # 3-step checkout (cart → delivery → confirm)
│   │
│   └── ui/
│       ├── Icons.tsx        # All SVG icon components
│       ├── StarRating.tsx   # Reusable star rating
│       └── Toast.tsx        # Notification toast
│
├── lib/
│   ├── data.ts             # Chef data, filter options, image URLs
│   └── utils.ts            # formatPostal, validatePostal, filterAndSort, sleep
│
└── types/
    └── index.ts            # Chef, CartItem, AuthTab, OrderStep, etc.
```

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| Canadian postal code search (A1A 1A1) with validation | ✅ |
| Chef cards with story ring, badge, heart save | ✅ |
| Cuisine filter pills (7 options) | ✅ |
| Sort dropdown (5 options) | ✅ |
| Chef detail modal with menu + about tab | ✅ |
| Add/remove items with quantity counter | ✅ |
| 3-step order modal (cart → delivery → confirm) | ✅ |
| Auth modal with login/register/OTP flows | ✅ |
| Role selection (Chef / Customer) | ✅ |
| Video story modal | ✅ |
| Smooth scroll navigation | ✅ |
| Toast notifications | ✅ |
| Animated hero section | ✅ |
| How It Works hover cards | ✅ |
| About / gallery section | ✅ |
| Become a Chef CTA | ✅ |
| Fully responsive footer with province tags | ✅ |

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript
- **Images**: `next/image` with Unsplash
- **Fonts**: Playfair Display + DM Sans (Google Fonts)

---

## 🍁 Canadian Postal Code Format

Search bar validates the `A1A 1A1` format (alternating letter-digit-letter digit-letter-digit).  
All 10 provinces are displayed in the footer: ON, BC, QC, AB, MB, SK, NS, NB, NL, PE.

---

## 📦 Next Steps (Production)

- Connect to a real backend (Node.js/Express + PostgreSQL)
- Add Mapbox map discovery view
- Integrate Stripe for payments
- Add Twilio for real phone OTP
- Add chef onboarding + document upload flow
- Province-based compliance verification logic
