// @ts-check
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://takimoysha.github.io",
	base: "/",
	integrations: [
		compress(),
		mdx(),
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
		enabled: false,
	},
});
