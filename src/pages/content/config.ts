import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const numdateToDate = (numdate: String) => {
  let date = `${numdate.slice(0, 4)}-${numdate.slice(4, 6)}-${numdate.slice(6, 8)}`;

  if (numdate.length === 12) {
    date += `T${numdate.slice(8, 10)}:${numdate.slice(10, 12)}`;
  }

  return new Date(date);
};

const docsMetaSchema = z.object({
  title: z.string(),
  date: z.string().transform(numdateToDate),
  tags: z.array(z.string()),
  link: z.string().optional(),
});

export type DocsMeta = z.infer<typeof docsMetaSchema>;

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "blog" }),
  schema: docsMetaSchema,
});

export const collections = {
  blog: blogCollection,
};
