/**
 * Pure helpers for the browser fingerprint widget (`app/components/draft/MyFingerprint.vue`).
 * Everything here is DOM-free, so it is unit-testable in `tests/unit/fingerprint.test.ts`.
 */

export type FingerprintStatus = 'ok' | 'partial' | 'unavailable';

export interface FingerprintItem {
  label: string;
  value: string;
}

export interface FingerprintChipGroup {
  label: string;
  items: string[];
}

export interface FingerprintSection {
  id: string;
  title: string;
  status: FingerprintStatus;
  items: FingerprintItem[];
  chips?: FingerprintChipGroup[];
  hint?: string;
  note?: string;
}

/** Signal that exists, but is hidden from JavaScript (IP, storage quota, ...). */
export const NOT_FROM_JS = 'not visible from JavaScript';

/** Signal that is only observable from a server that terminates the connection. */
export const SERVER_ONLY = 'server side only';

/** Placeholder for "this API returned nothing". */
export const EMPTY = '—';

export function isUnavailableValue(value: string): boolean {
  return value === NOT_FROM_JS || value === SERVER_ONLY || value === EMPTY;
}

/**
 * FNV-1a (32 bit), hex encoded. Fast, dependency free and good enough
 * for a stable "is it the same browser" hash — not a security primitive.
 */
export function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export type FingerprintComponentValue = string | number | boolean | string[] | null | undefined;

function normalizeComponent(value: FingerprintComponentValue): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(',');
  return String(value);
}

/**
 * Joins collected signals into a single hash.
 * Keys are sorted, so insertion order never changes the result
 * (same idea as JA3, but over JS-visible signals instead of TLS).
 */
export function hashComponents(components: Record<string, FingerprintComponentValue>): string {
  const input = Object.keys(components)
    .sort()
    .map((key) => `${key}=${normalizeComponent(components[key])}`)
    .join('|');
  return fnv1aHex(input);
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return EMPTY;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unit]}`;
}

/**
 * Turns `Date#getTimezoneOffset()` (minutes behind UTC) into `UTC+03:00`.
 */
export function formatUtcOffset(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return EMPTY;
  const sign = totalMinutes <= 0 ? '+' : '-';
  const absolute = Math.abs(totalMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const minutes = String(absolute % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${minutes}`;
}
