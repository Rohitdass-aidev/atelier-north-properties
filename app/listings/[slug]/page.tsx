import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPropertyBySlug, getRelatedProperties, getAllProperties, formatPrice, formatArea } from '@/lib/mockData';
import Gallery from '@/components/listings/Gallery';

interface ListingPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const properties = getAllProperties();
  return properties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const property = getPropertyBySlug(params.slug);
  if (!property) {
    return {
      title: 'Property Not Found | Atelier North Properties',
    };
  }

  return {
    title: `${property.title} | Atelier North Properties`,
    description: property.description,
    openGraph: {
      title: `${property.title} | Atelier North Properties`,
      description: property.description,
      images: [
        {
          url: property.cover_image,
          alt: property.cover_image_alt,
        },
      ],
    },
  };
}

export default function ListingDetailPage({ params }: ListingPageProps) {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const related = getRelatedProperties(params.slug, 3);

  return (
    <div className="pt-[60px] md:pt-[72px] min-h-screen">
      {/* Hero Gallery Section */}
      <Gallery images={property.gallery} title={property.title} />

      {/* Information & Details Section */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Context / Rule of Thirds offset block */}
        <div className="md:col-span-4 flex flex-col gap-8 md:pt-4">
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-2">
              Location
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-normal">
              {property.location}
            </span>
          </div>

          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-2">
              Guide Price
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-normal">
              {formatPrice(property.price, property.price_display)}
            </span>
          </div>

          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-2">
              Status
            </span>
            <span className="inline-block px-3 py-1 font-label-caps text-xs uppercase tracking-widest border border-outline text-primary">
              {property.status_display}
            </span>
          </div>
        </div>

        {/* Main Title & Specs */}
        <div className="md:col-span-8 flex flex-col gap-12 mt-8 md:mt-0">
          <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary leading-tight font-normal">
            {property.title}
          </h1>

          {/* Property Facts (Inline Strip) */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 py-8 border-y border-outline-variant">
            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Beds
              </span>
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-normal">
                {property.bedrooms}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Baths
              </span>
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-normal">
                {property.bathrooms}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                Area
              </span>
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-normal truncate">
                {formatArea(property.area)}{' '}
                <span className="text-xl md:text-2xl font-serif text-on-surface-variant">sq ft</span>
              </span>
            </div>
          </div>

          {/* Description & Collapsible Details Panel */}
          <div className="space-y-6">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {property.description}
            </p>

            {property.extended_description && (
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {property.extended_description}
              </p>
            )}

            {/* Collapsible Specific Features */}
            {property.features && property.features.length > 0 && (
              <details className="group cursor-pointer pt-4 border-t border-outline-variant" open>
                <summary className="font-nav-link text-nav-link uppercase tracking-widest text-primary py-2 flex items-center justify-between w-full outline-none list-none">
                  <span className="flex items-center gap-2">
                    <span className="group-open:rotate-90 transition-transform duration-200">›</span> Key Architectural Highlights
                  </span>
                </summary>
                <ul className="pt-4 pb-2 space-y-3 font-body-md text-on-surface-variant pl-4">
                  {property.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="pt-6">
              <Link
                href={`/enquire?property=${encodeURIComponent(property.title)}`}
                className="inline-flex font-nav-link text-nav-link uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
              >
                Enquire About This Property →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Listings Strip */}
      {related.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 border-t border-outline-variant">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline-md text-headline-md text-primary font-normal">
              Related Properties
            </h2>
            <Link
              href="/listings"
              className="font-nav-link text-nav-link uppercase tracking-widest text-on-surface-variant border-b border-outline-variant pb-1 hover:text-primary transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {related.map((item) => (
              <Link key={item.id} href={`/listings/${item.slug}`} className="group flex flex-col gap-4 cursor-pointer">
                <div className="aspect-[4/3] w-full overflow-hidden border border-outline-variant relative bg-surface-dim">
                  <Image
                    src={item.cover_image}
                    alt={item.cover_image_alt || item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
                  />
                </div>
                <div>
                  <h3 className="font-body-lg text-body-lg text-primary mb-1 group-hover:text-secondary transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    {item.location} • {formatPrice(item.price, item.price_display)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
