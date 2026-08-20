# Component Architecture - Atelier North Properties

## Component Hierarchy

```
App
├── components/
│   ├── atoms/
│   │   ├── Button.tsx           # Primary, Secondary, Ghost variants
│   │   ├── Input.tsx              # Text, Number, Select
│   │   ├── Label.tsx              # Form labels
│   │   ├── Icon.tsx               # Material Symbols wrapper
│   │   ├── Avatar.tsx             # User avatar
│   │   └── Badge.tsx              # Status/pill indicators
│   │
│   ├── molecules/
│   │   ├── ListingCard.tsx        # Individual property card
│   │   ├── PropertyFacts.tsx      # Bedrooms/Baths/Area display
│   │   ├── SocialLink.tsx         # Social media icon/link
│   │   ├── NavLink.tsx            # Navigation link with active state
│   │   └── ImageWithPlaceholder.tsx
│   │
│   ├── organisms/
│   │   ├── Header.tsx             # Top navigation bar
│   │   ├── Footer.tsx             # Site footer
│   │   ├── MobileMenu.tsx         # Slide-in drawer for mobile
│   │   ├── Gallery.tsx            # Image carousel with navigation
│   │   ├── GallerySlide.tsx       # Individual gallery slide
│   │   ├── GalleryNav.tsx         # Prev/Next controls
│   │   ├── GalleryCounter.tsx     # Image counter (01/14)
│   │   ├── GalleryProgress.tsx    # Progress indicator bar
│   │   ├── DensitySelector.tsx    # Compact/Standard/Immersive toggle
│   │   └── PropertyImages.tsx     # Cover + gallery image manager
│   │
│   ├── templates/
│   │   ├── HomeTemplate.tsx       # Homepage layout
│   │   ├── ListingIndexTemplate.tsx # Listings grid + filters
│   │   ├── ListingDetailTemplate.tsx # Gallery + details layout
│   │   ├── AboutTemplate.tsx      # About page layout
│   │   └── DashboardTemplate.tsx  # Admin layout with sidebar
│   │
│   └── ui/
│       ├── ThemeProvider.tsx      # Dark/light mode context
│       ├── MobileProvider.tsx     # Mobile/tablet/desktop detection
│       └── FormProvider.tsx     # Form state management
│
├── hooks/
│   ├── useAuth.tsx                # Auth state management
│   ├── useGallery.tsx             # Gallery state and navigation
│   ├── useImageUpload.tsx         # File upload handling
│   ├── useMobileMenu.tsx          # Mobile menu open/close state
│   └── useReducedMotion.tsx       # Prefers-reduced-motion detection
│
├── lib/
│   ├── supabase.ts                # Client initialization
│   ├── database.types.ts          # Generated TypeScript types
│   ├── image-utils.ts             # Image optimization helpers
│   └── validation.ts              # Form validation schemas
│
└── styles/
    ├── globals.css                # Global styles
    ├── components.css             # Component-specific utilities
    └── tailwind.config.js         # Tailwind configuration
```

## Component Details

### Atoms

#### Button.tsx
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

Variants:
- primary: bg-primary text-on-primary
- secondary: border border-primary text-primary
- ghost: text-primary hover:bg-surface-container

