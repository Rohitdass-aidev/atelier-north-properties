'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/listings', label: 'Listings', icon: 'home_work' },
    { href: '/#areas', label: 'Areas', icon: 'map' },
    { href: '/about', label: 'About', icon: 'info' },
    { href: '/enquire', label: 'Enquire', icon: 'mail' },
  ];

  return (
    <>
      {/* Top Header - Compact, refined height matching Stitch */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 md:py-5 bg-surface/90 backdrop-blur-sm border-b border-outline-variant">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-xl md:text-2xl tracking-tighter text-primary hover:opacity-80 transition-opacity"
        >
          <span className="hidden md:inline">Atelier North Properties / City + Coast</span>
          <span className="md:hidden">Atelier North</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-nav-link text-nav-link uppercase tracking-widest items-center">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/listings'
                ? pathname === '/listings' || pathname.startsWith('/listings/')
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 cursor-pointer transition-colors duration-300 ${
                  isActive
                    ? 'text-primary border-b border-primary font-medium'
                    : 'text-on-surface-variant hover:text-secondary border-b border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-1 text-primary focus:outline-none"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      {/* Mobile Slide-out Menu Overlay - Matching Stitch exactly */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center space-y-8 bg-surface transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-margin-mobile p-2 text-primary focus:outline-none"
          aria-label="Close navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-display-lg-mobile text-display-lg-mobile text-primary block"
          >
            Atelier North
          </Link>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-2 block">
            City + Coast
          </span>
        </div>

        <nav className="flex flex-col space-y-6 text-center items-center">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/listings'
                ? pathname === '/listings' || pathname.startsWith('/listings/')
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-nav-link text-nav-link uppercase flex items-center gap-2 pb-1 transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}