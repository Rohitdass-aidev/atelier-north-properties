'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property, formatPrice } from '@/lib/mockData';

interface ListingCardProps {
  property: Property;
  density?: 'compact' | 'standard' | 'immersive';
  aspectRatio?: 'portrait' | 'landscape' | 'square' | 'video';
  priority?: boolean;
}

export default function ListingCard({
  property,
  density = 'standard',
  aspectRatio,
  priority = false,
}: ListingCardProps) {
  // Determine aspect ratio class
  let aspectClass = 'aspect-[4/3]';
  if (aspectRatio === 'portrait') aspectClass = 'aspect-[3/4]';
  else if (aspectRatio === 'square') aspectClass = 'aspect-square';
  else if (aspectRatio === 'video') aspectClass = 'aspect-[16/9]';

  if (density === 'immersive') {
    return (
      <article className="group cursor-pointer w-full mb-16">
        <Link href={`/listings/${property.slug}`} className="block">
          <div className="w-full h-[480px] md:h-[680px] mb-6 overflow-hidden bg-surface-dim border border-outline-variant relative">
            <Image
              src={property.cover_image}
              alt={property.cover_image_alt || property.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 1440px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-2 group-hover:underline underline-offset-4 decoration-1">
                {property.title}
              </h2>
              <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">
                {property.location}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <div className="font-body-lg text-body-lg text-primary mb-2">
                {formatPrice(property.price, property.price_display)}
              </div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase flex items-center space-x-4">
                <span>{property.status_display}</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>{property.bedrooms} Beds</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>{property.bathrooms} Baths</span>
                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                <span>{property.area.toLocaleString()} Sq Ft</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (density === 'compact') {
    return (
      <article className="group cursor-pointer flex flex-col gap-3">
        <Link href={`/listings/${property.slug}`} className="block">
          <div className="w-full aspect-[4/3] overflow-hidden border border-outline-variant bg-surface-dim relative mb-3">
            <Image
              src={property.cover_image}
              alt={property.cover_image_alt || property.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
          <div className="flex flex-col gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
            <h3 className="font-headline-md text-lg text-primary group-hover:underline underline-offset-4 decoration-1 normal-case font-normal">
              {property.title}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {property.location} • {formatPrice(property.price, property.price_display)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  // Standard editorial card
  return (
    <article className="listing-card group flex flex-col gap-4 cursor-pointer">
      <Link href={`/listings/${property.slug}`} className="block">
        <div
          className={`image-hover-container ${aspectClass} w-full border border-outline-variant bg-surface-dim relative overflow-hidden`}
        >
          <Image
            src={property.cover_image}
            alt={property.cover_image_alt || property.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </div>
        <div className="flex flex-col gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant mt-4">
          <h3 className="listing-title text-primary text-base font-medium normal-case font-display">
            {property.title}
          </h3>
          <p className="text-[11px] tracking-wider text-on-surface-variant">
            {property.area_category} / {property.region} / {property.status_display} /{' '}
            {formatPrice(property.price, property.price_display)} / {property.image_count} Images
          </p>
        </div>
      </Link>
    </article>
  );
}
