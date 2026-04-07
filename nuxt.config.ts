import tailwindcss from '@tailwindcss/vite';
import { SITE_CONFIG, SOCIALS_CONFIG } from './config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui', // UI compatibility with TailwindCSS
    '@nuxt/fonts',         // custom fonts (Google Fonts)

    '@nuxt/content', // static content md/mdx/json, must be before sitemap

    '@nuxtjs/seo', //
    '@nuxtjs/sitemap', //
    '@nuxtjs/robots', //
    // '@nuxt/schema',        // TODO:
    '@nuxtjs/i18n', //
    '@nuxtjs/html-validator', //
    'nuxt-og-image', // Автоматическая генерация OG-изображений для соцсетей
    // '@nuxt/image',         // Оптимизация изображений (IPX, Cloudinary и др.)
    // '@nuxt/scripts',       // scripts (Google Tag Manager, Meta Pixel etc.)
    // '@unocss/nuxt',        // faster then tailwindcss
  ],

  // $production: {
  //   modules: [],
  //   experimental: {
  //     noVueServer: true,
  //   },
  // },
  $development: {
    modules: ['nuxt-studio', '@nuxt/devtools'],
  },
  $test: {
    modules: ['@nuxt/test-utils/module'],
    experimental: {
      componentIslands: true,
    },
  },
  experimental: {
    payloadExtraction: 'client',
  },

  appConfig: {
    SITE_CONFIG,
    SOCIALS_CONFIG,
  },
  runtimeConfig: {
    public: {
      googleSiteVerification: '',
      bingSiteVerification: '',
    },
  },

  app: {
    head: {
      title: SITE_CONFIG.title,
      htmlAttrs: {
        lang: SITE_CONFIG.defaultLocale,
        'data-theme': SITE_CONFIG.themes[0],
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Digital Decay / TakiMoysha / RSS',
          href: `${SITE_CONFIG.url}/rss.xml`,
        },
      ],
      meta: [
        { name: 'description', content: SITE_CONFIG.description },
        {
          name: 'google-site-verification',
          content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
        {
          name: 'msvalidate.01',
          content: process.env.NUXT_PUBLIC_BING_SITE_VERIFICATION,
        },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },
  site: {
    /* @nuxtjs/sitemap: ... */
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    title: SITE_CONFIG.title,
  },
  ogImage: { enabled: false },

  sitemap: {
    zeroRuntime: true, // when sitemap is generated on build
    include: [],
  },
  components: {
    dirs: [{ path: './app/components/', pathPrefix: false }],
  },
  vite: {
    // css: { lightningcss: {} }, // for unocss
    build: { modulePreload: { polyfill: false } },
    vue: { features: { optionsAPI: false } },
    clearScreen: true,
    plugins: [tailwindcss()],
  },

  content: {
    watch: { enabled: process.env.NODE_ENV === 'development' },
    build: {
      markdown: {
        rehypePlugins: {
          // https://github.com/remarkjs/remark
        },
        remarkPlugins: {
          // https://github.com/remarkjs/remark
        },
        highlight: {
          // supported themes: https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes
          theme: {
            default: 'github-light',
          },
        },
      },
    },
  },

  css: ['~/assets/styles/main.css'],
  ssr: false, // for github pages
  nitro: {
    preset: 'github-pages', // or static
    experimental: { tasks: true },
    future: { nativeSWR: true },
    // prerender: {
    //   crawlLinks: true,
    //   ignore: ['/__nuxt_content'],
    //   routes: ['/'],
    // },
    // hooks: {},
  },

  i18n: {
    baseUrl: SITE_CONFIG.url,
    locales: [
      { code: 'ru', iso: 'ru-RU', name: 'Русский' },
      { code: 'en', iso: 'en-US', name: 'English' },
    ],
    defaultLocale: SITE_CONFIG.defaultLocale,
    strategy: 'no_prefix',
  },

  htmlValidator: {
    failOnError: true,
  },

  // security: {
  //   headers: {
  //     crossOriginEmbedderPolicy: false,
  //   },
  // },

  // social: {
  //   networks: {
  //     linkedin: SOCIALS_CONFIG.linkedin,
  //     github: SOCIALS_CONFIG.github,
  //   },
  // },
});
