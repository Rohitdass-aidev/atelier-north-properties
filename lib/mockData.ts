// Mock property data for Atelier North Properties
// Aligned with the canonical Stitch portfolio designs

export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'off_market';
export type PropertyType = 'house' | 'apartment' | 'villa' | 'penthouse' | 'land';
export type PropertyArea = 'City' | 'Coast' | 'Country';

export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  region: string;
  area_category: PropertyArea;
  price: number;
  price_display?: string;
  status: PropertyStatus;
  status_display: string;
  property_type: PropertyType;
  property_type_display: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // square feet
  description: string;
  extended_description?: string;
  features?: string[];
  cover_image: string;
  cover_image_alt: string;
  gallery: GalleryImage[];
  published: boolean;
  sort_order: number;
  image_count: number;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'The Cliff House',
    slug: 'the-cliff-house',
    location: 'Cornwall Coast',
    region: 'Cornwall',
    area_category: 'Coast',
    price: 4250000,
    status: 'available',
    status_display: 'Available',
    property_type: 'villa',
    property_type_display: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    description:
      'A masterclass in contextual modernism. The Cliff House is sculpted from raw concrete and local stone, designed to weather and integrate with its dramatic coastal setting over time. The interior layout prioritizes volume and light, featuring double-height living spaces that frame uninterrupted views of the Atlantic.',
    extended_description:
      'Extensive use of continuous glazing blurs the boundary between the rugged exterior landscape and the meticulously crafted, serene interior spaces. Board-formed concrete elevations provide passive thermal mass, while curated cedar detailing softens the austere aesthetic.',
    features: [
      'Unobstructed Atlantic Ocean panoramas',
      'Cantilevered coastal terrace & infinity plunge pool',
      'Board-formed architectural concrete construction',
      'Sub-Zero & Gaggenau bespoke integrated kitchen',
      'Private cliff-path access to secluded cove',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBK78Sx-OX4UzUDTkNUDfPYHWOquSmz5LhAUTW422CR92QTbphHbfaPJVhEN19W_So6AL3w6j_TELpc5hSDHA2GDtOivB_ai9ALOhySWZ78nUcFFlagm8fSOuMnvwAhl6WHRkSzkZZFY_DEjRLEiGfXyrWzD9bPyNy_xgGt4sRP_ymQ_XCb1hPIB77TP-6mRMDTP-1P8DFUjsc9CwIkOny0ikhewCHN6f8z3PtDa75p01xj10gfIapR',
    cover_image_alt:
      'Minimalist concrete cliff house perched over a turbulent ocean at dawn.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK78Sx-OX4UzUDTkNUDfPYHWOquSmz5LhAUTW422CR92QTbphHbfaPJVhEN19W_So6AL3w6j_TELpc5hSDHA2GDtOivB_ai9ALOhySWZ78nUcFFlagm8fSOuMnvwAhl6WHRkSzkZZFY_DEjRLEiGfXyrWzD9bPyNy_xgGt4sRP_ymQ_XCb1hPIB77TP-6mRMDTP-1P8DFUjsc9CwIkOny0ikhewCHN6f8z3PtDa75p01xj10gfIapR',
        alt: 'Wide exterior shot of a modern brutalist concrete villa on a coastal cliff.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjnPLt5qysMYTNqvAm-mngyQIWMhOp_rxuQ_9RdxA0uE84pwdZTFwKBEH5JiX3038p8aRRYMBkSYZ69BpMTcgiG4PbmuPoDlQDN-uhfRE-loyDRlVG6h3FgukRML5SzbjN2WzMUF2wJsmmAZcd5Mn-I5X9CAbPqowjP7opGbBvYLHWonskSBk_aqZ4AVlZNek01TXqa4PZTaUEBU8f5aE_Q1xn7gqj462nxyGY01S3jQYqBXhb0Dkj',
        alt: 'Wide exterior view of sharp geometric lines against coastal crag.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVKU9vTMaU3TXkpP5qhdA5WLrCJxTGxc2xbZmxzZmOvg37CnwH3Aj3Vbi2zuAjp-Mt71QlyQ94dLRop5RwCyVoLRGgGf3UkfDQJiwUze8ir0JpM-kKxsMlt86V7az7C2fK-DbRA2nGz83eMDDWSc8JlZnx-JWbcsX151yxiUI6S6FJi-gsigGSoXNaEWdJJnnK4wEDUjBYi0a6aVGZ4wb4G6oTo8etzHh7VLxzQ_OPjEvwEmLge5aE',
        alt: 'Interior architectural space with sweeping curved concrete staircase.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVeK5jgGTlWBpU-VX9aYdmvf0Ea5TSReBb_zq3SKCuEX1FMcO18aZqGm6w_QTtucK5qqRcWzPEPWxm2_CGugkoq7Er9PsvV2BNhasZTKnW0IHaY4Hiot0TxA5KZe1L5O40wDbV6CgstM10tU4E0PLf5BGBQPCNtsX3J0EIazaxdb7ZJb2taAhmr-hlNyv57FNbbnwh2E6wc93pOCAl9HVnaIoYHcbf9xzxYYwl2ba81moOuj0-YsN9',
        alt: 'Minimalist kitchen with dark stained wood and monolithic pale stone island.',
      },
    ],
    published: true,
    sort_order: 1,
    image_count: 14,
  },
  {
    id: '2',
    title: 'Volume & Light',
    slug: 'volume-and-light',
    location: 'Highgate, London',
    region: 'London',
    area_category: 'City',
    price: 5100000,
    status: 'under_offer',
    status_display: 'Under Offer',
    property_type: 'house',
    property_type_display: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: 3600,
    description:
      'A study in structural geometry where a sweeping curved concrete staircase meets warm oak flooring. Dramatic raking sunlight creates sharp architectural shadows across blank gallery walls in this serene London residence.',
    extended_description:
      'Designed by an award-winning British studio, this home offers double-height entertaining spaces with museum-grade lighting, concealed acoustic ceilings, and a seamless courtyard garden transition.',
    features: [
      'Dramatic sculptural helical staircase in poured concrete',
      'Double-height 6.5m ceiling reception gallery',
      'South-facing secluded walled courtyard garden',
      'Underfloor heating and integrated air filtration',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVKU9vTMaU3TXkpP5qhdA5WLrCJxTGxc2xbZmxzZmOvg37CnwH3Aj3Vbi2zuAjp-Mt71QlyQ94dLRop5RwCyVoLRGgGf3UkfDQJiwUze8ir0JpM-kKxsMlt86V7az7C2fK-DbRA2nGz83eMDDWSc8JlZnx-JWbcsX151yxiUI6S6FJi-gsigGSoXNaEWdJJnnK4wEDUjBYi0a6aVGZ4wb4G6oTo8etzHh7VLxzQ_OPjEvwEmLge5aE',
    cover_image_alt:
      'Interior with curved concrete staircase and dramatic raking sunlight.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVKU9vTMaU3TXkpP5qhdA5WLrCJxTGxc2xbZmxzZmOvg37CnwH3Aj3Vbi2zuAjp-Mt71QlyQ94dLRop5RwCyVoLRGgGf3UkfDQJiwUze8ir0JpM-kKxsMlt86V7az7C2fK-DbRA2nGz83eMDDWSc8JlZnx-JWbcsX151yxiUI6S6FJi-gsigGSoXNaEWdJJnnK4wEDUjBYi0a6aVGZ4wb4G6oTo8etzHh7VLxzQ_OPjEvwEmLge5aE',
        alt: 'Curved concrete staircase and double-height light well.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMOj7jXu21RyrK46Tu6vPJGPr6VG3lDbBNNMvjpDVjLSXiNdFX-o5UmFbnNlp4h1K9Zfo4P0-qsylk4NfvujQeVg1bIWxsdo9uXP66x-viwsN0C1Myp8lnv5n6Y2ep5Pl2YnEgeqnz0ooWjbj3S_AEPFDnCHVj5YxymjWQlty7JdmbV4uVU4hfr8cqOv7_FcYA6-W2HxFxBPi2mkHERpEgiKmS4UjvpwwqKDkI_qcGKb5ZtuoCpeq6',
        alt: 'Macro texture of dark veined marble meeting board-formed concrete.',
      },
    ],
    published: true,
    sort_order: 2,
    image_count: 24,
  },
  {
    id: '3',
    title: 'The Brutalist Mews',
    slug: 'the-brutalist-mews',
    location: 'Highgate, London',
    region: 'London',
    area_category: 'City',
    price: 3450000,
    status: 'available',
    status_display: 'Available',
    property_type: 'house',
    property_type_display: 'Mews House',
    bedrooms: 3,
    bathrooms: 2,
    area: 2400,
    description:
      'Raw concrete walls contrast with elegant mid-century modern furniture and minimal, sculptural lighting. The composition is asymmetrical, highlighting stark geometry and textural richness in a private Highgate enclave.',
    extended_description:
      'High clerestory windows flood the core of this residence with diffused northern daylight. An austere palette of monolithic screed floors, raw aggregate walls, and dark stained timber creates an atmosphere of timeless architectural quietude.',
    features: [
      'Architect-designed mews freehold',
      'Exposed fair-faced board-marked concrete',
      'Discrete garage with EV fast charging',
      'Rooftop reading room with skyline glimpses',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvC_Jgo6J6QnLk03pq4MSQhATjZKSvPZX-WbGMbwN9fErsXT6CYmgdSJB_2NtJCcyMBe9vPdk4WO2Y4MgBgJWj9MXhsjuAl4iptfxKay_PhMmgUwgICXeQGPWLfZj6BRxCbVpVUK5IMNO-18VvpN2CuVnhjpp_at7cnf6BWVCeaPFw6YmObDIa5NwRmEfFpz_d47Aa02Balp4e1N4AHxbe5vEft0B-hSE-xyyB3JfAh84wxJAUN36a',
    cover_image_alt:
      'Brutalist mews house interior in Highgate with raw concrete and mid-century furniture.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvC_Jgo6J6QnLk03pq4MSQhATjZKSvPZX-WbGMbwN9fErsXT6CYmgdSJB_2NtJCcyMBe9vPdk4WO2Y4MgBgJWj9MXhsjuAl4iptfxKay_PhMmgUwgICXeQGPWLfZj6BRxCbVpVUK5IMNO-18VvpN2CuVnhjpp_at7cnf6BWVCeaPFw6YmObDIa5NwRmEfFpz_d47Aa02Balp4e1N4AHxbe5vEft0B-hSE-xyyB3JfAh84wxJAUN36a',
        alt: 'Main living volume with exposed concrete and bespoke millwork.',
      },
    ],
    published: true,
    sort_order: 3,
    image_count: 8,
  },
  {
    id: '4',
    title: 'Stone & Timber',
    slug: 'stone-and-timber',
    location: 'Highgate, London',
    region: 'London',
    area_category: 'City',
    price: 8500000,
    status: 'available',
    status_display: 'Available',
    property_type: 'villa',
    property_type_display: 'Villa',
    bedrooms: 6,
    bathrooms: 6,
    area: 7400,
    description:
      'A commanding contemporary residence blending rough natural stone with smooth Shou Sugi Ban charred timber cladding. Soft, diffused daylight highlights the tactile qualities of the materials under an understated architectural profile.',
    extended_description:
      'Set within secluded landscaped grounds, this landmark residence features expansive reception spaces, a subterranean wellness suite, and floor-to-ceiling slimline glass panels opening to mature woodland borders.',
    features: [
      'Subterranean 12m lap pool and sauna suite',
      'Hand-crafted Japanese blackened timber facade',
      'Detached architectural guest lodge',
      'Direct perimeter access to Hampstead Heath borders',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1RSgccctNLq1mrfpKxmBFFLRIBjAcUIzI_mbt1DZ0ZdwK-nMMQTPw0zIZiSdetCGGjrTerFkci-Z1JYHqf40RJfZ5nD7NbWWL51xpbJ7uXrT5lA9qf0A637vN7yx3MXieZl-iEKnWW6JBkns0V3uNIxgpnV_u6RFAmqo-C4mrlbIJ8oC7seY5Ih-0VAhsnqzN_q0J8jeslMYSOUTachHSEJYi5Ofiter9I5hiVd6m8ZYJW_V-vEx',
    cover_image_alt:
      'Vertical crop of a modern residence blending rough natural stone with smooth timber.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1RSgccctNLq1mrfpKxmBFFLRIBjAcUIzI_mbt1DZ0ZdwK-nMMQTPw0zIZiSdetCGGjrTerFkci-Z1JYHqf40RJfZ5nD7NbWWL51xpbJ7uXrT5lA9qf0A637vN7yx3MXieZl-iEKnWW6JBkns0V3uNIxgpnV_u6RFAmqo-C4mrlbIJ8oC7seY5Ih-0VAhsnqzN_q0J8jeslMYSOUTachHSEJYi5Ofiter9I5hiVd6m8ZYJW_V-vEx',
        alt: 'Stone and timber exterior elevation under diffused light.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuu-tqh8FdQjRZiwzWiWLPivrPKwgGDMg-VUu_ys2ZwETUL5KmCTZ6HUPrf41bSIa0iR0WAzKIzPKwxbquww5rc9VxpRmXtBNwDP9AIZv01d75hILytVnaA7Kkr5_VgKgyWkYi-tgJnxbasv9aGUzo-hjKnK4FeETSCMmjnaOGTxHKbhr4IXzuuzEQrnGHQIlAW-_nrs2m5n9niQoSPPPdFiKhzqlrKWfAr-BVRp7UMFH-gHAQeO4Y',
        alt: 'Contextual stone facade in garden setting.',
      },
    ],
    published: true,
    sort_order: 4,
    image_count: 12,
  },
  {
    id: '5',
    title: 'The Glass Pavilion',
    slug: 'the-glass-pavilion',
    location: 'Surrey Hills',
    region: 'Surrey',
    area_category: 'Country',
    price: 3100000,
    status: 'under_offer',
    status_display: 'Under Offer',
    property_type: 'house',
    property_type_display: 'Pavilion',
    bedrooms: 3,
    bathrooms: 2,
    area: 2800,
    description:
      'A striking modernist glass pavilion set within a lush, manicured walled garden. Crisp white interior elements and dark steel framework celebrate transparency and connection to surrounding nature.',
    extended_description:
      'The house floats subtly on a recessed plinth. Minimalist interior partitions in pale Douglas fir create defined zones for living and rest while maintaining sightlines through the 360-degree glass perimeter.',
    features: [
      'Structural glass engineering with thermal efficiency',
      'Historic 18th-century brick walled garden setting',
      'Bespoke terrazzo flooring throughout',
      'Automated external solar shading blinds',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyLsQXlRN2xcaF1G2BItJyOJ94AI0nX7bqboDdgKUUqlMQ7lBluek-Vbs4AC_PFMOWjWGbxKc4bDz0OQz5Kw54WG9Rbak8y764TXZrI5ucfH1U3mdeSU1A2LWDz_gVlfw3dhYDILK32fD1Cb5wc4P9aFoMxBc13rQJJGSK67WIjF_pEKkesGtS-QX1QMrKz3XpnvS2fPawSoIPXMYpxQ8IVW6Vxv3_scEY6DIRw9wLIjc1zci1UV_w',
    cover_image_alt:
      'Modernist glass pavilion house set within a green walled garden.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyLsQXlRN2xcaF1G2BItJyOJ94AI0nX7bqboDdgKUUqlMQ7lBluek-Vbs4AC_PFMOWjWGbxKc4bDz0OQz5Kw54WG9Rbak8y764TXZrI5ucfH1U3mdeSU1A2LWDz_gVlfw3dhYDILK32fD1Cb5wc4P9aFoMxBc13rQJJGSK67WIjF_pEKkesGtS-QX1QMrKz3XpnvS2fPawSoIPXMYpxQ8IVW6Vxv3_scEY6DIRw9wLIjc1zci1UV_w',
        alt: 'Glass pavilion exterior at golden hour.',
      },
    ],
    published: true,
    sort_order: 5,
    image_count: 16,
  },
  {
    id: '6',
    title: 'Pine Pavilion',
    slug: 'pine-pavilion',
    location: 'The Cotswolds',
    region: 'Cotswolds',
    area_category: 'Country',
    price: 2850000,
    status: 'available',
    status_display: 'Available',
    property_type: 'house',
    property_type_display: 'Pavilion',
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    description:
      'A low-profile, minimalist pavilion constructed from pale pine wood, nestled among tall, slender evergreen trees. A serene, Scandinavian-inspired architectural sanctuary focusing on peaceful integration with woodland surroundings.',
    extended_description:
      'Expansive triple-glazed apertures frame the forest canopy, creating a calm, meditative interior. Heated Dinesen Douglas fir planks run seamlessly through the living spaces out to a sheltered outdoor dining loggia.',
    features: [
      'Zero-carbon cross-laminated timber (CLT) structure',
      'Ground-source heat pump and solar PV integration',
      'Private 4-acre ancient woodland plot',
      'Detached Finnish cedar sauna cabin',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZkGIvlXkZ3uFuJihg6fKDaqjdH5XHc3FHouYa1x1EMGy96UMNYuBFT979mP1FQLAzvjRVVxYxpvy8E1ogogj3gKNZKCSYEXmvCipZtrYra7yaRjVC65T8xKucijQNtcA8Em9cZ9-UnhuCU0c8arS34bm4V4nJibuANKhvR0hjkHCxs4Hk-tcxEcBPq2zTgKIotbPuJTMbOj_0hczM4a0aT48n2zwPN2Lq6futnhZoLfgxsSUBOtBY',
    cover_image_alt:
      'Pine pavilion house nestled among tall evergreen trees at dusk.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZkGIvlXkZ3uFuJihg6fKDaqjdH5XHc3FHouYa1x1EMGy96UMNYuBFT979mP1FQLAzvjRVVxYxpvy8E1ogogj3gKNZKCSYEXmvCipZtrYra7yaRjVC65T8xKucijQNtcA8Em9cZ9-UnhuCU0c8arS34bm4V4nJibuANKhvR0hjkHCxs4Hk-tcxEcBPq2zTgKIotbPuJTMbOj_0hczM4a0aT48n2zwPN2Lq6futnhZoLfgxsSUBOtBY',
        alt: 'Pine pavilion surrounded by evergreen pines.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcP5ZtBoY4JuYJXsUCGPlGmofD28y9M7u-WFSfQixRLkIai_ms7JPJEWHC-Al3c8LQFsHm0udda9ZY0mnpOCVl-_n0FcjWVrx9D_Txpt9db-WGmIp5DH40a5SSjM0jfCuSXsYE5kJVoINAl4ozQ6S0NJB06fKvIMXh0Zzwm8nwBn57LM3vWGMQ8OPsIjDanKOEWh056K02_4TaxzzXFKhjTbkLU8S8H5qMMp07Lstm627OTwBQ0rM-',
        alt: 'Dusk view of pine pavilion glowing through trees.',
      },
    ],
    published: true,
    sort_order: 6,
    image_count: 14,
  },
  {
    id: '7',
    title: 'The Brutalist Apartment',
    slug: 'the-brutalist-apartment',
    location: 'Manchester',
    region: 'Manchester',
    area_category: 'City',
    price: 1950000,
    price_display: 'POA',
    status: 'sold',
    status_display: 'Sold',
    property_type: 'apartment',
    property_type_display: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    description:
      'Heavily veined dark marble meets raw, board-formed concrete in this distinctive city loft. Macro focus on texture, material authenticity, and quiet luxury craftsmanship.',
    extended_description:
      'An expansive open-plan layout occupies the entire upper floor of a converted industrial warehouse. Custom steel-framed partition doors, dark terrazzo, and integrated bronze details provide tactile luxury throughout.',
    features: [
      'Original restored concrete coffered ceilings',
      'Custom Nero Marquina marble kitchen block',
      'Dual aspect terrace overlooking the urban canal',
      'Direct private key-card elevator entrance',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMOj7jXu21RyrK46Tu6vPJGPr6VG3lDbBNNMvjpDVjLSXiNdFX-o5UmFbnNlp4h1K9Zfo4P0-qsylk4NfvujQeVg1bIWxsdo9uXP66x-viwsN0C1Myp8lnv5n6Y2ep5Pl2YnEgeqnz0ooWjbj3S_AEPFDnCHVj5YxymjWQlty7JdmbV4uVU4hfr8cqOv7_FcYA6-W2HxFxBPi2mkHERpEgiKmS4UjvpwwqKDkI_qcGKb5ZtuoCpeq6',
    cover_image_alt:
      'Close-up architectural detail shot of dark marble and concrete.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMOj7jXu21RyrK46Tu6vPJGPr6VG3lDbBNNMvjpDVjLSXiNdFX-o5UmFbnNlp4h1K9Zfo4P0-qsylk4NfvujQeVg1bIWxsdo9uXP66x-viwsN0C1Myp8lnv5n6Y2ep5Pl2YnEgeqnz0ooWjbj3S_AEPFDnCHVj5YxymjWQlty7JdmbV4uVU4hfr8cqOv7_FcYA6-W2HxFxBPi2mkHERpEgiKmS4UjvpwwqKDkI_qcGKb5ZtuoCpeq6',
        alt: 'Macro architectural textures in Manchester loft.',
      },
    ],
    published: true,
    sort_order: 7,
    image_count: 8,
  },
  {
    id: '8',
    title: 'Georgian Intervention',
    slug: 'georgian-intervention',
    location: 'Mayfair, London',
    region: 'London',
    area_category: 'City',
    price: 8250000,
    status: 'available',
    status_display: 'Available',
    property_type: 'penthouse',
    property_type_display: 'Penthouse',
    bedrooms: 5,
    bathrooms: 5,
    area: 6100,
    description:
      'The juxtaposition of preserved ornate Georgian plasterwork and ultra-modern, minimalist black steel and glass interventions. Refined, archival, and deeply rooted in editorial architectural photography.',
    extended_description:
      'Spanning four expansive floors with private mews access, this townhouse represents one of central London’s finest historic modernisations, boasting original marble fireplaces and an engineered glass roof garden room.',
    features: [
      'Grade II listed Georgian facade with contemporary core',
      'Private internal hydraulic glass elevator',
      'Landscaped rooftop terrace with Mayfair views',
      'Secure subterranean parking for 2 vehicles',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTRazEM3DLemMLjnZg3YX5AbhTO4Cc3jvGMAv6pjQIq1XbgH5mG25xRB3TdVGz4U1FaJ8FDydeS9q9_b-ktAO6TNrjpzdaoqAIuOb76zQwQOBONUMiA9hKTFRet2qggg_TYryXDB5ebqc1yeOp6ESyx5zRw_ACnoSXLBq8FwRQLOt1Yh8N5_L8BNSZ4hc21U5GE9NPhn1gCljC5_WOcMxAVnwRrwESLb3Cg4SAzXPxcBE3jZIWAG6U',
    cover_image_alt:
      'Mayfair Georgian townhouse interior with minimalist glass and black steel.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTRazEM3DLemMLjnZg3YX5AbhTO4Cc3jvGMAv6pjQIq1XbgH5mG25xRB3TdVGz4U1FaJ8FDydeS9q9_b-ktAO6TNrjpzdaoqAIuOb76zQwQOBONUMiA9hKTFRet2qggg_TYryXDB5ebqc1yeOp6ESyx5zRw_ACnoSXLBq8FwRQLOt1Yh8N5_L8BNSZ4hc21U5GE9NPhn1gCljC5_WOcMxAVnwRrwESLb3Cg4SAzXPxcBE3jZIWAG6U',
        alt: 'Georgian townhouse reception with contemporary glass interventions.',
      },
    ],
    published: true,
    sort_order: 8,
    image_count: 5,
  },
  {
    id: '9',
    title: 'Cliffside Retreat',
    slug: 'cliffside-retreat',
    location: 'Cornwall Coast',
    region: 'Cornwall',
    area_category: 'Coast',
    price: 4100000,
    status: 'available',
    status_display: 'Available',
    property_type: 'villa',
    property_type_display: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    description:
      'A wide, horizontal architectural statement overlooking a moody sea. Stark modern glass facade framed by soft, natural tones of coastal grasses and slate.',
    extended_description:
      'Constructed into the natural granite slope, the residence steps down across three terraced levels, ensuring uninterrupted sea views from every living space and bedroom suite.',
    features: [
      'Direct coastal path access',
      'Triple-aspect open-plan ocean living room',
      'Sheltered internal courtyards for year-round outdoor living',
      'Solar thermal and green sedum roof',
    ],
    cover_image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDas9t-I59F_2lWP4-w3hH6vjVpzfRrSlLOFxSPUJHqLMdoEITLrZbqiupekg3q9tRwYCUprWN2fbTlsUfL0XuSKfFnF7NmSJksw_Pmtd9xW-1JH5U0_j1rB6LjDX1HE6XU2OpDkKxQxg6Aucr3Nsj1id2vxK1Y34bUZ2vumSASCLvOj8-4eDyffiDOi9tPFFRX-pjJp0hLYZX3YSVdClZ_4wZii4G82ERhy6F_4zG1shg0jBmRFrgt',
    cover_image_alt:
      'Coastal view of cliffside retreat in Cornwall with stark glass facade.',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDas9t-I59F_2lWP4-w3hH6vjVpzfRrSlLOFxSPUJHqLMdoEITLrZbqiupekg3q9tRwYCUprWN2fbTlsUfL0XuSKfFnF7NmSJksw_Pmtd9xW-1JH5U0_j1rB6LjDX1HE6XU2OpDkKxQxg6Aucr3Nsj1id2vxK1Y34bUZ2vumSASCLvOj8-4eDyffiDOi9tPFFRX-pjJp0hLYZX3YSVdClZ_4wZii4G82ERhy6F_4zG1shg0jBmRFrgt',
        alt: 'Cliffside retreat overlooking the ocean.',
      },
    ],
    published: true,
    sort_order: 9,
    image_count: 12,
  },
];

export function getAllProperties(): Property[] {
  return properties.filter((p) => p.published).sort((a, b) => a.sort_order - b.sort_order);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug && p.published);
}

export function getRelatedProperties(slug: string, limit = 3): Property[] {
  return properties
    .filter((p) => p.slug !== slug && p.published)
    .slice(0, limit);
}

export function formatPrice(price: number, display?: string): string {
  if (display) return display;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return new Intl.NumberFormat('en-GB').format(area);
}
