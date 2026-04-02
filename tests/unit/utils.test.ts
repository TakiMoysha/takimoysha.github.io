import { describe, expect, test } from 'vitest';
import { parseDate } from '@/utils/content';

describe('document parsing', () => {
  test('should parse string to date', () => {
    const res = parseDate('20230101');
    console.log(res);
    expect(res).toBeInstanceOf(Date);
  });

  test('should parse number to date', () => {
    const dataset = [202109151046, 20230101, '2026-01-05T14:16'];
    dataset.forEach((element) => {
      const res = parseDate(element);
      console.log(res);
      expect(res).toBeInstanceOf(Date);
    });
  });
});
