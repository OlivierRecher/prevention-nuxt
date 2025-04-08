import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
  nitro: {
    preset: 'vercel',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Alcoolytics',
      short_name: 'Alcoolytics',
      description: 'Application pour suivre facilement et efficacement votre consommation d\'alcool durant une soirée, un apéro, un repas. Vous obtiendrez une estimation rapide de votre taux d\'alcoolémie.',
      lang: 'fr',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#efb100',
      icons: [
        {
          src: '/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
    },
    client: {
      installPrompt: true,
    },
  },
  app: {
    head: {
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Alcoolytics' },
      ],
    },
  }
})
