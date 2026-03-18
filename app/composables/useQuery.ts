export const useQuery = () => useRoute().query;
export const useLocaleFromQuery = () =>
  useRoute().query.locale || useAppConfig().defaultLocale;

export default {
  useQuery,
  useLocaleFromQuery,
};
