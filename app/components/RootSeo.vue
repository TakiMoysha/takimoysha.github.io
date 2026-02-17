<template>
  <html :lang="lang" />
  <link rel="canonical" :href="canonicalURL" />

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
import { SITE } from "@/consts";

interface Props {
  title: string;
  lang?: "en-US" | "ru-RU";
  description?: string;
  url?: string;
  author?: string;
  canonicalURL?: string;
  imageURL?: string;
}

const props = withDefaults(defineProps<Props>(), {
  lang: "en-US",
  title: SITE.title,
  description: SITE.description || "",
});

const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;

const canonicalURL = computed(() => {
  return props.canonicalURL || `${siteUrl}${route.path}`;
});

const googleSiteVerification = useRuntimeConfig().public.googleSiteVerification;
const bingSiteVerification = useRuntimeConfig().public.bingSiteVerification;

const ldJson = computed(() => {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: props.author,
    url: siteUrl,
    sameAs: [
      "https://github.com/takimoysha",
      "https://linkedin.com/in/takimoysha",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog/search?q={search_string}`,
      "query-input": "required query=search_string",
    },
  };
  return JSON.stringify(json);
});

// <link v-if="lang === 'en-US'" rel="alternate" hreflang="ru" :href="`${siteUrl}/ru/`" />
useHead({
  title: props.title,
  meta: [],
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
