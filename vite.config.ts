import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icon.svg'],
            manifest: {
                name: 'Sajilo Quiz Master',
                short_name: 'Sajilo Quiz',
                description: 'Premium Quiz Application by Sajilo Digital',
                theme_color: '#0a0a0f',
                background_color: '#0a0a0f',
                display: 'standalone',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
})
