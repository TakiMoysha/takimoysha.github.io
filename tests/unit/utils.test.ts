import { describe, expect, test } from 'vitest';
import { parseDate } from './content';
import {
  getLocalizedEntry,
  groupByLocale,
  parseLocaleFromId,
} from './content-locale';

describe('document parsing', () => {
  test('should parse string to date', () => {
    const res = parseDate('20230101');
    expect(res).toBeInstanceOf(Date);
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