Sizes:
- sm: px-3 py-1.5 text-sm
- md: px-4 py-2 text-base
- lg: px-6 py-3 text-lg
```

#### Input.tsx
```tsx
interface InputProps {
  type: 'text' | 'number' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

### Molecules

#### ListingCard.tsx (Density-Aware)
```tsx
interface ListingCardProps {
  property: Property;
  density?: 'compact' | 'standard' | 'immersive';
}

Density variations:
- compact: Title, price, small image, minimal details
- standard: Full image, title, location, price, status
- immersive: Large featured image, detailed specs, accent details
```

#### Gallery.tsx (Controlled Component)
```tsx
interface GalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

Features:
- Keyboard navigation (ArrowLeft/ArrowRight)
- Touch/swipe gestures
- Progress indicator
- Image counter
- Reduced motion support
- Virtual scrolling for large galleries
```

### Organisms

#### ListingGrid.tsx (Single Component, Three States)
```tsx
interface ListingGridProps {
  properties: Property[];
  density: 'compact' | 'standard' | 'immersive';
  onSelect?: (property: Property) => void;
}

Layout variations:
- compact: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter
- standard: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-section-gap
- immersive: masonry-style with featured items (col-span-1 md:col-span-12, etc.)

Breakpoints:
- Mobile: 1 column
- Tablet: 1-2 columns
- Desktop: 3-12 columns (density dependent)
```

#### MobileMenu.tsx (Slide-in Drawer)
```tsx
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

Features:
- Slide-in from left
- Close button in top-right
- Navigation links with icons
- Close on outside click
- Voice-over friendly
```

## State Management Hierarchy

```
App Level
├── Auth Context (user session)
├── Theme Context (dark/light mode)
├── Mobile Detection (hydrated client-only)
│
Route Level
├── ListingIndex
│   ├── DensitySelector State (local or URL param)
│   └── Filters State (searchParams or local)
│
Component Level
├── Gallery (controlled by parent)
├── MobileMenu (local state via useMobileMenu)
└── Forms (local state or FormProvider)
```

## Reusable Patterns

### 1. Density-Based Component Pattern
```tsx
// Single component with density prop
const ListingCard = ({ property, density = 'standard' }) => {
  const layouts = {
    compact: <CompactLayout {...props} />,
    standard: <StandardLayout {...props} />,
    immersive: <ImmersiveLayout {...props} />
  };
  return layouts[density];
};
```

### 2. Controlled Gallery Pattern
```tsx
// Gallery state managed by parent
<ListingDetail>
  <Gallery
    images={property.gallery}
    currentIndex={currentIndex}
    onPrevious={() => setIndex(i => i - 1)}
    onNext={() => setIndex(i => i + 1)}
  />
</ListingDetail>
```

### 3. Form Validation Pattern
```tsx
// Using Zod schema with React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(propertySchema)
});
```

## Styling Conventions

### Tailwind Classes Organization
```tsx
<div className="
  /* Layout */
  flex flex-col w-full
  /* Spacing */
  px-margin-mobile md:px-margin-desktop
  /* Typography */
  font-body-lg text-body-lg
  /* Colors */
  bg-surface text-on-surface
  /* Borders */
  border border-outline-variant
  /* Interactions */
  transition-colors duration-300
  /* Accessibility */
  focus:outline-none focus:ring-2
">
```

### Component File Structure
```
ComponentName/
├── index.tsx          # Main component export
├── ComponentName.tsx  # Component implementation
├── types.ts           # TypeScript interfaces
├── styles.ts          # Dynamic styles (optional)
└── __tests__/
    └── ComponentName.test.tsx
```

## Performance Optimizations

1. **Lazy Loading**: Gallery images and listings loaded on demand
2. **Code Splitting**: Dashboard/Admin components loaded only in /dashboard routes
3. **Image Optimization**: Using next/image with blur placeholders
4. **Memoization**: Expensive calculations memoized (property filtering, calculations)
5. **Server Components**: Data fetching in server components for SEO

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy (h1 > h2 > h3)
2. **ARIA Labels**: Gallery navigation, mobile menu toggle
3. **Focus Management**: Tab order, visible focus indicators
4. **Keyboard Navigation**: All interactive elements keyboard-accessible
5. **Reduced Motion**: Respects prefers-reduced-motion media query
6. **Color Contrast**: WCAG AA compliant (4.5:1 minimum)

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Atoms: Button, Input, Icon
- Molecules: ListingCard, SocialLink
- Hooks: useGallery, useMobileMenu

### Integration Tests
- Gallery navigation (keyboard, touch, mouse)
- Mobile menu open/close
- Form submission and validation

### End-to-End Tests (Playwright)
- Full user flows:
  - View listings from homepage
  - Navigate to property detail
  - Browse gallery
  - Submit enquiry form