'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { createProperty } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? 'Creating Property...' : 'Create Property'}
    </button>
  );
}

export default function NewPropertyPage() {
  const [state, formAction] = useFormState(createProperty, null);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-outline-variant pb-6">
        <Link
          href="/admin/properties"
          className="font-nav-link text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 mb-2"
        >
          ← Back to Properties
        </Link>
        <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
          New Property
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-1">
          Create a new architectural listing in the portfolio database.
        </p>
      </div>

      {/* Form Error Banner */}
      {state?.error && (
        <div className="p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Validation Error
          </p>
          <p className="text-on-surface-variant">{state.error}</p>
        </div>
      )}

      {/* Property Creation Form */}
      <form action={formAction} className="space-y-8 bg-surface-container-low border border-outline-variant p-6 md:p-10">
        {/* Basic Information */}
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
                placeholder="e.g. The Brutalist Mews"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.title && (
                <p className="text-xs text-on-surface-variant mt-1">{state.fieldErrors.title[0]}</p>
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
                placeholder="e.g. the-brutalist-mews"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-mono text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-[11px] font-label-caps text-on-surface-variant mt-1 uppercase tracking-wider">
                Lowercase letters, numbers, and hyphens only
              </p>
              {state?.fieldErrors?.slug && (
                <p className="text-xs text-on-surface-variant mt-1">{state.fieldErrors.slug[0]}</p>
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
                placeholder="e.g. Highgate, London"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.location && (
                <p className="text-xs text-on-surface-variant mt-1">{state.fieldErrors.location[0]}</p>
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
                placeholder="e.g. 3450000"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fieldErrors?.price && (
                <p className="text-xs text-on-surface-variant mt-1">{state.fieldErrors.price[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Classification & Specifications */}
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
                defaultValue="house"
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
                defaultValue="available"
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
                defaultValue="0"
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
                defaultValue="1"
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
                defaultValue="1"
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
                placeholder="e.g. 3200"
                className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Description */}
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
              rows={5}
              placeholder="Detailed architectural narrative of the residence..."
              className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-y"
            />
          </div>
        </div>

        {/* Publishing Options */}
        <div className="space-y-4 pt-2 border-t border-outline-variant">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="published"
              id="published"
              className="w-4 h-4 accent-primary text-primary focus:ring-primary border-outline-variant"
            />
            <span className="font-label-caps text-xs uppercase tracking-widest text-primary">
              Publish listing immediately
            </span>
          </label>
          <p className="text-[11px] font-body-md text-on-surface-variant pl-7">
            Unpublished properties will remain as drafts visible only in this admin dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant">
          <Link
            href="/admin/properties"
            className="font-nav-link text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors py-2"
          >
            Cancel
          </Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
