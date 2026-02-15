// TODO: compress, mdx, sitemap
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxtjs/feed'],
  components: {
    dirs: [{ path: './app/components/', pathPrefix: false }],
  },
  vite: {
    clearScreen: true,
    plugins: [
      // @ts-expect-error type mismath between tailwindcss and vite
      tailwindcss(),
    ],
  },

  ssr: false,
  css: ['./app/assets/styles/global.css'],
  nitro: {
    preset: 'static',
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский' },
    ],
    defaultLocale: 'en',
  },
  feed: [
    {
      path: '/feed.xml',
      async create(feed) { },
      cacheTime: 1000 * 60 * 24,
      type: 'rss2',
      data: ['Archive'],
    },
  ],
});
