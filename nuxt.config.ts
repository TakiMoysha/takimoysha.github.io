import tailwindcss from '@tailwindcss/vite';

const SITE_CONFIG = {
  title: 'Digital Decay',
  author: 'TakiMoysha',
  description: 'Blog posts and notes about development and technology.',
  themes: ['dark', 'light', 'halloween', 'biopunk'] as Array<string>,
  contentThemes: [
    'github-light',
    'github-dark',
    'monokai',
    'monokai',
  ] as Array<string>,
  url: 'https://takimoysha.github.io',
};

const SOCIALS_CONFIG = {
  github: {
    href: 'https://github.com/takimoysha',
    icon: 'lucide:github',
    linkTitle: 'GitHub',
  },
  linkedin: {
    href: 'https://linkedin.com/in/takimoysha',
    icon: 'lucide:linkedin',
    linkTitle: 'LinkedIn',
  },
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/seo', //
    // '@nuxtjs/sitemap', // TODO: migration to nuxt/seo
    // '@nuxtjs/robots', // TODO: migration to nuxt/seo
    // '@nuxt/schema',        // TODO: migration to nuxt/seo
    '@nuxtjs/i18n', //
    '@nuxtjs/html-validator', //
    // 'nuxt-og-image',       // Автоматическая генерация OG-изображений для соцсетей
    // '@nuxt/image',         // Оптимизация изображений (IPX, Cloudinary и др.)
    // '@nuxt/fonts',         // custom fonts (Google Fonts)
    // '@nuxt/scripts',       // scripts (Google Tag Manager, Meta Pixel etc.)
    // '@unocss/nuxt',        // faster then tailwindcss
    '@nuxt/content', // static content md/mdx/json
    '@nuxt/ui', //
  ],

  $production: {
    modules: ['nuxt-security'],
    experimental: {
      noVueServer: true,
    },
  },
  $development: {
    modules: ['nuxt-studio'],
  },
  $test: {
    modules: ['@nuxt/test-utils/module'],
    experimental: {
      componentIslands: true,
    },
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
      htmlAttrs: { lang: 'en-US', 'data-theme': SITE_CONFIG.themes[0] },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Digital Decay / TakiMoysha / RSS',
          href: `${SITE_CONFIG.url}/feed.xml`,
        },
      ],
      meta: [
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
    /* not working properly */
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    title: SITE_CONFIG.title,
  },
  ogImage: { enabled: false },

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

  content: {
    watch: { enabled: process.env.NODE_ENV === 'development' },
    build: {
      markdown: {
        highlight: {
          // supported themes: https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes
          theme: {
            default: 'github-light',
            dark: 'catppuccin-mocha',
            light: 'github-dark',
            halloween: 'monokai',
            biopunk: 'monokai',
          },
          langs: [
            'python',
            'js',
            'ts',
            'json',
            'yaml',
            'html',
            'md',
            'mermaid',
            'plsql',
          ],
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
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
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
      linkedin: SOCIALS_CONFIG.linkedin,
      github: SOCIALS_CONFIG.github,
    },
  },
});
