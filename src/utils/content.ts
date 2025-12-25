import { BLOG_COLLECTION_NAME } from "@/constants";
import type { BlogDocType } from "@/content.config";
import { getCollection } from "astro:content";

export async function getBlogCollection(
	opts: { sort?: boolean } = { sort: true },
): Promise<BlogDocType[]> {
	const data: BlogDocType[] = await getCollection(BLOG_COLLECTION_NAME);

	let result: BlogDocType[] = data.filter(
		(doc: BlogDocType) => !doc.data.draft,
	);

	if (opts.sort === true) {
		result = result.sort(
			(a: BlogDocType, b: BlogDocType) =>
				b.data.date.getTime() - a.data.date.getTime(),
		);
	}

	return result;
}
