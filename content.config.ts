import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const archiveSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  date: z.string(),
});

const cyclesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});


export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'content/docs/*' }),
    archive: defineCollection({
      type: 'page',
      source: 'content/archive/*.md',
      schema: archiveSchema,
    }),
    cycles: defineCollection({
      type: 'data',
      source: 'content/cycles/*.json',
      schema: cyclesSchema,
    }),
    projects: defineCollection({
      type: 'page',
      source: 'content/projects/*.mdx',
    }),
  },
});
