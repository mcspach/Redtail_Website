/**
 * Canonical business facts for RedTail Web Design.
 *
 * Single source of truth for structured data (see src/utils/schema.ts) and any
 * future contact/footer markup. Keep values here in sync with the real listings
 * (Google Business Profile, social accounts) — search engines cross-check them.
 */

export const SITE_NAME = "RedTail Web Design";

export const SITE_DESCRIPTION =
  "Premium Web and Brand Design for Creatives and Entrepreneurs. Based in Clovis, California, serving clients worldwide.";

export const SITE_EMAIL = "matthew@redtailwebdesign.com";

export const SITE_LOCALE = "en-US";

/** Path to the primary logo asset, resolved to an absolute URL for JSON-LD. */
export const SITE_LOGO_PATH = "/images/graphics/Logo_Lockup_Red.svg";

/** Default Open Graph / social sharing image. */
export const SITE_SOCIAL_IMAGE_PATH = "/og_image.png";

/**
 * Business location. No street address is published on the site, so only the
 * locality/region/country are asserted here — do not invent a street address.
 */
export const SITE_ADDRESS = {
  locality: "Clovis",
  region: "CA",
  country: "US",
} as const;

/** Verified profiles, used for the Organization `sameAs` property. */
export const SITE_PROFILES = [
  "https://www.instagram.com/redtailwebdesign",
  "https://www.linkedin.com/company/redtail-web-design",
  "https://business.google.com/v/redtail-web-design/08067669138798226837/807c/_?",
];

/** Topics the business is an authority on, for Organization `knowsAbout`. */
export const SITE_EXPERTISE = [
  "Web Design",
  "Web Development",
  "Brand Design",
  "Visual Identity",
  "Logo Design",
  "Ecommerce Development",
  "Shopify Development",
  "Website Audits",
  "Search Engine Optimization",
];
