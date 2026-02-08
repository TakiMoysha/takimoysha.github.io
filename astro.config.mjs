// @ts-check
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import ToolbarDevContent from "./src/integrations/demo";

// https://astro.build/config
export default defineConfig({
	site: "https://takimoysha.github.io",
	base: "/",
	integrations: [
		compress(),
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: "en",
				locales: {
					en: "en-US",
					ru: "ru-RU",
				},
			},
		}),
		ToolbarDevContent,
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
		enabled: true,
	},
});
