import { expect, test, describe } from "bun:test";
import { parseDate } from "./content.ts";
import type { ArchiveDocumentType } from "@/content.config.ts";
import { REGEX_LOCALE_PATTERN } from "@/consts.ts";

describe("document parsing", () => {
	test("should parse string to date", () => {
		let res = parseDate("20230101");
	});

	test("should parse number to date", () => {
		let res = parseDate(20230101);
	});
});

/**
 * Logical group for document, merge information from different files
 * slug identifies a file, only the base menu is built.
 * File extensions, locale and built-in parameters are metadata by which files are grouped.
 */
interface EntryGroup {
	slug: string;
	locales: Record<string, ArchiveDocumentType>;
}

describe("content:grouping", () => {
	test("should loading files as EntryGroup", () => {
		const filenames = ["sql.en.mdx", "sql.ru.mdx", "index.md", "index.mdx"];

		const groups: Map<string, EntryGroup> = new Map();

		const addEntryGroup = (group: EntryGroup) => {
			const existing = groups.get(group.slug);
			if (existing) {
				existing.locales = {
					...existing.locales,
					...group.locales,
				};
			} else {
				groups.set(group.slug, group);
			}
		};

		filenames.forEach((fn) => {
			// let locale = fn.match(REGEX_LOCALE_PATTERN);
			const _filename = fn.split(".");

			// WARN: astro:content does not support tests

			console.log(groups);
		});
	});
});

// export function getArchiveLocale(entry: ArchiveDocumentType): string {
// 	const match = entry.id.match(REGEX_LOCALE_PATTERN);
// 	return match ? match[1].toLowerCase() : DEFAULT_LOCALE;
// }

// export function getArchiveBaseSlug(entry: ArchiveDocumentType): string {
// 	return entry.id.replace(REGEX_LOCALE_PATTERN, "");
// }

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
