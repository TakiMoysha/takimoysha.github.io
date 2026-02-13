import { expect, test, describe } from "bun:test";
import { parseDate } from "./content.ts";

describe("document parsing", () => {
	test("should parse string to date", () => {
		let res = parseDate("20230101");
	});

	test("should parse number to date", () => {
		let res = parseDate(20230101);
	});
});


describe("content:loading", () => {
	test("should group documents regardless of locales", () => {
		let filenames = ["sql.en.mdx", "sql.ru.mdx"];

	})
})

// export interface ArchiveEntryGroup {
// 	slug: string;
// 	locales: Record<string, ArchiveDocumentType>;
// }
//
// export function getArchiveLocale(entry: ArchiveDocumentType): string {
// 	const match = entry.id.match(REGEX_LOCALE_PATTERN);
// 	return match ? match[1].toLowerCase() : DEFAULT_LOCALE;
// }
//
// export function getArchiveBaseSlug(entry: ArchiveDocumentType): string {
// 	return entry.id.replace(REGEX_LOCALE_PATTERN, "");
// }
//
// export function groupArchiveEntries(
// 	entries: readonly ArchiveDocumentType[],
// ): ArchiveEntryGroup[] {
// 	const groups = new Map<string, ArchiveEntryGroup>();
//
// 	for (const entry of entries) {
// 		const slug = getArchiveBaseSlug(entry);
// 		const locale = getArchiveLocale(entry);
// 		const group = groups.get(slug) ?? { slug, locales: {} };
// 		group.locales[locale] = entry;
// 		groups.set(slug, group);
// 	}
//
// 	return Array.from(groups.values());
// }
//
// export function parseAcceptLanguage(
// 	header: string | null | undefined,
// ): string[] {
// 	if (!header) return [];
//
// 	return header
// 		.split(",")
// 		.map((part) => part.trim())
// 		.filter(Boolean)
// 		.map((part) => part.split(";")[0]?.toLowerCase() ?? "")
// 		.filter(Boolean)
// 		.map((tag) => tag.split("-")[0]);
// }
//
// interface ResolveLocaleOptions {
// 	explicit?: string | null;
// 	preferred?: readonly string[];
// 	fallback?: string;
// }
//
// export function resolveLocale(
// 	available: readonly string[],
// 	options: ResolveLocaleOptions = {},
// ): string {
// 	const { explicit, preferred = [], fallback = DEFAULT_LOCALE } = options;
//
// 	if (explicit && available.includes(explicit)) {
// 		return explicit;
// 	}
//
// 	for (const locale of preferred) {
// 		if (available.includes(locale)) {
// 			return locale;
// 		}
// 	}
//
// 	if (available.includes(fallback)) {
// 		return fallback;
// 	}
//
// 	return available[0] ?? fallback;
// }
