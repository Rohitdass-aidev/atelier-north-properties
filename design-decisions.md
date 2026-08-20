# Design Decisions - Atelier North Properties

## 1. Source of Truth
After reviewing all 7 canonical screens, the established source of truth is:
- **Primary Reference**: Original Atelier North design specification (evident in consistent typography, spacing system, and color naming)
- **Consistency Priority**: When conflicts arose, we prioritized patterns appearing in 4+ screens
- **Accessibility**: All decisions validated against WCAG 2.1 AA contrast requirements
- **Production Feasibility**: Favored CSS-only solutions over JavaScript-dependent interactions where possible

## 2. Resolved Inconsistencies

### Background Color
**Issue**: 
- home_desktop.html, listings_standard_desktop.html, about_desktop.html: Override to `#F2F0EA`
- Other screens: Use theme surface `#fbf9f3`
- Mobile screens: Vary based on dark mode class

**Decision**: Use theme surface color `#fbf9f3` as the definitive background
**Why**: 
- More consistent across 4/7 screens
- Matches the Tailwind theme configuration
- Provides better flexibility for dark/light mode switching
- `#F2F0EA` override appears to be a per-request variation, not systemic

### Typography
**Issue**: 
- Consistent font families across all screens (Bodoni Moda, Literata, Inter)
- Minor variations in font weights for specific elements

**Decision**: Standardize on the defined typographic scale:
- Display (headings): Bodoni Moda
- Body (paragraphs): Literata  
- UI (nav, labels, captions): Inter
- Maintain the exact font sizes and line heights from Tailwind config

### Mobile Menu Implementation
**Issue**: 
- Three different implementations:
  1. home_mobile.html: Simple menu button in fixed header
  2. listings pages: Slide-in drawer with close button
  3. detail pages: Minimalist header with back/share buttons

**Decision**: Implement the slide-in drawer pattern (from listings pages)
**Why**:
- Most complete implementation (includes close button, proper styling)
- Better UX for navigation-heavy site
- Consistent with mobile patterns in listings_standard_desktop.html and listing_detail_mobile.html
- Accessible with proper trap focus

### Spacing
**Issue**: 
- Consistent 4px unit system across all screens
- Some variation in section gap usage

**Decision**: Standardize spacing scale:
- Unit: 4px (base)
- Margin mobile: 20px
- Margin desktop: 80px  
- Gutter: 24px
- Section gap: 120px
- Apply consistently via Tailwind padding/margin utilities

### Navigation
**Issue**: 
- Desktop: Consistent fixed header with logo/nav
- Mobile: Varied implementations as noted above

**Decision**: 
- Desktop: Fixed header with logo left, nav links right (transparent bg on scroll)
- Mobile: Slide-in drawer from left (matching listings implementation)
- Active state: Underline border for nav links (from home_desktop.html)

### Listing Card Differences
**Issue**: 
- Three distinct grid presentations:
  1. Standard: 3-column lg grid with varied aspect ratios
  2. Immersive: 12-column asymmetric layout
  3. Mobile: Single column stack

**Decision**: Create a single ListingGrid component with three density states:
- Compact: 4-column lg, tight gaps
- Standard: 3-column lg (reference implementation)
- Immersive: 12-column lg with featured spanning (from listings_immersive_desktop.html)
**Why**: 
- Avoids duplication of card component logic
- Allows user preference persistence
- Matches the "one reusable component" requirement

### Button/Link Differences
**Issue**: 
- Inconsistent active states (border-b vs bg-change)
- Varied hover effects
- Different padding applications

**Decision**: Standardize interactive elements:
- Primary buttons: bg-primary text-on-primary hover:bg-primary/90
- Secondary buttons: border border-primary text-primary hover:bg-primary/10
- Text links: text-on-surface-variant hover:text-primary transition-colors
- Active nav links: border-b border-primary pb-1
- All interactive elements: transition-colors duration-300

### Gallery Behavior
**Issue**: 
- Desktop: Fullscreen overlay with prev/next buttons and progress bar
- Mobile: Minimal controls with swipe gesture
- Some use scale transform, others don't

**Decision**: Implement a reusable gallery component with:
- Desktop: Overlay layout with prev/next buttons (top corners), counter/progress (bottom)
- Mobile: Full-screen swipeable with minimal controls (counter + nav)
- Keyboard navigation (arrow keys)
- Touch/swipe support
- Accessible labels (aria-label, role)
- Reduced motion respect (prefers-reduced-media)
- Image preloading for adjacent slides

