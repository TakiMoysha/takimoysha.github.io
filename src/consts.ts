export const BLOG_COLLECTION_NAME = "blog";

export const SITE: {
  title: string;
  description: string;
  defaultLanguage: "en-us" | "ru-RU";
  themes: Array<string>;
} = {
  title: "Digital Decay",
  description: "Blog, notes and reports about development.",
  defaultLanguage: "en-us",
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
