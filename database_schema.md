# Database Schema - Atelier North Properties

## Tables

### Properties
```sql
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  location text not null,
  price integer not null, -- stored in cents/pence
  status text check (status in ('available', 'under_offer', 'sold', 'off_market')) default 'available',
  property_type text check (property_type in ('house', 'apartment', 'villa', 'penthouse', 'land')) default 'house',
  bedrooms integer not null,
  bathrooms integer not null,
  area integer not null, -- square feet
  description text,
  cover_image_id uuid, -- will reference storage.objects via foreign key
  published boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint properties_cover_image_id_fkey
    foreign key (cover_image_id) references storage.objects(id)
    on update cascade
);
```

### Property Images
```sql
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  image_id uuid not null references storage.objects,
  alt text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Admin Users
```sql
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy to only allow authenticated users to view/edit
create policy "Users can view admin_users" on admin_users
  for select using (auth.uid() is not null);

create policy "Users can insert admin_users" on admin_users
  for insert with check (auth.uid() is not null);

create policy "Users can update admin_users" on admin_users
  for update using (auth.uid() is not null);
```

## Indexes
```sql
-- Index for SEO-friendly slug lookups
create index idx_properties_slug on properties(slug);

-- Index for published listings filtering
create index idx_properties_published on properties(published);

-- Index for location-based searches
create index idx_properties_location on properties(location);

-- Index for property type filtering
create index idx_properties_type on properties(property_type);

-- Index for status filtering
create index idx_properties_status on properties(status);

-- Index for sort ordering
create index idx_properties_sort_order on properties(sort_order);

-- Index for image ordering per property
create index idx_property_images_sort_order on property_images(property_id, sort_order);
```

## Row Level Security (RLS)
```sql
-- Properties table RLS
 alter table properties enable row level security;

create policy "Public can view published properties" on properties
  for select using (published = true);

create policy "Admins can manage all properties" on properties
  for all using (
    exists (
      select 1 from admin_users
      where admin_users.user_id = auth.uid()
      and admin_users.role in ('admin', 'editor')
    )
  );

-- Property images RLS
 alter table property_images enable row level security;

create policy "Public can view property images for published properties" on property_images
  for select using (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
      and properties.published = true
    )
  );

create policy "Admins can manage all property images" on property_images
  for all using (
    exists (
      select 1 from admin_users
      where admin_users.user_id = auth.uid()
      and admin_users.role in ('admin', 'editor')
    )
  );
