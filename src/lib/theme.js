const THEME_KEYS = new Set(["ocean", "forest", "sunset", "amber", "rose"]);

export function normalizeThemeKey(input) {
  if (!input) return "ocean";
  const value = String(input).trim().toLowerCase();
  if (!value) return "ocean";

  if (THEME_KEYS.has(value)) return value;

  // Back-compat with older stored names like "Ocean Blue"
  if (value.includes("forest")) return "forest";
  if (value.includes("sunset") || value.includes("purple")) return "sunset";
  if (value.includes("amber") || value.includes("warm")) return "amber";
  if (value.includes("rose") || value.includes("pink")) return "rose";
  if (value.includes("ocean") || value.includes("blue")) return "ocean";

  return "ocean";
}

export function applyTheme(themeKey) {
  if (typeof document === "undefined") return;

  const normalized = normalizeThemeKey(themeKey);
  const root = document.documentElement;

  if (normalized === "ocean") {
    delete root.dataset.theme;
    return;
  }

  root.dataset.theme = normalized;
}

export function getStoredThemeKey() {
  if (typeof window === "undefined") return "ocean";
  return normalizeThemeKey(window.localStorage.getItem("theme"));
}

export function storeThemeKey(themeKey) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("theme", normalizeThemeKey(themeKey));
}
