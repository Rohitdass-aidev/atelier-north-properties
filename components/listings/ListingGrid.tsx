'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property, formatPrice } from '@/lib/mockData';
import ListingCard from './ListingCard';
import DensitySelector, { DensityMode } from './DensitySelector';

interface ListingGridProps {
  properties: Property[];
  density: DensityMode;
  onDensityChange: (density: DensityMode) => void;
}

export default function ListingGrid({
  properties,
  density,
  onDensityChange,
}: ListingGridProps) {
  // Helper to chunk properties for immersive view: [ [p0], [p1, p2], [p3], [p4, p5], ... ]
  const renderImmersiveItems = () => {
    const elements = [];
    let i = 0;

    while (i < properties.length) {
      const isHero = elements.length % 2 === 0;

      if (isHero) {
        const prop = properties[i];
        elements.push(
          <div key={`immersive-hero-${prop.id}`} className="col-span-1 md:col-span-12">
            <article className="group cursor-pointer mb-section-gap">
              <Link href={`/listings/${prop.slug}`} className="block">
                <div className="w-full h-[480px] md:h-[716px] mb-6 overflow-hidden bg-surface-dim border border-outline-variant relative">
                  <Image
                    src={prop.cover_image}
                    alt={prop.cover_image_alt || prop.title}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 1440px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-2 group-hover:underline underline-offset-4 decoration-1">
                      {prop.title}
                    </h2>
                    <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">
                      {prop.location}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <div className="font-body-lg text-body-lg text-primary mb-2">
                      {formatPrice(prop.price, prop.price_display)}
                    </div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase flex items-center space-x-4">
                      <span>{prop.status_display}</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span>{prop.bedrooms} Beds</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span>{prop.bathrooms} Baths</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span>{prop.area.toLocaleString()} Sq Ft</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
            {i + 1 < properties.length && (
              <div className="border-t border-outline-variant mb-section-gap hidden md:block" />
            )}
          </div>
        );
        i += 1;
      } else {
        const prop1 = properties[i];
        const prop2 = properties[i + 1];

        elements.push(
          <div key={`immersive-pair-${prop1.id}`} className="col-span-1 md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
              {/* Left Tall Portrait */}
              <article className="col-span-1 md:col-span-5 group cursor-pointer mb-12 md:mb-0">
                <Link href={`/listings/${prop1.slug}`} className="block">
                  <div className="w-full h-[520px] md:h-[819px] mb-6 overflow-hidden bg-surface-dim border border-outline-variant relative">
                    <Image
                      src={prop1.cover_image}
                      alt={prop1.cover_image_alt || prop1.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-2 group-hover:underline underline-offset-4 decoration-1">
                      {prop1.title}
                    </h2>
                    <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase mb-4">
                      {prop1.location}
                    </p>
                    <div className="font-body-lg text-body-lg text-primary mb-2">
                      {formatPrice(prop1.price, prop1.price_display)}
                    </div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase flex flex-wrap gap-x-4 gap-y-2">
                      <span>{prop1.status_display}</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                      <span>{prop1.bedrooms} Beds</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                      <span>{prop1.bathrooms} Baths</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                      <span>{prop1.area.toLocaleString()} Sq Ft</span>
                    </div>
                  </div>
                </Link>
              </article>

              {/* Right Horizontal Crop */}
              {prop2 && (
                <article className="col-span-1 md:col-span-7 group cursor-pointer flex flex-col justify-end">
                  <Link href={`/listings/${prop2.slug}`} className="block">
                    <div className="w-full h-[380px] md:h-[512px] mb-6 overflow-hidden bg-surface-dim border border-outline-variant relative">
                      <Image
                        src={prop2.cover_image}
                        alt={prop2.cover_image_alt || prop2.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 840px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div>
                      <h2 className="font-headline-md text-headline-md text-primary mb-2 group-hover:underline underline-offset-4 decoration-1">
                        {prop2.title}
                      </h2>
                      <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase mb-4">
                        {prop2.location}
                      </p>
                      <div className="font-body-lg text-body-lg text-primary mb-2">
                        {formatPrice(prop2.price, prop2.price_display)}
                      </div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase flex flex-wrap gap-x-4 gap-y-2">
                        <span>{prop2.status_display}</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                        <span>{prop2.bedrooms} Beds</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                        <span>{prop2.bathrooms} Baths</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full self-center"></span>
                        <span>{prop2.area.toLocaleString()} Sq Ft</span>
                      </div>
                    </div>
                  </Link>
                </article>
              )}
            </div>
            {i + (prop2 ? 2 : 1) < properties.length && (
              <div className="border-t border-outline-variant mb-section-gap hidden md:block" />
            )}
          </div>
        );
        i += prop2 ? 2 : 1;
      }
    }

    return elements;
  };

  return (
    <section>
      {/* Immersive: 12-column asymmetric / stacked view matching Stitch rhythm and spacing */}
      {density === 'immersive' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {renderImmersiveItems()}
        </div>
      )}

      {/* Standard: 3-column grid */}
      {density === 'standard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-section-gap">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className={
                index % 4 === 1
                  ? 'lg:col-start-2 lg:row-span-2'
                  : index % 4 === 3
                  ? 'lg:col-start-1'
                  : ''
              }
            >
              <ListingCard
                key={property.id}
                property={property}
                density="standard"
                aspectRatio={
                  index % 4 === 1
                    ? 'portrait'
                    : index % 4 === 2
                    ? 'square'
                    : index % 4 === 3
                    ? 'video'
                    : 'landscape'
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Compact: 4-column grid */}
      {density === 'compact' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-12">
          {properties.map((property) => (
            <ListingCard key={property.id} property={property} density="compact" />
          ))}
        </div>
      )}
    </section>
  );
}