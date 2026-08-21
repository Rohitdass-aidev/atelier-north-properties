'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllProperties } from '@/lib/mockData';
import ListingGrid from '@/components/listings/ListingGrid';
import DensitySelector, { DensityMode } from '@/components/listings/DensitySelector';
import FiltersBar from '@/components/listings/FiltersBar';

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialArea = searchParams.get('area') || 'All';

  const [density, setDensity] = useState<DensityMode>('standard');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const allProps = getAllProperties();

  // Filter properties
  const filteredProperties = useMemo(() => {
    return allProps.filter((p) => {
      // Type filter
      if (selectedType !== 'All') {
        if (p.property_type.toLowerCase() !== selectedType.toLowerCase()) return false;
      }
      // Area filter
      if (selectedArea !== 'All') {
        const matchesCategory = p.area_category.toLowerCase() === selectedArea.toLowerCase();
        const matchesRegion = p.region.toLowerCase().includes(selectedArea.toLowerCase());
        const matchesLocation = p.location.toLowerCase().includes(selectedArea.toLowerCase());
        if (!matchesCategory && !matchesRegion && !matchesLocation) return false;
      }
      // Status filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Available' && p.status !== 'available') return false;
        if (selectedStatus === 'Under Offer' && p.status !== 'under_offer') return false;
        if (selectedStatus === 'Sold' && p.status !== 'sold') return false;
      }
      return true;
    });
  }, [allProps, selectedType, selectedArea, selectedStatus]);

  return (
    <div className="pt-24 md:pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-[1440px] mx-auto">
      {/* Header & Controls Section */}
      <header className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-outline-variant pb-8">
        <div>
          <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
            Index
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2 max-w-xl">
            A curated selection of architectural residences across city and coast.
          </p>
        </div>

        {/* Controls: Filters & Density */}
        <div className="w-full md:w-auto flex flex-col md:flex-row justify-between md:justify-end items-start md:items-center gap-6 md:gap-8">
          <FiltersBar
            selectedType={selectedType}
            selectedArea={selectedArea}
            selectedStatus={selectedStatus}
            onTypeChange={setSelectedType}
            onAreaChange={setSelectedArea}
            onStatusChange={setSelectedStatus}
          />
          <DensitySelector currentDensity={density} onDensityChange={setDensity} />
        </div>
      </header>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-24 border border-dashed border-outline-variant my-12 bg-surface-container-low">
          <p className="font-display text-2xl text-primary mb-2">No properties found</p>
          <p className="font-label-caps text-on-surface-variant uppercase text-xs">
            Try adjusting your filter selections above
          </p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedArea('All');
              setSelectedStatus('All');
            }}
            className="mt-6 font-nav-link text-nav-link uppercase text-primary border-b border-primary pb-1"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Unified Listing Grid Component */}
      {filteredProperties.length > 0 && (
        <ListingGrid
          properties={filteredProperties}
          density={density}
          onDensityChange={setDensity}
        />
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-label text-sm">Loading index...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
