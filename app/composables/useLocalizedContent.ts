import type { Collections } from '@nuxt/content';
import {
  DEFAULT_LOCALE,
  getLocalizedEntry,
  groupByLocale,
} from '~/utils/content-locale';

interface EntryGroup<T> {
  baseSlug: string;
  locales: Record<string, T>;
}

interface LocalizedEntry<T> {
  slug: string;
  entry: T;
  locales: string[];
}

export function useLocalizedContent<C extends keyof Collections>(
  collection: C,
) {
  const i18n = useI18n();

  async function getGrouped(): Promise<Map<string, EntryGroup<any>>> {
    const items = await queryCollection(collection).all();
    const groups = groupByLocale(items);

    const result = new Map<string, EntryGroup<any>>();
    for (const [baseSlug, locales] of groups) {
      result.set(baseSlug, { baseSlug, locales });
    }

    return result;
  }

  async function getBySlug(slug: string): Promise<any | null> {
    const groups = await getGrouped();
    const group = groups.get(slug);
    if (!group) return null;

    const currentLocale = unref(i18n.locale);
    const fallbackLocale = unref(i18n.defaultLocale) ?? DEFAULT_LOCALE;

    return getLocalizedEntry(group.locales, currentLocale, fallbackLocale);
  }

  async function getList(): Promise<LocalizedEntry<any>[]> {
    const groups = await getGrouped();
    const currentLocale = unref(i18n.locale);
    const fallbackLocale = unref(i18n.defaultLocale) ?? DEFAULT_LOCALE;

    return Array.from(groups.values()).map((g) => ({
      slug: g.baseSlug,
      entry: getLocalizedEntry(g.locales, currentLocale, fallbackLocale),
      locales: Object.keys(g.locales),
    }));
  }

  return {
    getGrouped,
    getBySlug,
    getList,
  };
}
