import { DEFAULT_LOCALE, REGEX_LOCALE_PATTERN } from "@/consts";
import type { ArchiveDocumentType } from "@/content.config";

// ============================================================================================

// ============================================================================================
export function parseDate(numdate: number | string): Date | null {
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

// ============================================================================================
/**
 * Logical group for document, merge information from different files
 */
// ============================================================================================

export interface ArchiveEntryGroup {
	slug: string;
	locales: Record<string, ArchiveDocumentType>;
}

export function getArchiveLocale(entry: ArchiveDocumentType): string {
	const match = entry.id.match(REGEX_LOCALE_PATTERN);
	return match ? match[1].toLowerCase() : DEFAULT_LOCALE;
}

export function getArchiveBaseSlug(entry: ArchiveDocumentType): string {
	return entry.id.replace(REGEX_LOCALE_PATTERN, "");
}

export function groupArchiveEntries(
	entries: readonly ArchiveDocumentType[],
): ArchiveEntryGroup[] {
	const groups = new Map<string, ArchiveEntryGroup>();

	for (const entry of entries) {
		const slug = getArchiveBaseSlug(entry);
		const locale = getArchiveLocale(entry);
		const group = groups.get(slug) ?? { slug, locales: {} };
		group.locales[locale] = entry;
		groups.set(slug, group);
	}

	return Array.from(groups.values());
}

export function parseAcceptLanguage(
	header: string | null | undefined,
): string[] {
	if (!header) return [];

	return header
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => part.split(";")[0]?.toLowerCase() ?? "")
		.filter(Boolean)
		.map((tag) => tag.split("-")[0]);
}

interface ResolveLocaleOptions {
	explicit?: string | null;
	preferred?: readonly string[];
	fallback?: string;
}

export function resolveLocale(
	available: readonly string[],
	options: ResolveLocaleOptions = {},
): string {
	const { explicit, preferred = [], fallback = DEFAULT_LOCALE } = options;

	if (explicit && available.includes(explicit)) {
		return explicit;
	}

	for (const locale of preferred) {
		if (available.includes(locale)) {
			return locale;
		}
	}

	if (available.includes(fallback)) {
		return fallback;
	}

	return available[0] ?? fallback;
}
