import type { Collections } from '@nuxt/content';
import { getLocalizedEntry, parseLocaleFromId } from '~/utils/content-locale';

const DEFAULT_LOCALE = 'en';

interface EntryGroup<T> {
  slug: string;
  locales: string[];
  entries: Record<string, T>;
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

  async function getList(): Promise<LocalizedEntry<any>[]> {
    const items = await queryCollection(collection).all();

    const grouped = new Map<string, Record<string, any>>();

    for (const item of items) {
      const id = String(item.id || item.path || item._path);
      const { baseSlug, locale } = parseLocaleFromId(id);

      if (!grouped.has(baseSlug)) {
        grouped.set(baseSlug, {});
      }
      grouped.get(baseSlug)![locale] = item;
    }

    const currentLocale = unref(i18n.locale) ?? DEFAULT_LOCALE;
    const fallbackLocale = unref(i18n.defaultLocale) ?? DEFAULT_LOCALE;

    return Array.from(grouped.entries()).map(([slug, entries]) => ({
      slug,
      entry: getLocalizedEntry(entries, currentLocale, fallbackLocale),
      locales: Object.keys(entries),
    }));
  }

  async function getBySlug(slug: string): Promise<any | null> {
    const items = await queryCollection(collection)
      .where('_path', 'LIKE', `%${slug}%`)
      .all();

    if (!items.length) return null;

    const grouped: Record<string, any> = {};
    for (const item of items) {
      const id = String(item.id || item.path || item._path);
      const { baseSlug, locale } = parseLocaleFromId(id);
      if (baseSlug === slug || baseSlug.endsWith(slug)) {
        grouped[locale] = item;
      }
    }

    const currentLocale = unref(i18n.locale) ?? DEFAULT_LOCALE;
    const fallbackLocale = unref(i18n.defaultLocale) ?? DEFAULT_LOCALE;

    return getLocalizedEntry(grouped, currentLocale, fallbackLocale);
  }

  return {
    getList,
    getBySlug,
  };
}
