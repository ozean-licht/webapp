# Ozean Licht Akademie™ 🌊✨

> **Eine multidimensionale spirituelle Bildungsplattform für kosmisches Bewusstsein und Transformation**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

---

## 📖 Über das Projekt

Ozean Licht Akademie™ ist die digitale Heimat für **Lia Lohmann's** spirituelle Bildungsplattform. Die WebApp bietet einen energetischen "Safe Space" für Transformation, Bewusstseinsarbeit und spirituelles Wachstum durch authentisches Wissen aus erster Hand.

### 🎯 Kernmission

- Menschen bei der Erinnerung ihrer kosmischen Natur unterstützen
- Transformation limitierender Glaubenssätze durch **LCQ® (Light Code Quantum Transformation)**
- Aufbau einer herzbasierten Community für bewusste Schöpfer
- Integration von Bewusstsein und Verkörperung im Alltag
- Bereitstellung präziser Werkzeuge zur Navigation der Realitätsmatrix

### ✨ Unique Features

- **Authentisches Wissen** - Direkte ET-Kontakte, keine Theorie
- **LCQ® Technologie** - Exklusive Light Code Quantum Transformation
- **Herzportal-Methodik** - Herzbasierte Bewusstseinsarbeit
- **Safe Space Philosophie** - Geschützter Raum ohne Dogmen
- **95+ Videos** - Umfangreiche Video-Bibliothek
- **Live Events** - Channelings, Q&As, Transformationssitzungen
- **Athemirah® Cosmic School** - Flagship Education Program

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React Framework mit App Router
- **React 18+** - Server Components & Client Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS Framework
- **ShadCN UI** - Accessible component library
- **Framer Motion** - Animations (geplant)
- **Zustand/Jotai** - State Management (geplant)

### Backend & Services
- **Supabase** - PostgreSQL Database, Authentication, Storage
- **Supabase Edge Functions** - Serverless functions (Deno)
- **Stripe** - Payments & Subscriptions (geplant)
- **Vimeo/Mux** - Video Hosting & Streaming (geplant)
- **Resend** - Transactional Emails
- **Vercel** - Hosting & Deployment
- **N8N** - Workflow Automation (self-hosted)
- **Airtable** - Content Management (wird migriert zu Supabase)

### Development Tools
- **Docker** - MCP Gateway für Task Master
- **Task Master AI** - Project Task Management
- **ESLint + Prettier** - Code Quality
- **Git/GitHub** - Version Control

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ und npm/yarn/pnpm
- Supabase Account (oder lokale Supabase Instanz)
- Docker (optional, für Task Master MCP)

### Installation

```bash
# Repository klonen
git clone https://github.com/yourusername/ozean-licht.git
cd ozean-licht

# Dependencies installieren
npm install

# Environment Variables einrichten
cp .env.example .env.local
# Fülle die .env.local mit deinen Credentials
```

### Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://suwevnhwtmcazjugfmps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend (Email Service)
RESEND_API_KEY=your-resend-api-key

# Stripe (Payment) - Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret

