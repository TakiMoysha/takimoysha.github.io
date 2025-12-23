import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

// API Reference: https://docs.astro.build/en/reference/integrations-reference/
export default {
  name: "toolbar-ex",
  hooks: {
    "astro:config:setup": ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: "toolbar-ex",
        name: "Toolbar Ex",
        icon: ":|",
        entrypoint: fileURLToPath(new URL("./app.ts", import.meta.url)),
      });
    },
  },
} satisfies AstroIntegration;
