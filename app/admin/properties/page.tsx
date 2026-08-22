import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PublishToggleButton from './PublishToggleButton';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatus(status: string) {
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

export default async function AdminPropertiesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch properties and count of associated images
  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      slug,
      location,
      price,
      status,
      property_type,
      published,
      sort_order,
      created_at,
      property_images (count)
    `)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      {/* Top Bar / Navigation context */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <Link
            href="/admin"
            className="font-nav-link text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 mb-2"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
            Properties
          </h1>
        </div>

        <div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            <span>+</span> New Property
          </Link>
        </div>
      </div>

      {/* Error state if database query fails */}
      {error && (
        <div className="p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Database Query Error
          </p>
          <p className="text-on-surface-variant">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {(!properties || properties.length === 0) && !error && (
        <div className="text-center py-20 px-4 border border-outline-variant bg-surface-container-low">
          <p className="font-display text-2xl text-primary mb-2">No properties yet</p>
          <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto mb-6">
            Your database currently contains no property records. Create your first listing to begin
            managing your portfolio.
          </p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            Create Property
          </Link>
        </div>
      )}

      {/* Properties Table */}
      {properties && properties.length > 0 && (
        <div className="border border-outline-variant bg-surface-container-low overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant font-label-caps text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container">
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Images</th>
                <th className="py-4 px-6">Publishing</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-sm">
              {properties.map((property) => {
                const imageCount =
                  Array.isArray(property.property_images) && property.property_images[0]
                    ? (property.property_images[0] as { count: number }).count
                    : 0;

                return (
                  <tr
                    key={property.id}
                    className="hover:bg-surface-container transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-primary text-base font-display">
                        {property.title}
                      </div>
                      <div className="text-xs text-on-surface-variant font-mono mt-0.5">
                        /{property.slug}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-on-surface-variant">
                      {property.location}
                    </td>

                    <td className="py-4 px-6 capitalize text-on-surface-variant">
                      {property.property_type}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-label-caps uppercase tracking-wider border border-outline-variant bg-surface text-primary">
                        {formatStatus(property.status)}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-medium text-primary">
                      {formatCurrency(property.price)}
                    </td>

                    <td className="py-4 px-6 text-on-surface-variant">
                      {imageCount} {imageCount === 1 ? 'image' : 'images'}
                    </td>

                    <td className="py-4 px-6">
                      {property.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-label-caps uppercase tracking-wider text-secondary font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-label-caps uppercase tracking-wider text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <PublishToggleButton
                          propertyId={property.id}
                          propertyTitle={property.title}
                          isPublished={property.published}
                        />
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="inline-block font-nav-link text-xs uppercase tracking-widest text-primary hover:text-secondary border-b border-primary hover:border-secondary pb-0.5 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
