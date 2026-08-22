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
