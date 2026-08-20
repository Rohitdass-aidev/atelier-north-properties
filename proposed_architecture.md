# Proposed Architecture - Atelier North Properties

## Tech Stack
- Next.js 14 (App Router): For SEO-friendly server-side rendering and hybrid data fetching
- TypeScript: For type safety and maintainability
- Tailwind CSS: For utility-first styling aligned with design system
- Supabase: For authentication, PostgreSQL database, and storage

## Key Components
1. **Server Components**: Handle data fetching and business logic (e.g., API routes, database queries)
2. **Client Components**: UI render with interactivity (e.g., gallery, form submissions)
3. **Edge Functions (Optional)**: For complex business rules needing client-side execution

## Deployment
- Vercel: Platform for Next.js hosting, optimized for edge functions
- Supabase: Managed database and storage with built-in RLS policies

## Architecture Diagram
```
@startuml
actor Admin, PublicUser

Admin -> Supabase:
  "Auth (create/update properties)"
  "Image Upload"
  "Manage Dashboard"

PublicUser -> Next.js:
  "Homepage"
  "Listings Search"
  "Property Detail"

Next.js -> Supabase:
  "RSVP API"
  "Image Thumbnails"
  "Search Filters"

Next.js -> Tailwind:
  "UI Styling"

@enduml
```

## Tradeoffs
- Avoiding SSR/CSR complexity for polymorphic content
- Leveraging Supabase Auth for unified user management
- Edge Functions reserved for non-critical logic

## Simplicity Pact
No web sockets, server-side rendering beyond SEO needs, or distributed caches
