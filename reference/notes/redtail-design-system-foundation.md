## RedTail Design System Foundation

### Extracted Palette

- `--white: white`
- `--black: black`
- `--grey: rgba(238, 238, 238, 0.93)`
- `--blackish: #101010`
- `--dark-red: #420000`
- `--primary-red: hsla(356.56050955414014, 63.56%, 48.43%, 1)`
- `--yellow: hsla(38.54014598540146, 83.03%, 67.65%, 1)`

The semantic tokens in `src/styles/_tokens.scss` now map directly back to this live-site palette. The only additional color values retained are opacity variants of these same colors for borders, muted text, selection, and layered UI states.

### Typography

- Headings use the existing Adobe font token `--font-heading` with a high-contrast editorial feel.
- Body, UI, and supporting text use `--font-body`, a condensed sans that better matches the live site’s compact uppercase styling.
- Hero headlines intentionally override the default serif heading treatment and stay in the condensed sans to match the homepage art direction.

### Spacing And Layout

- Containers are centered with a default width of `75rem`, plus narrow and wide variants for future section work.
- Sections now use semantic spacing tokens: `--section-space-sm`, `--section-space`, and `--section-space-lg`.
- Reusable section tone modifiers were added for light, dark, and muted bands so the site can preserve the live homepage’s alternating rhythm.

### Shared Primitives Added

- Reusable ruled heading pattern via `src/components/ui/Heading.astro`.
- Semantic section wrapper via `src/components/ui/Section.astro`.
- Container size variants via `src/components/ui/Container.astro`.
- General button, card, and form-control foundations in `src/styles/_utilities.scss`.

### Assumptions

- The palette values above were supplied from the live site and used directly.
- The live site appears to use the already embedded Adobe fonts, so the pass keeps those families and aligns the repo’s semantic tokens around them.
- Several downstream sections are still placeholders, so this pass focuses on the reusable foundation rather than full one-to-one section reconstruction.
