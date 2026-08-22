import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PropertyEditForm from './PropertyEditForm';
import UploadForm from './UploadForm';
import ImageGalleryManager from './ImageGalleryManager';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function PropertyEditPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch property
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single();

  if (propertyError || !property) {
    notFound();
  }

  // Fetch existing images for this property ordered by sort_order
  const { data: images } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', params.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-outline-variant pb-6">
        <Link
          href="/admin/properties"
          className="font-nav-link text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 mb-2"
        >
          ← Back to Properties
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
              {property.title}
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              {property.location} &bull; {formatCurrency(property.price)} &bull;{' '}
              <span className="font-mono text-xs">/{property.slug}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {property.published && (
              <Link
                href={`/listings/${property.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 text-xs font-nav-link uppercase tracking-wider text-primary border border-outline-variant hover:border-primary transition-colors"
              >
                View Live ↗
              </Link>
            )}
            <span
              className={`inline-block px-3 py-1 text-xs font-label-caps uppercase tracking-wider border ${
                property.published
                  ? 'border-secondary/40 text-secondary bg-surface'
                  : 'border-outline-variant text-on-surface-variant bg-surface-dim'
              }`}
            >
              {property.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Property Details Form */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary">
            Property Specifications &amp; Details
          </h2>
        </div>
        <PropertyEditForm property={property} />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4 pt-4 border-t border-outline-variant">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary">
            Upload Photography
          </h2>
        </div>
        <UploadForm propertyId={property.id} propertyTitle={property.title} />
      </div>

      {/* Image Gallery Manager */}
      <div className="space-y-4 pt-4 border-t border-outline-variant">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary">
            Uploaded Images ({images?.length || 0})
          </h2>
        </div>

        <ImageGalleryManager
          propertyId={property.id}
          propertyTitle={property.title}
          images={images || []}
          supabaseUrl={supabaseUrl}
        />
      </div>
    </div>
  );
}
