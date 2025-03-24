import rss, { rssSchema } from "@astrojs/rss";
import { getCollection, defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docsMetaSchema = z.object({
  title: z.string(),
  date: z.number(),
  tags: z.array(z.string()),
});

const devlogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "devlog" }),
  schema: docsMetaSchema,
});
const notesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "notes" }),
  schema: docsMetaSchema,
});

const tags = ["<language>en-us</language>", "<language>ru</language>"];

const toItem = (doc) => ({
  title: doc.data.title,
  date: doc.data.date,
  tags: doc.data.tags,
  link: `/content/${doc.slug}`,
});

export const collections = {
  devlog: devlogCollection,
  notes: notesCollection,
};
