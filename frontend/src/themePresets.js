export const THEME_PRESETS = [
  { id: "midnight", label: "Midnight", className: "theme-dark" },
  { id: "ocean", label: "Ocean", className: "theme-ocean" },
  { id: "ember", label: "Ember", className: "theme-ember" },
  { id: "forest", label: "Forest", className: "theme-forest" },
  { id: "dusk", label: "Dusk", className: "theme-dusk" },
];

export function applyStoredTheme() {
  if (typeof document === "undefined") return;
  let byId, legacy;
  try {
    byId = localStorage.getItem("themeId");
    legacy = localStorage.getItem("themeName");
  } catch { /* The public listening rooms also work when storage is blocked. */ }
  let preset = byId ? THEME_PRESETS.find((t) => t.id === byId) : null;
  if (!preset) {
    if (legacy === "ocean") {
      preset = THEME_PRESETS.find((t) => t.id === "ocean");
    }
  }
  document.body.className = (preset || THEME_PRESETS[0]).className;
}
