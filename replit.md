# AI Web Builder para Autónomos

## Overview

This is an AI-powered web builder application designed for freelancers and small business owners in the Spanish market. The application generates professional, responsive websites based on business descriptions using OpenAI's GPT-5 model. Users can describe their business, select a template type, and receive a fully customizable website with downloadable HTML/CSS/JS code.

The project targets non-technical users with a modern, vibrant UI featuring gradients, animations, and colloquial Spanish language ("tío", "menos que Netflix"). The landing page emphasizes speed, simplicity, and value proposition with psychological selling techniques (urgency, price anchoring).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Framer Motion for animations

**UI Framework:**
- Shadcn/ui component library (New York style variant)
- Tailwind CSS for styling with custom design system
- Radix UI primitives for accessible components

**Design System:**
- Custom color palette with CSS variables for theming
- Light/dark mode support
- Vibrant gradients (violet → blue → cyan, pink → orange → yellow)
- Interactive elements: cursor trail, parallax shapes, scroll progress
- Responsive design with mobile-first approach

**Key Interactive Features:**
- CursorTrail: Canvas-based particle system following mouse movement
- ParallaxShapes: Floating background shapes with mouse parallax effect
- ScrollProgress: Animated progress bar tracking page scroll
- KonamiCode: Easter egg with confetti celebration
- RippleButton: Material Design-style ripple effect on buttons
- TypingAnimation: Typewriter effect for text

**Page Structure:**
- TechNexoLanding (/): Modern two-column landing page with hero section and animated chat preview
- Landing (/landing-old): Original marketing page with pain points, features, pricing
- Builder: Website generation interface with preview and customization
- ChatBuilder: Conversational AI interface for website creation
- Login: User authentication page with email/password
- Register: User registration with password confirmation
- Dashboard: User's websites management (view, edit, delete, download)
- 404: Not found page

**Recent Features (October 2025):**

**Tier-Based Access Control (October 24, 2025):**
- Two-tier system: "free" (default) and "premium"/"pro"
- Free tier: Can generate and preview websites, publish to .replit.app subdomain, but CANNOT download ZIP files
- Premium tier: Full access including ZIP downloads
- Download buttons show locked state with lock icon for free users
- Plan badges displayed in ChatBuilder and Dashboard headers
- User plan fetched from `/api/me` with `staleTime: 0` to prevent privilege escalation
- Automatic retry logic (retry: 1) for transient failures
- Security: No localStorage caching to prevent stale privileges after downgrade

**User Dashboard:**
- Grid layout showing all user's generated websites
- Website cards with preview, date, template type
- Actions: Edit (reopens in Builder), Download (ZIP - premium only), Delete (with confirmation)
- Empty state with call-to-action
- Integration with Builder: localStorage-based editing flow
- Secure deletion with ownership verification
- Plan indicator badge (Free/Premium) in dashboard header

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js
- TypeScript with ES modules
- Development: tsx for hot reloading
- Production: esbuild for bundling

**API Endpoints:**
- POST `/api/generate`: Generate website from business description
- POST `/api/customize`: Customize website colors and texts
- GET `/api/templates`: Fetch available template types

**OpenAI Integration:**
- Model: GPT-5 (released August 2025)
- JSON-formatted responses for structured output
- Response format: `{ html: string, css: string, js: string }`
- Generates complete, production-ready websites with:
  - Semantic HTML5
  - Responsive CSS with CSS variables for easy customization
  - Modern design patterns
  - Accessibility features (ARIA labels)
  - SEO meta tags

**Storage Strategy:**
- **DbStorage** (PostgreSQL via Drizzle ORM) - Active implementation
- Interface-based design (`IStorage`) allows flexible storage backends
- MemStorage available as fallback for development
- Users, sessions, and generation requests persisted in database

**Request Flow:**
1. Client submits business description + template type
2. Server validates with Zod schemas
3. Creates generation request in storage
4. Calls OpenAI API to generate website code
5. Updates request with generated HTML/CSS/JS
6. Returns complete generation to client

### Data Storage Solutions

