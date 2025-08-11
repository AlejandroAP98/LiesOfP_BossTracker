import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', "sounds/piano.mp3"],
      manifest: {
        id: '/',
        name:'Lies of P Boss Tracker',
        short_name: 'Lies of P Tracker',
        description: 'Lleva el seguimiento de los jefes de Lies of P',
        theme_color: '#261B25',
        background_color: '#261B25',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
        {
            urlPattern: /\/sounds\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'custom-cache'
            }
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  }
})
