# AGENTS.md

## Project Overview

This repo is an Astro site -  it was originally migrated off a previous build on Webflow. 

This is a static marketing site intended for deployment to GitHub Pages.

## Primary Goals

- Build the site in Astro.
- Keep the site static-compatible.
- Keep the codebase clean, component-driven, and maintainable.
- Avoid unnecessary dependencies.
- Prepare for future editing improvements, but do not add a CMS yet.

## Tech Stack

Use:

- Astro
- SCSS
- JavaScript only where needed
- GSAP sparingly
- Adobe Fonts via embed code
- GitHub Pages for deployment 

Do not use:

- Bootstrap
- Tailwind
- React
- Vue/Svelte/etc.
- Contentful or any CMS
- Server-side rendering
- Random third-party UI kits

## Project Structure

Expected structure:

```text
public/
  images/
  fonts/
  icons/

src/
  components/
    ui/
    sections/
  content/
  layouts/
  pages/
  scripts/
  styles/

reference/
  notes/
  screenshots/
  html/
```

## Helpful Skills

Reach for these before improvising. The first two are personal installs in
`~/.claude/skills/` — they are not committed to this repo, so another machine or
a CI run may not have them.

### Installed locally

- **`google-form-native`** — the contact form's whole architecture. This site is
  static with no backend, so [ContactForm.astro](src/components/sections/ContactForm.astro)
  is a hand-built form POSTing straight to a Google Form's `formResponse`
  endpoint, with Google Sheets as the inbox. Use it for any change to that form,
  to add a second form elsewhere, or to pull `entry.*` field IDs out of a Google
  Form. It ships an extractor script and — more importantly — documents the
  silent-failure traps. The big one: the hidden sink iframe's `load` event fires
  whether Google accepted the POST or rejected it, so a field that's required in
  Google Forms but optional in the HTML shows the visitor a success message and
  writes nothing to the sheet. Read `references/gotchas.md` before touching field
  names or required flags. `ContactForm-backup.astro` is the old iframe embed,
  kept as a fallback; delete it once the native form has proven itself.

- **`impeccable`** — frontend design and UX work: visual hierarchy, spacing,
  typography, color, motion, accessibility, responsive behavior, UX copy, empty
  and error states. This is a brand-led marketing site where the design *is* the
  product, so use it for section layout and polish rather than eyeballing CSS.
  It respects existing design tokens — point it at
  [src/styles/](src/styles/) so it extends the system instead of inventing a
  parallel one.

### Built in

- **`run`** — launch the dev server and actually look at a change. Prefer this
  over declaring visual or animation work done from the source alone. GSAP
  timings and scroll behavior in particular cannot be verified by reading code.

- **`code-review`** — bug-hunting pass over the current diff. Worth running
  before any commit that touches the inline `<script>` blocks, since Astro
  type-checks those at build time and DOM null-guards are easy to miss.

- **`simplify`** — quality-only pass for reuse and duplication. Useful against
  [_utilities.scss](src/styles/_utilities.scss), which has grown large enough
  that new rules often duplicate existing ones.

- **`security-review`** — narrow value here, since the site is static. The one
  real attack surface is the public, unauthenticated Google Forms endpoint;
  `google-form-native`'s gotchas file already covers that and its escalation
  path, so reach for this only if a change adds a genuinely new surface.

Skip `dataviz` (no charts on this site) and the `artifact-*` skills (those are
for publishing shareable pages, not for site work).
