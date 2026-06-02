export type CaseStudyMeta = {
  slug: string;
  title: string;
  cardImage: string;
  cardAlt: string;
  services: string[];
  summary?: string;
  featured?: boolean;
  published?: boolean;
};

export const getCaseStudyUrl = (slug: string) => `/case-studies/${slug}/`;

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "distinct-creative-group",
    title: "Distinct Creative Group",
    cardImage: "/images/work/distinct-homepage-mockup.webp",
    cardAlt:
      "Distinct Creative Group website mockup displayed on a tablet and mobile device",
    services: ["Web Design", "Web Development"],
    summary:
      "A polished marketing site focused on stronger positioning, clearer navigation, and more confident presentation.",
    featured: true,
    published: true,
  },
  {
    slug: "bravo-farms",
    title: "Bravo Farms",
    cardImage: "/images/work/Bravo-Mockup.webp",
    cardAlt: "Bravo Farms website mockup shown on desktop and tablet devices",
    services: ["Web Design", "Shopify Development"],
    summary:
      "An ecommerce refresh built to highlight Bravo Farms&apos; visual identity, giftable products, and destination appeal.",
    featured: true,
    published: true,
  },
  {
    slug: "ursa-major-global-tech",
    title: "Ursa Major Global Tech",
    cardImage: "/images/work/Mockup_UMGT_Website.png",
    cardAlt: "Ursa Major Global Tech brand and website mockup",
    services: ["Logo Design", "Branding", "Web Design", "Web Development"],
    summary:
      "A combined brand and website system that clarifies the company story and presents its technology work with authority.",
    featured: true,
    published: true,
  },
  {
    slug: "modern-campus-design-studio",
    title: "Modern Campus Design Studio",
    cardImage: "/images/work/design-studio.webp",
    cardAlt:
      "University website design and development mockup for Modern Campus Design Studio",
    services: ["Web Design", "Web Development"],
    summary:
      "A higher-education web engagement focused on clearer structure and a stronger institutional presence.",
    published: false,
  },
  {
    slug: "dc-marketing",
    title: "DC Marketing",
    cardImage: "/images/work/dc-marketing.webp",
    cardAlt:
      "DC Marketing branding mockup with logo studies and campaign artwork",
    services: ["Logo Design", "Branding"],
    summary:
      "Brand identity work designed to sharpen recognition and create a more cohesive visual system.",
    published: false,
  },
  {
    slug: "gasco-home-loans",
    title: "Gasco Home Loans",
    cardImage: "/images/work/gasco-mockup.png",
    cardAlt: "Gasco Home Loans website mockup displayed on tablet and phone",
    services: ["Web Design", "Web Development"],
    summary:
      "A mortgage-industry website refresh aimed at clarity, trust, and easier client action.",
    published: false,
  },
];

export const featuredCaseStudies = caseStudies.filter(study => study.featured);

export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find(study => study.slug === slug);
