const THEME_KEY = "ask-mahaperiyava:theme:v1";

function preferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#181715" : "#f7f4ee";
  if (persist) localStorage.setItem(THEME_KEY, theme);

  const button = document.querySelector("#info-theme-toggle");
  if (button) {
    const dark = theme === "dark";
    const icon = button.querySelector("[data-theme-icon]");
    const label = button.querySelector("[data-theme-label]");
    if (icon) icon.textContent = dark ? "☀" : "☾";
    if (label) label.textContent = dark ? "Light" : "Dark";
    button.setAttribute("aria-label", dark ? "Use light mode" : "Use dark mode");
  }
}

applyTheme(preferredTheme());

document.querySelector("#info-theme-toggle")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next, true);
});
