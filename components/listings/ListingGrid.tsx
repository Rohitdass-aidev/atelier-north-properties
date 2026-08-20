'use client';

import { Property } from '@/lib/mockData';
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
  return (
    <section>
      <div className="flex justify-end mb-8">
        <DensitySelector currentDensity={density} onDensityChange={onDensityChange} />
      </div>

      {/* Immersive: 12-column asymmetric / stacked view */}
      {density === 'immersive' && (
        <div className="flex flex-col gap-12">
          {properties.map((property, idx) => (
            <div key={property.id}>
              <ListingCard property={property} density="immersive" priority={idx === 0} />
              {idx < properties.length - 1 && (
                <div className="border-t border-outline-variant my-12 hidden md:block" />
              )}
            </div>
          ))}
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
              <ListingCard key={property.id} property={property} density="standard" />
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