```

## Storage Buckets

### Properties Images
```sql
-- Create in Supabase Dashboard > Storage > Buckets
-- Bucket: properties
-- Settings:
  - Public: true (for public access to property photos)
  - File size limit: 10MB
  - Allowed MIME types: image/jpeg, image/png, image/webp, image/avif
  - File patterns: 
    - properties/*
    - properties/**

-- RLS Policies:
  - Allow authenticated users to upload
  - Allow public access to files
  - Allow authenticated users to delete
```

## Triggers and Functions

### Update Timestamp Trigger
```sql
create or replace function update_updated_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_updated_timestamp
    before update on properties
    for each row execute function update_updated_timestamp();
```

### Update Admin Updated Timestamp
```sql
create or replace function update_admin_updated_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_admin_updated_timestamp
    before update on admin_users
    for each row execute function update_admin_updated_timestamp();
```

### Generate Slug from Title
```sql
create or replace function generate_slug(title text)
returns text as $$
begin
    return lower(regexp_replace(
        regexp_replace(title, '[^a-z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
    ));
end;
$$ language plpgsql;
```

### Unique Property Insertion
```sql
create or replace function prevent_duplicate_property_insert()
returns trigger as $$
begin
    -- Ensure each property has unique slug
    if exists (
        select 1 from properties
        where slug = new.slug
    ) then
        -- Append timestamp to make unique
        new.slug = new.slug || '-' || extract(epoch from now())::bigint;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trigger_prevent_duplicate_insert
    before insert on properties
    for each row execute function prevent_duplicate_property_insert();
```

## Database Views

### Published Properties List
```sql
create or replace view published_properties as
select
  p.id,
  p.title,
  p.slug,
  p.location,
  p.price,
  p.status,
  p.property_type,
  p.bedrooms,
  p.bathrooms,
  p.area,
  p.description,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  (select url from storage.objects where id = p.cover_image_id) as cover_image_url,
  (select count(*) from property_images where property_images.property_id = p.id) as gallery_count
from properties p
where p.published = true
order by p.sort_order, p.created_at desc;
```

### Property Detail View (includes gallery)
```sql
create or replace view property_detail as
select
  p.id,
  p.title,
  p.slug,
  p.location,
  p.price,
  p.status,
  p.property_type,
  p.bedrooms,
  p.bathrooms,
  p.area,
  p.description,
  p.published,
  p.sort_order,
  p.created_at,
  p.updated_at,
  (select url from storage.objects where id = p.cover_image_id) as cover_image_url,
  (select count(*) from property_images where property_images.property_id = p.id) as gallery_count,
  -- Gallery with image URLs
  (select json_agg(
    json_build_object(
      'id', pi.id,
      'alt', pi.alt,
      'sort_order', pi.sort_order,
      'url', (select url from storage.objects where id = pi.image_id)
    ) order by pi.sort_order
  ) from property_images pi where pi.property_id = p.id) as gallery
from properties p;
```

## Database Functions

### Get Property Stats
```sql
create or replace function get_property_stats()
returns json as $$
declare
    stats json;
begin
    select json_build_object(
        'total_listings', count(*),
        'published_listings', count(*) filter (where published = true),
        'available', count(*) filter (where status = 'available'),
        'under_offer', count(*) filter (where status = 'under_offer'),
        'sold', count(*) filter (where status = 'sold'),
        'off_market', count(*) filter (where status = 'off_market')
    ) into stats
    from properties;
    
    return stats;
end;
$$ language plpgsql;
```

### Search Properties
```sql
create or replace function search_properties(
    search_term text,
    location_filter text,
    type_filter text,
    status_filter text,
    min_price integer,
    max_price integer
)
returns setof properties as $$
begin
    return query
    select p.*
    from properties p
    where (search_term is null or p.published = true)
      and (location_filter is null or p.location ilike '%' || location_filter || '%')
      and (type_filter is null or p.property_type = type_filter)
      and (status_filter is null or p.status = status_filter)
      and (min_price is null or p.price >= min_price)
      and (max_price is null or p.price <= max_price)
      and (search_term is null or 
           p.title ilike '%' || search_term || '%' or
           p.description ilike '%' || search_term || '%' or
           p.location ilike '%' || search_term || '%')
    order by 
      case when p.sort_order > 0 then 0 else 1 end,
      p.sort_order,
      p.created_at desc;
end;
$$ language plpgsql;
```

## Performance Considerations

1. **Indexing**: All major query filters are indexed
2. **Caching**: Implement Redis caching for complex queries
3. **Pagination**: All list queries support offset/limit for large result sets
4. **Thumbnail Generation**: Use Supabase Transformations for responsive image delivery

## Migration Strategy

1. Start with Properties and Property_Images tables
2. Add Admin_Users after initial admin setup
3. Create storage bucket with public access
4. Set up RLS policies to secure data
5. Add indexes for performance
6. Test with sample data

## Troubleshooting

### Common Issues
1. **RLS Policy errors**: Use Supabase Dashboard to check policy syntax
2. **Storage file size limits**: Configure bucket with appropriate limits
3. **Database connection timeouts**: Use connection pooling in Next.js
4. **Storage file access errors**: Ensure bucket is public for property images

### Monitoring
- Use Supabase Dashboard to monitor query performance
- Set up alerts for failed database operations
- Monitor storage usage and costs
- Log all admin actions for audit trail