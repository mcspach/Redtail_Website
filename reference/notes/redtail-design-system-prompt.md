## RedTail Design System Extraction Prompt

Use this prompt when you want an implementation pass that pulls the main design system from the live RedTail site into this Astro repo.

```md
You are working inside the `redtail-website` Astro repo. Your job is not to redesign the site. Your job is to extract and implement the main design system from `https://www.redtailwebdesign.com/` into this codebase so the rest of the rebuild can reuse consistent tokens, base styles, and UI primitives.

Context:
- This repo is an Astro rebuild of the existing Webflow site.
- Match the current live site visually and structurally as closely as practical.
- Keep everything static-compatible.
- Use Astro + SCSS only. Add JavaScript only if a design-system-level interaction absolutely requires it.
- Do not add Tailwind, Bootstrap, React, Vue, CMS tooling, or extra UI libraries.
- Adobe Fonts are already embedded in `src/layouts/BaseLayout.astro`.
- Use the local full-page reference screenshot at `reference/screenshots/Screenshot - RedTail Web Design - Home`.

What to study first:
1. Inspect the live homepage at `https://www.redtailwebdesign.com/`.
2. Compare it against the local screenshot in `reference/screenshots/`.
3. Read the current repo structure, especially:
   - `src/styles/_tokens.scss`
   - `src/styles/_base.scss`
   - `src/styles/global.scss`
   - `src/layouts/BaseLayout.astro`
   - `src/components/ui/`
   - `src/components/sections/`

Primary goal:
Extract the site’s main design system and implement it as reusable foundations in this repo. Focus on the shared visual language, not on rebuilding every section from scratch in the same pass.

Design characteristics to preserve:
- Strong alternation between off-white and near-black section backgrounds.
- Warm red-to-orange primary accent used in hero typography and brand moments.
- Muted gold/yellow CTA color used for buttons and highlights.
- High-contrast editorial feel with serif display headings and condensed sans-serif supporting text.
- Oversized uppercase hero messaging with tight line-height.
- Thin divider rules with centered section titles.
- Card-based content blocks with dark surfaces, subtle borders, and restrained radius.
- Spacious vertical rhythm with deliberate section framing.
- Subtle texture/grain and faint line-art background motifs where appropriate.
- Premium agency aesthetic, not a generic SaaS style.

Your tasks:
1. Audit the live site and identify the core design tokens:
   - brand colors
   - background/surface colors
   - text colors
   - border/rule colors
   - font families
   - font scale
   - spacing scale
   - container widths
   - radii
   - shadows or surface treatments
2. Convert those findings into semantic CSS custom properties in `src/styles/_tokens.scss`.
3. Update `src/styles/_base.scss` and `src/styles/global.scss` so the global site foundation reflects the live site:
   - body background and text color
   - heading styles
   - paragraph defaults
   - link behavior
   - section spacing
   - container behavior
   - form field styling
   - shared card styling
4. Align or create shared UI primitives in `src/components/ui/` for recurring patterns:
   - primary CTA button
   - secondary button if needed
   - section heading with divider lines
   - section wrapper / container helpers
5. If existing component names or tokens are misleading, refactor them carefully without breaking the current Astro structure.
6. Keep the result maintainable and component-driven. Prefer semantic naming like `--color-accent`, `--color-surface-dark`, `--section-space-lg`, etc.

Implementation rules:
- Preserve the RedTail visual language. Do not “improve” it into a different brand system.
- Do not introduce a trendy redesign, glassmorphism, soft gradients, or generic startup polish.
- Reuse the existing Adobe font setup if it matches the live site. If the live site appears to use the already embedded Typekit families, keep them and wire them correctly into tokens.
- Prefer a small, coherent set of tokens over a bloated one-off token dump.
- Use SCSS and CSS custom properties. Keep styles readable and centralized.
- Keep section-level visuals compatible with the current components in `src/components/sections/`.
- Avoid changing copy unless needed for structural cleanup.
- Do not add dependencies.

Expected deliverables:
- Updated `src/styles/_tokens.scss`
- Updated `src/styles/_base.scss`
- Updated `src/styles/global.scss` if needed
- Updated or added shared primitives in `src/components/ui/`
- A short note in `reference/notes/` summarizing:
  - the extracted palette
  - typography choices
  - spacing/layout rules
  - any assumptions where the live site was ambiguous

Acceptance criteria:
- The repo has a clear reusable design-system layer derived from the live site.
- Shared styles support the hero, case studies, testimonial, contact, service cards, and footer/social sections without inventing a different brand language.
- Tokens and primitives are reusable for the rest of the Webflow-to-Astro migration.
- The visual result feels recognizably like `redtailwebdesign.com`.

Before finishing:
- Verify the build still works.
- Call out any areas where exact values were inferred from the screenshot rather than directly inspectable from the live DOM.
```

## Notes From Review

These cues came directly from the live homepage and the local full-page screenshot:

- Typography appears to rely on a serif display face for headings and a condensed sans for body and UI text.
- The dominant palette is off-white, charcoal/near-black, saturated red-orange, and muted gold.
- The main reusable patterns are alternating light/dark bands, thin ruled section headers, dark cards, boxed form controls, framed social tiles, and compact CTA buttons.
- The site feels editorial and brand-forward. The extraction pass should preserve that tension rather than smooth it into a generic marketing-site system.
