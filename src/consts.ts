export const BLOG_COLLECTION_NAME = "archive";
export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LANGUAGES = ["en", "ru"];
export const REGEX_LOCALE_PATTERN = new RegExp(
  `\\.(${SUPPORTED_LANGUAGES.join("|")}\\.)`,
  "i",
);
export const SITE: {
  title: string;
  description: string;
  defaultLanguage: "en-US" | "ru-RU";
  themes: Array<string>;
} = {
  title: "Digital Decay",
  description: "Blog, notes and reports about development.",
  defaultLanguage: "en-US",
  themes: ["dark"],
};

export const SOCIALS = [
  {
    href: "https://github.com/takimoysha",
    icon: "tabler:brand-github",
    linkTitle: "GitHub",
  },
  {
    href: "https://linkedin.com/in/takimoysha",
    icon: "tabler:brand-linkedin",
    linkTitle: "LinkedIn",
  },
];

export default {
  BLOG_COLLECTION_NAME,

  SOCIALS,
  SITE,
};
