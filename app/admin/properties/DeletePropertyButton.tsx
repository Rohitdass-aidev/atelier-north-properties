'use client';

import { useState, useTransition } from 'react';
import { deleteProperty } from './actions';

export default function DeletePropertyButton({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${propertyTitle}"?\n\nThis will remove the property and all associated photographs from storage. This action cannot be undone.`
    );

    if (!confirmed) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteProperty(propertyId);
      if (res?.error) {
        setErrorMessage(res.error);
        alert(`Failed to delete "${propertyTitle}": ${res.error}`);
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {errorMessage && (
        <span className="text-[10px] text-primary font-mono bg-surface-container px-1.5 py-0.5 border border-outline">
          Error
        </span>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        title={`Permanently delete "${propertyTitle}"`}
        className="px-2 py-1 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container border border-transparent hover:border-outline-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
