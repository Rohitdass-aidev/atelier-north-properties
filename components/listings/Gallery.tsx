'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/mockData';

interface GalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = images.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!images || images.length === 0) return null;

  const progressPercentage = ((currentIndex + 1) / total) * 100;
  const currentImage = images[currentIndex];

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] md:h-[88vh] bg-surface flex flex-col overflow-hidden">
      {/* Active Slide Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentImage.src}
          alt={currentImage.alt || `${title} - Slide ${currentIndex + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-700 ease-in-out"
        />
        {/* Gradient Overlay for bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Prev / Next Clickable Navigation Area & Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-margin-mobile md:px-margin-desktop pointer-events-none z-10">
        <button
          onClick={prevSlide}
          className="pointer-events-auto font-label-caps text-label-caps text-on-primary uppercase tracking-widest hover:opacity-70 transition-opacity bg-primary/20 backdrop-blur-md md:bg-transparent px-4 py-2 md:p-0 rounded"
          aria-label="Previous image"
        >
          ← Prev
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto font-label-caps text-label-caps text-on-primary uppercase tracking-widest hover:opacity-70 transition-opacity bg-primary/20 backdrop-blur-md md:bg-transparent px-4 py-2 md:p-0 rounded"
          aria-label="Next image"
        >
          Next →
        </button>
      </div>

      {/* Image Counter & Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full px-margin-mobile md:px-margin-desktop pb-8 flex flex-col gap-4 z-10">
        <div className="font-label-caps text-label-caps text-on-primary tracking-widest flex justify-between items-center">
          <span>
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="hidden sm:inline opacity-80 uppercase text-[11px]">
            Use keyboard arrows to navigate
          </span>
        </div>
        <div className="w-full h-[2px] bg-white/30 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
