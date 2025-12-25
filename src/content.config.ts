import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import slugify from "slugify";

const CONTENT_FILE_PATTERN = "**/[^_]*.{md,mdx,html}";
const CONTENT_FILE_REPLACE_PATTERN = "/\.(md|mdx|html)$/i";

const formatDate = (numdate: Number | String) => {
  numdate = String(numdate);

  let date = `${numdate.slice(0, 4)}-${numdate.slice(4, 6)}-${numdate.slice(6, 8)}`;

  if (numdate.length === 12) {
    date += `T${numdate.slice(8, 10)}:${numdate.slice(10, 12)}`;
  }

  return new Date(date);
  // return date
};

const slugifyPath = (slug: String, ctx: z.RefinementCtx) => {
  if (slug) return slug;

  if (ctx.path instanceof String) {
    const filePath = ctx.path
      .split("/")
      .pop()
      ?.replace(CONTENT_FILE_REPLACE_PATTERN, "");

    if (!filePath) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `invalid path conversion result: ${ctx.path}=>${filePath}`,
      });
      return;
    }

    return slugify(filePath, { lower: true });
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: `unsupported path type<number>: ${ctx.path}`,
  });
  return;
};

const docsMetaSchema = z.object({
  title: z.string(),
  date: z.number().transform(formatDate),
  slug: z.string().transform(slugifyPath),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type DocsMeta = z.infer<typeof docsMetaSchema>;

const blog = defineCollection({
  loader: glob({ pattern: CONTENT_FILE_PATTERN, base: "content" }),
  schema: docsMetaSchema,
});

export const collections = { blog };

export type BlogDocType = import("astro:content").CollectionEntry<"blog">;
