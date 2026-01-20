import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.png", "192x192.png", "512x512.png"],
            manifest: {
                name: "Sajilo Quiz",
                short_name: "Sajilo Quiz",
                description: "Premium Quiz Application by Sajilo Digital",
                theme_color: "#0a0a0f",
                background_color: "#0a0a0f",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                ],
            },
        }),
    ],
});
