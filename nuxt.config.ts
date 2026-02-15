// TODO: compress, mdx, sitemap
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://takimoysha.github.io';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  site: { url: SITE_URL },
  sitemap: {
    zeroRuntime: true, // when sitemap is generated on build
    urls: [
      {
        loc: SITE_URL,
        lastmod: new Date(),
      },
    ],
  },
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

  ssr: false, // TODO: try with 
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
});
