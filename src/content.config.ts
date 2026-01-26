import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import slugify from "slugify";
import { parseDate } from "@/lib/content";


const slugOptions = { lower: true, strict: true, trim: true } as const;

const normalizeSlug = (value?: string | undefined) => {
	if (!value) return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? slugify(trimmed, slugOptions) : undefined;
};

const docsMetaSchema = z.object({
	title: z.string(),
	date: z.number().transform((val, ctx) => {
		let res = parseDate(val);

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
			return (
				normalizeSlug(val ?? undefined) ??
				slugify(String(ctx.path), slugOptions)
			);
		}),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]),
	draft: z.boolean().default(false),
});

export type DocsMeta = z.infer<typeof docsMetaSchema>;

const ALL_CONTENT_FILE = "./**/[^_]*.{md,mdx,html}";
const ROOT_CONTENT_FILES = "./[^_]*.{md,mdx,html}";

const archive = defineCollection({
	loader: glob({ pattern: ALL_CONTENT_FILE, base: "content/archive" }),
	schema: docsMetaSchema,
});
const projects = defineCollection({
	loader: glob({ pattern: ALL_CONTENT_FILE, base: "content/projects" }),
	schema: docsMetaSchema,
});

const cycles = defineCollection({
	loader: glob({ pattern: ROOT_CONTENT_FILES, base: "content/cycles" }),
	schema: docsMetaSchema,
});


export const collections = { archive, projects, cycles };

export type ArchiveDocumentType = import("astro:content").CollectionEntry<"archive">;
