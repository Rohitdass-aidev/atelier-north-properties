'use client';

export type DensityMode = 'compact' | 'standard' | 'immersive';

interface DensitySelectorProps {
  currentDensity: DensityMode;
  onDensityChange: (density: DensityMode) => void;
}

export default function DensitySelector({
  currentDensity,
  onDensityChange,
}: DensitySelectorProps) {
  const options: { id: DensityMode; label: string }[] = [
    { id: 'compact', label: 'Compact' },
    { id: 'standard', label: 'Standard' },
    { id: 'immersive', label: 'Immersive' },
  ];

  return (
    <div className="hidden md:flex items-center gap-4 font-label-caps text-label-caps text-outline uppercase border-l border-outline-variant pl-8">
      {options.map((opt) => {
        const isActive = currentDensity === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onDensityChange(opt.id)}
            className={`transition-colors cursor-pointer pb-1 ${
              isActive
                ? 'text-primary border-b border-primary font-medium'
                : 'hover:text-primary border-b border-transparent'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}