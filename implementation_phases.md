# Implementation Phases - Atelier North Properties

## Phase 1 — Project Foundation
- Initialize Next.js 14 project with TypeScript and Tailwind CSS
- Configure ESLint, Prettier, TypeScript strict mode
- Set up Supabase client and TypeScript types
- Create basic layout with header/footer components
- Implement dark/light mode via `class` on `<html>` element
- Configure Tailwind config with design system colors, spacing, fonts
- Set up project structure and component conventions
- Add basic favicon/meta tags

**Deliverable**: Working dev environment with homepage shell, TypeScript strict mode passing, basic Tailwind setup verified

## Phase 2 — Design System & Core Components
- Build atomic component library (Button, Input, Label, Icon, Avatar, Badge)
- Create molecule components (ListingCard, PropertyFacts, SocialLink, NavLink)
- Implement organisms (Header, Footer, MobileMenu, DensitySelector)
- Build ListingGrid component with three density states
- Create Gallery component with navigation, counter, progress bar
- Implement ThemeProvider for dark/light mode switching
- Set up Storybook or documentation site for component library
- Write unit tests for core components

**Deliverable**: Complete component library with tests, dark/light mode toggle working, Gallery component functional with static data

## Phase 3 — Public Pages with Mock Data
- Create Home page with hero section and featured listings
- Build Listings index page with filters and density control
- Implement Listing detail page with gallery and property specs
- Build About page with staff/expertise and publications
- Connect all components using mock property data
- Implement client-side routing between pages
- Add skip links and landmark regions for accessibility
- Test all breakpoints (mobile, tablet, desktop)
- Verify navigation flow works without JavaScript fallback

**Deliverable**: Fully functional frontend with mock data, all pages navigable, accessibility basics in place

## Phase 4 — Supabase Database Setup
- Initialize Supabase project (free tier)
- Create PostgreSQL tables: properties, property_images
- Set up storage bucket: properties (with public access)
- Configure Row Level Security (RLS) policies
- Set up Supabase Transformations for image processing
- Create database functions: search, stats, slug generation
- Set up database connection in Next.js environment variables
- Verify database operations (CRUD) via Supabase Dashboard

**Deliverable**: Secure database schema, storage bucket configured, basic CRUD operations working

## Phase 5 — Authentication
- Implement Supabase Auth (email/password + magic links)
- Create login page (/dashboard/login) with form validation
- Protect dashboard routes with auth middleware
- Implement session management (getSession, onSessionChanged)
- Add password reset functionality
- Implement role-based access (admin/editor/viewer)
- Test auth flow locally and in production

**Deliverable**: Secure authentication system for admin access, protected dashboard routes

## Phase 6 — CMS Admin Interface
- Build dashboard homepage with stats cards
- Create properties index page with filtering/search
- Implement property creation form with validation
- Add publishing workflow (draft/published toggle)
- Implement property sorting (numeric sort_order)
- Add bulk actions (change status, delete selected)
- Implement image upload component with drag/drop preview
- Create image management interface (reorder, delete, replace)
- Add ALT text field with optional AI suggestion
- Build property detail view within admin

**Deliverable**: Complete CMS for property management, image upload working, publishing workflow functional

## Phase 7 — Connect CMS to Public Website
- Replace mock data with live Supabase queries
- Implement real-time property updates (optional via Realtime)
- Add search and filtering on listings page (works with DB)
- Create dynamic meta tags for SEO (title, description per property)
- Implement 404 handling for non-existent slugs
- Add sitemap.xml generation (dynamic routes)
- Implement robots.txt
- Test all public pages with live data

**Deliverable**: Live property data powering public website, SEO meta tags working

## Phase 8 — Responsive, Accessibility & Performance
- Test all breakpoints extensively (mobile <640px, tablet 640-1024px, desktop >1024px)
- Full WCAG 2.1 AA accessibility audit:
  - Color contrast verification (all combinations)
  - Keyboard navigation throughout
  - Screen reader testing with NVDA/VoiceOver
  - Focus management (modals, menus, skip links)
  - Reduced motion respect
- Performance optimization:
  - Image optimization with next/Image (blur placeholders, srcset)
  - Code splitting (dynamic imports for dashboard)
  - Bundle size analysis (target <200KB initial JS)
  - Implement caching headers
  - Lighthouse score >90 (performance, accessibility, SEO)
- Fix any accessibility violations found

**Deliverable**: Production-ready site passing Lighthouse >90, WCAG AA compliance

## Phase 9 — Final Polish & Launch Prep
- Configure Vercel project with custom domain
- Set up environment variables (NEXT_PUBLIC_SUPABASE_URL, etc.)
- Deploy to Vercel with preview deployments for branches
- Configure custom domain with SSL
- Set up error monitoring (Sentry optional)
- Create deployment checklist and runbook
- Final content review (all property data, images, text)
- Team training on CMS usage (if applicable)

**Deliverable**: Live production site at custom domain

## Phase 10 — Post-Launch (Optional)
- Monitor analytics (page views, popular properties)
- Collect user feedback on CMS usability
- Plan Phase 2 features (favoriting, advanced search, multilingual)
- Database optimization if needed
- Regular backup verification

---

## Phase Timeline Summary

| Phase | Duration | Primary Owner | Key Milestone |
|-------|----------|---------------|--------------|
| 1 | 1 week | Developer | Dev environment ready |
| 2 | 1-2 weeks | Developer | Component library complete |
| 3 | 1 week | Developer | Frontend with mock data |
| 4 | 1 week | Developer + DevOps | Database live |
| 5 | 1 week | Developer | Auth working |
| 6 | 1 week | Developer | CMS complete |
| 7 | 1 week | Developer | Live data connected |
| 8 | 1-2 weeks | Developer | Accessibility/performance |
| 9 | 1 week | DevOps | Production deployment |
| **Total** | **~10-12 weeks** | | |

## Success Criteria Checklist

- [ ] Homepage loads in <2s on 3G
- [ ] Lighthouse score >90 for performance, accessibility, SEO
- [ ] WCAG 2.1 AA compliant
- [ ] Mobile-first design working at all breakpoints
- [ ] Supabase Auth functional for admin access
- [ ] CMS allows create/edit/publish properties
- [ ] Image upload and gallery display working
- [ ] All public pages indexed with correct SEO meta
- [ ] No console errors across all browsers
- [ ] Backup strategy in place