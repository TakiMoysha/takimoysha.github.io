import { describe, expect, test } from 'vitest';
import { parseDate } from '~/utils/content';
import {
  DEFAULT_LOCALE,
  getLocalizedEntry,
  groupByLocale,
  parseLocaleFromId,
  SUPPORTED_LOCALES,
} from '~/utils/content-locale';

describe('locale constants', () => {
  test('should have correct default locale', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  test('should have supported locales defined', () => {
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('ru');
    expect(SUPPORTED_LOCALES).toHaveLength(2);
  });
});

describe('locale parsing', () => {
  test('should parse locale from id with ru suffix', () => {
    const result = parseLocaleFromId('post.ru');
    expect(result.baseSlug).toBe('post');
    expect(result.locale).toBe('ru');
  });

  test('should parse locale from id with en suffix', () => {
    const result = parseLocaleFromId('article.en');
    expect(result.baseSlug).toBe('article');
    expect(result.locale).toBe('en');
  });

  test('should return default locale for id without suffix', () => {
    const result = parseLocaleFromId('simple');
    expect(result.baseSlug).toBe('simple');
    expect(result.locale).toBe('en');
  });

  test('should handle complex slugs with dots', () => {
    const result = parseLocaleFromId('my.post.en');
    expect(result.baseSlug).toBe('my.post');
    expect(result.locale).toBe('en');
  });

  test('should handle path-like ids', () => {
    const result = parseLocaleFromId('archive/my-post.ru');
    expect(result.baseSlug).toBe('archive/my-post');
    expect(result.locale).toBe('ru');
  });

  test('should handle ids with multiple dots', () => {
    const result = parseLocaleFromId('doc.v2.ru');
    expect(result.baseSlug).toBe('doc.v2');
    expect(result.locale).toBe('ru');
  });
});

  test('should parse number to date', () => {
    const res = parseDate(20230101);
    expect(res).toBeInstanceOf(Date);
  });
});

describe('locale parsing', () => {
  test('should parse locale from id with ru suffix', () => {
    const result = parseLocaleFromId('post.ru');
    expect(result.baseSlug).toBe('post');
    expect(result.locale).toBe('ru');
  });

  test('should parse locale from id with en suffix', () => {
    const result = parseLocaleFromId('article.en');
    expect(result.baseSlug).toBe('article');
    expect(result.locale).toBe('en');
  });

  test('should return default locale for id without suffix', () => {
    const result = parseLocaleFromId('simple');
    expect(result.baseSlug).toBe('simple');
    expect(result.locale).toBe('en');
  });
});

describe('locale grouping', () => {
  const items = [
    { id: 'post.en', title: 'English Post' },
    { id: 'post.ru', title: 'Russian Post' },
    { id: 'article.en', title: 'Article' },
  ];

  test('should group items by base slug', () => {
    const groups = groupByLocale(items);
    expect(groups.size).toBe(2);
    expect(groups.get('post')?.en?.title).toBe('English Post');
    expect(groups.get('post')?.ru?.title).toBe('Russian Post');
  });
});

describe('localized entry selection', () => {
  const group = {
    en: { id: 'test.en', title: 'English' },
    ru: { id: 'test.ru', title: 'Russian' },
  };

  test('should return preferred locale entry', () => {
    const entry = getLocalizedEntry(group, 'ru', 'en');
    expect(entry?.title).toBe('Russian');
  });

  test('should fallback to default locale', () => {
    const entry = getLocalizedEntry({ en: group.en }, 'ru', 'en');
    expect(entry?.title).toBe('English');
  });
});
