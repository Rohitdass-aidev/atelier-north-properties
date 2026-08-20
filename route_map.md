# Route Map - Atelier North Properties

## Route Structure

```
/ (Home)
/listings (Listings Index)
/listings/[slug] (Listing Detail)
/about (About)
/enquire (Enquiry/Contact)
/dashboard (Dashboard - redirects to /dashboard/properties)
/dashboard/login (Login)
/dashboard/properties (Properties List)
/dashboard/properties/new (Create Property)
/dashboard/properties/[slug]/edit (Edit Property)
/api/* (Server Actions / API Routes)
```

## Detailed Route Definitions

### Public Routes

#### GET /
- **Component**: `app/page.tsx` (Server Component)
- **Layout**: `HomeTemplate`
- **Data**: Featured properties (3-4), hero image
- **Caching**: Static with ISR (revalidate: 3600)
- **SEO**: 
  - Title: "Atelier North Properties | City + Coast"
  - Description: "Selected residences in the city and coast..."
  - OG Image: Hero image

#### GET /listings
- **Component**: `app/listings/page.tsx` (Server Component)
- **Layout**: `ListingIndexTemplate`
- **Search Params**:
  - `density`: 'compact' | 'standard' | 'immersive' (default: 'standard')
  - `type`: property_type filter
  - `location`: area filter
  - `status`: status filter
  - `page`: pagination (default: 1)
  - `sort`: 'newest' | 'price-asc' | 'price-desc' (default: 'newest')
- **Data**: Filtered properties from DB with pagination
- **Caching**: Static with ISR (revalidate: 300)
- **SEO**:
  - Title: "Listings | Atelier North Properties"
  - Dynamic meta based on filters

#### GET /listings/[slug]
- **Component**: `app/listings/[slug]/page.tsx` (Server Component)
- **Layout**: `ListingDetailTemplate`
- **Data**: Property detail with full gallery
- **Caching**: Static with ISR (revalidate: 3600)
- **SEO**:
  - Title: "{property.title} | Atelier North Properties"
  - Description: Property description (truncated)
  - OG Image: Cover image
  - JSON-LD: Product schema for real estate

#### GET /about
- **Component**: `app/about/page.tsx` (Server Component)
- **Layout**: `AboutTemplate`
- **Data**: Static content (team, expertise, publications)
- **Caching**: Static (build time)
- **SEO**:
  - Title: "About | Atelier North Properties"
  - Description: "Sourcing exceptional architectural merit..."

#### GET /enquire
- **Component**: `app/enquire/page.tsx` (Client Component for form)
- **Layout**: `HomeTemplate` (or EnquireTemplate)
- **Data**: None (form only)
- **SEO**:
  - Title: "Enquire | Atelier North Properties"

### Protected Routes (Dashboard)

#### GET /dashboard/login
- **Component**: `app/(dashboard)/login/page.tsx` (Client Component)
- **Auth**: Public (redirects if already logged in)
- **Layout**: Minimal (centered card)
- **Form**: Email/password + Magic link option
- **Actions**: Login, Request magic link, Password reset

#### GET /dashboard
- **Redirect**: `/dashboard/properties`

#### GET /dashboard/properties
- **Component**: `app/(dashboard)/dashboard/properties/page.tsx` (Server Component)
- **Auth**: Required (admin/editor role)
- **Layout**: `DashboardTemplate` with sidebar
- **Data**: All properties (published + drafts) with search/filter
- **UI**: Table/grid view, bulk actions, pagination
- **Actions**: Create, Edit, Delete, Publish/Unpublish, Duplicate

#### GET /dashboard/properties/new
- **Component**: `app/(dashboard)/dashboard/properties/new/page.tsx` (Client Component)
- **Auth**: Required (admin/editor role)
- **Layout**: `DashboardTemplate`
- **Form**: Full property creation form with image uploads
- **Actions**: Save draft, Publish, Cancel

#### GET /dashboard/properties/[slug]/edit
- **Component**: `app/(dashboard)/dashboard/properties/[slug]/edit/page.tsx` (Client Component)
- **Auth**: Required (admin/editor role)
- **Layout**: `DashboardTemplate`
- **Form**: Pre-filled property edit form with image management
- **Actions**: Save, Publish/Unpublish, Delete, Cancel

### API Routes / Server Actions

#### POST /api/auth/login
- Supabase Auth sign in
- Sets session cookie
- Returns redirect URL

#### POST /api/auth/logout
- Clears session
- Redirects to /

#### POST /api/properties
- **Server Action**: `createProperty`
- Creates property record + uploads images
- Validates with Zod schema
- Returns property slug for redirect

#### PUT /api/properties/[slug]
- **Server Action**: `updateProperty`
- Updates property + manages image additions/removals
- Handles cover image changes
- Returns updated property

