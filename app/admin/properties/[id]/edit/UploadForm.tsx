'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRef, useEffect } from 'react';
import { uploadPropertyImage, type UploadState } from './actions';

function UploadButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? 'Uploading to Storage...' : 'Upload Image'}
    </button>
  );
}

export default function UploadForm({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const uploadActionWithId = uploadPropertyImage.bind(null, propertyId);
  const [state, formAction] = useFormState<UploadState, FormData>(uploadActionWithId, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <div className="bg-surface-container-low border border-outline-variant p-6 md:p-8 space-y-6">
      <div>
        <h2 className="font-display text-xl text-primary font-normal">Upload Property Image</h2>
        <p className="font-body-md text-xs text-on-surface-variant mt-1">
          Images will be stored in Supabase bucket <span className="font-mono text-primary">properties</span> using relative path structure.
        </p>
      </div>

      {/* Success Banner */}
      {state?.success && (
        <div className="p-4 bg-surface-container border border-secondary/40 text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-secondary mb-1">
            ✓ Upload Successful
          </p>
          <p className="text-on-surface-variant text-xs">
            Stored in database as: <span className="font-mono text-primary font-medium">{state.imagePath}</span>
          </p>
        </div>
      )}

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
          <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
            Upload Error
          </p>
          <p className="text-on-surface-variant text-xs">{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="file"
            className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
          >
            Select Image File *
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-surface-container file:text-primary file:font-label-caps file:text-xs file:uppercase file:tracking-wider hover:file:bg-surface-dim transition-colors cursor-pointer"
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant">
            <span>Accepted: JPEG, PNG, WebP, AVIF</span>
            <span>Maximum size: 10 MB</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="alt"
            className="block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant mb-2"
          >
            Image Description / Alt Text
          </label>
          <input
            id="alt"
            name="alt"
            type="text"
            placeholder={`e.g. ${propertyTitle} - Exterior facade`}
            defaultValue={`${propertyTitle} - View`}
            className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="pt-2">
          <UploadButton />
        </div>
      </form>
    </div>
  );
}
