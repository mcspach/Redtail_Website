import { defineConfig } from 'astro/config';

// Replace REPOSITORY_NAME with the GitHub Pages repository name before deploy.
// For a user/organization pages site, set base to '/'.
export default defineConfig({
  output: 'static',
  base: '/REPOSITORY_NAME/'
});
