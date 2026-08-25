/**
 * JSON-LD (schema.org) builders.
 *
 * Every page emits a single `<script type="application/ld+json">` containing an
 * `@graph` of cross-referenced nodes. Nodes are linked by `@id` rather than
 * nested, so the Organization and WebSite are described once and referenced
 * everywhere — this is what lets search engines build one consistent entity for
 * the business instead of a new one per page.
 *
 * All URLs must be absolute. Relative URLs are invalid in JSON-LD, and the
 * `scripts/relativize-dist.mjs` build step only rewrites href/src/content
 * attributes, so absolute URLs inside the script tag survive the build intact.
 */

import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_EXPERTISE,
  SITE_LOCALE,
  SITE_LOGO_PATH,
  SITE_NAME,
  SITE_PROFILES,
} from "../data/site";
import type { CaseStudyMeta } from "../data/caseStudies";
import type { Offering } from "../data/services";
import { toAbsoluteUrl } from "./paths";

export type JsonLdNode = Record<string, unknown>;

type Site = URL | string;

/** A reference to another node in the graph. */
const ref = (id: string) => ({ "@id": id });

/** Stable `@id` values for the singleton nodes shared across every page. */
export const nodeIds = (site: Site) => {
  const root = toAbsoluteUrl("/", site);

  return {
    organization: `${root}#organization`,
    website: `${root}#website`,
    logo: `${root}#logo`,
  };
};

export const webPageId = (path: string, site: Site) =>
  `${toAbsoluteUrl(path, site)}#webpage`;

export const breadcrumbId = (path: string, site: Site) =>
  `${toAbsoluteUrl(path, site)}#breadcrumb`;

export const offerCatalogId = (site: Site) =>
  `${toAbsoluteUrl("/services/", site)}#catalog`;

export const caseStudyListId = (site: Site) =>
  `${toAbsoluteUrl("/case-studies/", site)}#list`;

/**
 * The business itself. `ProfessionalService` is a subtype of LocalBusiness (and
 * therefore Organization), which is the closest fit for a design studio with a
 * physical base that serves clients remotely.
 *
 * Deliberately omits `aggregateRating` and `review`: Google does not allow
 * self-serving reviews (a business publishing reviews of itself) to be marked up
 * for rich results, so the on-site testimonials must not be described here.
 */
export const buildOrganization = (site: Site): JsonLdNode => {
  const ids = nodeIds(site);

  return {
    "@type": "ProfessionalService",
    "@id": ids.organization,
    name: SITE_NAME,
    url: toAbsoluteUrl("/", site),
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    logo: {
      "@type": "ImageObject",
      "@id": ids.logo,
      url: toAbsoluteUrl(SITE_LOGO_PATH, site),
      caption: SITE_NAME,
    },
    image: ref(ids.logo),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      addressCountry: SITE_ADDRESS.country,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    knowsAbout: SITE_EXPERTISE,
    sameAs: SITE_PROFILES,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE_EMAIL,
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
  };
};

/** The site as a whole. No `SearchAction` — the site has no search feature. */
export const buildWebSite = (site: Site): JsonLdNode => {
  const ids = nodeIds(site);

  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: toAbsoluteUrl("/", site),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: ref(ids.organization),
    inLanguage: SITE_LOCALE,
  };
};

type WebPageOptions = {
  site: Site;
  path: string;
  name: string;
  description: string;
  imageUrl: string;
  /** WebPage subtype, e.g. CollectionPage, ContactPage, ItemPage. */
  type?: string;
  /** Set on the homepage so the site's primary entity is the business. */
  isHomePage?: boolean;
  hasBreadcrumb?: boolean;
  /** `@id` of the node this page primarily describes (e.g. a case study). */
  mainEntityId?: string;
};

export const buildWebPage = ({
  site,
  path,
  name,
  description,
  imageUrl,
  type = "WebPage",
  isHomePage = false,
  hasBreadcrumb = true,
  mainEntityId,
}: WebPageOptions): JsonLdNode => {
  const ids = nodeIds(site);

  return {
    "@type": type,
    "@id": webPageId(path, site),
    url: toAbsoluteUrl(path, site),
    name,
    description,
    isPartOf: ref(ids.website),
    about: ref(ids.organization),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    inLanguage: SITE_LOCALE,
    ...(isHomePage ? { mainEntity: ref(ids.organization) } : {}),
    ...(mainEntityId ? { mainEntity: ref(mainEntityId) } : {}),
    ...(hasBreadcrumb ? { breadcrumb: ref(breadcrumbId(path, site)) } : {}),
  };
};

