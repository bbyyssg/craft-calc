// Single place to change branding, domain and monetization settings.

export const SITE = {
  name: "Calculadora Tejer",
  url: import.meta.env.SITE as string, // set in astro.config.mjs (SITE_URL env var overrides)
  lastReviewed: "2026-10-21", // date formulas and sources were last checked
  // Google AdSense publisher ID, e.g. "ca-pub-1234567890123456". Empty = no ads rendered.
  adsenseClient: "",
  contactEmail: "", // shown on the About page when set
};

// Amazon Associates. Each marketplace needs its own Associates account and tracking tag
// (e.g. "mytag-21" for amazon.es). Empty tag = that store is hidden; no tags = no affiliate box.
export const AFFILIATE_STORES: Record<"es" | "pt", { domain: string; label: string; tag: string }[]> = {
  es: [
    { domain: "www.amazon.es", label: "Amazon España", tag: "" },
    { domain: "www.amazon.com.mx", label: "Amazon México", tag: "" },
  ],
  pt: [{ domain: "www.amazon.com.br", label: "Amazon Brasil", tag: "" }],
};

export type Lang = "es" | "pt";
export const LANGS: Lang[] = ["es", "pt"];
export const HTML_LANG: Record<Lang, string> = { es: "es", pt: "pt-BR" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_ES", pt: "pt_BR" };

export type ToolKey = "distribute" | "circle" | "gauge" | "candle" | "candleCost";
export type PageKey = "home" | "about" | "privacy" | ToolKey;

// Localized slugs: each language gets URLs in its own words (better for search).
export const PAGES: Record<PageKey, Record<Lang, string>> = {
  home: { es: "/es/", pt: "/pt/" },
  about: { es: "/es/acerca-de/", pt: "/pt/sobre/" },
  privacy: { es: "/es/privacidad/", pt: "/pt/privacidade/" },
  distribute: { es: "/es/calculadora-aumentos-disminuciones/", pt: "/pt/calculadora-aumentos-diminuicoes/" },
  circle: { es: "/es/calculadora-circulo-ganchillo/", pt: "/pt/calculadora-circulo-croche/" },
  gauge: { es: "/es/calculadora-muestra-tejido/", pt: "/pt/calculadora-amostra-trico/" },
  candle: { es: "/es/calculadora-velas-fragancia/", pt: "/pt/calculadora-velas-essencia/" },
  candleCost: { es: "/es/calculadora-costo-velas/", pt: "/pt/calculadora-custo-velas/" },
};

export const TOOLS: ToolKey[] = ["distribute", "circle", "gauge", "candle", "candleCost"];

// Path prefix when served from a sub-folder (e.g. GitHub Pages project site); "" on a custom domain.
export const BASE = (import.meta.env.BASE_URL as string).replace(/\/$/, "");

/** Site-relative URL for a file in public/, e.g. asset("/favicon.svg"). */
export function asset(path: string): string {
  return BASE + path;
}

export function pagePath(lang: Lang, key: PageKey): string {
  return BASE + PAGES[key][lang];
}
