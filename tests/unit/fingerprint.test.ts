import { describe, expect, test } from 'vitest';
import {
  EMPTY,
  NOT_FROM_JS,
  SERVER_ONLY,
  fnv1aHex,
  formatBytes,
  formatUtcOffset,
  hashComponents,
  isUnavailableValue,
} from '@/utils/fingerprint';

describe('fnv1aHex', () => {
  test('matches the reference vectors for the 32 bit FNV-1a', () => {
    expect(fnv1aHex('')).toBe('811c9dc5');
    expect(fnv1aHex('hello')).toBe('4f9f2cab');
  });

  test('always returns a zero padded 8 char hash', () => {
    expect(fnv1aHex('a')).toMatch(/^[0-9a-f]{8}$/);
    expect(fnv1aHex('Digital Decay')).toMatch(/^[0-9a-f]{8}$/);
  });

  test('is sensitive to a single character change', () => {
    expect(fnv1aHex('chromium')).not.toBe(fnv1aHex('chromiuM'));
  });
});

describe('hashComponents', () => {
  test('does not depend on the insertion order', () => {
    const a = { userAgent: 'ua', screen: '1920×1080', cores: 8 };
    const b = { cores: 8, screen: '1920×1080', userAgent: 'ua' };
    expect(hashComponents(a)).toBe(hashComponents(b));
  });

  test('treats an array the same as a joined string', () => {
    expect(hashComponents({ languages: ['en', 'ru'] })).toBe(
      hashComponents({ languages: 'en,ru' }),
    );
  });

  test('keeps missing values stable instead of throwing', () => {
    const expected = hashComponents({ deviceMemory: '', timezone: '' });
    expect(hashComponents({ deviceMemory: undefined, timezone: null })).toBe(expected);
  });

  test('changes when any signal changes', () => {
    const base = { renderer: 'GPU A', canvas: 'abc' };
    expect(hashComponents({ ...base, canvas: 'abd' })).not.toBe(hashComponents(base));
  });
});

describe('formatBytes', () => {
  test('formats the closest unit with one decimal', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1.0 MB');
    expect(formatBytes(5 * 1024 ** 4)).toBe('5.0 TB');
  });

  test('falls back to a dash for impossible input', () => {
    expect(formatBytes(-1)).toBe(EMPTY);
    expect(formatBytes(Number.NaN)).toBe(EMPTY);
  });
});

describe('formatUtcOffset', () => {
  test('converts getTimezoneOffset() minutes into a UTC label', () => {
    expect(formatUtcOffset(0)).toBe('UTC+00:00');
    expect(formatUtcOffset(-330)).toBe('UTC+05:30');
    expect(formatUtcOffset(300)).toBe('UTC-05:00');
    expect(formatUtcOffset(-180)).toBe('UTC+03:00');
  });
});

describe('isUnavailableValue', () => {
  test('marks placeholders instead of real readings', () => {
    expect(isUnavailableValue(NOT_FROM_JS)).toBe(true);
    expect(isUnavailableValue(SERVER_ONLY)).toBe(true);
    expect(isUnavailableValue(EMPTY)).toBe(true);
    expect(isUnavailableValue('12')).toBe(false);
    expect(isUnavailableValue('TLS_AES_256_GCM_SHA384')).toBe(false);
  });
});