# N8N (Automation) - Optional
N8N_WEBHOOK_URL=your-n8n-webhook-url
N8N_API_KEY=your-n8n-api-key
```

### Development Server

```bash
# Development Server starten
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm run start
```

---

## 📂 Projektstruktur

```
ozean-licht/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth-bezogene Routes
│   │   ├── login/
│   │   ├── register/
│   │   └── auth/callback/
│   ├── courses/                  # Kurskatalog & Details
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # Kursdetailseite
│   │   │   └── learn/            # Learning Interface
│   │   └── page.tsx              # Kurskatalog
│   ├── dashboard/                # User Dashboard
│   ├── magazine/                 # Blog/Magazin
│   ├── api/                      # API Routes
│   │   └── auth/magic-link/
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global Styles
│
├── components/                   # React Components
│   ├── ui/                       # ShadCN UI Components
│   ├── app-layout.tsx            # Dashboard Layout
│   ├── app-header.tsx            # Dashboard Header
│   ├── app-sidebar.tsx           # Dashboard Sidebar
│   ├── header.tsx                # Public Header
│   ├── footer.tsx                # Footer
│   └── ...                       # Weitere Components
│
├── lib/                          # Utility Functions
│   ├── supabase.ts               # Supabase Browser Client
│   ├── supabase-server.ts        # Supabase Server Client
│   └── utils.ts                  # Helper Functions
│
├── supabase/                     # Supabase Configuration
│   ├── config.toml               # Supabase Config
│   └── functions/                # Edge Functions
│       ├── send-email/
│       ├── get-courses/
│       └── query-data/
│
├── scripts/                      # Development Scripts
│   ├── sync-airtable-courses.js  # Airtable → Supabase Sync
│   ├── process-course-images.js  # Image Processing
│   └── ...
│
├── workflows/                    # N8N Workflow Definitions
│   ├── airtable-blogs-sync.json
│   ├── airtable-courses-sync.json
│   └── ...
│
├── tasks/                        # Task Master Tasks
│   └── tasks.json                # Project Tasks (25 Tasks)
│
├── .taskmaster/                  # Task Master Configuration
│   ├── docs/
│   │   └── prd.txt               # Product Requirements Document
│   ├── tasks/
│   └── reports/
│
├── types.ts                      # TypeScript Type Definitions
├── middleware.ts                 # Next.js Middleware (Auth)
├── tailwind.config.ts            # Tailwind Configuration
├── next.config.js                # Next.js Configuration
└── package.json                  # Dependencies
```

---

## 🔑 Key Features & Status

### ✅ Implementiert

- [x] **Next.js Setup** - App Router, TypeScript, Tailwind CSS
- [x] **Supabase Integration** - Auth, Database Connection
- [x] **Authentication** - Email/Password, Magic Link, Password Reset
- [x] **Homepage** - Hero, Features, Testimonials, FAQ
- [x] **Kurskatalog** - Basis-Listing mit Thumbnails
- [x] **Kursdetailseite** - Hero, Description, CTA
- [x] **Learning Interface** - Layout mit Sidebar (Mock Video Player)
- [x] **Dashboard** - Basis Layout für User Profile
- [x] **N8N Workflows** - Airtable Sync, Image Processing
- [x] **Resend Email** - Magic Link Versand

### 🔄 In Arbeit

- [ ] **Datenbank Schema** - Vollständiges Schema für alle Features
- [ ] **RLS Policies** - Row Level Security für alle Tabellen
- [ ] **Video Player** - Vimeo/Mux Integration
- [ ] **Progress Tracking** - User Progress auf Content-Level
- [ ] **User Profile** - Erweiterte Funktionen (Zertifikate, Notizen)

### 📋 Geplant (MVP Phase 1)

- [ ] **Stripe Integration** - Payments & Subscriptions
- [ ] **Live Event System** - Zoom Integration, Calendar
- [ ] **Video-Bibliothek** - 95+ Videos mit Filter/Suche
- [ ] **Email Automation** - Welcome Series, Reminders
- [ ] **Analytics** - GA4, Sentry, Performance Monitoring
- [ ] **SEO Optimierung** - Schema.org, Sitemap

### 🚀 Phase 2 Features

- [ ] **Athemirah® Cosmic School** - Dedicated Section
- [ ] **Licht Navigator** - AI Chat Assistant
- [ ] **Community Forum** - Discussion Threads
- [ ] **Mobile App** - React Native/Flutter
- [ ] **Multi-language** - EN/DE Support

> Siehe `tasks/tasks.json` für detaillierte Task-Liste mit 25 Tasks

---

## 🎨 Design System

### Farben

- **Primary**: `#00E5CC` (Türkis) - Ozean-Energie
- **Background**: `#0A0E1A` - Dunkler Hintergrund
- **Text**: `#FFFFFF` - Weiß für Kontrast
- **Accent**: Türkis-Verläufe auf dunklem Hintergrund

### Typography

