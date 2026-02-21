import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const archiveSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  date: z.string(),
  locale: z.string().default('en'),
});

const cyclesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  locale: z.string().default('en'),
});

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'docs/*.md' }),
    archive: defineCollection({
      type: 'page',
      source: 'archive/*.md',
      schema: archiveSchema,
    }),
    cycles: defineCollection({
      type: 'data',
      source: 'cycles/*.json',
      schema: cyclesSchema,
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.mdx',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        locale: z.string().default('en'),
      }),
    }),
  },
});
