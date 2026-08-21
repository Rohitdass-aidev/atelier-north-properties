import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Property, PropertyStatus, PropertyType, PropertyArea } from '@/lib/mockData';
import ListingsClient from './ListingsClient';

export const dynamic = 'force-dynamic';

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

function mapTypeDisplay(type: string): string {
  switch (type) {
    case 'house':
      return 'House';
    case 'apartment':
      return 'Apartment';
    case 'villa':
      return 'Villa';
    case 'penthouse':
      return 'Penthouse';
    case 'land':
      return 'Land';
    default:
      return type;
  }
}

function determineAreaCategory(location: string): PropertyArea {
  const loc = (location || '').toLowerCase();
  if (
    loc.includes('coast') ||
    loc.includes('cornwall') ||
    loc.includes('sea') ||
    loc.includes('beach') ||
    loc.includes('bay') ||
    loc.includes('st ives') ||
    loc.includes('mawgan')
  ) {
    return 'Coast';
  }
  if (
    loc.includes('country') ||
    loc.includes('cotswolds') ||
    loc.includes('rural') ||
    loc.includes('manor') ||
    loc.includes('somerset') ||
    loc.includes('hampshire')
  ) {
    return 'Country';
  }
  return 'City';
}

function resolveImageUrl(imagePath: string | null | undefined, supabaseUrl: string): string {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const pathInBucket = imagePath.replace(/^properties\//, '');
  return `${supabaseUrl}/storage/v1/object/public/properties/${pathInBucket}`;
}

export default async function ListingsPage() {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  const { data: rawProperties, error } = await supabase
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
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <header className="mb-12 border-b border-outline-variant pb-8">
          <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
            Index
          </h1>
        </header>
        <div className="p-6 bg-surface-container border border-outline text-primary font-body-md">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Unable to Load Listings
          </p>
          <p className="text-on-surface-variant text-sm">
            We encountered an issue retrieving portfolio records. Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  // Map Supabase rows to Property model
  const properties: Property[] = (rawProperties || []).map((row) => {
    const sortedImages = Array.isArray(row.property_images)
      ? [...row.property_images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : [];

    const primaryImage =
      row.cover_image_path || (sortedImages.length > 0 ? sortedImages[0].image_path : null);
    const primaryImageAlt =
      sortedImages.length > 0 && sortedImages[0].alt ? sortedImages[0].alt : row.title;

    const coverImageUrl = resolveImageUrl(primaryImage, supabaseUrl);

    const gallery = sortedImages.map((img) => ({
      src: resolveImageUrl(img.image_path, supabaseUrl),
      alt: img.alt || row.title,
    }));

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      location: row.location,
      region: row.location.split(',')[0]?.trim() || row.location,
      area_category: determineAreaCategory(row.location),
      price: row.price,
      status: (row.status || 'available') as PropertyStatus,
      status_display: mapStatusDisplay(row.status || 'available'),
      property_type: (row.property_type || 'house') as PropertyType,
      property_type_display: mapTypeDisplay(row.property_type || 'house'),
      bedrooms: row.bedrooms ?? 0,
      bathrooms: row.bathrooms ?? 0,
      area: row.area ?? 0,
      description: row.description || '',
      cover_image: coverImageUrl,
      cover_image_alt: primaryImageAlt,
      gallery: gallery.length > 0 ? gallery : [{ src: coverImageUrl, alt: primaryImageAlt }],
      published: row.published,
      sort_order: row.sort_order ?? 0,
      image_count: sortedImages.length,
    };
  });

  return (
    <Suspense fallback={<div className="pt-32 text-center font-label text-sm">Loading index...</div>}>
      <ListingsClient properties={properties} />
    </Suspense>
  );
}
