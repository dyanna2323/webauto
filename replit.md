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
- Landing: Marketing page with pain points, features, pricing
- Builder: Website generation interface with preview and customization
- Login: User authentication page with email/password
- Register: User registration with password confirmation
- Dashboard: User's websites management (view, edit, delete, download)
- 404: Not found page

**Recent Features (October 2025):**

**User Dashboard:**
- Grid layout showing all user's generated websites
- Website cards with preview, date, template type
- Actions: Edit (reopens in Builder), Download (ZIP), Delete (with confirmation)
- Empty state with call-to-action
- Integration with Builder: localStorage-based editing flow
- Secure deletion with ownership verification

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
- In-memory storage (`MemStorage`) for development/prototyping
- Interface-based design (`IStorage`) allows easy swap to database
- Schema defined for PostgreSQL compatibility via Drizzle ORM
- UUID-based identifiers for generation requests

**Request Flow:**
1. Client submits business description + template type
2. Server validates with Zod schemas
3. Creates generation request in storage
4. Calls OpenAI API to generate website code
5. Updates request with generated HTML/CSS/JS
6. Returns complete generation to client

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for generation requests
- No persistence (data lost on server restart)
- Suitable for development and testing

**Schema Design (Drizzle ORM):**
- Table: `generation_requests`
- Fields:
  - `id` (varchar, primary key)
  - `businessDescription` (text)
  - `templateType` (varchar)
  - `generatedHtml` (text, nullable)
  - `generatedCss` (text, nullable)
  - `generatedJs` (text, nullable)
  - `customColors` (json, nullable) - stores primary/secondary/accent colors
  - `createdAt` (timestamp)

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