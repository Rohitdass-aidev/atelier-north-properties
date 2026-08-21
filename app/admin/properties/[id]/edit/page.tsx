import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UploadForm from './UploadForm';

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

  // Fetch existing images for this property
  const { data: images } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', params.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
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
          <div>
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

      {/* Image Upload Section */}
      <UploadForm propertyId={property.id} propertyTitle={property.title} />

      {/* Current Uploaded Images Gallery */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary">
            Uploaded Images ({images?.length || 0})
          </h2>
        </div>

        {(!images || images.length === 0) ? (
          <div className="text-center py-12 border border-dashed border-outline-variant bg-surface-container-low">
            <p className="font-display text-lg text-primary mb-1">No images uploaded yet</p>
            <p className="font-body-md text-xs text-on-surface-variant">
              Use the upload tool above to add photography for this residence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => {
              // Convert stored relative path properties/{property_id}/{filename} to public storage URL
              const pathInBucket = img.image_path.replace(/^properties\//, '');
              const publicUrl = `${supabaseUrl}/storage/v1/object/public/properties/${pathInBucket}`;

              return (
                <div
                  key={img.id}
                  className="bg-surface-container-low border border-outline-variant overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-surface-container relative overflow-hidden border-b border-outline-variant">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl}
                      alt={img.alt || property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5 flex-grow">
                    <p className="font-body-md text-xs font-medium text-primary line-clamp-1">
                      {img.alt || 'Untitled'}
                    </p>
                    <p className="font-mono text-[11px] text-on-surface-variant truncate" title={img.image_path}>
                      {img.image_path}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