## 3. Technical Architecture
**Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase
**Justification**:
- Next.js: Optimal for SEO, performance, and hybrid rendering
- TypeScript: Essential for maintainability in CMS-driven site
- Tailwind: Matches existing design system, utility-first approach
- Supabase: Provides auth, PostgreSQL storage, and file storage in one
- Vercel: Optimal Next.js deployment with edge functions

**What We Avoided**:
- Microservices (overkill for brochure site)
- Kubernetes (complexity not justified)
- Redis (Supabase handles caching needs)
- External APIs (beyond Supabase)
- Heavy state libraries (React Context sufficient for UI state)

## 4. Application Architecture

### Folder Structure
```
/app
  /(routes)           # Route groups
    /dashboard        # Admin protected routes
    /api              # Route handlers
  /components         # Reusable UI components
  /lib                # Utilities, Supabase client
  /types              # TypeScript definitions
  /styles             # Global CSS, Tailwind config
/assets               # Static assets (images, icons)
/public               # Static public files
```

### Component Architecture
- **Atoms**: Button, Link, Input, Avatar, Icon
- **Molecules**: ListingCard, PropertyFacts, NavLink, SocialLink
- **Organisms**: ListingGrid, Gallery, MobileMenu, HeaderFooter
- **Templates**: HomePage, ListingIndex, ListingDetail, AboutPage
- **Pages**: Route-specific implementations

### Route Structure
```
/ (Home)
/listings (Index)
/listings/[slug] (Detail)
/about
/enquire
/dashboard/login
/dashboard/properties
/dashboard/properties/new
/dashboard/properties/[slug]/edit
```

### Data Flow
1. Server Components fetch data directly from Supabase
2. Client Components use React Query/SWR for mutations
3. Form submissions use Supabase auth helpers
4. Image uploads go directly to Supabase Storage
5. Real-time updates via Supabase Realtime (optional)