- **Headings**: `Cinzel Decorative` - Elegante Serif-Schrift
- **Body**: `Inter` - Moderne Sans-Serif

### Design-Prinzipien

1. **Energetische Ästhetik** - Fließende Animationen, Wasser/Ozean-Metaphern
2. **Safe Space Feeling** - Warme Farben, beruhigende Typografie
3. **Intuitive Navigation** - Maximal 3 Klicks zu jedem Inhalt
4. **Mobile-First** - 60%+ User auf Mobile erwartet
5. **Accessibility** - WCAG 2.1 AA Konformität
6. **Performance** - <2s Initial Load Time

---

## 🗄️ Supabase Setup

### Supabase Projekt

- **URL**: `https://suwevnhwtmcazjugfmps.supabase.co`
- **Region**: EU (GDPR-compliant)

### Tabellen (Geplant)

```sql
-- Core Tables
- users (extended profile)
- courses (mit categories, pricing)
- modules
- contents (video, text, pdf)
- user_courses (enrollments)
- user_progress (content tracking)
- subscriptions
- subscription_tiers
- events
- event_registrations
- transactions
- bookmarks
- user_notes
- testimonials
- tags
- course_tags
```

### Edge Functions

```bash
# Edge Functions deployen
npx supabase functions deploy

# Spezifische Function deployen
npx supabase functions deploy send-email
npx supabase functions deploy get-courses
```

### Environment Variables (Supabase)

In Supabase Dashboard → Settings → Edge Functions:

```
RESEND_API_KEY=your_resend_api_key
SEND_EMAIL_HOOK_SECRET=your_webhook_secret
```

---

## 🔐 Authentication Flow

### Implemented Auth Methods

1. **Email/Password** - Klassische Registrierung
2. **Magic Link** - Passwortlose Anmeldung via Email
3. **Password Reset** - Mit Email-Bestätigung

### Geplant

- Google OAuth
- Apple Sign-in
- 2FA (Optional)

### Middleware Protection

Geschützte Routen in `middleware.ts`:

```typescript
const protectedRoutes = [
  '/profile',
  '/my-courses',
  '/user',
  '/admin'
]
```

---

## 📊 Task Management mit Task Master

### Task Master MCP Setup

Task Master läuft als **MCP (Model Context Protocol) Server** über Docker Gateway und ist vollständig in Cursor integriert.

**Status**: ✅ Vollständig konfiguriert und funktionsfähig

```bash
# Task Master Container Status prüfen
docker ps | grep taskmaster

# Gateway Logs
docker logs mcp-gateway --tail 50

# Tasks anzeigen
# Verwende MCP Tools in Cursor:
mcp_MCP_DOCKER_get_tasks({
  projectRoot: "/workspace",
  file: "tasks/tasks.json"
})
```

**Features:**
- 36 MCP Tools verfügbar
- Task Creation, Update, Status Management
- Subtasks, Dependencies, Tags
- Complexity Analysis
- Research-backed Task Generation

**Dokumentation:**
- Setup: `TASKMASTER_SETUP.md`
- Tasks: `tasks/tasks.json` (25 Tasks)
- PRD: `.taskmaster/docs/prd.txt`

---

## 🧪 Testing

### Unit Tests

```bash
# Tests ausführen (coming soon)
npm run test
```

### E2E Tests

```bash
# Playwright Tests (geplant)
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Auth Flows (Sign up, Login, Magic Link, Password Reset)
- [ ] Course Browsing (Filter, Search, Sort)
- [ ] Video Playback (Play, Pause, Progress)
- [ ] Payment Flow (Checkout, Success, Fail)
- [ ] Mobile Responsiveness
- [ ] Cross-browser (Chrome, Firefox, Safari)

---

## 📈 Performance Benchmarks

### Ziele (PRD 7.1)

- **Lighthouse Score**: >90 in allen Kategorien
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Core Web Vitals**: Alle "Good"
- **Video Start Time**: <2s

### Aktueller Status

```bash
# Lighthouse Audit ausführen
npm run lighthouse

