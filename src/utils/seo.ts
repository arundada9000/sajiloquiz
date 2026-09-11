import { useEffect } from "react";
import { site } from "../config/site";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  schema?: Record<string, unknown>;
};

// Lightweight SEO helper for a hash-routed SPA. Sets the document title,
// description and Open Graph tags so shared links render correctly, and
// injects JSON-LD structured data for the page.
export function useSeo({
  title,
  description,
  path,
  type = "website",
  schema,
}: SeoOptions) {
  useEffect(() => {
    const url = `${site.url}/#${path}`;
    document.title = title;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", site.name);
    setMeta("property", "og:url", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    document.querySelectorAll("script[data-json-ld]").forEach((el) => el.remove());
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = url;
    document.head.appendChild(link);

    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.jsonLd = "true";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.querySelectorAll("link[rel='canonical']").forEach((el) => el.remove());
      document.querySelectorAll("script[data-json-ld]").forEach((el) => el.remove());
    };
  }, [title, description, path, type, schema]);
}