### Authentication Boundary
- Public routes: /, /listings, /listings/[slug], /about, /enquire
- Protected routes: /dashboard/* (redirect to login if not authenticated)
- Auth handled via Supabase Auth (email/password + magic links optional)

### Database Schema
See Section 5 below

### Storage Structure
```
/properties          # Main property images
  /{propertyId}/
    cover.jpg        # Main cover image
    gallery/         # Additional images
      01.jpg
      02.jpg
    thumbnails/      # Auto-generated responsive variants
```

### API/Server Action Strategy
- Supabase SDK for direct database queries (server components)
- Supabase Auth helpers for authentication
- Edge Functions only if needed for complex business logic
- Prefer server actions for form mutations

### Image Handling Strategy
1. Admin uploads via drag/drop to Supabase Storage
2. Automatic thumbnail generation via Supabase Transformations
3. Database stores metadata (URL, dimensions, alt text, order)
4. Responsive delivery via `<Image>` component with srcset
5. Lazy loading by default
6. AVIF/WebP formats with fallback

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (for admin actions)
```

### Deployment Architecture
- Vercel: Automatic builds from main branch
- Preview deployments for PRs
- Production: Custom domain with SSL
- Edge caching for static assets
- Database hosted on Supabase (managed)

## 5. CMS Data Model

### Properties Table
```sql
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  location text not null,
  price integer not null, -- stored in cents/pence
  status text check (status in ('available', 'under_offer', 'sold', 'off_market')) default 'available',
  property_type text check (property_type in ('house', 'apartment', 'villa', 'penthouse', 'land')),
  bedrooms integer not null,
  bathrooms integer not null,
  area integer not null, -- square feet
  description text,
  cover_image_id uuid references storage.objects,
  published boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Property Images Table
```sql
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  image_id uuid not null references storage.objects,
  alt text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Property Types (Could be enum or separate table)
Using check constraint for simplicity as types are fixed:
- house, apartment, villa, penthouse, land

### Regions/Areas
Not implemented as separate table - stored as text in location field for simplicity
Could expand to: areas table with name, description, if needed later

### Admin Users
Leverage Supabase Auth users with role-based access:
- Create admin role in Supabase
- Use auth.uid() checks in policies
- Alternative: separate admins table linked to auth.users

### Essential Property Fields Covered:
- ✓ title
- ✓ slug
- ✓ location
- ✓ price
- ✓ status
- ✓ property_type
- ✓ bedrooms
- ✓ bathrooms
- ✓ area
- ✓ description
- ✓ cover_image_id
- ✓ gallery images (via property_images)
- ✓ published state
- ✓ sort_order
- ✓ created/updated timestamps

## 6. Image Architecture

### Flow
Admin upload → Auth check → Supabase Storage → Metadata DB record → Public listing → Optimized delivery

### Process
1. **Upload**: Drag/drop component to Supabase Storage bucket
2. **Validation**: File type (jpg/png/webp), size (<10MB), dimensions
3. **Storage**: Path format: `properties/{propertyId}/{purpose}/{filename}`
4. **Metadata**: Record in property_images table with:
   - ALT text (required for accessibility)
   - Sort order (for gallery sequence)
   - Purpose: 'cover' or 'gallery'
5. **Processing**: 
   - Automatic resizing via Supabase Transformations
   - Generate: thumbnail (300px), medium (800px), large (1600px)
   - Format: AVIF/WebP with JPEG fallback
6. **Delivery**: Next.js Image component with:
   - srcset for responsive breakpoints
   - lazy loading by default
   - placeholder blurred preview
   - quality optimization

### Special Considerations
- **Cover Image**: Special handling for property detail hero
- **Ordering**: Manual sort order in CMS
- **ALT Text**: Required field with AI-suggested generation (optional)
- **Deletion**: Cascade delete removes DB records and storage files
- **Replacement**: Upload new version, update DB reference

## 7. Gallery Mechanics

### Implementation
Using Framer Motion or CSS-only solution for:
- Previous/Next navigation (arrows/swipe)
- Keyboard navigation (ArrowLeft/ArrowRight)
- Touch/swipe support
- Image counter (01 / 14)
- Progress indicator (visual bar)
- Accessible labels (aria-label, role="img")
- Reduced motion: Respects prefers-reduced-media (fade instead of slide)

### Components
- `Gallery` container with state for current index
- `GalleryNavigation` for prev/next controls
- `GalleryCounter` for X/Y display
- `GalleryProgress` for visual progress bar
- `GallerySlide` for individual image with preloading

### Behavior
- Desktop: Clickable overlay areas, arrow keys
- Mobile: Full swipe gesture, tap edges for nav
- Accessible: Screen reader announces image number/total
- Performance: Lazy load adjacent images, prioritize current

## 8. Listings Density

### ListingGrid Component
Single component with three states controlled by prop or user preference:

```tsx
<ListingGrid density="compact" properties={properties} />
<ListingGrid density="standard" properties={properties} />
<ListingGrid density="immersive" properties={properties} />
```

### Breakpoint Behavior
| Density   | Mobile (<640px) | Tablet (640px-1024px) | Desktop (>1024px) |
|-----------|-----------------|-----------------------|-------------------|
| Compact   | 1 column        | 2 columns             | 4 columns         |
| Standard  | 1 column        | 2 columns             | 3 columns         |
| Immersive | 1 column        | 1 column              | 12-column asymmetric |

### Implementation
- Uses CSS Grid with dynamic template columns
- Shared ListingCard component for all densities
- User preference stored in localStorage
- URL parameter override for sharing/direct links

## 9. Dynamic vs Static Content Classification

### STATIC UI
- Navigation (structure, active states)
- Typography (fonts, sizes, weights)
- Buttons/Links (styles, hover effects)
- Layout (grid structures, spacing)
- Density selector (UI control)
- Footer (content links, copyright)
- Animation definitions
- Icon systems
- Form input styles

### CMS/DATABASE CONTENT
- Property title
- Location
- Price (formatted from cents)
- Status badge
- Property type
- Bedrooms/Baths/Area
- Description
- Cover image
- Gallery images (with ALT text)
- Published state
- Sort order
- Related listings (algorithmically generated)
- Meta tags (title, description for SEO)

## 10. Implementation Plan

### Phase 1 — Project foundation
- Initialize Next.js 14 + TypeScript + Tailwind project
- Configure ESLint, Prettier, TypeScript strict mode
- Set up Supabase client and types
- Create basic layout with header/footer
- Implement dark/light mode via class on html element
- **Deliverable**: Working dev environment with homepage shell

### Phase 2 — Design system/components
- Build atomic components (Button, Link, Input, Icon)
- Create molecule components (ListingCard, PropertyFacts, SocialLink)
- Implement layout organisms (Header, Footer, MobileMenu)
- Create ListingGrid component with three densities
- Build Gallery component with navigation/counter/progress
- Establish component library with Storybook-style documentation
- **Deliverable**: Complete component library with visual tests

### Phase 3 — Public pages with mock data
- Create Home page with hero and featured listings
- Build Listings index page with filters and density control
- Implement Listing detail page with gallery and specs
- Build About page with staff/projects
- Connect components using mock property data
- Implement client-side routing and navigation
- **Deliverable**: Fully functional frontend with mock data

### Phase 4 — Supabase database
- Initialize Supabase project
- Create properties and property_images tables
- Set up Row Level Security (RLS) policies
- Create storage buckets for property images
- Implement database functions for common queries
- **Deliverable**: Secure, production-ready database schema

### Phase 5 — Authentication
- Implement Supabase Auth (email/password)
- Create login page (/dashboard/login)
- Protect dashboard routes with auth middleware
- Add session management and route protection
- Implement password reset and profile update
- **Deliverable**: Secure authentication system for admin access

### Phase 6 — CMS/admin
- Build dashboard homepage with stats
- Create properties index with filtering/search
- Implement property form (create/edit) with validation
- Add publishing workflow (draft/published toggle)
- Implement property sorting (drag/drop or numeric)
- Add bulk actions (delete, change status)
- **Deliverable**: Complete CMS for property management

### Phase 7 — Image upload/storage
- Build image upload component (drag/drop, preview)
- Integrate with Supabase Storage
- Implement automatic thumbnails via transformations
- Create image management (reorder, delete, replace)
- Add ALT text field with AI-suggestion option
- Handle cover vs gallery image distinction
- **Deliverable**: Secure image handling with optimization

### Phase 8 — Connect CMS to public website
- Replace mock data with live Supabase queries
- Implement real-time updates (optional)
- Add search and filtering functionality
- Create dynamic meta tags for SEO
- Implement 404 handling and redirects
- Add sitemap.xml and robots.txt generation
- **Deliverable**: Live property data powering public site

### Phase 9 — Responsive/accessibility/performance
- Test all breakpoints (mobile, tablet, desktop)
- Implement WCAG 2.1 AA accessibility:
  - Proper color contrast (verify all combinations)
  - Keyboard navigation throughout
  - Screen reader labels (aria-label, role)
  - Focus management (modals, menus)
  - Skip links and landmark regions
- Performance optimization:
  - Image optimization (next/image, lazy loading)
  - Code splitting and dynamic imports
  - Minimize JavaScript bundle size
  - Implement caching headers
- **Deliverable**: Production-ready site passing Lighthouse >90

### Phase 10 — Production deployment
- Configure Vercel project with environment variables
- Set up preview deployments for branches
- Configure custom domain and SSL
- Set up error monitoring (Sentry or similar)
- Implement backup strategy for database
- Create deployment checklist and runbook
- **Deliverable**: Live production site at ateliernorth.properties

## Risks/Open Questions

### Risks
1. **Image optimization costs**: Supabase transformations may incur costs at scale
   - Mitigation: Set reasonable limits, use client-side compression for uploads
   
2. **Supabase Auth complexity**: Managing roles and permissions
   - Mitigation: Start with simple email/password, add magic links later
   
3. **SEO for dynamic content**: Ensuring property pages are indexable
   - Mitigation: Use Next.js metadata API, static generation where possible
   
4. **Mobile gallery performance**: Handling many high-res images
   - Mitigation: Implement virtualization, lazy load adjacent slides
   
5. **CMS usability**: Non-technical users managing properties
   - Mitigation: Focus on intuitive UX, clear validation, preview mode

### Open Questions
1. **Should we implement property favoriting/saving?**
   - Not in MVP but could be Phase 11
   
2. **Need for multilingual support?**
   - Current scope is English-only, but structure should support i18n
   
3. **Advanced search/filtering capabilities?**
   - MVP: basic filters (type, location, status)
   - Future: map-based search, price sliders, keyword search
   
4. **Integration with external CRM/email systems?**
   - Out of scope for MVP, but webhook capability could be added
   
5. **Analytics and tracking requirements?**
   - Basic page views via next/gtm, enhanced e-commerce not needed

---
*Decisions based on analysis of 7 canonical screens and Atelier North design specification. Prioritizes consistency, accessibility, and production feasibility over theoretical perfection.*