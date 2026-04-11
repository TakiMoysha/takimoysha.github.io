import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { defineSitemapSchema } from '@nuxtjs/sitemap/content';
import { SITE_CONFIG } from './config';

const stackInformation = {
  /* core libraries and it versions */
};
const remarkText = {
  /* some remark about note */
};

const archiveMultilanguage = {
  archive: defineCollection({
    type: 'page',
    source: 'archive/**/*.md',
    schema: z.object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      zerolinks: z.array(z.string()).default([]),
      date: z.string(),
      locale: z.string().default(SITE_CONFIG.defaultLocale),
      draft: z.boolean().default(false),
      sitemap: defineSitemapSchema(),
    }),
    indexes: [
      { columns: ['slug'] },
      { columns: ['date'] },
      { columns: ['tags'] },
    ],
  }),
};

export default defineContentConfig({
  collections: {
    ...archiveMultilanguage,
    docs: defineCollection({ type: 'page', source: 'docs/*.md' }),
    series: defineCollection({
      type: 'data',
      source: 'series/**/manifest.json',
      schema: z.object({
        version: z.string(),
        content: z.record(z.any()).optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/index.mdx',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        locale: z.string().default(SITE_CONFIG.defaultLocale),
        draft: z.boolean().default(false),
        sitemap: defineSitemapSchema(),
      }),
    }),
  },
});
