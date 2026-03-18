export function parseDate(numdate: number | string): Date | null {
  if (typeof numdate === 'number') numdate = String(numdate);

  if (typeof numdate === 'string') {
    // ISO format (2026-01-05T14:16)
    if (numdate.includes('-') && numdate.includes('T')) {
      return new Date(numdate);
    }

    // Handle numeric format (20230101)
    let date = '';
    if (numdate.length >= 8) {
      date = `${numdate.slice(0, 4)}-${numdate.slice(4, 6)}-${numdate.slice(6, 8)}`;
    } else {
      date = `00000000`;
    }

    return new Date(date);
  }

  return null;
}

export function formatDate(datastr: string) {
  return parseDate(datastr)?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
