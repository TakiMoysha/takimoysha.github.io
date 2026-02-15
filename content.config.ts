import { defineCollection, defineContentConfig } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    archive: defineCollection({ type: 'page', source: "content/archive/*"}),
    cycles: defineCollection({ type: 'page', source: "content/cycles/*"}),
    docs: defineCollection({ type: 'page', source: "content/docs/*"}),
    projects: defineCollection({ type: 'page', source: "content/projects/*"})
  },
});
