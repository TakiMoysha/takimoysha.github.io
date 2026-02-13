import { getCollection } from "astro:content";
import { BLOG_COLLECTION_NAME } from "./consts";
import type { ArchiveDocumentType } from "./content.config";

export async function getBlogCollection(
	opts: { sort: boolean } = { sort: true },
): Promise<ArchiveDocumentType[]> {
	let data: ArchiveDocumentType[] = await getCollection(
		BLOG_COLLECTION_NAME,
		({ data }) => !data?.draft,
	);

	if (opts.sort === true) {
		data = data.sort(
			(a: ArchiveDocumentType, b: ArchiveDocumentType) =>
				b.data.date.getTime() - a.data.date.getTime(),
		);
	}

	return data;
}