**Current Implementation:**
- PostgreSQL database via Neon (serverless)
- Drizzle ORM for type-safe database operations
- All data persisted across server restarts
- Session storage in PostgreSQL via connect-pg-simple

**Schema Design (Drizzle ORM):**

*Users Table:*
- `id` (serial, primary key)
- `email` (varchar, unique, required)
- `password` (varchar, hashed, required)
- `name` (varchar, optional)
- `plan` (varchar, default: 'free') - 'free', 'premium', or 'pro'
- `createdAt` (timestamp, auto)

*Generation Requests Table:*
- `id` (varchar, primary key)
- `userId` (integer, foreign key to users)
- `businessDescription` (text, required)
- `templateType` (varchar, required)
- `generatedHtml` (text, nullable)
- `generatedCss` (text, nullable)
- `generatedJs` (text, nullable)
- `customColors` (json, nullable) - stores primary/secondary/accent colors
- `customTexts` (json, nullable) - custom text overrides
- `customImages` (json, nullable) - custom image URLs
- `createdAt` (timestamp, auto)

**Database Configuration:**
- Drizzle Kit configured for PostgreSQL dialect
- Migration output directory: `./migrations`
- Schema location: `./shared/schema.ts`
- Connection via `DATABASE_URL` environment variable

### External Dependencies

**Third-Party Services:**
- OpenAI API (GPT-5 model) - website generation
  - API key required via `OPENAI_API_KEY` environment variable
  - JSON mode for structured responses
  - No temperature parameter (not supported in GPT-5)

**Database:**
- Neon Serverless Postgres (configured but not actively used)
- Connection pooling via `@neondatabase/serverless`
- Drizzle ORM for schema management and queries

**Build & Development Tools:**
- Vite plugins:
  - @vitejs/plugin-react
  - @replit/vite-plugin-runtime-error-modal
  - @replit/vite-plugin-cartographer (dev only)
  - @replit/vite-plugin-dev-banner (dev only)

**UI Libraries:**
- Complete Radix UI component collection (accordion, dialog, dropdown, etc.)
- Canvas Confetti for celebration animations
- cmdk for command palette functionality
- Framer Motion for advanced animations
- React Day Picker for date selection
- Recharts for potential data visualization
- Vaul for drawer component

**Fonts:**
- Google Fonts: Inter (400-900 weights), Space Grotesk (400-700 weights)
- Preconnected to fonts.googleapis.com for performance

**Utilities:**
- Zod for runtime type validation and schema generation
- date-fns for date manipulation
- JSZip for potential ZIP file generation (website downloads)
- clsx + tailwind-merge for className composition

**Type Safety:**
- Shared schema types between client and server via `@shared/schema`
- Drizzle Zod integration for automatic validation schemas
- TypeScript strict mode enabled

## Self-Hosting / Deployment

The application is fully prepared for self-hosting to point **technexo.ai** to your own server.

**Deployment Guides:**
- `DEPLOYMENT_PLESK.md` - **For Plesk dedicated hosting** (GUI-based, easiest)
- `DEPLOYMENT.md` - For manual VPS setup (Ubuntu/NGINX/PM2)

**Configuration Files:**
- `.env.example` - Environment variable template
- `ecosystem.config.js` - PM2 process manager configuration (VPS only)
- `nginx.conf.example` - NGINX reverse proxy configuration (VPS only)

**Build Scripts:**
- `npm run build` - Builds frontend (Vite) and backend (esbuild)
- `npm start` - Runs production server
- `npm run db:push` - Syncs database schema

**Recommended VPS Providers:**
- Hetzner Cloud: €4.49/month (2GB RAM, 1 CPU)
- DigitalOcean: $6/month (1GB RAM, 1 CPU)
- Vultr/Linode: $5-6/month

**Production Stack:**
- Node.js 20.x + Express
- PostgreSQL (self-hosted or managed)
- NGINX reverse proxy
- PM2 process manager
- Let's Encrypt SSL (free HTTPS)
- Ubuntu 22.04 LTS recommended

See `DEPLOYMENT.md` for complete instructions.