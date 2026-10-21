// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Production domain by default. The GitHub Pages workflow overrides both values while the
// site is served from https://<user>.github.io/<repo>/ (see .github/workflows/deploy.yml).
export default defineConfig({
  site: process.env.SITE_URL || "https://calculadoratejer.com",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  integrations: [
    sitemap({
      i18n: { defaultLocale: "es", locales: { es: "es", pt: "pt-BR" } },
    }),
  ],
});
