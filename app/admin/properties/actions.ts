'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function togglePropertyPublish(
  propertyId: string,
  targetPublished: boolean
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. You must be signed in as an admin.' };
  }

  if (!propertyId) {
    return { error: 'Missing property ID.' };
  }

  // 1. Verify property existence and retrieve slug for revalidation
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('id, slug, published')
    .eq('id', propertyId)
    .single();

  if (fetchError || !property) {
    return { error: 'Property not found.' };
  }

  // 2. Update ONLY the published column in properties
  const { error: updateError } = await supabase
    .from('properties')
    .update({ published: targetPublished })
    .eq('id', propertyId);

  if (updateError) {
    return { error: `Failed to update publishing status: ${updateError.message}` };
  }

  // 3. Revalidate affected cache paths
  revalidatePath('/admin/properties');
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath('/listings');
  if (property.slug) {
    revalidatePath(`/listings/${property.slug}`);
  }
  revalidatePath('/');

  return { success: true };
}

export async function deleteProperty(
  propertyId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. You must be signed in as an admin.' };
  }

  if (!propertyId) {
    return { error: 'Missing property ID.' };
  }

  // 1. Retrieve the property record
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('id, slug, cover_image_path')
    .eq('id', propertyId)
    .single();

  if (fetchError || !property) {
    return { error: 'Property not found in database.' };
  }

  // 2. Retrieve all associated property_images records
  const { data: images, error: imagesFetchError } = await supabase
    .from('property_images')
    .select('id, image_path')
    .eq('property_id', propertyId);

  if (imagesFetchError) {
    return { error: `Failed to retrieve property images: ${imagesFetchError.message}` };
  }

  // 3. Extract unique relative Storage paths inside the 'properties' bucket
  const storageFilesToRemove: string[] = [];

  if (images && images.length > 0) {
    for (const img of images) {
      if (img.image_path && !img.image_path.startsWith('http://') && !img.image_path.startsWith('https://')) {
        const relativePath = img.image_path.replace(/^properties\//, '');
        if (relativePath && !storageFilesToRemove.includes(relativePath)) {
          storageFilesToRemove.push(relativePath);
        }
      }
    }
  }

  if (
    property.cover_image_path &&
    !property.cover_image_path.startsWith('http://') &&
    !property.cover_image_path.startsWith('https://')
  ) {
    const coverRelPath = property.cover_image_path.replace(/^properties\//, '');
    if (coverRelPath && !storageFilesToRemove.includes(coverRelPath)) {
      storageFilesToRemove.push(coverRelPath);
    }
  }

  // 4. Delete files from Supabase Storage bucket 'properties'
  if (storageFilesToRemove.length > 0) {
    const { error: storageDeleteError } = await supabase.storage
      .from('properties')
      .remove(storageFilesToRemove);

    if (storageDeleteError) {
      return {
        error: `Storage cleanup failed: ${storageDeleteError.message}. Database records preserved to allow safe retry.`,
      };
    }
  }

  // 5. Delete associated rows from public.property_images
  const { error: imagesDbError } = await supabase
    .from('property_images')
    .delete()
    .eq('property_id', propertyId);

  if (imagesDbError) {
    return {
      error: `Failed to delete property images records: ${imagesDbError.message}`,
    };
  }

  // 6. Delete the property row from public.properties
  const { error: propDbError } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId);

  if (propDbError) {
    return {
      error: `Failed to delete property record: ${propDbError.message}`,
    };
  }

  // 7. Revalidate affected cache paths
  revalidatePath('/admin/properties');
  revalidatePath('/listings');
  if (property.slug) {
    revalidatePath(`/listings/${property.slug}`);
  }
  revalidatePath('/');

  return { success: true };
}
