<template>
  <html :lang="lang" />
  <Link rel="canonical" :href="canonicalURL" />
  <Title>{{ title }}</Title>
  <Meta name="description" :content="description" />

  <!-- OpenGraph -->
  <Meta property="og:title" :content="title" />
  <Meta property="og:description" :content="description" />
  <Meta property="og:url" :content="canonicalURL" />
  <Meta property="og:locale" :content="lang" />
  <Meta property="og:type" content="website" />
  <Meta property="og:site_name" content="TakiMoysha" />
  <template v-if="imageURL">
    <Meta property="og:image" :content="imageURL" />
    <Meta property="og:image:width" content="1200" />
    <Meta property="og:image:height" content="630" />
  </template>

  <!-- Twitter / X -->
  <template v-if="imageURL">
    <Meta property="twitter:card" content="summary_large_image" />
    <Meta property="twitter:image" :content="imageURL" />
  </template>
  <Meta property="twitter:url" :content="canonicalURL" />
  <Meta property="twitter:title" :content="title" />
  <Meta property="twitter:description" :content="description" />

  <!-- Language alternates -->
  <Link v-if="lang === 'en'" rel="alternate" hreflang="ru" :href="`${siteUrl}/ru/`" />
  <Link v-if="lang === 'ru'" rel="alternate" hreflang="en" :href="`${siteUrl}/en/`" />

  <!-- Sitemap -->
  <Link rel="sitemap" href="/sitemap.xml" />

  <!-- RSS Feed -->
  <Link rel="alternate" type="application/rss+xml" title="TakiMoysha RSS Feed" :href="`${siteUrl}/feed.xml`" />

  <!-- third-party metadata -->
  <Meta name="google-site-verification" :content="googleSiteVerification" />
  <Meta name="msvalidate.01" :content="bingSiteVerification" />

  <!-- Schema.org JSON-LD -->
  <Script type="application/ld+json" v-html="ldJson" />
</template>

<script setup lang="ts">
import { SITE } from '@/consts'

interface Props {
  title: string
  lang?: 'en' | 'ru'
  description?: string
  url?: string
  author?: string
  canonicalURL?: string
  imageURL?: string
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'en',
  title: SITE.title,
  description: SITE.description || '',
})

const route = useRoute()
const siteUrl = useRuntimeConfig().public.siteUrl || 'https://takimoysha.github.io'

const canonicalURL = computed(() => {
  return props.canonicalURL || `${siteUrl}${route.path}`
})

const googleSiteVerification = useRuntimeConfig().public.googleSiteVerification || ''
const bingSiteVerification = useRuntimeConfig().public.bingSiteVerification || ''

const ldJson = computed(() => {
  const json = {
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
      'query-input': 'required query=search_string'
    }
  }
  return JSON.stringify(json)
})

// useSeoMeta({
//   title: props.title,
//   description: props.description,
//   ogTitle: props.title,
//   ogDescription: props.description,
//   ogImage: props.imageURL,
//   twitterTitle: props.title,
//   twitterDescription: props.description,
//   twitterImage: props.imageURL
// })
</script>
