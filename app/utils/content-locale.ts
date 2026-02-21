export const SUPPORTED_LOCALES = ['en', 'ru'] as const;
export const DEFAULT_LOCALE = 'en';

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface ParsedLocale {
  baseSlug: string;
  locale: SupportedLocale;
}

export function parseLocaleFromId(id: string): ParsedLocale {
  const match = id.match(/^(.+)\.(ru|en)$/);
  if (match) {
    return {
      baseSlug: match[1]!,
      locale: match[2]! as SupportedLocale,
    };
  }
  return {
    baseSlug: id,
    locale: DEFAULT_LOCALE,
  };
}

export function groupByLocale<T extends { id: string; locale?: string }>(
  items: T[],
): Map<string, Record<string, T>> {
  const groups = new Map<string, Record<string, T>>();

  for (const item of items) {
    const { baseSlug, locale } = parseLocaleFromId(item.id);
    if (!groups.has(baseSlug)) {
      groups.set(baseSlug, {});
    }
    groups.get(baseSlug)![locale] = item;
  }

  return groups;
}

export function getLocalizedEntry<T>(
  group: Record<string, T>,
  preferredLocale: string,
  fallbackLocale: string = DEFAULT_LOCALE,
): T | null {
  const entry =
    group[preferredLocale] ?? group[fallbackLocale] ?? Object.values(group)[0];
  return entry ?? null;
}