# Vercel Analytics
# Automatisch aktiviert bei Deployment
```

---

## 🚀 Deployment

### Vercel Deployment

**Automatisches Deployment** via GitHub Integration:

- `main` Branch → Production
- Pull Requests → Preview Deployments

```bash
# Manual Deployment
vercel

# Production Deployment
vercel --prod
```

### Environment Variables (Vercel)

Alle Environment Variables müssen im Vercel Dashboard konfiguriert werden:

- Settings → Environment Variables
- Production, Preview, Development getrennt konfigurierbar

### Build Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🤝 Contributing

### Development Workflow

1. **Branch erstellen** von `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development**
   - Code schreiben
   - Linter beachten: `npm run lint`
   - Types prüfen: `npx tsc --noEmit`

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Pull Request**
   - Push to GitHub
   - Create Pull Request
   - Request Review

### Commit Conventions

```
feat: neue Feature
fix: Bug Fix
docs: Dokumentation
style: Formatting
refactor: Code Refactoring
test: Tests
chore: Build/Config
```

### Code Style

- **ESLint** - Automatische Checks
- **Prettier** - Code Formatting (coming soon)
- **TypeScript Strict Mode** - Type Safety

---

## 📚 Wichtige Ressourcen

### Dokumentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI Docs](https://ui.shadcn.com/)

### Interne Docs

- **PRD**: `.taskmaster/docs/prd.txt` - Product Requirements Document
- **Tasks**: `tasks/tasks.json` - 25 detaillierte Tasks
- **Task Master Setup**: `TASKMASTER_SETUP.md`
- **Email Alerts**: `setup-email-alerts.md`

### Design Assets

- **Figma**: [Link coming soon]
- **Brand Guidelines**: [Link coming soon]
- **Logo & Assets**: `/public` Verzeichnis

---

## 🐛 Known Issues & Troubleshooting

### Issue: Videos werden nicht geladen

**Lösung**: Video Player ist noch Mock-Implementation. Vimeo/Mux Integration steht aus (Task 9).

### Issue: Thumbnails fehlen bei einigen Kursen

**Lösung**: 
```bash
# Thumbnail-Fix Script ausführen
node scripts/fix-missing-thumbnails.js
```

### Issue: Supabase Connection Error

**Lösung**: 
1. Überprüfe `.env.local` Credentials
2. Stelle sicher dass Supabase URL & Key korrekt sind
3. Checke ob Supabase Service läuft

### Issue: MCP Connection Closed

**Lösung**: 
```bash
# Gateway neu starten
cd /Users/serg/MCP/DockerGateway
docker-compose restart
```

---

## 📞 Support & Kontakt

### Team

- **Founder**: Lia Lohmann
- **Development**: [Your Name]
- **Design**: [Designer Name]

### Links

- **Website**: [Coming Soon]
- **Instagram**: [@ozean_licht](https://instagram.com/ozean_licht)
- **Email**: info@ozean-licht.com

---

## 📄 License

This project is proprietary and confidential. All rights reserved by Ozean Licht Akademie™.

**© 2025 Ozean Licht Akademie™ - Lia Lohmann**

---

## 🌟 Roadmap

### Phase 1: MVP (Aktuell)
- ✅ Projekt Setup & Foundation
- 🔄 Core Features (Auth, Courses, Learning)
- 📋 Payment Integration
- 📋 Video Platform
- 📋 User Dashboard

### Phase 2: Advanced Features
- Athemirah School Integration
- Live Event System
- Magazin/Blog CMS
- Community Forum
- Mobile Optimization

### Phase 3: Growth Features
- Mobile App (React Native)
- Advanced Personalization
- Affiliate System
- Multi-language (EN/DE)
- API für Integrations

### Phase 4: Scale & Optimize
- Performance Audits
- A/B Testing
- Advanced SEO
- Marketing Automation
- Version 2.0

---

**Made with ❤️ and cosmic energy** ✨🌊

*For detailed task breakdown, see `tasks/tasks.json` (25 Tasks)*
