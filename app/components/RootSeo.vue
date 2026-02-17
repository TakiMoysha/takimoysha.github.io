<script setup lang="ts">
import { SITE } from '@/consts';

interface Props {
  title?: string;
  lang?: 'en-US' | 'ru-RU';
  description?: string;
  author?: string;
  canonicalURL?: string;
  imageURL?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: SITE.title,
  description: SITE.description,
  lang: 'en-US',
});

const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;
const googleSiteVerification = useRuntimeConfig().public.googleSiteVerification;
const bingSiteVerification = useRuntimeConfig().public.bingSiteVerification;

const canonicalURL = computed(
  () => props.canonicalURL ?? `${siteUrl}${route.path}`,
);

const ldJson = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: props.author,
    url: siteUrl,
    sameAs: [
      'https://github.com/takimoysha',
      'https://linkedin.com/in/takimoysha',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog/search?q={search_string}`,
      'query-input': 'required query=search_string',
    },
  }),
);

useHead({
  htmlAttrs: { lang: props.lang },
  link: [
    { rel: 'canonical', href: canonicalURL.value },
    { rel: 'sitemap', href: '/sitemap.xml' },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Digital Decay / TakiMoysha / RSS',
      href: `${siteUrl}/feed.xml`,
    },
  ],
  meta: [
    { name: 'google-site-verification', content: googleSiteVerification },
    { name: 'msvalidate.01', content: bingSiteVerification },
  ],
  script: [{ type: 'application/ld+json', innerHTML: ldJson.value }],
});

useSeoMeta({
  title: props.title,
  description: props.description,
  ogTitle: props.title,
  ogDescription: props.description,
  ogImage: props.imageURL,
  twitterTitle: props.title,
  twitterDescription: props.description,
  twitterImage: props.imageURL,
});
</script>

<template>
  <!-- SEO meta tags are managed by useHead and useSeoMeta composables -->
</template>
