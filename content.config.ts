import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const cyclesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'content/docs/*' }),
    archive: defineCollection({ type: 'page', source: 'content/archive/*.md' }),
    cycles: defineCollection({
      type: 'page',
      source: 'content/cycles/*.json',
      schema: cyclesSchema,
    }),
    projects: defineCollection({
      type: 'page',
      source: 'content/projects/*.mdx',
    }),
  },
});
