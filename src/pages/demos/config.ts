import { z, defineCollection } from "astro:content";

export type DocsMeta = z.infer<typeof docsMetaSchema>;
