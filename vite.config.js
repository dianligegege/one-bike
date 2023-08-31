import { fileURLToPath, URL } from 'node:url'
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    mkcert({
      force: true,
      autoUpgrade: true,
    }),
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'One Bike',
        short_name: 'one bike',
        description: 'one app for all bike',
        theme_color: '#ffffff',
        display: 'fullscreen',
        icons: [
          {
            src: 'icon.png',
            sizes: '150x150',
            type: 'image/png'
          },
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    https: true,
  }
})
