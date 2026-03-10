export default async () => {
  if (import.meta.client && !import.meta.dev) return {};

  console.debug('useArchiveContent');
  return {
    data: {},
  };
};
