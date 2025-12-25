// @ts-check
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import ToolbarExIntegration from "./toolbar-ex/src/integration.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://takimoysha.github.io",
  base: "/",
  integrations: [
    ToolbarExIntegration,
    compress(),
    sitemap({
      // filter: (page) => page.match('/private/*') === null,
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          ru: "ru-RU",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
  prefetch: {
    prefetchAll: true,
  },
  output: "static",
  devToolbar: {
    enabled: false
  }
});
