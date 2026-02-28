import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'docs/*.md' }),
    archive: defineCollection({
      type: 'page',
      source: 'archive/**/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
        date: z.string(),
        locale: z.string().default('en'),
        draft: z.boolean().default(false),
      }),
      indexes: [{ columns: ['slug', 'date', 'tags'] }],
    }),
    cycles: defineCollection({
      type: 'data',
      source: 'cycles/**/manifest.json',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        locale: z.string().default('en'),
        spec: z.object({}).default({}),
        draft: z.boolean().default(false),
      }),
      indexes: [],
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/index.mdx',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        locale: z.string().default('en'),
        draft: z.boolean().default(false),
      }),
    }),
  },
});
