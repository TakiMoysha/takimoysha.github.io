export default () => {
  const googleSiteVerification =useRuntimeConfig().public.googleSiteVerification;
  const bingSiteVerification = useRuntimeConfig().public.bingSiteVerification;
  useHead({
    meta: [
      { name: 'google-site-verification', content: googleSiteVerification },
      { name: 'msvalidate.01', content: bingSiteVerification },
    ],
  });
};
