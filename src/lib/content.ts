import { BLOG_COLLECTION_NAME } from "@/consts";
import type { ArchiveDocumentType } from "@/content.config";
import { getCollection } from "astro:content";

interface IOptions {
	sort?: boolean;
}
const DefaultOptions = { sort: true };

export async function getBlogCollection(
	opts: IOptions = DefaultOptions,
): Promise<ArchiveDocumentType[]> {
	const data: ArchiveDocumentType[] = await getCollection(BLOG_COLLECTION_NAME);

	let result: ArchiveDocumentType[] = data.filter(
		(doc: ArchiveDocumentType) => !doc.data.draft,
	);

	if (opts.sort === true) {
		result = result.sort(
			(a: ArchiveDocumentType, b: ArchiveDocumentType) =>
				b.data.date.getTime() - a.data.date.getTime(),
		);
	}

	return result;
}

export function parseDate(numdate: Number | String): Date | null {
	if (typeof numdate === "number") numdate = String(numdate);

	if (typeof numdate === "string") {
		let date = `${numdate.slice(0, 4)}-${numdate.slice(4, 6)}-${numdate.slice(6, 8)}`;

		if (numdate.length === 12) {
			date += `T${numdate.slice(8, 10)}:${numdate.slice(10, 12)}`;
		}

		return new Date(date);
	}

	return null;
}
