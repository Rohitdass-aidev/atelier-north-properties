'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const propertyUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase alphanumeric with hyphens (e.g. brutalist-mews)'
    )
    .trim(),
  location: z.string().min(1, 'Location is required').trim(),
  price: z.coerce.number().int().min(0, 'Price must be a positive integer'),
  status: z.enum(['available', 'under_offer', 'sold', 'off_market']),
  property_type: z.enum(['house', 'apartment', 'villa', 'penthouse', 'land']),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms must be 0 or greater'),
  bathrooms: z.coerce.number().int().min(0, 'Bathrooms must be 0 or greater'),
  area: z.coerce.number().int().min(0, 'Area must be 0 or greater'),
  description: z.string().optional().default(''),
  sort_order: z.coerce.number().int().default(0),
  published: z
    .preprocess((val) => val === 'on' || val === 'true' || val === true, z.boolean())
    .default(false),
});

export type UpdatePropertyState = {
  success?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function updateProperty(
  propertyId: string,
  prevState: UpdatePropertyState,
  formData: FormData
): Promise<UpdatePropertyState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. You must be signed in to edit properties.' };
  }

  if (!propertyId) {
    return { error: 'Missing property ID.' };
  }

  // 1. Fetch current property to know current slug & verify existence
  const { data: currentProperty, error: fetchError } = await supabase
    .from('properties')
    .select('id, slug')
    .eq('id', propertyId)
    .single();

  if (fetchError || !currentProperty) {
    return { error: 'Property not found.' };
  }

  // 2. Extract and validate fields
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    location: formData.get('location'),
    price: formData.get('price'),
    status: formData.get('status'),
    property_type: formData.get('property_type'),
    bedrooms: formData.get('bedrooms'),
    bathrooms: formData.get('bathrooms'),
    area: formData.get('area'),
    description: formData.get('description'),
    sort_order: formData.get('sort_order') || '0',
    published: formData.get('published'),
  };

  const parsed = propertyUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(fieldErrors).flat()[0] || 'Please correct the invalid fields.';
    return {
      error: firstErrorMessage,
      fieldErrors,
    };
  }

  // 3. Check slug uniqueness if changed
  if (parsed.data.slug !== currentProperty.slug) {
    const { data: existingSlug } = await supabase
      .from('properties')
      .select('id')
      .eq('slug', parsed.data.slug)
      .neq('id', propertyId)
      .maybeSingle();

    if (existingSlug) {
      return {
        error: `A property with slug "${parsed.data.slug}" already exists. Please choose a unique slug.`,
        fieldErrors: {
          slug: ['This slug is already in use by another property.'],
        },
      };
    }
  }

  // 4. Update the property row
  const { error: updateError } = await supabase
    .from('properties')
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      location: parsed.data.location,
      price: parsed.data.price,
      status: parsed.data.status,
      property_type: parsed.data.property_type,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      area: parsed.data.area,
      description: parsed.data.description,
      sort_order: parsed.data.sort_order,
      published: parsed.data.published,
    })
    .eq('id', propertyId);

  if (updateError) {
    if (
      updateError.code === '23505' ||
      updateError.message.includes('unique constraint') ||
      updateError.message.includes('slug')
    ) {
      return {
        error: `A property with slug "${parsed.data.slug}" already exists. Please choose a unique slug.`,
        fieldErrors: {
          slug: ['This slug is already in use by another property.'],
        },
      };
    }
    return {
      error: `Failed to update property: ${updateError.message}`,
    };
  }

  // 5. Revalidate affected cache paths
  revalidatePath('/admin/properties');
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath('/listings');
  revalidatePath(`/listings/${parsed.data.slug}`);
  if (currentProperty.slug !== parsed.data.slug) {
    revalidatePath(`/listings/${currentProperty.slug}`);
  }
  revalidatePath('/');

  return {
    success: true,
    message: 'Property details updated successfully.',
  };
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadState = {
  success?: boolean;
  error?: string;
  imagePath?: string;
} | null;

