import tailwindcss from '@tailwindcss/vite';
import { SITE_CONFIG, SOCIALS_CONFIG } from './config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/i18n',
    '@nuxtjs/html-validator',
    'nuxt-og-image',
  ],

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
    payloadExtraction: true,
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
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },

  content: {
    experimental: {
      // native = встроенный node:sqlite (Node >= 22.5 / bun).
      // better-sqlite3 не используем: его нативный бинарник собран под другой ABI
      // и падает с "module did not self-register" после обновления Node.
      sqliteConnector: 'native',
    },
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
          langs: ['toml', 'rust', 'scheme', 'bash'],
        },
      },
    },
  },

  css: ['~/assets/styles/main.css'],
  // full-static SSG для github pages: страницы рендерятся в HTML на этапе build,
  // это нужно и для schema.org (иначе warning "schema.org with SSR disabled")
  ssr: true,
  nitro: {
    preset: 'github-pages', // or static
    experimental: { tasks: true },
    future: { nativeSWR: true },
    prerender: {
      // rss.xml — server route, краулер сам её не находит надёжно
      routes: ['/rss.xml'],
    },
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
    options: {
      rules: {
        // reka-ui (NuxtUI) рендерит порталы поповеров только на клиенте,
        // в статическом HTML id-ссылки селектов всегда "висящие"
        'no-missing-references': 'off',
        // NuxtUI/reka виджеты — div-ы с ARIA-ролями, это ок
        'prefer-native-element': 'off',
        // shiki подсветка кода инжектит <style> прямо в поток контента
        'element-permitted-content': 'off',
        // GFM-таблицы из markdown не умеют scope у th
        'wcag/h63': 'off',
        // уровни заголовков в авторском markdown — не блокируем сборку
        'heading-level': 'warn',
      },
    },
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
