# AGENTS.md

## Project Overview

This repo is an Astro rebuild of an existing Webflow site. redtailwebdesign.com

The goal is to migrate fully off Webflow while preserving the current site’s visual design, layout, content structure, and behavior as closely as possible.

This is a static marketing site intended for deployment to GitHub Pages.

## Primary Goals

- Rebuild the Webflow site in Astro.
- Match the existing Webflow site visually and structurally.
- Keep the site static-compatible.
- Keep the codebase clean, component-driven, and maintainable.
- Avoid unnecessary dependencies.
- Prepare for future editing improvements, but do not add a CMS yet.

## Tech Stack

Use:

- Astro
- SCSS
- JavaScript only where needed
- GSAP later, only for matching existing interactions
- Adobe Fonts via embed code
- GitHub Pages for deployment later

Do not use:

- Bootstrap
- Tailwind
- React unless explicitly requested
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
