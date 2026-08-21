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
    <section className="relative w-full h-[530px] md:h-[921px] bg-surface flex flex-col overflow-hidden">
      {/* Active Slide Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentImage.src}
          alt={currentImage.alt || `${title} - Slide ${currentIndex + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />
      </div>

      {/* Gallery Controls - Understated, minimal text matching Stitch */}
      <div className="absolute inset-0 flex items-center justify-between px-margin-mobile md:px-margin-desktop pointer-events-none z-10">
        <button
          onClick={prevSlide}
          className="pointer-events-auto font-label-caps text-label-caps text-on-primary uppercase tracking-widest hover:opacity-70 transition-opacity focus:outline-none py-2 px-1"
          aria-label="Previous image"
        >
          Prev
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto font-label-caps text-label-caps text-on-primary uppercase tracking-widest hover:opacity-70 transition-opacity focus:outline-none py-2 px-1"
          aria-label="Next image"
        >
          Next
        </button>
      </div>

      {/* Image Counter & Subtle Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full px-margin-mobile md:px-margin-desktop pb-8 flex flex-col gap-4 z-10">
        <div className="font-label-caps text-label-caps text-on-primary tracking-widest">
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
        <div className="w-full h-[1px] bg-outline-variant/30 relative">
          <div
            className="absolute top-0 left-0 h-full bg-on-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
