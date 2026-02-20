import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://takimoysha.github.io';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',        // Улучшенные регулярки в Markdown
    '@nuxtjs/i18n',           //
    // 'nuxt-og-image',       // Автоматическая генерация OG-изображений для соцсетей
    // '@nuxt/image',         // Оптимизация изображений (IPX, Cloudinary и др.)
    '@nuxtjs/html-validator', // static content md/mdx/json
    // '@nuxt/fonts',         // custom fonts (Google Fonts)
    // '@nuxt/scripts',       // scripts (Google Tag Manager, Meta Pixel etc.)
    // '@unocss/nuxt',        // faster then tailwindcss
    // '@nuxt/schema',        // TODO: wip
    '@nuxt/content',          //
    '@nuxt/ui',               //
    '@nuxtjs/robots',         //
    'nuxt-studio',            //
  ],

  $production: {
    modules: ['nuxt-security'],
    experimental: {
      noVueServer: true,
    },
  },
  $test: {
    modules: ['@nuxt/test-utils/module'],
    experimental: {
      componentIslands: true,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en-US' },
      title: 'Digital Decay',
    },
    pageTransition: false,
    layoutTransition: false,
  },

  site: { url: SITE_URL },
  sitemap: {
    zeroRuntime: true, // when sitemap is generated on build
  },
  components: {
    dirs: [{ path: './app/components/', pathPrefix: false }],
  },
  vite: {
    // css: { lightningcss: {} }, // for unocss
    build: { modulePreload: { polyfill: false } },
    vue: { features: { optionsAPI: false } },
    clearScreen: true,
    plugins: [
      // @ts-expect-error: different versions of "Plugin" under nuxt and tailwindss
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      googleSiteVerification: '',
      bingSiteVerification: '',
    },
  },

  content: {
    watch: { enabled: false },
    build: {
      markdown: {
        highlight: { theme: 'tokyo-night', langs: ['js', 'json', 'python'] },
      },
    },
  },

  css: ['~/assets/styles/main.css'],
  ssr: false, // for github pages
  nitro: {
    experimental: { tasks: true },
    future: { nativeSWR: true },
    prerender: {
      crawlLinks: true,
      ignore: ['/__nuxt_content'],
      routes: ['/'],
    },
    hooks: {},
    preset: 'static',
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский' },
    ],
    defaultLocale: 'en',
  },

  htmlValidator: {
    failOnError: true,
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
    },
  },

  social: {
    networks: {
      linkedin: { identifier: 'takimoysha.arpa' },
      github: { identifier: 'takimoysha.arpa' },
    },
  },
});
