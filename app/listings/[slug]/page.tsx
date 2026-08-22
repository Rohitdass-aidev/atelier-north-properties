import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatArea } from '@/lib/mockData';
import Gallery from '@/components/listings/Gallery';

export const dynamic = 'force-dynamic';

interface ListingPageProps {
  params: {
    slug: string;
  };
}

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

function mapStatusDisplay(status: string): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'under_offer':
      return 'Under Offer';
    case 'sold':
      return 'Sold';
    case 'off_market':
      return 'Off Market';
    default:
      return status;
  }
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  const { data: property } = await supabase
    .from('properties')
    .select('title, description, cover_image_path, property_images (image_path, alt, sort_order)')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!property) {
    return {
      title: 'Property Not Found | Atelier North Properties',
    };
  }

  const sortedImages = Array.isArray(property.property_images)
    ? [...property.property_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    : [];

  const primaryImage =
    property.cover_image_path || (sortedImages.length > 0 ? sortedImages[0].image_path : null);
  const coverUrl = resolveImageUrl(primaryImage, supabaseUrl);

  return {
    title: `${property.title} | Atelier North Properties`,
    description: property.description || undefined,
    openGraph: {
      title: `${property.title} | Atelier North Properties`,
      description: property.description || undefined,
      images: coverUrl
        ? [
            {
              url: coverUrl,
              alt: property.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  // Fetch only published property matching the slug
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      slug,
      location,
      price,
      status,
      property_type,
      bedrooms,
      bathrooms,
      area,
      description,
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
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  // If not found, draft (published === false), or error -> return 404
  if (error || !property) {
    notFound();
  }

  // Sort images by sort_order ASC
  const sortedImages = Array.isArray(property.property_images)
    ? [...property.property_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    : [];

  // Build valid gallery images list
  const gallery: { src: string; alt: string }[] = [];

  if (sortedImages.length > 0) {
    for (const img of sortedImages) {
      const url = resolveImageUrl(img.image_path, supabaseUrl);
      if (url) {
        gallery.push({
          src: url,
          alt: img.alt || property.title,
        });
      }
    }
  } else if (property.cover_image_path) {
    const url = resolveImageUrl(property.cover_image_path, supabaseUrl);
    if (url) {
      gallery.push({
        src: url,
        alt: property.title,
      });
    }
  }

  const statusDisplay = mapStatusDisplay(property.status || 'available');

  // Fetch up to 3 related published properties from Supabase (excluding current property)
  const { data: rawRelated } = await supabase
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
      property_images (
        id,
        image_path,
        alt,
        sort_order
      )
    `)
    .eq('published', true)
    .neq('slug', params.slug)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(3);

  const related = (rawRelated || []).map((item) => {
    const sortedItemImages = Array.isArray(item.property_images)
      ? [...item.property_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : [];
    const primaryImg =
      item.cover_image_path || (sortedItemImages.length > 0 ? sortedItemImages[0].image_path : null);
    const coverUrl = resolveImageUrl(primaryImg, supabaseUrl);
    const altText =
      sortedItemImages.length > 0 && sortedItemImages[0].alt
        ? sortedItemImages[0].alt
        : item.title;

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      location: item.location,
      price: item.price,
      coverUrl,
      altText,
    };
  });

  return (
    <div className="pt-[60px] md:pt-[72px] min-h-screen">
      {/* Hero Gallery Section */}
      {gallery.length > 0 ? (
        <Gallery images={gallery} title={property.title} />
      ) : (
        <div className="w-full h-[320px] md:h-[480px] bg-surface-container-low border-b border-outline-variant flex items-center justify-center">
          <p className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
            No photography available for this residence
          </p>
        </div>
      )}

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
              {formatPrice(property.price)}
            </span>
          </div>

          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-2">
              Status
            </span>
            <span className="inline-block px-3 py-1 font-label-caps text-xs uppercase tracking-widest border border-outline text-primary">
              {statusDisplay}
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

          {/* Description & Narrative */}
          <div className="space-y-6">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

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
                  {item.coverUrl ? (
                    <Image
                      src={item.coverUrl}
                      alt={item.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
                        Photography in Preparation
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-body-lg text-body-lg text-primary mb-1 group-hover:text-secondary transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    {item.location} • {formatPrice(item.price)}
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
