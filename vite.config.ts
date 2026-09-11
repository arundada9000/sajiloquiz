import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { site, pwaShortcuts } from "./src/config/site";

// Tint value used across manifest/meta. RGB string -> hex.
const themeHex = site.manifest.themeColor;
const bgHex = site.manifest.backgroundColor;

const ldSoftware = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.author.url,
      email: site.author.email,
      telephone: site.author.phone,
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
    },
  },
  null,
  2,
);

const ldFaq = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Sajilo Quiz need an internet connection?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It is an installable Progressive Web App. Once loaded, the whole quiz, including your questions, images and sounds, runs offline. That is exactly why it was built: quiz venues often have unreliable internet.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add my own questions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the Admin Panel from the home screen. You can create questions and rounds, attach images and audio, and everything is saved in your browser on your device.",
        },
      },
      {
        "@type": "Question",
        name: "Is my quiz data uploaded anywhere?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Questions, scores and settings live in your browser's local storage on your own device. Nothing you create is sent to a server.",
        },
      },
      {
        "@type": "Question",
        name: "Is Sajilo Quiz free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, completely free. It was built for real quiz competitions and is shared so anyone can run a smooth quiz event with it.",
        },
      },
    ],
  },
  null,
  2,
);

const ldOrg = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    url: site.companyUrl,
    email: site.author.email,
    telephone: site.author.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Horizon Chowk",
      addressLocality: "Butwal",
      addressRegion: "Lumbini",
      postalCode: "32900",
      addressCountry: "NP",
    },
    geo: { "@type": "GeoCoordinates", latitude: 27.683, longitude: 83.45 },
    sameAs: Object.values(site.social),
  },
  null,
  2,
);

// Inject meta/JSON-LD tokens at build time AND emit robots.txt + sitemap.xml so
// the live site is always driven by src/config/site.ts (single source of truth).
function htmlInject(): Plugin {
  return {
    name: "sajilo-html-inject",
    transformIndexHtml(html) {
      return html
        .replaceAll("__SITE_TITLE__", `${site.name} - ${site.tagline}`)
        .replaceAll("__SITE_NAME__", site.name)
        .replaceAll("__SITE_DESCRIPTION__", site.description)
        .replaceAll("__SITE_AUTHOR__", site.author.name)
        .replaceAll("__SITE_URL__", site.url)
        .replaceAll("__SITE_THEME_COLOR__", themeHex)
        .replaceAll("__SITE_BG_COLOR__", bgHex)
        .replaceAll("__SITE_LOCALE__", site.companyLocale)
        .replaceAll("__SITE_REGION__", site.companyRegion)
        .replace("__LD_SOFTWARE__", ldSoftware)
        .replace("__LD_FAQ__", ldFaq)
        .replace("__LD_ORG__", ldOrg);
    },
    generateBundle() {
      const base = `${site.url}`;
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>
  <url><loc>${base}/#/admin</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>
  <url><loc>${base}/#/privacy</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>
  <url><loc>${base}/#/terms</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></url>
</urlset>
`;
      const robots = `# Allow all search engines
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${base}/sitemap.xml
`;
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: robots,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: sitemap,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    htmlInject(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/logo-favicon.png", "icons/logo-192.png", "icons/logo-512.png", "og-image.png", "robots.txt", "sitemap.xml"],
      manifest: {
        id: `${site.url}/`,
        name: site.name,
        short_name: site.shortName,
        description: site.description,
      theme_color: themeHex,
      background_color: bgHex,
      display: "standalone",
      orientation: "any",
      categories: ["education", "entertainment", "games"],
      lang: "en",
      start_url: "/",
      scope: "/",
      icons: [
        { src: "icons/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "icons/logo-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: "icons/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "icons/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      shortcuts: pwaShortcuts as never,
    },
    workbox: {
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/api\//, /^\/__\//],
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
      ],
    },
  }),
  ],
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "framer-motion"],
          lucide: ["lucide-react"],
        },
      },
    },
  },
});
