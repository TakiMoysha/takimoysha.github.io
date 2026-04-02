export default () => {
  const site = useAppConfig().SITE_CONFIG;

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

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: ldJson.value,
      },
    ],
  });
};
