import { getCollection, defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docsMetaSchema = z.object({
  title: z.string(),
  date: z.number(),
  tags: z.array(z.string()),
  link: z.string().optional(),
});

const devlogCollection = defineCollection({
  loader: glob({ pattern: "data/**/*.md", base: "worklog" }),
  schema: docsMetaSchema,
});

// const notesCollection = defineCollection({
//   loader: glob({ pattern: "**/*.md", base: "notes" }),
//   schema: docsMetaSchema,
// });

const collections = {
  devlog: devlogCollection,
  // notes: notesCollection,
};
