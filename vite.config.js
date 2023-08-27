import { fileURLToPath, URL } from 'node:url'
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate', // 注册更新模式方式  默认是autoUpdate，将会自动更新，其他还有prompt和skipWaiting
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto', // 控制如何在应用程序中注册ServiceWorker 默认值是 'auto' ，其他如：'inline' 则是注入一个简单的注册脚本，内联在应用程序入口点中
      manifest: { // manifest.json 文件配置
        name: 'qborfy study website',
        short_name: 'qborfyStudy',
        description: 'qborfy study website',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/icon.png',
            sizes: '144x144',
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
