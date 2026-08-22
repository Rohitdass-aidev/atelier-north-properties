import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bodoni_Moda, Literata, Inter } from 'next/font/google';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  adjustFontFallback: false,
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atelier North Properties | City + Coast',
  description: 'Selected residences in the city and coast. Sourcing exceptional architectural merit.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${literata.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="bg-surface text-on-surface antialiased font-body-md selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}