<script setup lang="ts">
const site = useAppConfig().SITE_CONFIG;
const socials = useAppConfig().SOCIALS_CONFIG;

const ldJson = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.author,
    url: site.url,
    // sameAs: Object.values(socials).map((social) => social.href),
    // potentialAction: {
    //   '@type': 'SearchAction',
    //   target: `${site.url}/archive/search?q={search_string}`,
    //   'query-input': 'required query=search_string',
    // },
  }),
);

// useSeoMeta({
// title: props.title ?? site.title,
// description: props.description ?? site.description,
// ogTitle: props.title ?? site.title,
// ogDescription: props.description ?? site.description,
// ogImage: props.imageURL,
// twitterTitle: props.title ?? site.title,
// twitterDescription: props.description ?? site.description,
// twitterImage: props.imageURL,
// });
</script>
