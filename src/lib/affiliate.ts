// Amazon search links with an Associates tag. Search links (rather than single products)
// stay valid when a listing disappears and let the visitor pick a brand available locally.

/** e.g. affiliateUrl("www.amazon.es", "mechas para velas", "mytag-21") */
export function affiliateUrl(domain: string, query: string, tag: string): string {
  const url = new URL(`https://${domain}/s`);
  url.searchParams.set("k", query);
  url.searchParams.set("tag", tag);
  return url.href;
}
