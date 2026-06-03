import { defineConfig } from "astro/config";

const site = process.env.SITE_URL || "https://www.redtailwebdesign.com";

export default defineConfig({
  site,
  output: "static",
});
