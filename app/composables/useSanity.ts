import { createClient } from '@sanity/client';

export const useSanityClient = () => {
  return createClient({
    projectId: 'digital-decay',
    dataset: 'production',
    apiVersion: '2024-04-03',
    useCdn: true,
  });
};

const exampleAsyncReuest = () => {
  // useAsyncData for SSG and static
  useAsyncData('article', () => {
    return useSanityClient().fetch(
      `[_type =="article" && slug.current == $slug][0]`,
      { slut: useRoute().params.slug },
    );
  });
};

