import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

// API Reference: https://docs.astro.build/en/reference/integrations-reference/
export default () => {
	return {
		name: "dev-content",
		hooks: {
			"astro:config:setup": ({ addDevToolbarApp }) => {
				addDevToolbarApp({
					id: "dev-content",
					name: "Dev Content",
					icon: "Ct",
					entrypoint: fileURLToPath(new URL("./demo-app.ts", import.meta.url)),
				});
			},
			"astro:build:done": ({ pages, dir }) => {
				// post build operations
			},
			"astro:build:ssr": ({ manifest }) => {
				//
			},
		},
	} satisfies AstroIntegration;
}
