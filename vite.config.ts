import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "16x16.png",
        "32x32.png",
        "48x48.png",
        "152x152.png",
        "167x167.png",
        "180x180.png",
        "192x192.png",
        "512x512.png",
      ],
      manifest: {
        name: "Sajilo Quiz Master",
        short_name: "Sajilo Quiz",
        description: "Premium Quiz Application by Sajilo Digital",
        theme_color: "#0a0a0f",
        background_color: "#0a0a0f",
        display: "standalone",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
