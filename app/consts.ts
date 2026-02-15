export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'ru'];
export const REGEX_LOCALE_PATTERN = new RegExp(
  `\\.(${SUPPORTED_LOCALES.join('|')}\\.)`,
  'i',
);

export const SITE = {
  title: 'Digital Decay' as string,
  description: 'Blog, notes and reports about development.' as string,
  defaultLanguage: 'en-US' as 'en-US' | 'ru-RU',
  themes: ['dark'] as Array<string>,
};

export const SOCIALS = [
  {
    href: 'https://github.com/takimoysha',
    icon: 'tabler:brand-github',
    linkTitle: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/takimoysha',
    icon: 'tabler:brand-linkedin',
    linkTitle: 'LinkedIn',
  },
];
