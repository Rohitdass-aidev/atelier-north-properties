'use client';

import { useState, useTransition } from 'react';
import {
  deletePropertyImage,
  reorderPropertyImage,
  setPropertyCoverImage,
} from './actions';

export type PropertyImageItem = {
  id: string;
  property_id: string;
  image_path: string;
  alt: string;
  sort_order: number;
};

export default function ImageGalleryManager({
  propertyId,
  propertyTitle,
  images,
  coverImagePath,
  supabaseUrl,
}: {
  propertyId: string;
  propertyTitle: string;
  images: PropertyImageItem[];
  coverImagePath: string | null;
  supabaseUrl: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSetCover = (imagePath: string, imageId: string) => {
    setErrorMessage(null);
    setActiveActionId(imageId);

    startTransition(async () => {
      const res = await setPropertyCoverImage(propertyId, imagePath);
      if (res?.error) {
        setErrorMessage(res.error);
        alert(`Failed to set cover image: ${res.error}`);
      }
      setActiveActionId(null);
    });
  };

  const handleReorder = (imageId: string, direction: 'up' | 'down') => {
    setErrorMessage(null);
    setActiveActionId(imageId);

    startTransition(async () => {
      const res = await reorderPropertyImage(propertyId, imageId, direction);
      if (res?.error) {
        setErrorMessage(res.error);
      }
      setActiveActionId(null);
    });
  };

  const handleDelete = (imageId: string, altText: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this image ("${altText || 'Untitled'}")?\n\nThis will permanently delete the file from storage and the database.`
    );

    if (!confirmed) return;

    setErrorMessage(null);
    setActiveActionId(imageId);

    startTransition(async () => {
      const res = await deletePropertyImage(propertyId, imageId);
      if (res?.error) {
        setErrorMessage(res.error);
      }
      setActiveActionId(null);
    });
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-outline-variant bg-surface-container-low">
        <p className="font-display text-lg text-primary mb-1">No images uploaded yet</p>
        <p className="font-body-md text-xs text-on-surface-variant">
          Use the upload tool above to add photography for this residence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Operation Error
          </p>
          <p className="text-on-surface-variant text-xs">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => {
          const pathInBucket = img.image_path.replace(/^properties\//, '');
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/properties/${pathInBucket}`;
          const isFirst = index === 0;
          const isLast = index === images.length - 1;
          const isBusy = isPending && activeActionId === img.id;
          const isCover = coverImagePath === img.image_path;

          return (
            <div
              key={img.id}
              className={`bg-surface-container-low border transition-opacity flex flex-col ${
                isCover ? 'border-primary shadow-sm' : 'border-outline-variant'
              } ${isBusy ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            >
              {/* Image Preview Container */}
              <div className="aspect-[4/3] bg-surface-container relative overflow-hidden border-b border-outline-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl}
                  alt={img.alt || propertyTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-primary/90 text-on-primary font-label-caps text-[10px] uppercase tracking-wider">
                    #{index + 1}
                  </span>
                  {isCover && (
                    <span className="px-2 py-0.5 bg-secondary text-primary font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                      ★ Cover Photo
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata Info */}
              <div className="p-4 space-y-1.5 flex-grow">
                <p className="font-body-md text-xs font-medium text-primary line-clamp-1">
                  {img.alt || 'Untitled image'}
                </p>
                <p
                  className="font-mono text-[11px] text-on-surface-variant truncate"
                  title={img.image_path}
                >
                  {img.image_path}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-surface border-t border-outline-variant flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {!isCover ? (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSetCover(img.image_path, img.id)}
                      title="Set as primary cover image for public display"
                      className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider border border-outline-variant hover:border-primary bg-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Set as Cover
                    </button>
                  ) : (
                    <span className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider text-secondary font-medium">
                      Primary Cover
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isFirst || isPending}
                    onClick={() => handleReorder(img.id, 'up')}
                    title="Move Up in sequence"
                    className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider border border-outline-variant bg-surface hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={isLast || isPending}
                    onClick={() => handleReorder(img.id, 'down')}
                    title="Move Down in sequence"
                    className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider border border-outline-variant bg-surface hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(img.id, img.alt)}
                    className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container border border-transparent hover:border-outline-variant transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
