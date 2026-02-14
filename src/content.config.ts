import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import slugify from "slugify";
import { parseDate } from "@/lib/content";

const docsMetaSchema = z.object({
	title: z.string(),
	date: z.number().transform((val, ctx) => {
		const res = parseDate(val);

		if (res) return res;

		if (ctx) {
			ctx.addIssue({
				code: "custom",
				message: `Invalid date format: ${val}`,
			});
		}
		return new Date();
	}),
	slug: z
		.string()
		.optional()
		.transform((val, ctx) => {
			if (val) return val;
			return slugify(String(ctx.path), {
				lower: true,
				strict: true,
				trim: true,
			});
		}),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]),
	draft: z.boolean().default(false),
});

export type DocsMeta = z.infer<typeof docsMetaSchema>;

const ALL_CONTENT_FILE = "**/*.{md,mdx}";

export const archiveCollection = defineCollection({
	loader: glob({ pattern: ALL_CONTENT_FILE, base: "content/archive" }),
	schema: docsMetaSchema,
});
export const projectsCollection = defineCollection({
	loader: glob({ pattern: ALL_CONTENT_FILE, base: "content/projects" }),
	schema: docsMetaSchema,
});

// const ROOT_CONTENT_FILES = "/**/index.{md,mdx,html}";
// const cycles = defineCollection({
// 	loader: glob({ pattern: ROOT_CONTENT_FILES, base: "content/cycles" }),
// 	schema: docsMetaSchema,
// });

export const hytaleCollection = defineCollection({
	loader: file("content/cycles/hytale.json"),
});

export const collections = {
	archive: archiveCollection,
	projects: projectsCollection,
};

export type ArchiveDocumentType =
	import("astro:content").CollectionEntry<"archive">;
export type ProjectDocumentType =
	import("astro:content").CollectionEntry<"projects">;
