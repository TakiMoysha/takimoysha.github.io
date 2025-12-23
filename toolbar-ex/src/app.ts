import { defineToolbarApp } from "astro/toolbar";

// Guide: https://docs.astro.build/en/recipes/making-toolbar-apps/
// API Reference: https://docs.astro.build/en/reference/dev-toolbar-app-reference/

type Joke = {
  type: string;
  setup: string;
  punchline: string;
  id: number;
};

export default defineToolbarApp({
  init(canvas) {
    const astroWindow = document.createElement("astro-dev-toolbar-window");

    // Container
    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gap = "0.5rem";
    container.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";
    container.style.minWidth = "260px";

    astroWindow.append(container);
    canvas.append(astroWindow);

    const setLoading = () => {
      container.textContent = "";
      const spinner = document.createElement("div");
      spinner.textContent = "Loading…";
      spinner.style.opacity = "0.8";
      spinner.style.fontStyle = "italic";
      container.append(spinner);
    };

    const renderError = () => {
      container.textContent = "";
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";

      const err = document.createElement("div");
      err.textContent = "no jokes? :(";
      err.style.opacity = "0.8";

      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "Next";
      next.style.cursor = "pointer";
      next.style.padding = "0.2rem 0.5rem";
      next.style.fontSize = "0.8rem";
      next.style.border = "1px solid currentColor";
      next.style.borderRadius = "0.25rem";
      next.addEventListener("click", () => load());

      row.append(err, next);
      container.append(row);
    };

    const renderJoke = (data: Joke) => {
      container.textContent = "";

      // Header row with type and id + Next button
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";

      const meta = document.createElement("div");
      meta.style.display = "flex";
      meta.style.gap = "0.5rem";
      meta.style.fontSize = "0.8rem";
      meta.style.opacity = "0.8";
      meta.innerHTML = `<span>${data.type}</span><span>#${data.id}</span>`;

      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "Next";
      next.style.cursor = "pointer";
      next.style.padding = "0.2rem 0.5rem";
      next.style.fontSize = "0.8rem";
      next.style.border = "1px solid currentColor";
      next.style.borderRadius = "0.25rem";
      next.addEventListener("click", () => load());

      header.append(meta, next);
      container.append(header);

      // Setup text
      const setup = document.createElement("p");
      setup.textContent = data.setup;
      setup.style.margin = "0";
      container.append(setup);

      // Punchline with reveal button
      const punchWrapper = document.createElement("div");
      punchWrapper.style.display = "flex";
      punchWrapper.style.alignItems = "center";
      punchWrapper.style.gap = "0.5rem";

      const punchline = document.createElement("span");
      punchline.textContent = data.punchline;
      punchline.style.filter = "blur(6px)"; // hidden by default
      punchline.style.userSelect = "none";
      punchline.setAttribute("aria-hidden", "true");
      punchline.addEventListener("click", () => {
        const hidden = punchline.getAttribute("aria-hidden") === "true";
        if (hidden) {
          punchline.style.filter = "none";
          punchline.removeAttribute("aria-hidden");
          punchline.style.userSelect = "auto";
        } else {
          punchline.style.filter = "blur(6px)";
          punchline.setAttribute("aria-hidden", "true");
          punchline.style.userSelect = "none";
        }
      });

      punchWrapper.append(punchline);
      container.append(punchWrapper);
    };

    const load = () => {
      setLoading();
      fetch("https://official-joke-api.appspot.com/jokes/random")
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as Joke;
          return data;
        })
        .then((data) => renderJoke(data))
        .catch(() => renderError());
    };

    // initial load
    load();
  },
});
