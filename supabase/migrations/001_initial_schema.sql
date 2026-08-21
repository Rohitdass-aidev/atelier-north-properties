-- Phase 2A: Initial Database Schema
-- Based on architecture_review.md (authoritative)
-- Generated for Atelier North Properties

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    price INTEGER NOT NULL, -- stored in cents/pence
    status TEXT CHECK (status IN ('available', 'under_offer', 'sold', 'off_market')) DEFAULT 'available',
    property_type TEXT CHECK (property_type IN ('house', 'apartment', 'villa', 'penthouse', 'land')) DEFAULT 'house',
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    area INTEGER NOT NULL, -- square feet
    description TEXT,
    cover_image_path TEXT, -- stores relative storage path: properties/{property_id}/{filename}
    published BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- PROPERTY_IMAGES TABLE
-- ============================================================================
CREATE TABLE public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL, -- stores relative storage path: properties/{property_id}/{filename}
    alt TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Properties indexes
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_properties_published ON public.properties(published);
CREATE INDEX idx_properties_location ON public.properties(location);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_sort_order ON public.properties(sort_order);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);

-- Property images indexes
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_sort_order ON public.property_images(property_id, sort_order);

-- ============================================================================
-- TIMESTAMP TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on both tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Properties RLS Policies
-- Public/anon: SELECT only published properties
CREATE POLICY "Public can view published properties"
    ON public.properties
    FOR SELECT
    USING (published = true);

-- Authenticated: Full CRUD
CREATE POLICY "Authenticated users can insert properties"
    ON public.properties
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
    ON public.properties
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
    ON public.properties
    FOR DELETE
    TO authenticated
    USING (true);

-- Property Images RLS Policies
-- Public/anon: SELECT images belonging to published properties
CREATE POLICY "Public can view images of published properties"
    ON public.property_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = property_images.property_id
            AND properties.published = true
        )
    );

-- Authenticated: Full CRUD
CREATE POLICY "Authenticated users can insert property images"
    ON public.property_images
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update property images"
    ON public.property_images
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property images"
    ON public.property_images
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STORAGE BUCKET (run via Supabase Dashboard or Supabase CLI)
-- ============================================================================
-- The 'properties' bucket and storage policies must be created in Supabase Dashboard > Storage
-- or via Supabase CLI. This is documented here for reproducibility.
--
-- Bucket: properties
-- Settings:
--   - Public: true
--   - File size limit: 10MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/avif
--
-- Storage RLS Policies (via Supabase Dashboard > Storage > Policies):
-- 1. "Public can read images" - SELECT on storage.objects for bucket 'properties' TO anon
-- 2. "Authenticated can upload images" - INSERT on storage.objects for bucket 'properties' TO authenticated
-- 3. "Authenticated can update images" - UPDATE on storage.objects for bucket 'properties' TO authenticated
-- 4. "Authenticated can delete images" - DELETE on storage.objects for bucket 'properties' TO authenticated