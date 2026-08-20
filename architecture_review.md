# Architecture Review - Atelier North Properties

## Final recommended stack
- **Next.js (App Router)**: Core framework for Server Components and Server Actions.
- **TypeScript**: For end-to-end type safety.
- **Tailwind CSS**: Utility-first styling (purely light mode, adhering to the Stitch design system).
- **Supabase**: Unified backend for PostgreSQL, Storage, and Authentication.

*Explicitly excluded: Redis, Kubernetes, microservices, complex state management (Redux/Zustand), external APIs (beyond Supabase), and custom backend infrastructure.*

## Final database tables
The schema is reduced to the absolute minimum required for the specified MVP CRUD operations:

1. `properties`
   - `id` (uuid)
   - `title` (text)
   - `slug` (text)
   - `location` (text)
   - `price` (integer)
   - `status` (text)
   - `property_type` (text)
   - `bedrooms` (integer)
   - `bathrooms` (integer)
   - `area` (integer)
   - `description` (text)
   - `cover_image_path` (text) - *Stores relative storage key, not full URL*
   - `published` (boolean)
   - `sort_order` (integer)
   - timestamps (`created_at`, `updated_at`)

2. `property_images`
   - `id` (uuid)
   - `property_id` (uuid)
   - `image_path` (text) - *Stores relative storage key, not full URL*
   - `alt` (text)
   - `sort_order` (integer)
   - timestamp (`created_at`)

## Final database relationships
- `property_images` has a standard Foreign Key to `properties(id)` with `ON DELETE CASCADE`.
- *Removed*: Foreign key relationships to Supabase internal `storage.objects`. Images are referenced by their relative storage paths (e.g. `properties/{property_id}/{filename.jpg}`) as text fields, decoupling the application database from the storage provider's internal tables.

## Final authentication model
- **Public Website**: No authentication required.
- **Admin CMS**: Supabase Auth (Email/Password).
- **Row Level Security (RLS)**:
  - **Read**: `properties` and `property_images` are public for `SELECT` where `published = true`.
  - **Mutations**: All `INSERT`, `UPDATE`, `DELETE` operations are protected by a simple `auth.uid() IS NOT NULL` check.
  - *Note*: Public signups MUST be disabled in the Supabase project settings to prevent unauthorized admin access.

## Final storage model
- A single public Supabase Storage bucket (`properties`).
- Uploads happen directly from the admin panel (authenticated).
- By storing the relative path rather than a hardcoded full URL, we ensure the system is completely portable. The full URL is generated at runtime (e.g., combining the Supabase URL and the relative path).
- When deleting a property, a Next.js Server Action will first use the stored paths to delete the actual files from the storage bucket, and then delete the database record.

## Final component architecture
- **Flattened Structure**: The `atoms → molecules → organisms → templates` abstraction has been removed.
- Components will live in a single flat `components/` directory, grouped functionally only if necessary (e.g., `components/ui`, `components/layout`, `components/listings`).
- **No ThemeProvider**: The dark mode context and Tailwind `class` dark mode have been completely removed to strictly follow the light-mode-only Atelier North design system.
- Components will only be created when there is genuine reuse (e.g., a shared `ListingCard`, `Button`, or `TopNavBar`).

## Final route structure
```
/ (Home)
/listings (Index)
/listings/[slug] (Detail)
/about (About)
/enquire (Contact)
/dashboard/login (Admin Login)
/dashboard/properties (Admin List)
/dashboard/properties/new (Admin Create)
/dashboard/properties/[slug]/edit (Admin Edit)
```
*(No `/api/*` routes)*

## Final server/API strategy
- **No API Routes**: The `/api/*` layer has been entirely eliminated.
- **Data Fetching**: Direct server-side Supabase queries inside Next.js Server Components.
- **Mutations**: Next.js Server Actions will handle all form submissions, property CRUD, and image uploads securely on the server.

## Static vs dynamic content
- **Public Routes** (`/`, `/listings`, `/about`, `/listings/[slug]`): Static generation with Incremental Static Regeneration (ISR). They will periodically revalidate data from Supabase to balance performance and freshness.
- **Dashboard Routes** (`/dashboard/*`): Fully dynamic, rendered on request with strict authentication checks.

## Deployment architecture
- **Frontend & Server Actions**: Vercel.
- **Database, Auth & Storage**: Supabase.
- No separate backend infrastructure.

## What was removed from the previous architecture
- The `admin_users` table and complex role-based access control (RBAC).
- The `/api/*` routing layer.
- The `atoms/molecules/organisms` component directory structure.
- Dark mode implementation, theme providers, and toggle logic.
- Foreign key ties to internal `storage.objects`.
- Redis caching for queries.
- Any mention of CRM, analytics dashboards, payments, or AI features.

## What was simplified
- **Authentication**: Relying solely on `auth.uid()` existence for admin rights (with signups disabled) instead of a custom roles table.
- **Image Storage**: Saving image URLs as simple text instead of managing relational integrity with storage buckets.
- **Component Abstraction**: Favoring maintainability over strict atomic design principles.

## Remaining risks
- **Admin Security**: Since we removed the `admin_users` table, if public signups are accidentally left enabled in Supabase, anyone who signs up will have admin mutation rights via RLS. (Must ensure signups are strictly disabled).
- **Server Actions UX**: Server Actions for large image uploads might require careful client-side optimistic UI and error handling to feel responsive compared to direct client-to-storage uploads.

## Final implementation order
1. **Foundation**: Scaffold Next.js + Tailwind (light mode only).
2. **Database**: Setup Supabase tables (`properties`, `property_images`) and RLS. Disable public signups.
3. **Storage**: Setup public Supabase bucket.
4. **UI Components**: Build flattened, reusable UI components based on Stitch HTML.
5. **Public Pages**: Implement public routes with Server Components and static mock data, then connect to Supabase.
6. **Authentication**: Setup admin login page and protect `/dashboard`.
7. **Admin CMS**: Implement Server Actions for CRUD operations and image uploads.
8. **Integration**: Tie CMS actions to live property views and refine Server Action error handling.
