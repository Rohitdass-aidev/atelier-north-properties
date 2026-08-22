'use client';

import { useState, useTransition } from 'react';
import { togglePropertyPublish } from './actions';

export default function PublishToggleButton({
  propertyId,
  propertyTitle,
  isPublished,
}: {
  propertyId: string;
  propertyTitle: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await togglePropertyPublish(propertyId, !isPublished);
      if (res?.error) {
        setErrorMessage(res.error);
        alert(`Failed to update status for "${propertyTitle}": ${res.error}`);
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      {errorMessage && (
        <span className="text-[10px] text-primary font-mono bg-surface-container px-1.5 py-0.5 border border-outline">
          Error
        </span>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        title={
          isPublished
            ? `Unpublish "${propertyTitle}" (move to draft)`
            : `Publish "${propertyTitle}" (make publicly live)`
        }
        className={`px-3 py-1 text-[11px] font-label-caps uppercase tracking-wider border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isPublished
            ? 'border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary bg-surface'
            : 'border-secondary/50 text-secondary hover:bg-secondary/10 bg-surface'
        }`}
      >
        {isPending
          ? isPublished
            ? 'Unpublishing...'
            : 'Publishing...'
          : isPublished
          ? 'Unpublish'
          : 'Publish'}
      </button>
    </div>
  );
}
