# CineHub BD

> Premium Movie Discovery, Booking Companion & Cinema Management Platform for Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)

## Overview

CineHub BD is a production-ready SaaS platform providing the best movie booking experience in Bangladesh. Built for movie lovers, families, couples, and regular moviegoers.

## Features

- 🎬 **Movie Discovery** — Browse current, upcoming, and trending movies
- 🏟️ **Branch Explorer** — All cinema branches with maps and facilities
- 🪑 **Live Seat Map** — Real-time seat availability with visual seat picker
- 🎟️ **Smart Booking** — Full booking flow with food, coupons, and payments
- 📱 **Mobile First** — Native app-like PWA experience
- 🤖 **AI Recommendations** — Personalized movie and seat suggestions
- 👤 **User Dashboard** — Booking history, QR tickets, rewards, wishlist
- ⚙️ **Admin Panel** — Full CMS with analytics and management tools

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS v4 + ShadCN UI |
| Animation | Framer Motion v11 |
| State | Zustand v5 + TanStack Query v5 |
| Auth | Auth.js v5 (NextAuth) |
| Database | PostgreSQL 16 + Prisma 6 |
| Cache | Redis (ioredis) |
| Payments | SSLCommerz + bKash (abstracted) |
| Deployment | Vercel + Docker |

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16
- Redis 7

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/cinehub-bd.git
cd cinehub-bd

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up the database
npx prisma migrate dev --name init
npx prisma db seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Docker Setup

```bash
# Start all services (PostgreSQL + Redis + App)
docker compose up -d

# Run database migrations
docker compose --profile migrate up migrate

# View logs
docker compose logs -f app
```

## Project Structure

```
src/
├── app/                    # Next.js App Router (thin routing layer)
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (main)/             # Main public pages
│   ├── (dashboard)/        # User dashboard
│   ├── (admin)/            # Admin panel
│   └── api/                # API routes
├── features/               # Feature-based modules
│   ├── auth/
│   ├── movies/
│   ├── booking/
│   ├── branches/
│   └── payments/
├── components/             # Shared UI components
│   ├── ui/                 # ShadCN components
│   └── shared/             # Global layout components
├── lib/                    # Third-party configs
├── hooks/                  # Global hooks
├── store/                  # Zustand stores
├── services/               # Data providers + payment gateways
├── types/                  # Global TypeScript types
└── utils/                  # Pure utility functions
```

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
npx prisma studio    # Database GUI
```

## License

MIT License — See [LICENSE](LICENSE) for details.

---

Built with ❤️ for Bangladeshi movie lovers.
