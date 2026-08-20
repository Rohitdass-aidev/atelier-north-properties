'use client';

import { useState } from 'react';

interface FiltersBarProps {
  selectedType: string;
  selectedArea: string;
  selectedStatus: string;
  onTypeChange: (type: string) => void;
  onAreaChange: (area: string) => void;
  onStatusChange: (status: string) => void;
}

export default function FiltersBar({
  selectedType,
  selectedArea,
  selectedStatus,
  onTypeChange,
  onAreaChange,
  onStatusChange,
}: FiltersBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const types = ['All', 'House', 'Villa', 'Apartment', 'Pavilion', 'Penthouse'];
  const areas = ['All', 'City', 'Coast', 'Country', 'London', 'Cornwall'];
  const statuses = ['All', 'Available', 'Under Offer', 'Sold'];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="flex flex-wrap items-center gap-6 font-nav-link text-nav-link text-on-surface-variant uppercase relative">
      {/* Type Filter */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('type')}
          className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer py-1"
        >
          Type <span className="text-outline">—</span>{' '}
          <span className="text-primary font-medium">{selectedType}</span>
          <span className="material-symbols-outlined text-sm">
            {openDropdown === 'type' ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openDropdown === 'type' && (
          <div className="absolute top-full left-0 mt-2 w-44 bg-surface border border-outline-variant shadow-lg z-30 py-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  onTypeChange(type);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-xs uppercase hover:bg-surface-container-high transition-colors ${
                  selectedType === type ? 'font-bold text-primary bg-surface-container-low' : 'text-on-surface-variant'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Area Filter */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('area')}
          className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer py-1"
        >
          Area <span className="text-outline">—</span>{' '}
          <span className="text-primary font-medium">{selectedArea}</span>
          <span className="material-symbols-outlined text-sm">
            {openDropdown === 'area' ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openDropdown === 'area' && (
          <div className="absolute top-full left-0 mt-2 w-44 bg-surface border border-outline-variant shadow-lg z-30 py-2">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => {
                  onAreaChange(area);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-xs uppercase hover:bg-surface-container-high transition-colors ${
                  selectedArea === area ? 'font-bold text-primary bg-surface-container-low' : 'text-on-surface-variant'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('status')}
          className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer py-1"
        >
          Status <span className="text-outline">—</span>{' '}
          <span className="text-primary font-medium">{selectedStatus}</span>
          <span className="material-symbols-outlined text-sm">
            {openDropdown === 'status' ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openDropdown === 'status' && (
          <div className="absolute top-full left-0 mt-2 w-44 bg-surface border border-outline-variant shadow-lg z-30 py-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-4 py-2 text-xs uppercase hover:bg-surface-container-high transition-colors ${
                  selectedStatus === status ? 'font-bold text-primary bg-surface-container-low' : 'text-on-surface-variant'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
