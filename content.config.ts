import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const archiveMultilanguage = {
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
  archive_ru: defineCollection({
    type: 'page',
    source: 'archive/**/*.ru.md',
    schema: z.object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      date: z.string(),
      locale: z.string().default('ru'),
      draft: z.boolean().default(false),
    }),
    indexes: [{ columns: ['slug', 'date', 'tags'] }],
  }),
  archive_en: defineCollection({
    type: 'page',
    source: 'archive/**/*.en.md',
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
};

export default defineContentConfig({
  collections: {
    ...archiveMultilanguage,
    docs: defineCollection({ type: 'page', source: 'docs/*.md' }),
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
