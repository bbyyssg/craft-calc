import { SITE, HTML_LANG, type Lang } from "../site";

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "");

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: stripTags(item.a) },
    })),
  };
}

export function toolJsonLd(lang: Lang, path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: new URL(path, SITE.url).href,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    inLanguage: HTML_LANG[lang],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
