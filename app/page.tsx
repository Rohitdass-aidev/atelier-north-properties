import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

function resolveImageUrl(imagePath: string | null | undefined, supabaseUrl: string): string | null {
  if (!imagePath || !imagePath.trim()) {
    return null;
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const pathInBucket = imagePath.replace(/^properties\//, '');
  return `${supabaseUrl}/storage/v1/object/public/properties/${pathInBucket}`;
}

export default async function HomePage() {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  // Query only published properties from Supabase, sorted by sort_order ASC, then created_at DESC
  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      slug,
      location,
      price,
      cover_image_path,
      published,
      sort_order,
      created_at,
      property_images (
        id,
        image_path,
        alt,
        sort_order
      )
    `)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(3);

  const areas = [
    {
      name: 'Mayfair',
      category: 'City',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAw_gYIgz7_KsOUSmf4zVT4geygQX9CWlYUnRjmnGbKgI3VdDNlnFHJSyA8lHLA26uug_u1f19xLqfXBwH4EH63iIiodzejXZsZ4u4eRUUigpZcC8sVSqaiwBnYULbHcH9fUlhdRi_s_4SsusDxf2C0rtI7yxXVE79D5Ucdm-0eW1RDqqxnm_2XHkekqBiFwF_tcWU4s7PXF1cFbJYq98wsWrUzkFYWH_3VMk9pDfvvGIf_bEzK8S6e',
      alt: 'Mayfair stucco-fronted architecture',
    },
    {
      name: 'Cornwall Coast',
      category: 'Coast',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYtRfHCOLbQVTQrKEHN6mmxcSYoO6Gyc20CN0WXCzS25PjeOZhbvmDyfRcMjfbATQ2CaG5y1ryBc_uGL4sKc3OQ2E-63FFrb0U1ccndRdDDDnT4V3lsGXqt7WRjOvEBeVyLyRqF81hRQSXeix3OYbVVGCC7UwuL3gXnIUnmTnZVXVnky-LXTTR6y9lUwfa4sTtC2eTwzhF-2pyY05P-oUmS1LuGvfOoxDQWPFehKeVGFW9QbFa7LTq',
      alt: 'Cornwall rugged coastal cliff',
    },
    {
      name: 'Hampstead',
      category: 'City',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7YR3DUgjy36Eq6gcpA7reXmGAVXjTUDh5HVz-qLHntTy6Y2jFSxcg0xgqDxfkUGdzVE_sntR4VAHqRPyjzRQNRL4YorsszkfpcBqq0rMTkNrSQgBriuxkB14hz7EJkVpzZF_Y9QtUJjEQloGndQ4VJuAu8YRUJ0hW0p2I371NzQHTQNi93cWdCsWKDqia6nzYQ91XVhnTj8w5PegAdZWByjbXHmHskq_pqzwqzUEt_HZw5852MT8',
      alt: 'Hampstead modernist architecture among foliage',
    },
  ];

  // Helper to extract image details for a property
  const getPropertyDetails = (property: typeof properties extends (infer T)[] | null ? T : any) => {
    if (!property) return null;
    const sortedImages = Array.isArray(property.property_images)
      ? [...property.property_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : [];
    const primaryImagePath =
      property.cover_image_path || (sortedImages.length > 0 ? sortedImages[0].image_path : null);
    const imageUrl = resolveImageUrl(primaryImagePath, supabaseUrl);
    const imageAlt =
      sortedImages.length > 0 && sortedImages[0].alt
        ? sortedImages[0].alt
        : `${property.title} architectural photograph`;
    const imageCount = sortedImages.length;

    return {
      property,
      imageUrl,
      imageAlt,
      imageCount,
    };
  };

  const item1 = properties && properties.length > 0 ? getPropertyDetails(properties[0]) : null;
  const item2 = properties && properties.length > 1 ? getPropertyDetails(properties[1]) : null;
  const item3 = properties && properties.length > 2 ? getPropertyDetails(properties[2]) : null;

  return (
    <div className="pt-[60px] md:pt-[72px]">
      {/* Hero Section - Matching Stitch 870px / 100dvh crop */}
      <section className="w-full h-[100dvh] md:h-[870px] relative mb-section-gap overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAoGA1uFufkDyqmh5M9NDJxpBCSH3NQQp8gQ6WxmkqMsPy6KUS70oCtBnV5-e7EJh0ZExtcEMx93WQVkK03V1V2ecNw-Lokf_bMtyPbwhjBUnJaBQ2Z3r0o0UzLrHCD83xXt7LmQA7vDqmePMZIGl71MzRSXE2I0yEoXf6vxhZ4LItvqc5M2sptKU_3VFLQJnchf-XPWTve_pImguyzMX-Ix3shwZixeHMwGSeyUtIMZYRFjE3ZmBq"
            alt="A striking edge-to-edge architectural photograph of a modern concrete and glass house at twilight"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
        </div>

        {/* Bottom Banner Overlay */}
        <div className="absolute bottom-0 left-0 w-full px-margin-mobile md:px-margin-desktop pb-8 flex flex-col md:flex-row justify-between items-start md:items-center text-on-primary bg-gradient-to-t from-primary/60 to-transparent pt-32">
          <div>
            <h1 className="font-display-xl text-display-lg md:text-display-xl mb-2 text-white font-normal hidden md:block">
              Atelier North
            </h1>
            <p className="font-label-caps text-label-caps uppercase tracking-widest text-white/90">
              Selected residences in the city + coast
            </p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0 font-label-caps text-label-caps uppercase tracking-widest text-white/90">
            <p className="mb-1">London / 51.5074° N</p>
            <a
              href="mailto:enquiries@ateliernorth.com"
              className="border-b border-white/80 pb-0.5 hover:text-white transition-colors"
            >
              enquiries@ateliernorth.com
            </a>
          </div>
        </div>
      </section>

      {/* Featured Residences (Asymmetrical Grid) */}
      <section className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-12">
          <div className="md:col-start-1 md:col-span-4">
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary font-normal">
              Curated
              <br />
              Listings
            </h2>
          </div>
          <div className="md:col-start-5 md:col-span-8 flex items-end pb-2">
            <div className="w-full h-px bg-outline-variant"></div>
          </div>
        </div>

        {/* Query error handling */}
        {error && (
          <div className="p-6 bg-surface-container border border-outline text-primary font-body-md mb-12">
            <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
              Unable to Load Curated Listings
            </p>
            <p className="text-on-surface-variant text-sm">{error.message}</p>
          </div>
        )}

        {/* Empty state when no properties are published */}
        {!error && (!properties || properties.length === 0) && (
          <div className="text-center py-20 px-4 border border-outline-variant bg-surface-container-low mb-12">
            <p className="font-display text-2xl text-primary mb-2">No curated residences published</p>
            <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto mb-6">
              Our curated collection is currently being updated. Please check back soon or browse all properties.
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Explore Index
            </Link>
          </div>
        )}

        {/* Asymmetrical Grid items */}
        {properties && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-gutter">
            {/* Item 1: Large Portrait (Left aligned) */}
            {item1 && (
              <article className="md:col-start-2 md:col-span-6 group cursor-pointer">
                <Link href={`/listings/${item1.property.slug}`}>
                  <div className="w-full aspect-[3/4] overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                    {item1.imageUrl ? (
                      <Image
                        src={item1.imageUrl}
                        alt={item1.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
                          Photography in Preparation
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                        {item1.property.title}
                      </h3>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {item1.property.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-nav-link text-nav-link text-primary font-medium">
                        {formatPrice(item1.property.price)}
                      </p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {String(item1.imageCount).padStart(2, '0')} IMG
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Item 2: Landscape (Right aligned & offset vertically) */}
            {item2 && (
              <article className="md:col-start-7 md:col-span-6 md:mt-48 group cursor-pointer">
                <Link href={`/listings/${item2.property.slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                    {item2.imageUrl ? (
                      <Image
                        src={item2.imageUrl}
                        alt={item2.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
                          Photography in Preparation
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                        {item2.property.title}
                      </h3>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {item2.property.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-nav-link text-nav-link text-primary font-medium">
                        {formatPrice(item2.property.price)}
                      </p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {String(item2.imageCount).padStart(2, '0')} IMG
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Item 3: Square (Center left) */}
            {item3 && (
              <article className="md:col-start-3 md:col-span-5 group cursor-pointer">
                <Link href={`/listings/${item3.property.slug}`}>
                  <div className="w-full aspect-square overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                    {item3.imageUrl ? (
                      <Image
                        src={item3.imageUrl}
                        alt={item3.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
                          Photography in Preparation
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                        {item3.property.title}
                      </h3>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {item3.property.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-nav-link text-nav-link text-primary font-medium">
                        {formatPrice(item3.property.price)}
                      </p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                        {String(item3.imageCount).padStart(2, '0')} IMG
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* View All Listings CTA */}
            <div className="md:col-start-1 md:col-span-12 flex justify-center mt-12">
              <Link
                href="/listings"
                className="font-label-caps text-label-caps uppercase tracking-widest border border-primary px-8 py-4 hover:bg-primary hover:text-on-primary transition-colors duration-300"
              >
                View All Listings
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Areas of Focus Section */}
      <section
        id="areas"
        className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-[1440px] mx-auto bg-surface-container-low py-20 md:py-24 border-y border-outline-variant"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
          <div className="md:col-start-2 md:col-span-4">
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary font-normal">
              Areas of
              <br />
              Focus
            </h2>
          </div>
          <div className="md:col-start-6 md:col-span-6 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            <p>
              We source properties across a selective geography, focusing on enclaves that offer
              exceptional architectural merit, whether embedded in the historic fabric of the city or
              exposed to the raw elements of the coast.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-start-2 md:col-span-10">
            <ul className="flex flex-col border-t border-outline-variant">
              {areas.map((area) => (
                <li key={area.name}>
                  <Link
                    href={`/listings?area=${encodeURIComponent(area.category)}`}
                    className="group cursor-pointer border-b border-outline-variant py-8 flex items-center justify-between hover:bg-surface-container transition-colors px-2 md:px-4"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 overflow-hidden border border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block relative bg-surface-dim">
                        <Image
                          src={area.image}
                          alt={area.alt}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-headline-md text-headline-md text-primary group-hover:translate-x-3 transition-transform duration-300 font-normal">
                        {area.name}
                      </h3>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-2xl">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
