'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProperty, type UpdatePropertyState } from './actions';

export type EditableProperty = {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  status: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string | null;
  sort_order: number;
  published: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? 'Saving Changes...' : 'Save Property Details'}
    </button>
  );
}

export default function PropertyEditForm({ property }: { property: EditableProperty }) {
  const updateActionWithId = updateProperty.bind(null, property.id);
  const [state, formAction] = useFormState<UpdatePropertyState, FormData>(
    updateActionWithId,
    null
  );

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {state?.success && (
        <div className="p-4 bg-surface-container border border-secondary/40 text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-secondary mb-1">
            ✓ Changes Saved
          </p>
          <p className="text-on-surface-variant text-xs">
            {state.message || 'Property specifications updated successfully.'}
          </p>
        </div>
      )}

      {/* General Error Banner */}
      {state?.error && (
        <div className="p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Validation Error
          </p>
          <p className="text-on-surface-variant text-xs">{state.error}</p>
        </div>
      )}

      {/* Property Edit Form */}
      <form
        action={formAction}
        className="space-y-8 bg-surface-container-low border border-outline-variant p-6 md:p-10"
      >
        {/* Section 1: Basic Details */}
        <div className="space-y-6">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary border-b border-outline-variant pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Property Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={property.title}
                placeholder="e.g. The Brutalist Mews"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.title && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {state.fieldErrors.title[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                URL Slug *
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                defaultValue={property.slug}
                placeholder="e.g. the-brutalist-mews"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-mono text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-[11px] font-label-caps text-on-surface-variant mt-1 uppercase tracking-wider">
                Lowercase letters, numbers, and hyphens only
              </p>
              {state?.fieldErrors?.slug && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {state.fieldErrors.slug[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="location"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                defaultValue={property.location}
                placeholder="e.g. Highgate, London"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.location && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {state.fieldErrors.location[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Price (£ GBP) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="1"
                defaultValue={property.price}
                placeholder="e.g. 3450000"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.price && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {state.fieldErrors.price[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Classification & Specifications */}
        <div className="space-y-6">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary border-b border-outline-variant pb-2">
            Classification &amp; Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="property_type"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Property Type *
              </label>
              <select
                id="property_type"
                name="property_type"
                defaultValue={property.property_type || 'house'}
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Status *
              </label>
              <select
                id="status"
                name="status"
                defaultValue={property.status || 'available'}
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="available">Available</option>
                <option value="under_offer">Under Offer</option>
                <option value="sold">Sold</option>
                <option value="off_market">Off Market</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort_order"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Sort Order
              </label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={property.sort_order ?? 0}
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="bedrooms"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Bedrooms *
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                required
                min="0"
                defaultValue={property.bedrooms ?? 1}
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="bathrooms"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Bathrooms *
              </label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                required
                min="0"
                defaultValue={property.bathrooms ?? 1}
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="area"
                className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
              >
                Area (Sq Ft) *
              </label>
              <input
                id="area"
                name="area"
                type="number"
                required
                min="0"
                defaultValue={property.area ?? 0}
                placeholder="e.g. 3200"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Editorial Narrative */}
        <div className="space-y-6">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary border-b border-outline-variant pb-2">
            Editorial Narrative
          </h2>

          <div>
            <label
              htmlFor="description"
              className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={property.description || ''}
              placeholder="Detailed architectural narrative of the residence..."
              className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-y"
            />
          </div>
        </div>

        {/* Section 4: Publishing Status */}
        <div className="space-y-4 pt-2 border-t border-outline-variant">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="published"
              id="published"
              defaultChecked={property.published}
              className="w-4 h-4 accent-primary text-primary focus:ring-primary border-outline-variant"
            />
            <span className="font-label-caps text-xs uppercase tracking-widest text-primary">
              Publish listing publicly
            </span>
          </label>
          <p className="text-[11px] font-body-md text-on-surface-variant pl-7">
            When published, this property will appear on public listings and search. When
            unpublished, it remains in draft state only accessible to admins.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-outline-variant">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