#### DELETE /api/properties/[slug]
- **Server Action**: `deleteProperty`
- Deletes property + all associated images
- Soft delete option (status = 'off_market')

#### POST /api/images/upload
- **Server Action**: `uploadPropertyImages`
- Uploads to Supabase Storage
- Generates thumbnails
- Returns image records with URLs

#### DELETE /api/images/[imageId]
- **Server Action**: `deletePropertyImage`
- Removes from storage + database

#### GET /api/search
- **Server Action**: `searchProperties`
- Full-text search with filters
- Returns paginated results

#### POST /api/enquire
- **Server Action**: `submitEnquiry`
- Sends email via Resend/SendGrid
- Logs to database
- Returns success/error

## Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 1. Redirect /dashboard to /dashboard/properties
  // 2. Protect /dashboard/* routes (check auth cookie)
  // 3. Redirect authenticated users from /dashboard/login to /dashboard/properties
  // 4. Set response headers (security, caching)
  // 5. Handle locale detection (future)
}
```

## Route Groups (App Router)

```
/app
├── page.tsx                    # Home
├── layout.tsx                  # Root layout (providers, fonts)
├── globals.css                 # Global styles
├── loading.tsx                 # Global loading UI
├── error.tsx                   # Global error UI
├── not-found.tsx               # 404 page
├── sitemap.ts                  # Sitemap generation
├── robots.ts                   # Robots.txt generation
│
├── listings/
│   ├── page.tsx               # Listings index
│   └── [slug]/
│       └── page.tsx           # Listing detail
│
├── about/
│   └── page.tsx               # About page
│
├── enquire/
│   └── page.tsx               # Enquiry page
│
├── (dashboard)/                # Route group for admin
│   ├── layout.tsx             # Dashboard layout with sidebar
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── dashboard/
│       ├── page.tsx           # Redirect to properties
│       └── properties/
│           ├── page.tsx       # Properties list
│           ├── new/
│           │   └── page.tsx   # Create property
│           └── [slug]/
│               └── edit/
│                   └── page.tsx # Edit property
│
└── api/
    ├── auth/
    │   ├── login/route.ts
    │   └── logout/route.ts
    ├── properties/
    │   ├── route.ts           # GET list, POST create
    │   └── [slug]/
    │       ├── route.ts       # GET, PUT, DELETE
    │       └── images/
    │           └── route.ts   # POST upload, DELETE
    ├── images/
    │   └── [imageId]/route.ts # DELETE image
    ├── search/route.ts        # GET search
    └── enquire/route.ts       # POST submit
```

## Navigation Flow

```
Public User Flow:
Home -> Listings Index -> Listing Detail -> Enquire
              -> About
              -> (back navigation)

Admin Flow:
Login -> Properties List -> Create New Property
                    -> Edit Existing Property
                    -> Manage Images
                    -> Publish/Unpublish
                    -> Delete
                    -> (back to list)

Deep Linking:
/listings/[slug]          - Direct to property
/dashboard/properties/[slug]/edit  - Direct to edit
/enquire?property=slug    - Pre-filled enquiry
```

## Caching Strategy

| Route | Cache Type | Revalidate | Notes |
|-------|-----------|------------|-------|
| / | Static + ISR | 3600s | Homepage with featured |
| /listings | Static + ISR | 300s | Filters via searchParams |
| /listings/[slug] | Static + ISR | 3600s | Individual properties |
| /about | Static | Build time | Never changes dynamically |
| /enquire | Dynamic | No cache | Form page |
| /dashboard/* | Dynamic | No cache | Requires auth |

## Error Pages

- `not-found.tsx`: Custom 404 with search link
- `error.tsx`: Global error boundary with retry
- `loading.tsx`: Skeleton loaders for each route

## Sitemap & Robots

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const properties = await getPublishedProperties();
  
  return [
    { url: 'https://ateliernorth.properties', lastModified: new Date() },
    { url: 'https://ateliernorth.properties/listings', lastModified: new Date() },
    { url: 'https://ateliernorth.properties/about', lastModified: new Date() },
    { url: 'https://ateliernorth.properties/enquire', lastModified: new Date() },
    ...properties.map(p => ({
      url: `https://ateliernorth.properties/listings/${p.slug}`,
      lastModified: p.updated_at
    }))
  ];
}
```

## Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];
```

## Internationalization (Future)

```
Future structure:
/[locale]/
  ├── page.tsx
  ├── listings/
  │   ├── page.tsx
  │   └── [slug]/
  │       └── page.tsx
  ├── about/
  │   └── page.tsx
  └── enquire/
      └── page.tsx

Default locale: en
Supported: en, fr, de (if needed)
```