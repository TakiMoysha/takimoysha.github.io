<script setup lang="ts">
interface Props {
  title?: string;
  lang?: 'en-US' | 'ru-RU';
  description?: string;
  author?: string;
  imageURL?: string;
}

const props = defineProps<Props>();
const route = useRoute();

const site = useAppConfig().SITE_CONFIG;
const socials = useAppConfig().SOCIALS_CONFIG;
console.log(socials);

const googleSiteVerification = useRuntimeConfig().public.googleSiteVerification;
const bingSiteVerification = useRuntimeConfig().public.bingSiteVerification;

const canonicalURL = computed(() => `${site.url}${route.path}`);

const ldJson = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: props.author,
    url: site.url,
    sameAs: Object.values(socials).map((social) => social.href),
    // potentialAction: {
    //   '@type': 'SearchAction',
    //   target: `${site.url}/archive/search?q={search_string}`,
    //   'query-input': 'required query=search_string',
    // },
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
      href: `${site.url}/feed.xml`,
    },
  ],
  meta: [
    { name: 'google-site-verification', content: googleSiteVerification },
    { name: 'msvalidate.01', content: bingSiteVerification },
  ],
  script: [{ type: 'application/ld+json', innerHTML: ldJson.value }],
});

useSeoMeta({
  title: props.title ?? site.title,
  description: props.description ?? site.description,
  ogTitle: props.title ?? site.title,
  ogDescription: props.description ?? site.description,
  ogImage: props.imageURL,
  twitterTitle: props.title ?? site.title,
  twitterDescription: props.description ?? site.description,
  twitterImage: props.imageURL,
});
</script>
