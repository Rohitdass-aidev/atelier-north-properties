'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full px-margin-mobile md:px-margin-desktop py-12 md:py-16 flex flex-col md:flex-row justify-between items-start gap-gutter bg-surface-container-low border-t border-outline-variant mt-auto">
      {/* Brand Column */}
      <div className="mb-8 md:mb-0">
        <Link
          href="/"
          className="font-display-lg text-headline-md text-primary mb-4 block hover:opacity-80 transition-opacity"
        >
          Atelier North Properties
        </Link>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          © Atelier North Properties. All rights reserved.
        </p>
      </div>

      {/* Links & Info */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:w-auto font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
        <div className="flex flex-col space-y-2">
          <span className="text-outline">Offices</span>
          <p className="text-primary normal-case font-medium">London &amp; Cornwall</p>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-outline">Contact</span>
          <a
            href="mailto:enquiries@ateliernorth.com"
            className="hover:text-primary transition-colors lowercase normal-case"
          >
            enquiries@ateliernorth.com
          </a>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-outline">Social</span>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}