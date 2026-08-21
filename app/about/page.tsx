import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Atelier North Properties',
  description:
    'Sourcing exceptional architectural merit. Atelier North is a specialist property advisory operating across city and coast.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full">
      {/* Main Statement */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-gutter">
        <div className="md:col-span-10 md:col-start-2 mb-12 md:mb-16">
          <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary text-left leading-tight font-normal">
            Sourcing exceptional architectural merit.
          </h1>
        </div>

        {/* Image Section */}
        <div className="md:col-span-6 md:col-start-1 h-[460px] md:h-[720px] border border-outline-variant relative overflow-hidden group bg-surface-dim">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV21XdCm5SBfhYgb15MnErIpTXOpblErkJ3674mFWd0SzToL5zrrFNSTB1q-LRSjCjcPmdeBJ1U8OpClwkQz6ek9d8w11DfTSMBPKVaSnFEryVaUGiT7LsoQDKb2Gog3vBrEoHRDm_9qVVvkCdWUtsnkox8F1HEdstOAhUrLgldNysLugap_shzSEMEHZH4cG9gzwlAH7ZUAfvBnotKAZk49EEdff3q2w_aNu7Vw-nDBDqo45B71n8"
            alt="Serene architectural workspace"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content Column */}
        <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center space-y-12 md:space-y-16 mt-6 md:mt-0">
          {/* Narrative */}
          <div className="font-body-lg text-body-lg text-on-surface-variant space-y-4 leading-relaxed">
            <p>
              Atelier North is a specialist property advisory dedicated to residences of singular
              architectural character. Operating across London and the British coastline, we represent
              homes that exhibit rigorous craftsmanship, timeless materiality, and thoughtful spatial
              composition.
            </p>
            <p>
              We believe architecture is an emotional discipline. Our portfolio is deliberately
              limited to residences that elevate the ritual of everyday living.
            </p>
          </div>

          {/* Expertise */}
          <div>
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-6 border-b border-outline-variant pb-2 uppercase tracking-widest">
              Expertise &amp; Services
            </h2>
            <ul className="font-body-lg text-body-lg text-primary space-y-4 font-serif">
              <li className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Curation &amp; Portfolio Representation
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Discreet Private Acquisition
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Architectural &amp; Heritage Advisory
              </li>
            </ul>
          </div>

          {/* Press / Publications */}
          <div>
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-6 border-b border-outline-variant pb-2 uppercase tracking-widest">
              Featured Publications
            </h2>
            <div className="flex flex-wrap gap-4">
              <span className="border border-outline-variant text-primary px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest hover:border-primary transition-colors">
                Dezeen
              </span>
              <span className="border border-outline-variant text-primary px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest hover:border-primary transition-colors">
                Wallpaper*
              </span>
              <span className="border border-outline-variant text-primary px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest hover:border-primary transition-colors">
                Architectural Digest
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/enquire"
              className="inline-flex font-nav-link text-nav-link uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
            >
              Start an Enquiry →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