export type BreadcrumbItem = { name: string; path: string };

export const buildBreadcrumbList = (
  items: BreadcrumbItem[],
  path: string,
  site: Site,
): JsonLdNode => ({
  "@type": "BreadcrumbList",
  "@id": breadcrumbId(path, site),
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path, site),
  })),
});

/**
 * The service catalog, sourced from the same data the Services page renders so
 * the markup can never drift from the visible content.
 */
export const buildOfferCatalog = (
  offerings: Offering[],
  site: Site,
): JsonLdNode => {
  const ids = nodeIds(site);

  return {
    "@type": "OfferCatalog",
    "@id": offerCatalogId(site),
    name: `${SITE_NAME} Offerings`,
    url: toAbsoluteUrl("/services/", site),
    provider: ref(ids.organization),
    itemListElement: offerings.map((offering, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: offering.title,
        description: offering.description,
        serviceType: offering.title,
        provider: ref(ids.organization),
        areaServed: "Worldwide",
        ...(offering.bullets?.length
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${offering.title} inclusions`,
                itemListElement: offering.bullets.map((bullet, i) => ({
                  "@type": "Offer",
                  position: i + 1,
                  itemOffered: { "@type": "Service", name: bullet },
                })),
              },
            }
          : {}),
      },
    })),
  };
};

/** An `ItemList` of published case studies, for the case studies index. */
export const buildCaseStudyList = (
  studies: CaseStudyMeta[],
  site: Site,
): JsonLdNode => ({
  "@type": "ItemList",
  "@id": caseStudyListId(site),
  name: `${SITE_NAME} Case Studies`,
  numberOfItems: studies.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: studies.map((study, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: study.title,
    url: toAbsoluteUrl(`/case-studies/${study.slug}/`, site),
  })),
});

export const caseStudyArticleId = (slug: string, site: Site) =>
  `${toAbsoluteUrl(`/case-studies/${slug}/`, site)}#article`;

type CaseStudyOptions = {
  site: Site;
  slug: string;
  title: string;
  description: string;
  summary?: string;
  services?: string[];
  client?: string;
  imageUrl: string;
  /** ISO 8601 date. Omitted when the publication date is unknown. */
  datePublished?: string;
};

/**
 * A case study as an `Article` about the client organization. `datePublished` is
 * only emitted when a real date is supplied — fabricating one would misrepresent
 * the content's freshness.
 */
export const buildCaseStudyArticle = ({
  site,
  slug,
  title,
  description,
  summary,
  services = [],
  client,
  imageUrl,
  datePublished,
}: CaseStudyOptions): JsonLdNode => {
  const ids = nodeIds(site);
  const path = `/case-studies/${slug}/`;

  return {
    "@type": "Article",
    "@id": caseStudyArticleId(slug, site),
    headline: `${title} Case Study`,
    name: title,
    description,
    ...(summary ? { abstract: summary } : {}),
    url: toAbsoluteUrl(path, site),
    mainEntityOfPage: ref(webPageId(path, site)),
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    author: ref(ids.organization),
    publisher: ref(ids.organization),
    isPartOf: ref(ids.website),
    inLanguage: SITE_LOCALE,
    ...(services.length ? { keywords: services } : {}),
    ...(client
      ? {
          about: {
            "@type": "Organization",
            name: client,
          },
        }
      : {}),
    ...(datePublished ? { datePublished } : {}),
  };
};

/**
 * Assembles the final graph. Nodes are deduplicated by `@id` so a page can pass
 * extra nodes without risking a duplicate Organization or WebSite.
 */
export const buildGraph = (nodes: JsonLdNode[]): JsonLdNode => {
  const seen = new Set<string>();
  const graph: JsonLdNode[] = [];

  for (const node of nodes) {
    const id = node["@id"];

    if (typeof id === "string") {
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
    }

    graph.push(node);
  }

  return { "@context": "https://schema.org", "@graph": graph };
};

/**
 * Serializes the graph for safe inlining. `<` is escaped so a stray `</script>`
 * in any content string cannot break out of the script element.
 */
export const serializeJsonLd = (graph: JsonLdNode) =>
  JSON.stringify(graph).replace(/</g, "\\u003c");