export async function uploadPropertyImage(
  propertyId: string,
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. You must be signed in to upload images.' };
  }

  if (!propertyId) {
    return { error: 'Missing property ID.' };
  }

  const file = formData.get('file') as File | null;
  const alt = (formData.get('alt') as string)?.trim() || 'Property image';

  if (!file || file.size === 0) {
    return { error: 'Please select an image file to upload.' };
  }

  // Enforce 10 MB maximum file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 10 MB limit.`,
    };
  }

  // Enforce allowed MIME types
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      error: `Unsupported file format: ${file.type}. Allowed formats: JPEG, PNG, WebP, AVIF.`,
    };
  }

  // Generate a safe unique filename
  const rawExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanExtension = ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(rawExtension)
    ? rawExtension
    : 'jpg';
  const uniqueSuffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).substring(2, 10);
  const filename = `${Date.now()}-${uniqueSuffix}.${cleanExtension}`;
  const storageFilePath = `${propertyId}/${filename}`;
  const dbImagePath = `properties/${propertyId}/${filename}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket 'properties'
    const { error: uploadError } = await supabase.storage
      .from('properties')
      .upload(storageFilePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: `Storage upload failed: ${uploadError.message}` };
    }

    // Get current image count to set sort_order
    const { count } = await supabase
      .from('property_images')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    const sortOrder = count ?? 0;

    // Insert row into property_images
    const { error: dbError } = await supabase.from('property_images').insert({
      property_id: propertyId,
      image_path: dbImagePath,
      alt: alt,
      sort_order: sortOrder,
    });

    if (dbError) {
      // Rollback storage upload on database failure
      await supabase.storage.from('properties').remove([storageFilePath]);
      return { error: `Database insertion failed: ${dbError.message}` };
    }

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath('/admin/properties');
    return { success: true, imagePath: dbImagePath };
  } catch (err: any) {
    return { error: `Upload operation failed: ${err?.message || 'Unknown error'}` };
  }
}

export async function deletePropertyImage(
  propertyId: string,
  imageId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. Please sign in to delete images.' };
  }

  if (!propertyId || !imageId) {
    return { error: 'Missing property or image ID.' };
  }

  // 1. Retrieve the property_images row
  const { data: img, error: fetchError } = await supabase
    .from('property_images')
    .select('id, image_path, property_id')
    .eq('id', imageId)
    .eq('property_id', propertyId)
    .single();

  if (fetchError || !img) {
    return { error: 'Image record not found in database.' };
  }

  // 2. Delete the file from Supabase Storage
  const storageFilePath = img.image_path.replace(/^properties\//, '');
  const { error: storageError } = await supabase.storage
    .from('properties')
    .remove([storageFilePath]);

  if (storageError) {
    return {
      error: `Storage deletion failed: ${storageError.message}. Database record preserved.`,
    };
  }

  // 3. Delete the property_images database row
  const { error: dbError } = await supabase
    .from('property_images')
    .delete()
    .eq('id', imageId)
    .eq('property_id', propertyId);

  if (dbError) {
    return { error: `Failed to delete database record: ${dbError.message}` };
  }

  // 4. Normalize sort order for remaining images
  const { data: remaining } = await supabase
    .from('property_images')
    .select('id')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (remaining && remaining.length > 0) {
    for (let i = 0; i < remaining.length; i++) {
      await supabase
        .from('property_images')
        .update({ sort_order: i })
        .eq('id', remaining[i].id);
    }
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath('/admin/properties');
  return { success: true };
}

export async function reorderPropertyImage(
  propertyId: string,
  imageId: string,
  direction: 'up' | 'down'
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  if (!propertyId || !imageId) {
    return { error: 'Missing property or image ID.' };
  }

  // Fetch all images in their current sequence
  const { data: images, error: fetchError } = await supabase
    .from('property_images')
    .select('id, sort_order')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (fetchError || !images) {
    return { error: 'Failed to retrieve property images.' };
  }

  const currentIndex = images.findIndex((img) => img.id === imageId);
  if (currentIndex === -1) {
    return { error: 'Image not found in current listing.' };
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= images.length) {
    return { success: true }; // Already at edge
  }

  // Swap order
  const reordered = [...images];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  // Persist new unique sequential sort_order
  for (let i = 0; i < reordered.length; i++) {
    const { error: updateError } = await supabase
      .from('property_images')
      .update({ sort_order: i })
      .eq('id', reordered[i].id);

    if (updateError) {
      return { error: `Failed to update image order: ${updateError.message}` };
    }
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath('/admin/properties');
  return { success: true };
}
