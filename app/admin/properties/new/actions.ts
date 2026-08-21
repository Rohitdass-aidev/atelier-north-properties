'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens (e.g. brutalist-mews)')
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
  published: z.preprocess((val) => val === 'on' || val === 'true' || val === true, z.boolean()).default(false),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createProperty(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. You must be signed in to create properties.' };
  }

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

  const parsed = propertySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(fieldErrors).flat()[0] || 'Please correct the invalid fields.';
    return {
      error: firstErrorMessage,
      fieldErrors,
    };
  }

  const { error } = await supabase.from('properties').insert({
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
  });

  if (error) {
    if (error.code === '23505' || error.message.includes('unique constraint') || error.message.includes('slug')) {
      return {
        error: `A property with slug "${parsed.data.slug}" already exists. Please choose a unique slug.`,
      };
    }
    return {
      error: `Failed to create property: ${error.message}`,
    };
  }

  revalidatePath('/admin/properties');
  revalidatePath('/listings');
  revalidatePath('/');
  redirect('/admin/properties');
}
