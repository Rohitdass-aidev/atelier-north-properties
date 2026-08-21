import Link from 'next/link';
import Image from 'next/image';
import { getPropertyBySlug, formatPrice } from '@/lib/mockData';

export default function HomePage() {
  const property1 = getPropertyBySlug('the-brutalist-mews');
  const property2 = getPropertyBySlug('cliffside-retreat');
  const property3 = getPropertyBySlug('georgian-intervention');

  const areas = [
    {
      name: 'Mayfair',
      category: 'City',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAw_gYIgz7_KsOUSmf4zVT4geygQX9CWlYUnRjmnGbKgI3VdDNlnFHJSyA8lHLA26uug_u1f19xLqfXBwH4EH63iIiodzejXZsZ4u4eRUUigpZcC8sVSqaiwBnYULbHcH9fUlhdRi_s_4SsusDxf2C0rtI7yxXVE79D5Ucdm-0eW1RDqqxnm_2XHkekqBiFwF_tcWU4s7PXF1cFbJYq98wsWrUzkFYWH_3VMk9pDfvvGIf_bEzK8S6e',
      alt: 'Mayfair stucco-fronted architecture',
    },
    {
      name: 'Cornwall Coast',
      category: 'Coast',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYtRfHCOLbQVTQrKEHN6mmxcSYoO6Gyc20CN0WXCzS25PjeOZhbvmDyfRcMjfbATQ2CaG5y1ryBc_uGL4sKc3OQ2E-63FFrb0U1ccndRdDDDnT4V3lsGXqt7WRjOvEBeVyLyRqF81hRQSXeix3OYbVVGCC7UwuL3gXnIUnmTnZVXVnky-LXTTR6y9lUwfa4sTtC2eTwzhF-2pyY05P-oUmS1LuGvfOoxDQWPFehKeVGFW9QbFa7LTq',
      alt: 'Cornwall rugged coastal cliff',
    },
    {
      name: 'Hampstead',
      category: 'City',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7YR3DUgjy36Eq6gcpA7reXmGAVXjTUDh5HVz-qLHntTy6Y2jFSxcg0xgqDxfkUGdzVE_sntR4VAHqRPyjzRQNRL4YorsszkfpcBqq0rMTkNrSQgBriuxkB14hz7EJkVpzZF_Y9QtUJjEQloGndQ4VJuAu8YRUJ0hW0p2I371NzQHTQNi93cWdCsWKDqia6nzYQ91XVhnTj8w5PegAdZWByjbXHmHskq_pqzwqzUEt_HZw5852MT8',
      alt: 'Hampstead modernist architecture among foliage',
    },
  ];

  return (
    <div className="pt-[60px] md:pt-[72px]">
      {/* Hero Section - Matching Stitch 870px / 100dvh crop */}
      <section className="w-full h-[100dvh] md:h-[870px] relative mb-section-gap overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAoGA1uFufkDyqmh5M9NDJxpBCSH3NQQp8gQ6WxmkqMsPy6KUS70oCtBnV5-e7EJh0ZExtcEMx93WQVkK03V1V2ecNw-Lokf_bMtyPbwhjBUnJaBQ2Z3r0o0UzLrHCD83xXt7LmQA7vDqmePMZIGl71MzRSXE2I0yEoXf6vxhZ4LItvqc5M2sptKU_3VFLQJnchf-XPWTve_pImguyzMX-Ix3shwZixeHMwGSeyUtIMZYRFjE3ZmBq"
            alt="A striking edge-to-edge architectural photograph of a modern concrete and glass house at twilight"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
        </div>

        {/* Bottom Banner Overlay */}
        <div className="absolute bottom-0 left-0 w-full px-margin-mobile md:px-margin-desktop pb-8 flex flex-col md:flex-row justify-between items-start md:items-center text-on-primary bg-gradient-to-t from-primary/60 to-transparent pt-32">
          <div>
            <h1 className="font-display-xl text-display-lg md:text-display-xl mb-2 text-white font-normal hidden md:block">
              Atelier North
            </h1>
            <p className="font-label-caps text-label-caps uppercase tracking-widest text-white/90">
              Selected residences in the city + coast
            </p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0 font-label-caps text-label-caps uppercase tracking-widest text-white/90">
            <p className="mb-1">London / 51.5074° N</p>
            <a
              href="mailto:enquiries@ateliernorth.com"
              className="border-b border-white/80 pb-0.5 hover:text-white transition-colors"
            >
              enquiries@ateliernorth.com
            </a>
          </div>
        </div>
      </section>

      {/* Featured Residences (Asymmetrical Grid) */}
      <section className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-12">
          <div className="md:col-start-1 md:col-span-4">
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary font-normal">
              Curated
              <br />
              Listings
            </h2>
          </div>
          <div className="md:col-start-5 md:col-span-8 flex items-end pb-2">
            <div className="w-full h-px bg-outline-variant"></div>
          </div>
        </div>

        {/* Asymmetrical Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-gutter">
          {/* Item 1: Large Portrait (Left aligned) */}
          {property1 && (
            <article className="md:col-start-2 md:col-span-6 group cursor-pointer">
              <Link href={`/listings/${property1.slug}`}>
                <div className="w-full aspect-[3/4] overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                  <Image
                    src={property1.cover_image}
                    alt={property1.cover_image_alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                      {property1.title}
                    </h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      {property1.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-nav-link text-nav-link text-primary font-medium">
                      {formatPrice(property1.price, property1.price_display)}
                    </p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      08 IMG
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Item 2: Landscape (Right aligned & offset vertically) */}
          {property2 && (
            <article className="md:col-start-7 md:col-span-6 md:mt-48 group cursor-pointer">
              <Link href={`/listings/${property2.slug}`}>
                <div className="w-full aspect-[4/3] overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                  <Image
                    src={property2.cover_image}
                    alt={property2.cover_image_alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                      {property2.title}
                    </h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      {property2.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-nav-link text-nav-link text-primary font-medium">
                      {formatPrice(property2.price, property2.price_display)}
                    </p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      12 IMG
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Item 3: Square (Center left) */}
          {property3 && (
            <article className="md:col-start-3 md:col-span-5 group cursor-pointer">
              <Link href={`/listings/${property3.slug}`}>
                <div className="w-full aspect-square overflow-hidden border border-outline-variant relative mb-4 bg-surface-dim">
                  <Image
                    src={property3.cover_image}
                    alt={property3.cover_image_alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline border-b border-outline-variant pb-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-normal group-hover:underline underline-offset-4 decoration-1">
                      {property3.title}
                    </h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      {property3.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-nav-link text-nav-link text-primary font-medium">
                      {formatPrice(property3.price, property3.price_display)}
                    </p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
                      05 IMG
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* View All Listings CTA */}
          <div className="md:col-start-1 md:col-span-12 flex justify-center mt-12">
            <Link
              href="/listings"
              className="font-label-caps text-label-caps uppercase tracking-widest border border-primary px-8 py-4 hover:bg-primary hover:text-on-primary transition-colors duration-300"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Areas of Focus Section */}
      <section
        id="areas"
        className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-[1440px] mx-auto bg-surface-container-low py-20 md:py-24 border-y border-outline-variant"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16">
          <div className="md:col-start-2 md:col-span-4">
            <h2 className="font-display-lg-mobile md:font-display-lg text-primary font-normal">
              Areas of
              <br />
              Focus
            </h2>
          </div>
          <div className="md:col-start-6 md:col-span-6 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            <p>
              We source properties across a selective geography, focusing on enclaves that offer
              exceptional architectural merit, whether embedded in the historic fabric of the city or
              exposed to the raw elements of the coast.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-start-2 md:col-span-10">
            <ul className="flex flex-col border-t border-outline-variant">
              {areas.map((area) => (
                <li key={area.name}>
                  <Link
                    href={`/listings?area=${encodeURIComponent(area.category)}`}
                    className="group cursor-pointer border-b border-outline-variant py-8 flex items-center justify-between hover:bg-surface-container transition-colors px-2 md:px-4"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 overflow-hidden border border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block relative bg-surface-dim">
                        <Image
                          src={area.image}
                          alt={area.alt}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-headline-md text-headline-md text-primary group-hover:translate-x-3 transition-transform duration-300 font-normal">
                        {area.name}
                      </h3>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-2xl">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
